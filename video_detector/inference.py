import os
import torch
import torch.nn.functional as F
import numpy as np
from .model import SpatioTemporalDeepfakeNet
from .preprocessing import preprocess_video_frames

MODEL_CHECKPOINT_PATH = os.path.join("models", "best_spatiotemporal_model.pth")

_model_instance = None
_device_instance = None
_checkpoint_loaded = False


def get_device():
    global _device_instance
    if _device_instance is None:
        _device_instance = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        print(f"[VIDEO_DETECTOR] Inference device: {_device_instance}")
    return _device_instance


def load_video_model(checkpoint_path: str = MODEL_CHECKPOINT_PATH) -> tuple[SpatioTemporalDeepfakeNet, bool]:
    """
    Loads the SpatioTemporalDeepfakeNet model once and caches it in memory.
    Returns (model, is_loaded_from_pth).
    """
    global _model_instance, _checkpoint_loaded

    if _model_instance is not None:
        return _model_instance, _checkpoint_loaded

    dev = get_device()
    print("[VIDEO_DETECTOR] Instantiating SpatioTemporalDeepfakeNet architecture...")
    model = SpatioTemporalDeepfakeNet(pretrained_backbones=True)

    if os.path.exists(checkpoint_path):
        print(f"[VIDEO_DETECTOR] Loading trained weights from '{checkpoint_path}'...")
        try:
            checkpoint = torch.load(checkpoint_path, map_location=dev)
            
            # Handle state_dict wrapper dicts
            if isinstance(checkpoint, dict):
                if "state_dict" in checkpoint:
                    state_dict = checkpoint["state_dict"]
                elif "model_state_dict" in checkpoint:
                    state_dict = checkpoint["model_state_dict"]
                elif "model" in checkpoint and isinstance(checkpoint["model"], dict):
                    state_dict = checkpoint["model"]
                else:
                    state_dict = checkpoint
            else:
                state_dict = checkpoint

            # Strip 'module.' or 'model.' prefixes if saved from DataParallel / wrapper
            cleaned_state_dict = {}
            for k, v in state_dict.items():
                new_key = k
                if new_key.startswith("module."):
                    new_key = new_key[7:]
                if new_key.startswith("model."):
                    new_key = new_key[6:]
                cleaned_state_dict[new_key] = v

            model.load_state_dict(cleaned_state_dict, strict=False)
            _checkpoint_loaded = True
            print(f"[VIDEO_DETECTOR] ✅ Successfully loaded trained checkpoint from '{checkpoint_path}'")
        except Exception as e:
            print(f"[VIDEO_DETECTOR] ⚠️ Error loading checkpoint '{checkpoint_path}': {e}")
            _checkpoint_loaded = False
    else:
        print(f"[VIDEO_DETECTOR] ℹ️ Checkpoint file missing at '{checkpoint_path}'. Using un-finetuned architecture base.")
        _checkpoint_loaded = False

    model.to(dev)
    model.eval()

    _model_instance = model
    return _model_instance, _checkpoint_loaded


def predict_video(video_path: str, num_frames: int = 8) -> dict:
    """
    Runs video deepfake detection using spatio-temporal fusion model.
    Returns structured results dictionary.
    """
    model, is_trained_weights = load_video_model()
    dev = get_device()

    # Preprocess video into sequence tensor: [1, 8, 3, 300, 300]
    sequence_tensor, frame_info = preprocess_video_frames(video_path, num_frames=num_frames)
    sequence_tensor = sequence_tensor.to(dev)

    with torch.no_grad():
        logits, attn_weights_tensor = model(sequence_tensor)
        probs = F.softmax(logits, dim=1).squeeze(0).cpu().numpy()  # [2]
        attn_weights = attn_weights_tensor.squeeze(0).cpu().numpy().tolist()  # [8]

    real_prob = float(probs[0])
    fake_prob = float(probs[1])
    predicted_class = int(np.argmax(probs))  # 0 = Real, 1 = Fake
    confidence = float(np.max(probs))
    score_pct = int(round(fake_prob * 100))

    # Top key frames based on temporal attention weights
    indexed_weights = list(enumerate(attn_weights))
    sorted_by_weight = sorted(indexed_weights, key=lambda x: x[1], reverse=True)
    top_key_frame_seq_indices = [idx for idx, _ in sorted_by_weight[:2]]
    # Map back to video frame indices / metadata
    key_frames = [frame_info[idx]["frame_index"] for idx in top_key_frame_seq_indices]

    verdict = "SYNTHETIC" if fake_prob >= 0.5 else "AUTHENTIC"
    classification = "Likely synthetic" if fake_prob >= 0.65 else ("Possibly synthetic" if fake_prob >= 0.5 else "Likely authentic")

    annotated_frames = []
    for info, weight in zip(frame_info, attn_weights):
        annotated_frames.append({
            "frame_index": info["frame_index"],
            "sequence_index": info["sequence_index"],
            "timestamp_sec": info["timestamp_sec"],
            "timestamp_str": info["timestamp_str"],
            "attention_weight": round(float(weight), 4),
            "is_key_frame": info["frame_index"] in key_frames,
        })

    return {
        "success": True,
        "modality": "video",
        "verdict": verdict,
        "classification": classification,
        "score": score_pct,
        "confidence": round(confidence, 4),
        "real_probability": round(real_prob, 4),
        "fake_probability": round(fake_prob, 4),
        "predicted_class": predicted_class,
        "frames_analyzed": len(frame_info),
        "key_frames": key_frames,
        "attention_weights": [round(float(w), 4) for w in attn_weights],
        "analyzed_frames": annotated_frames,
        "model": "EfficientNet-B5 + Xception + Bi-LSTM + Attention",
        "checkpoint_loaded": is_trained_weights,
        "note": "Temporal attention highlights key frames relied upon most by the model during spatio-temporal inference."
    }
