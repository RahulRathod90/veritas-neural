# Veritas Neural

### *A Multimodal AI Detection Engine for Synthetic and Manipulated Media.*

> **For final-year engineering project and portfolio use.**

---

## 🧠 Overview

**Veritas Neural** is a multimodal forensic inference engine that analyzes text, images, audio, and video for AI-generated or synthetically manipulated content. It uses pretrained PyTorch models served through a FastAPI backend, with a React/Vite frontend.

**Privacy-focused design:** The backend can be run entirely locally (self-hosted). No files are sent to third-party AI APIs. When deployed locally, processing happens entirely on your own hardware.

> **Deployment note:** The current frontend connects to the URL set in `VITE_API_URL` (default: `http://localhost:8000`). If deployed to a cloud host, inference runs on that cloud server — not on the user's device.

---

## ✨ Actual Features

- **📄 Text detection:** RoBERTa transformer model (`Hello-SimpleAI/chatgpt-detector-roberta`) classifies text as likely AI-generated or human-written, with confidence thresholds and "Uncertain" label when confidence is low.
- **🖼️ Image detection:** SigLIP classifier (`Ateeqq/ai-vs-human-image-detector`) for full-image AI vs real classification. ViT deepfake detector (`prithivMLmods/Deep-Fake-Detector-v2-Model`) applied to face crops if faces are detected via OpenCV.
- **🎧 Audio analysis:** MFCC signal analysis via librosa (spectral features only — NOT a trained deepfake detector).
- **🎬 Video detection:** Sparse frame sampling. SigLIP model applied to individual frames. Actual frame timestamps reported.
- **📋 EXIF metadata:** Presence/absence of camera metadata noted as a weak supporting signal only.
- **🔒 Self-hosted local deployment:** All models run on your hardware after the initial download.

---

## ❌ What Is NOT Implemented

The following techniques are **not** implemented in this version. They are not claimed or displayed:

- PRNU sensor noise analysis
- GAN boundary detection
- Lip-sync desynchronization detection
- Temporal transformer analysis (e.g. TimeSformer)
- Pixel-level manipulation localization (bounding boxes)
- Trained audio anti-spoofing model (e.g. AASIST, RawNet2)

---

## 🏗️ Architecture

```
User Asset
    │
    ▼
React Frontend (Vite)
    │
    │  POST /api/analyze
    ▼
FastAPI Backend (local or self-hosted)
    │
    ├─ Text ────────────────► RoBERTa text classifier
    │                              └─► classification + confidence
    │
    ├─ Image ──────────────► Image preprocessing
    │                         ├─► SigLIP classifier (full image)
    │                         ├─► OpenCV face detection
    │                         ├─► ViT deepfake (face crops, if face found)
    │                         └─► EXIF metadata check
    │
    ├─ Audio ──────────────► Librosa MFCC analysis
    │                              └─► Signal features (informational only)
    │
    └─ Video ──────────────► Frame sampling (blur-filtered)
                                   └─► SigLIP per frame (actual timestamps)
                                         └─► Median + majority vote
    │
    ▼
Transparent JSON response with:
  - classification, score, confidence
  - evidence[] (from actual models only)
  - limitations[]
  - score_fusion documentation
```

---

## 🧬 AI Models Used

| Modality | Model | Purpose |
|:---------|:------|:--------|
| Image | `Ateeqq/ai-vs-human-image-detector` (SigLIP) | Full-image AI vs real classification |
| Image/Video | `prithivMLmods/Deep-Fake-Detector-v2-Model` (ViT) | Face deepfake detection on face crops |
| Text | `Hello-SimpleAI/chatgpt-detector-roberta` (RoBERTa) | AI-generated text detection |
| Audio | librosa MFCC | Basic audio signal analysis (not a deepfake model) |

---

## 🧪 Tech Stack

### Frontend
- React 19, Vite
- GSAP 3 (ScrollTrigger)
- Spline (3D scene)
- Lucide React
- Tailwind CSS v3.4

### Backend
- FastAPI + Uvicorn
- PyTorch + HuggingFace Transformers
- OpenCV (headless) — face detection
- Librosa — audio signal analysis
- ExifRead — EXIF metadata
- Pillow — image processing

---

## ⚙️ Installation & Setup

### Prerequisites
- Python 3.10+
- Node.js 18+
- ~800MB disk space for model cache

### 1. Clone the Repository
```bash
git clone https://github.com/1SoulHunter1/veritas-neural-core.git
cd veritas-neural-core
```

### 2. Backend Setup
```bash
pip install -r requirements.txt
```

> **Note:** Models (~800MB) download automatically from Hugging Face on the first run.

### 3. Start the Backend
```bash
# Development (with auto-reload)
uvicorn main:app --reload --port 8000

# Or directly:
python main.py
```

### 4. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Open: `http://localhost:5173`

---

## 🔑 Environment Variables

### Frontend (`frontend/.env`)

```env
# Backend API endpoint
# For local development:
VITE_API_URL=http://localhost:8000

# For cloud/self-hosted deployment:
# VITE_API_URL=https://your-backend-host.example.com
```

