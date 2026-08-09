# Veritas Neural Model Weight Directory

Place your trained spatio-temporal video deepfake detection model checkpoint file here:

```text
models/best_spatiotemporal_model.pth
```

### Model Architecture
- Spatial Fusion: EfficientNet-B5 + Xception (512-D)
- Sequence Model: Bi-LSTM
- Temporal Attention: 8 frames
- Binary Classifier: Real (0) vs Fake (1)
