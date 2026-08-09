import torch
import torch.nn as nn
import torch.nn.functional as F
import timm


class EfficientNetB5XceptionFusion(nn.Module):
    """
    Spatial feature extractor using dual backbones (EfficientNet-B5 + Xception)
    with 512-dimensional feature fusion.
    """
    def __init__(self, embed_dim: int = 512, pretrained: bool = True):
        super().__init__()
        self.effnet = timm.create_model("efficientnet_b5", pretrained=pretrained, num_classes=0)
        self.xception = timm.create_model("xception", pretrained=pretrained, num_classes=0)

        eff_dim = self.effnet.num_features   # 2048
        xc_dim = self.xception.num_features  # 2048

        self.fusion = nn.Sequential(
            nn.Linear(eff_dim + xc_dim, embed_dim),
            nn.BatchNorm1d(embed_dim),
            nn.ReLU(inplace=True),
            nn.Dropout(0.3)
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        # x: [N, 3, H, W]
        feat_eff = self.effnet(x)
        feat_xc = self.xception(x)
        combined = torch.cat([feat_eff, feat_xc], dim=1)
        fused = self.fusion(combined)
        return fused


class TemporalAttentionPool(nn.Module):
    """
    Temporal attention layer to score and pool feature vectors across video frames.
    """
    def __init__(self, hidden_dim: int = 512):
        super().__init__()
        self.attn = nn.Sequential(
            nn.Linear(hidden_dim, hidden_dim // 2),
            nn.Tanh(),
            nn.Linear(hidden_dim // 2, 1)
        )

    def forward(self, x: torch.Tensor):
        # x: [B, T, hidden_dim]
        attn_logits = self.attn(x)                # [B, T, 1]
        attn_weights = F.softmax(attn_logits, dim=1) # [B, T, 1]
        context = torch.sum(x * attn_weights, dim=1) # [B, hidden_dim]
        return context, attn_weights.squeeze(-1)    # [B, hidden_dim], [B, T]


class SpatioTemporalDeepfakeNet(nn.Module):
    """
    Complete Spatio-Temporal Deepfake Detection Architecture:
      EfficientNet-B5 + Xception (512-D spatial fusion)
      -> Bi-LSTM
      -> Temporal Attention
      -> Binary Classifier (0 = Real, 1 = Fake)
    """
    def __init__(
        self,
        embed_dim: int = 512,
        lstm_hidden: int = 256,
        lstm_layers: int = 2,
        num_classes: int = 2,
        pretrained_backbones: bool = True
    ):
        super().__init__()
        self.spatial_extractor = EfficientNetB5XceptionFusion(embed_dim=embed_dim, pretrained=pretrained_backbones)
        
        self.lstm = nn.LSTM(
            input_size=embed_dim,
            hidden_size=lstm_hidden,
            num_layers=lstm_layers,
            batch_first=True,
            bidirectional=True,
            dropout=0.3 if lstm_layers > 1 else 0.0
        )

        lstm_out_dim = lstm_hidden * 2  # 512
        self.attention = TemporalAttentionPool(hidden_dim=lstm_out_dim)
        
        self.classifier = nn.Sequential(
            nn.Dropout(0.4),
            nn.Linear(lstm_out_dim, 128),
            nn.ReLU(inplace=True),
            nn.Linear(128, num_classes)
        )

    def forward(self, x: torch.Tensor):
        # Input shape: [B, T, C, H, W] -> e.g. [B, 8, 3, 300, 300]
        B, T, C, H, W = x.shape
        x_reshaped = x.view(B * T, C, H, W)
        
        spatial_features = self.spatial_extractor(x_reshaped)  # [B * T, 512]
        sequence_features = spatial_features.view(B, T, -1)     # [B, T, 512]

        lstm_out, _ = self.lstm(sequence_features)              # [B, T, 512]
        context, attn_weights = self.attention(lstm_out)        # [B, 512], [B, T]
        
        logits = self.classifier(context)                       # [B, 2]
        return logits, attn_weights