### Backend (environment variables)

```env
# Comma-separated list of allowed frontend origins (for CORS)
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# Port to bind to (when run as __main__)
PORT=7860
```

---

## 📡 API Endpoints

### `GET /health`
Returns model availability and system status.

### `POST /api/analyze`

| Parameter | Type | Description |
|:---|:---|:---|
| `file` | File (Binary) | Image, video, audio, or text file |
| `text_payload` | String (Form) | Plain text for linguistic analysis |

Provide one of `file` or `text_payload`.

**Supported file types:**
- Image: `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`, `.bmp`
- Video: `.mp4`, `.mov`, `.avi`, `.mkv`, `.webm`
- Audio: `.wav`, `.mp3`, `.ogg`, `.flac`, `.m4a`
- Text: `.txt`, `.md`

**Maximum file size:** 20MB

### Example Response (Image)

```json
{
  "success": true,
  "scan_id": "0x99a2b3c4",
  "filename": "photo.jpg",
  "modality": "image",
  "classification": "Likely synthetic",
  "verdict": "SYNTHETIC",
  "score": 87,
  "confidence": "High",
  "processing_time_ms": 1420,
  "latency": "1.420s",
  "model": "Ateeqq/ai-vs-human-image-detector",
  "evidence": [
    {
      "name": "Image AI classifier (SigLIP)",
      "score": 91.2,
      "status": "analyzed",
      "source": "Ateeqq/ai-vs-human-image-detector",
      "note": "Trained to distinguish real photos from AI-generated images"
    },
    {
      "name": "Face deepfake classifier (ViT)",
      "status": "not_applicable",
      "source": "prithivMLmods/Deep-Fake-Detector-v2-Model",
      "note": "No faces detected in image"
    },
    {
      "name": "EXIF metadata",
      "status": "unavailable",
      "source": "exifread",
      "note": "Metadata absent — common due to screenshots, social media, or compression"
    },
    {
      "name": "Manipulation localization",
      "status": "not_available",
      "note": "Pixel-level manipulation localization is not implemented in this version."
    }
  ],
  "score_fusion": {
    "method": "Weighted combination of available model outputs",
    "components": [
      { "name": "SigLIP classifier", "weight": "70%" }
    ],
    "note": "Only components with valid model outputs contribute to the final score."
  },
  "limitations": [
    "AI detection is probabilistic — results are not definitive proof.",
    "Detection performance depends on model training distribution and content type.",
    "Metadata (EXIF) may be missing due to screenshots, social media, or compression — not AI generation.",
    "Audio analysis uses signal features (MFCC) only — no trained audio deepfake model is integrated.",
    "Manipulation localization (bounding boxes) is not implemented in this version.",
    "Models may not generalize to all types of AI-generated content."
  ]
}
```

### Error Responses

| Status | Meaning |
|:-------|:--------|
| 413 | File too large (>20MB) |
| 415 | Unsupported file type |
| 422 | Missing required input / text too short |
| 500 | Model/analysis failure |

---

## 🔐 Privacy & Deployment

### Local Mode (Full Privacy)
```
Browser → http://localhost:8000 → Local FastAPI → Local models
```
Files processed entirely on your machine. No data sent externally.

### Cloud/Self-Hosted Mode
```
Browser → https://your-server.com → Remote FastAPI → Remote models
```
Files are sent to the configured backend server. Privacy depends on your server configuration.

**To switch modes:** Set `VITE_API_URL` in `frontend/.env`.

### Docker Deployment
```bash
docker build -t veritas-neural .
docker run -p 7860:7860 -e ALLOWED_ORIGINS=http://localhost:5173 veritas-neural
```

---

## ⚠️ Known Limitations

1. **Audio detection is not reliable** — MFCC variance cannot reliably distinguish AI from real audio. No audio deepfake model is integrated.
2. **No manipulation localization** — The system classifies the whole image/video but cannot identify *where* manipulation occurred.
3. **Model generalization** — SigLIP was trained on specific distributions. Novel types of AI-generated content may evade detection.
4. **Video analysis is frame-based** — No temporal modeling. Frame-level scores are aggregated by median + majority vote.
5. **EXIF metadata is unreliable** as an AI indicator — screenshots, social media, WhatsApp, and image editing all remove EXIF.
6. **Results are probabilistic** — A high score does not prove AI generation. A low score does not prove authenticity.
7. **Text detection confidence** — When model confidence is < 65%, the result is labeled "Uncertain."

---

## 🚀 Future Improvements

- [ ] Integrate a trained audio anti-spoofing model (AASIST, RawNet2, or wav2vec-based)
- [ ] Add frequency-domain analysis for images (DCT/FFT artifacts)
- [ ] Implement face landmark consistency check for deepfakes
- [ ] Add PDF forensic report generation
- [ ] Batch file analysis
- [ ] WebSocket streaming for real-time analysis progress
- [ ] User authentication with actual session management

---

## 📜 License

MIT License. See `LICENSE` for details.

---

<p align="center">Built by 1SoulHunter1 — Final Year Engineering Project</p>
