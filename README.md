# Veritas Neural

![Python](https://img.shields.io/badge/Python-3.10%2B-3776AB?style=flat-square&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100%2B-009688?style=flat-square&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)
![PyTorch](https://img.shields.io/badge/PyTorch-2.x-EE4C2C?style=flat-square&logo=pytorch&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

**An offline, privacy-first AI-generated media detection engine.**

Veritas Neural detects AI-generated text, deepfake video, manipulated images, and synthetic voice clones. All inference runs locally on your machine using PyTorch — your files never leave your device.

---

## Features

| Modality | Model | What it detects |
|---|---|---|
| 🖼️ **Image** | SigLIP (ai-vs-human) + ViT (face deepfake) + EXIF analysis | AI-generated photos, GAN-synthesized faces, missing camera metadata |
| 🎬 **Video** | Frame-sampled SigLIP + temporal variance | Deepfake video, frame inconsistencies, AI-generated footage |
| 🎙️ **Audio** | MFCC via Librosa | Voice clones, vocoder artifacts, synthetic TTS speech |
| 📄 **Text** | RoBERTa (Hello-SimpleAI/chatgpt-detector) | ChatGPT, Claude, Gemini, and other LLM-generated text |

Additional signals:
- **EXIF metadata analysis** — real camera photos always carry metadata; AI images do not
- **Face detection** via OpenCV Haar cascade — applies deepfake model only to face crops
- **Sigmoid confidence calibration** — pushes ambiguous scores toward the extremes for cleaner verdicts
- **0–100 authenticity score** with `AUTHENTIC` / `SYNTHETIC` verdict and per-modality breakdown

---

## Architecture

```
Browser
  │
  ▼
Frontend (React + Vite + Tailwind CSS + GSAP)
  │  hosted on Vercel — localhost:5173 in dev
  │
  │  POST /api/analyze  (multipart file upload)
  ▼
Backend (FastAPI + Python)
  │  hosted on Railway — localhost:8000 in dev
  │
  ├─ image/*  → SigLIP + ViT (face crop) + EXIF check
  ├─ video/*  → Frame sampling → SigLIP per frame → temporal consensus
  ├─ audio/*  → Librosa MFCC variance analysis
  └─ text/*   → RoBERTa text classifier + heuristic boost
  │
  ▼
PyTorch Models (~800 MB, cached locally after first download)
```

---

## How It Works

**1. Upload** — Drop any file into the dashboard (photo, video, audio clip, or text document). Supports the most common media formats used on phones and social platforms.

**2. Analyze** — The FastAPI backend routes the file to the appropriate local ML model and runs inference entirely on your hardware. No external API calls are made.

**3. Verify** — Receive a 0–100 AI generation probability score, a clear `AUTHENTIC` or `SYNTHETIC` verdict, a breakdown by modality (visual / audio / linguistic), and a list of specific anomalies detected — all in under two seconds.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS v3, GSAP 3, Lucide React |
| Backend | FastAPI, Uvicorn, Python 3.10+ |
| ML — Image | `Ateeqq/ai-vs-human-image-detector` (SigLIP), `prithivMLmods/Deep-Fake-Detector-v2-Model` (ViT) |
| ML — Text | `Hello-SimpleAI/chatgpt-detector-roberta` (RoBERTa) |
| ML — Audio | Librosa (MFCC spectral variance) |
| Face Detection | OpenCV Haar cascade |
| EXIF Analysis | exifread |
| Model Runtime | PyTorch (CPU or CUDA) |
| Frontend Hosting | Vercel |
| Backend Hosting | Railway |

---

## Setup & Installation

### Prerequisites

- Python 3.10+
- Node.js 18+
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/veritas-neural.git
cd veritas-neural
```

### 2. Backend Setup

```bash
# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate        # macOS/Linux
# or
venv\Scripts\activate           # Windows

# Install dependencies
pip install -r requirements.txt

# Start the backend server
python main.py
# → API running at http://localhost:8000
```

> **Note:** ML models (~800 MB total) download automatically from Hugging Face on first run and are cached locally. An internet connection is only required for this initial download.

### 3. Frontend Setup

```bash
# From the project root
npm install

# Start the development server
npm run dev
# → App running at http://localhost:5173
```

### 4. Verify the Backend

```bash
curl http://localhost:8000/health
```

Expected response includes `"status": "operational"` and the loaded model names.

---

## Deployment

### Frontend — Vercel

1. Push the repo to GitHub
2. Import the project at [vercel.com](https://vercel.com)
3. Set the **Root Directory** to the project root (or `./` if the frontend is at root)
4. Vercel auto-detects Vite; no additional build configuration needed
5. Set the backend URL environment variable if required:
   ```
   VITE_API_URL=https://your-railway-app.up.railway.app
   ```

### Backend — Railway

1. Connect your GitHub repo at [railway.app](https://railway.app)
2. Railway detects the `Procfile` automatically:
   ```
   web: uvicorn main:app --host 0.0.0.0 --port $PORT
   ```
3. Set any required environment variables in the Railway dashboard
4. Models will be downloaded on the first cold start; use a persistent volume if available to avoid re-downloading on each deploy

---

## Privacy

Veritas Neural is built on a **zero-trust privacy model**:

- ✅ All ML inference runs locally — no file is ever uploaded to a third-party API
- ✅ No telemetry, no logging of user content
- ✅ Models are cached on your machine after the first download
- ✅ The application works fully offline after the initial model download
- ✅ CORS is configured for local development; restrict origins before production deployment

---

## API Reference

### `POST /api/analyze`

Accepts a multipart file upload.

**Request:**
```
Content-Type: multipart/form-data
Body: file=<binary>
```

**Response:**
```json
{
  "scan_id": "0x1a2b3c4d",
  "filename": "photo.jpg",
  "latency": 1.24,
  "score": 87,
  "verdict": "SYNTHETIC",
  "breakdown": { "visual": 87, "audio": 0, "linguistic": 0 },
  "anomalies": [
    { "id": 1, "label": "Camera EXIF Metadata Absent", "severity": "HIGH" }
  ],
  "timeline_spikes": [],
  "bounding_box": { "top": "15%", "left": "35%", "width": "30%", "height": "40%" }
}
```

### `GET /health`

Returns engine status and loaded model names.

---

## License

MIT — see [LICENSE](LICENSE) for details.
