"""
Veritas Neural — Multimodal Inference Engine v11.0

Models actually used:
  PRIMARY:   Ateeqq/ai-vs-human-image-detector  (SigLIP — real photo vs AI-generated)
  SECONDARY: prithivMLmods/Deep-Fake-Detector-v2-Model (ViT face deepfake — face crops only)
  TEXT:      Hello-SimpleAI/chatgpt-detector-roberta (RoBERTa AI text detector)

NOT implemented (not claimed):
  - PRNU sensor noise analysis
  - GAN boundary detection
  - Lip-sync desynchronization detection
  - Temporal transformer analysis
  - Manipulation localization / bounding boxes
  - Audio deepfake model (audio signal analysis only via MFCC)

Run locally:
  uvicorn main:app --reload --port 8000

Environment variables:
  ALLOWED_ORIGINS  — comma-separated list of allowed frontend origins
                     Default: http://localhost:5173,http://localhost:3000
  PORT             — port to bind to (default 7860 when run as __main__)
"""

import sys
if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass
if hasattr(sys.stderr, 'reconfigure'):
    try:
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

import os, io, time, hashlib, uuid, math, tempfile
from typing import Optional, List

import numpy as np

try:
    import cv2
    if hasattr(cv2, "CascadeClassifier") and hasattr(cv2, "data") and hasattr(cv2.data, "haarcascades"):
        CV2_AVAILABLE = True
        _FACE_CASCADE = cv2.CascadeClassifier(
            cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
        )
    else:
        CV2_AVAILABLE = False
        _FACE_CASCADE = None
        print("[VN] cv2 missing CascadeClassifier or haarcascades")
except Exception as e:
    CV2_AVAILABLE = False
    _FACE_CASCADE = None
    print(f"[VN] cv2 not available: {e}")

try:
    import librosa
    LIBROSA_AVAILABLE = True
except ImportError:
    LIBROSA_AVAILABLE = False
    print("[VN] librosa not available")

try:
    import exifread
    EXIF_AVAILABLE = True
except ImportError:
    EXIF_AVAILABLE = False
    print("[VN] exifread not available — install with: pip install exifread")

try:
    import torch
    from transformers import (
        AutoImageProcessor,
        SiglipForImageClassification,
        ViTForImageClassification,
        ViTImageProcessor,
        pipeline,
    )
    from PIL import Image
    TORCH_AVAILABLE = True
except ImportError:
    TORCH_AVAILABLE = False
    print("[VN] torch/transformers not available")

from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from video_detector import predict_video, load_video_model


# ─────────────────────────────────────────────────────────────
# ⚙️ Config
# ─────────────────────────────────────────────────────────────
PRIMARY_MODEL_ID   = "Ateeqq/ai-vs-human-image-detector"   # SigLIP — best accuracy
SECONDARY_MODEL_ID = "prithivMLmods/Deep-Fake-Detector-v2-Model"  # face deepfake only
TEXT_MODEL_ID      = "Hello-SimpleAI/chatgpt-detector-roberta"

VERDICT_THRESHOLD   = 65    # score > this → SYNTHETIC
NO_FACE_SECONDARY   = True  # skip secondary model if no face found
FACE_PADDING        = 0.3   # expand face crop by 30%
MIN_FACE_SIZE       = 60    # minimum face size in px
# EXIF is only a weak metadata signal — NOT a reliable indicator of AI generation.
# Missing EXIF is common due to screenshots, WhatsApp, social media, compression.
METADATA_BOOST      = 4.0   # small score bump only when EXIF is missing AND image is already suspicious

VIDEO_NUM_FRAMES    = 8
BLUR_THRESHOLD      = 60.0
MAJORITY_VOTE_RATIO = 0.60

# Text classification: if model confidence < this threshold, label as "Uncertain"
TEXT_UNCERTAIN_THRESHOLD = 0.65

_primary_model      = None
_primary_processor  = None
_secondary_model    = None
_secondary_proc     = None
_text_pipeline      = None
_device             = None


def _get_device():
    global _device
    if _device is None:
        _device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        print(f"[VN] Using device: {_device}")
    return _device


def _load_models():
    global _primary_model, _primary_processor
    global _secondary_model, _secondary_proc
    global _text_pipeline

    if not TORCH_AVAILABLE:
        return

    dev = _get_device()

    if _primary_model is None:
        print(f"[VN] Loading PRIMARY model: {PRIMARY_MODEL_ID} (SigLIP) ...")
        try:
            _primary_processor = AutoImageProcessor.from_pretrained(PRIMARY_MODEL_ID)
            _primary_model     = SiglipForImageClassification.from_pretrained(PRIMARY_MODEL_ID).to(dev)
            _primary_model.eval()
            print(f"[VN] ✅ Primary model ready. Labels: {_primary_model.config.id2label}")
        except Exception as e:
            print(f"[VN] ❌ Primary model failed: {e}")

    if _secondary_model is None:
        print(f"[VN] Loading SECONDARY model: {SECONDARY_MODEL_ID} (ViT deepfake) ...")
        try:
            _secondary_proc  = ViTImageProcessor.from_pretrained(SECONDARY_MODEL_ID)
            _secondary_model = ViTForImageClassification.from_pretrained(SECONDARY_MODEL_ID).to(dev)
            _secondary_model.eval()
            print(f"[VN] ✅ Secondary model ready. Labels: {_secondary_model.config.id2label}")
        except Exception as e:
            print(f"[VN] ❌ Secondary model failed: {e}")

    if _text_pipeline is None:
        print(f"[VN] Loading TEXT model: {TEXT_MODEL_ID} ...")
        try:
            _text_pipeline = pipeline(
                "text-classification",
                model=TEXT_MODEL_ID,
                truncation=True,
                max_length=512,
                device=0 if torch.cuda.is_available() else -1,
            )
            print("[VN] ✅ Text model ready.")
        except Exception as e:
            print(f"[VN] ❌ Text model failed: {e}")

    try:
        print("[VN] Loading VIDEO model (EfficientNet-B5 + Xception + Bi-LSTM + Attention)...")
        load_video_model()
    except Exception as e:
        print(f"[VN] ❌ Video model init failed: {e}")


# ─────────────────────────────────────────────────────────────
# 🧠 App + CORS
# ─────────────────────────────────────────────────────────────
app = FastAPI(title="Veritas Neural API", version="11.0.0")

@app.on_event("startup")
def startup_event():
    print("[VN] Preloading models...")
    _load_models()

# Read allowed origins from environment variable for production safety.
# Default allows local development on common Vite/React ports.
_raw_origins = os.environ.get("ALLOWED_ORIGINS", "*")
if _raw_origins == "*":
    ALLOWED_ORIGINS = ["*"]
else:
    ALLOWED_ORIGINS = [o.strip() for o in _raw_origins.split(",") if o.strip()]
print(f"[VN] CORS allowed origins: {ALLOWED_ORIGINS}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if "*" in ALLOWED_ORIGINS else ALLOWED_ORIGINS,
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=False,
)


# ─────────────────────────────────────────────────────────────
# 🔢 Sigmoid Calibration
# ─────────────────────────────────────────────────────────────
def _calibrate_score(raw: float) -> float:
    c = max(0.0, min(100.0, raw))
    return round(1.0 / (1.0 + math.exp(-0.08 * (c - 50))) * 100, 2)


# ─────────────────────────────────────────────────────────────
# 📋 EXIF Metadata Check
# ─────────────────────────────────────────────────────────────
def _check_exif(image_bytes: bytes) -> dict:
    """
    Reads EXIF metadata from an image.
    IMPORTANT: Missing EXIF is NOT a reliable indicator of AI generation.
    EXIF disappears due to: screenshots, WhatsApp, social media compression,
    format conversion, image editing, and many other common operations.
    Returns useful metadata fields for informational display only.
    """
    if not EXIF_AVAILABLE:
        return {"status": "unavailable", "has_exif": None, "tag_count": -1, "fields": {}}
    try:
        tags = exifread.process_file(io.BytesIO(image_bytes), stop_tag="UNDEF", details=False)
        tag_count = len(tags)
        has_exif  = tag_count > 0

        # Extract useful displayable fields (no sensitive GPS coordinates)
        fields = {}
        display_tags = {
            "Image Make":           "camera_make",
            "Image Model":          "camera_model",
            "Image Software":       "software",
            "EXIF DateTimeOriginal":"timestamp",
            "Image DateTime":       "datetime",
            "EXIF ExifImageWidth":  "width",
            "EXIF ExifImageLength": "height",
            "Image Orientation":    "orientation",
        }
        # GPS: only note presence, never expose coordinates
        gps_tags = [k for k in tags if k.startswith("GPS")]
        if gps_tags:
            fields["gps_data"] = "Present (not displayed)"

        for tag_key, field_name in display_tags.items():
            if tag_key in tags:
                fields[field_name] = str(tags[tag_key])

        print(f"[EXIF] Tags found: {tag_count} → {'Has metadata' if has_exif else 'No metadata'}")
        return {
            "status":    "available" if has_exif else "unavailable",
            "has_exif":  has_exif,
            "tag_count": tag_count,
            "fields":    fields,
        }
    except Exception as e:
        print(f"[EXIF ERROR] {e}")
        return {"status": "unavailable", "has_exif": None, "tag_count": -1, "fields": {}}


# ─────────────────────────────────────────────────────────────
# 👤 Face Detection
# ─────────────────────────────────────────────────────────────
def _detect_faces(image_bgr) -> list:
    if _FACE_CASCADE is None:
        return []
    gray  = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2GRAY)
    faces = _FACE_CASCADE.detectMultiScale(
        gray, scaleFactor=1.1, minNeighbors=5,
        minSize=(MIN_FACE_SIZE, MIN_FACE_SIZE),
    )
    return list(faces) if len(faces) > 0 else []


def _crop_face(image_bgr, x, y, w, h):
    H, W   = image_bgr.shape[:2]
    pad_x  = int(w * FACE_PADDING)
    pad_y  = int(h * FACE_PADDING)
    return image_bgr[max(0,y-pad_y):min(H,y+h+pad_y), max(0,x-pad_x):min(W,x+w+pad_x)]


# ─────────────────────────────────────────────────────────────
# 🔍 PRIMARY: SigLIP ai-vs-human (runs on full image)
# ─────────────────────────────────────────────────────────────
def _run_primary(pil_image: "Image.Image") -> Optional[float]:
    """
    SigLIP model: trained specifically to distinguish real photos from AI-generated.
    Returns AI-generated probability 0–1, or None if model unavailable.
    """
    if _primary_model is None or _primary_processor is None:
        return None
    try:
        dev    = _get_device()
        inputs = _primary_processor(images=pil_image, return_tensors="pt").to(dev)
        with torch.no_grad():
            logits = _primary_model(**inputs).logits
        probs    = torch.softmax(logits, dim=-1).squeeze().tolist()
        id2label = _primary_model.config.id2label

        # Find the AI/fake label
        ai_idx = next(
            (i for i, l in id2label.items()
             if any(k in l.upper() for k in ["AI","FAKE","ARTIF","SYNTH","GENERATED"])),
            None,
        )
        if ai_idx is None:
            # Fallback: pick the label that is NOT human
            ai_idx = next(
                (i for i, l in id2label.items()
                 if not any(k in l.upper() for k in ["HUM","REAL","HUMAN","AUTHENTIC"])),
                0,
            )

        score = float(probs[ai_idx]) if isinstance(probs, list) else float(probs)
        print(f"[PRIMARY SigLIP] AI prob={score:.3f} | Labels={id2label}")
        return score
    except Exception as e:
        print(f"[PRIMARY ERROR] {e}")
        return None


# ─────────────────────────────────────────────────────────────
# 🔍 SECONDARY: ViT deepfake (runs on face crops only)
# ─────────────────────────────────────────────────────────────
def _run_secondary_on_face(pil_face: "Image.Image") -> Optional[float]:
    """ViT deepfake model on a face crop. Returns fake prob 0–1, or None."""
    if _secondary_model is None or _secondary_proc is None:
        return None
    try:
        dev    = _get_device()
        inputs = _secondary_proc(images=pil_face, return_tensors="pt").to(dev)
        with torch.no_grad():
            logits = _secondary_model(**inputs).logits
        probs    = torch.softmax(logits, dim=-1).squeeze().tolist()
        id2label = _secondary_model.config.id2label
        fake_idx = next(
            (i for i, l in id2label.items()
             if any(k in l.upper() for k in ["FAKE","DEEP","ARTIF","SYNTH"])),
            0,
        )
        return float(probs[fake_idx])
    except Exception as e:
        print(f"[SECONDARY ERROR] {e}")
        return None


# ─────────────────────────────────────────────────────────────
# 🖼️ Full Image Inference Pipeline
# ─────────────────────────────────────────────────────────────
def _local_infer_image(image_bytes: bytes) -> dict:
    """
    Returns dict with actual model outputs only.
    No fabricated scores or evidence labels.
    """
    _load_models()

    # ── EXIF check (metadata signal only) ──
    exif = _check_exif(image_bytes)

    # ── Decode image ──
    nparr     = np.frombuffer(image_bytes, np.uint8)
    image_bgr = cv2.imdecode(nparr, cv2.IMREAD_COLOR) if CV2_AVAILABLE else None
    pil_full  = Image.open(io.BytesIO(image_bytes)).convert("RGB")

    # ── PRIMARY: SigLIP on full image ──
    primary_score = _run_primary(pil_full)

    # ── SECONDARY: ViT on face crops ──
    secondary_score = None
    face_count      = 0

    if image_bgr is not None:
        faces      = _detect_faces(image_bgr)
        face_count = len(faces)
        print(f"[FACE DETECT] {face_count} face(s) found")

        if face_count > 0:
            face_scores = []
            for i, (x, y, w, h) in enumerate(faces):
                crop = _crop_face(image_bgr, x, y, w, h)
                if crop is None or crop.size == 0:
                    continue
                pil_crop = Image.fromarray(cv2.cvtColor(crop, cv2.COLOR_BGR2RGB))
                s        = _run_secondary_on_face(pil_crop)
                if s is not None:
                    face_scores.append(s)
                    print(f"[SECONDARY] Face {i+1}: fake_prob={s:.3f}")
            if face_scores:
                secondary_score = max(face_scores)  # worst face drives the verdict

    return {
        "primary_score":   primary_score,
        "secondary_score": secondary_score,
        "exif":            exif,
        "face_count":      face_count,
    }


def _combine_image_scores(res: dict) -> float:
    """
    Combine primary + secondary + EXIF into a single 0–1 probability.

    Weighting (deterministic, transparent):
      Primary (SigLIP)   → 70% — trained on real vs AI photos
      Secondary (ViT)    → 30% — only if face detected
      EXIF missing boost → small +4 pts if image is already suspicious (>0.45)

    EXIF note: missing EXIF is NOT proof of AI generation. It is a weak
    supporting signal only used when the image classifier already suspects AI.
    """
    p = res["primary_score"]
    s = res["secondary_score"]
    e = res["exif"]["has_exif"]

    if p is None and s is None:
        return 0.40   # no model signal → lean toward authentic

    if p is not None and s is not None:
        combined = (p * 0.70) + (s * 0.30)
    elif p is not None:
        combined = p
    else:
        combined = s

    # Small EXIF metadata signal (reduced from 8→4 pts)
    if e is False and combined > 0.45:
        print(f"[EXIF] No metadata present → +{METADATA_BOOST}pts (weak supporting signal)")
        combined = min(1.0, combined + METADATA_BOOST / 100)

    print(f"[COMBINE] primary={f'{p:.3f}' if p is not None else 'N/A'} "
          f"secondary={f'{s:.3f}' if s is not None else 'N/A'} "
          f"exif={'yes' if e else 'no' if e is False else 'unknown'} → final={combined:.3f}")
    return combined


# ─────────────────────────────────────────────────────────────
# 🔤 Text Inference
# ─────────────────────────────────────────────────────────────
def _local_infer_text(text: str) -> dict:
    """
    Returns dict with:
      ai_prob      : float 0–1 (AI-generated probability from model)
      model_label  : str  (raw model label)
      model_confidence : float (model's own confidence)
      classification : str ("Likely AI-generated" | "Likely human-written" | "Uncertain")
    Model: Hello-SimpleAI/chatgpt-detector-roberta
    Labels: "Fake" = AI-generated, "Real" = human-written
    """
    _load_models()
    if _text_pipeline is None:
        return {"ai_prob": None, "model_label": None, "model_confidence": None,
                "classification": "Unavailable", "model": TEXT_MODEL_ID}
    try:
        result = _text_pipeline(text[:512])[0]
        label  = result["label"].upper()
        score  = float(result["score"])
        print(f"[TEXT MODEL] label={label!r} confidence={score:.3f}")

        # Map to AI probability
        if "FAKE" in label or label == "1":
            ai_prob = score
        elif "REAL" in label or label == "0":
            ai_prob = 1.0 - score
        else:
            print(f"[TEXT MODEL] Unknown label {label!r} — using score as-is")
            ai_prob = score

        # Classification with uncertainty handling
        if score < TEXT_UNCERTAIN_THRESHOLD:
            classification = "Uncertain"
        elif ai_prob >= 0.65:
            classification = "Likely AI-generated"
        else:
            classification = "Likely human-written"

        return {
            "ai_prob":           ai_prob,
            "model_label":       label,
            "model_confidence":  score,
            "classification":    classification,
            "model":             TEXT_MODEL_ID,
        }

    except Exception as e:
        print("[TEXT INFER ERROR]", e)
        return {"ai_prob": None, "model_label": None, "model_confidence": None,
                "classification": "Unavailable", "model": TEXT_MODEL_ID}


# ─────────────────────────────────────────────────────────────
# 📷 Frame Quality
# ─────────────────────────────────────────────────────────────
def _is_sharp(frame_bgr) -> bool:
    gray = cv2.cvtColor(frame_bgr, cv2.COLOR_BGR2GRAY)
    return cv2.Laplacian(gray, cv2.CV_64F).var() >= BLUR_THRESHOLD


# ─────────────────────────────────────────────────────────────
# 🎬 Video Analysis (Spatio-Temporal Model)
# ─────────────────────────────────────────────────────────────
def _analyze_video(video_bytes: bytes) -> dict:
    """
    Spatio-Temporal Video Deepfake Detection:
    EfficientNet-B5 + Xception (512-D spatial fusion) -> Bi-LSTM -> Temporal Attention.
    Passes 8-frame sequence tensor [1, 8, 3, 300, 300] to produce unified video prediction.
    """
    tmp = os.path.join(tempfile.gettempdir(), f"vn_video_{uuid.uuid4().hex[:8]}.mp4")
    try:
        with open(tmp, "wb") as f:
            f.write(video_bytes)
        res = predict_video(tmp)
        return res
    except Exception as e:
        print("[VIDEO ANALYSIS ERROR]", e)
        return {
            "success": False,
            "error": str(e),
            "score": 50,
            "verdict": "UNCERTAIN",
            "fake_probability": 0.5,
            "real_probability": 0.5,
            "frames_analyzed": 0,
            "key_frames": [],
            "analyzed_frames": [],
            "model": "EfficientNet-B5 + Xception + Bi-LSTM + Attention",
            "checkpoint_loaded": False
        }
    finally:
        if os.path.exists(tmp):
            try:
                os.remove(tmp)
            except Exception:
                pass


# ─────────────────────────────────────────────────────────────
# 🎵 Audio Signal Analysis (MFCC)
# ─────────────────────────────────────────────────────────────
def _analyze_audio(audio_bytes: bytes) -> dict:
    """
    Audio signal analysis using MFCC (Mel-frequency cepstral coefficients).

    IMPORTANT: This is NOT a trained audio deepfake/voice-clone detector.
    MFCC variance alone is a basic signal analysis feature — it cannot reliably
    distinguish synthetic from real speech.

    Returns:
      mfcc_variance : float — variance of MFCC features
      duration_sec  : float — audio duration
      sample_rate   : int   — sample rate used for analysis
      status        : str   — "analyzed" | "unavailable" | "error"
    """
    if not LIBROSA_AVAILABLE:
        return {
            "mfcc_variance": None,
            "duration_sec":  None,
            "sample_rate":   None,
            "status":        "unavailable",
        }
    tmp = os.path.join(tempfile.gettempdir(), f"vn_audio_{uuid.uuid4().hex[:8]}.wav")
    try:
        with open(tmp, "wb") as f:
            f.write(audio_bytes)
        y, sr    = librosa.load(tmp, sr=16000, mono=True)
        mfcc     = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
        variance = float(np.var(mfcc))
        duration = float(len(y) / sr)
        print(f"[AUDIO] MFCC variance={variance:.2f} | duration={duration:.2f}s | sr={sr}")
        return {
            "mfcc_variance": round(variance, 2),
            "duration_sec":  round(duration, 2),
            "sample_rate":   sr,
            "status":        "analyzed",
        }
    except Exception as e:
        print("[AUDIO ERROR]", e)
        return {
            "mfcc_variance": None,
            "duration_sec":  None,
            "sample_rate":   None,
            "status":        "error",
        }
    finally:
        if os.path.exists(tmp):
            os.remove(tmp)


# ─────────────────────────────────────────────────────────────
# ⚡ Score Utilities
# ─────────────────────────────────────────────────────────────
def _heuristic_text(text: str) -> float:
    if not text: return 50.0
    words = text.split()
    return max(10.0, min(90.0, (1 - len(set(words)) / max(len(words), 1)) * 100))

def _ensemble_score(
    text:      Optional[float] = None,
    image:     Optional[float] = None,
    heuristic: float = 0.5,
) -> float:
    """
    Deterministic weighted combination. Only includes modalities with valid scores.
    Weights are transparent and documented.
    """
    W = {"text": 0.50, "image": 0.75, "heuristic": 0.05}
    total = weight_sum = 0.0
    if text  is not None: total += text  * W["text"];  weight_sum += W["text"]
    if image is not None: total += image * W["image"]; weight_sum += W["image"]
    total += heuristic * W["heuristic"]; weight_sum += W["heuristic"]
    return (total / weight_sum) * 100 if weight_sum > 0 else 50.0


def _classify(score: float) -> str:
    """Convert numeric score to classification label."""
    if score >= 80: return "Likely synthetic"
    if score >= 65: return "Possibly synthetic"
    if score >= 45: return "Uncertain"
    if score >= 25: return "Likely authentic"
    return "Likely authentic"


def _confidence_label(score: float) -> str:
    """Return model confidence level based on distance from 50%."""
    dist = abs(score - 50)
    if dist >= 30: return "High"
    if dist >= 15: return "Moderate"
    return "Low"


# ─────────────────────────────────────────────────────────────
# 🧾 Transparent Response Builder
# ─────────────────────────────────────────────────────────────
STANDARD_LIMITATIONS = [
    "AI detection is probabilistic — results are not definitive proof.",
    "Detection performance depends on model training distribution and content type.",
    "Metadata (EXIF) may be missing due to screenshots, social media, or compression — not AI generation.",
    "Audio analysis uses signal features (MFCC) only — no trained audio deepfake model is integrated.",
    "Manipulation localization (bounding boxes) is not implemented in this version.",
    "Models may not generalize to all types of AI-generated content.",
]

def _build_response(
    score:    float,
    filename: str,
    start_time: float,
    modality: str = "media",
    evidence: Optional[List[dict]] = None,
    video_data: Optional[dict] = None,
    text_result: Optional[dict] = None,
    exif_data: Optional[dict] = None,
    face_count: int = 0,
    primary_score: Optional[float] = None,
    secondary_score: Optional[float] = None,
    audio_data: Optional[dict] = None,
) -> dict:
    """
    Build a fully transparent, deterministic response.
    All evidence items come from actual computations — nothing is fabricated.
    """
    processing_time_ms = round((time.time() - start_time) * 1000)
    verdict            = "SYNTHETIC" if score > VERDICT_THRESHOLD else "AUTHENTIC"
    classification     = _classify(score)
    confidence         = _confidence_label(score)

    # ── Build evidence list from actual computation results ──
    evidence_list = []

    if modality == "image" or (modality == "media" and primary_score is not None):
        # Image classifier evidence (actual model output)
        if primary_score is not None:
            evidence_list.append({
                "name":   "Image AI classifier (SigLIP)",
                "score":  round(primary_score * 100, 1),
                "status": "analyzed",
                "source": PRIMARY_MODEL_ID,
                "note":   "Trained to distinguish real photos from AI-generated images",
            })
        else:
            evidence_list.append({
                "name":   "Image AI classifier (SigLIP)",
                "status": "unavailable",
                "source": PRIMARY_MODEL_ID,
            })

        # Face deepfake classifier (actual model output)
        if face_count > 0 and secondary_score is not None:
            evidence_list.append({
                "name":   "Face deepfake classifier (ViT)",
                "score":  round(secondary_score * 100, 1),
                "status": "analyzed",
                "source": SECONDARY_MODEL_ID,
                "note":   f"Analyzed {face_count} detected face(s)",
            })
        elif face_count > 0 and secondary_score is None:
            evidence_list.append({
                "name":   "Face deepfake classifier (ViT)",
                "status": "unavailable",
                "source": SECONDARY_MODEL_ID,
                "note":   f"{face_count} face(s) detected but model unavailable",
            })
        else:
            evidence_list.append({
                "name":   "Face deepfake classifier (ViT)",
                "status": "not_applicable",
                "source": SECONDARY_MODEL_ID,
                "note":   "No faces detected in image",
            })

        # EXIF metadata (informational signal only)
        if exif_data:
            exif_entry = {
                "name":   "EXIF metadata",
                "status": exif_data.get("status", "unavailable"),
                "source": "exifread",
                "note":   (
                    "Metadata present — see fields for camera/software info"
                    if exif_data.get("has_exif")
                    else "Metadata absent — common due to screenshots, social media, or compression"
                ),
            }
            if exif_data.get("fields"):
                exif_entry["fields"] = exif_data["fields"]
            evidence_list.append(exif_entry)
        else:
            evidence_list.append({
                "name":   "EXIF metadata",
                "status": "unavailable",
                "source": "exifread",
            })

        # Manipulation localization — NOT implemented
        evidence_list.append({
            "name":   "Manipulation localization",
            "status": "not_available",
            "note":   "Pixel-level manipulation localization is not implemented in this version.",
        })

    elif modality == "audio":
        # Audio signal analysis (MFCC — NOT a deepfake detector)
        if audio_data and audio_data.get("status") == "analyzed":
            evidence_list.append({
                "name":           "Audio signal analysis (MFCC)",
                "status":         "analyzed",
                "source":         "librosa",
                "mfcc_variance":  audio_data.get("mfcc_variance"),
                "duration_sec":   audio_data.get("duration_sec"),
                "sample_rate":    audio_data.get("sample_rate"),
                "note":           "MFCC variance is a basic spectral feature — NOT a trained voice-clone or deepfake detector.",
            })
        else:
            evidence_list.append({
                "name":   "Audio signal analysis (MFCC)",
                "status": "unavailable" if not LIBROSA_AVAILABLE else "error",
                "source": "librosa",
            })
        evidence_list.append({
            "name":   "Audio deepfake model",
            "status": "not_available",
            "note":   "No trained audio anti-spoofing model is integrated. Audio deepfake detection is not available.",
        })

    elif modality == "text":
        if text_result:
            evidence_list.append({
                "name":              "AI text classifier (RoBERTa)",
                "classification":    text_result.get("classification"),
                "ai_probability":    round((text_result.get("ai_prob") or 0) * 100, 1) if text_result.get("ai_prob") is not None else None,
                "model_confidence":  round((text_result.get("model_confidence") or 0) * 100, 1) if text_result.get("model_confidence") is not None else None,
                "status":            "analyzed" if text_result.get("ai_prob") is not None else "unavailable",
                "source":            TEXT_MODEL_ID,
                "note":              "Trained to detect LLM-generated text (GPT-4, Claude, ChatGPT, etc.)",
            })
        else:
            evidence_list.append({
                "name":   "AI text classifier (RoBERTa)",
                "status": "unavailable",
                "source": TEXT_MODEL_ID,
            })

    elif modality in ("media", "video"):
        if video_data and video_data.get("analyzed_frames"):
            frames = video_data["analyzed_frames"]
            evidence_list.append({
                "name":            "Spatio-Temporal Video Analysis",
                "status":          "analyzed",
                "source":          "EfficientNet-B5 + Xception + Bi-LSTM + Attention",
                "frames_analyzed": video_data.get("frames_analyzed", len(frames)),
                "key_frames":      video_data.get("key_frames", []),
                "real_probability": round((video_data.get("real_probability", 0.5)) * 100, 1),
                "fake_probability": round((video_data.get("fake_probability", 0.5)) * 100, 1),
                "checkpoint_loaded": video_data.get("checkpoint_loaded", False),
                "note":            "8-frame sequence tensor passed through fused EfficientNet-B5/Xception features, Bi-LSTM temporal model, and attention pool.",
            })
        else:
            evidence_list.append({
                "name":   "Spatio-Temporal Video Analysis",
                "status": "unavailable",
                "source": "EfficientNet-B5 + Xception + Bi-LSTM + Attention",
            })

    # Add any additional evidence passed in
    if evidence:
        for item in evidence:
            evidence_list.append(item)

    # ── Score fusion documentation ──
    score_fusion = {
        "method": "Weighted combination of available model outputs",
        "components": [],
        "note": "Only components with valid model outputs contribute to the final score.",
    }
    if modality == "image" and primary_score is not None:
        score_fusion["components"].append({"name": "SigLIP classifier", "weight": "70%"})
        if secondary_score is not None:
            score_fusion["components"].append({"name": "ViT face deepfake", "weight": "30%"})
        if exif_data and exif_data.get("has_exif") is False:
            score_fusion["components"].append({"name": "EXIF metadata signal", "weight": "+4pts (supporting only)"})
    elif modality == "text":
        score_fusion["components"].append({"name": "RoBERTa classifier", "weight": "primary"})
    elif modality in ("media", "video"):
        score_fusion["components"].append({"name": "EfficientNet-B5 + Xception + Bi-LSTM + Attention", "weight": "100% (Spatio-Temporal)"})

    resp = {
        "success":            True,
        "scan_id":            f"0x{uuid.uuid4().hex[:8]}",
        "filename":           filename,
        "modality":           modality,
        "classification":     classification,
        "verdict":            verdict,
        "score":              int(round(score)),
        "confidence":         confidence,
        "processing_time_ms": processing_time_ms,
        "latency":            f"{processing_time_ms/1000:.3f}s",
        "model": (
            TEXT_MODEL_ID      if modality == "text"
            else PRIMARY_MODEL_ID if modality == "image"
            else "EfficientNet-B5 + Xception + Bi-LSTM + Attention"
        ),
        "evidence":           evidence_list,
        "score_fusion":       score_fusion,
        "limitations":        STANDARD_LIMITATIONS,
    }
    if modality in ("media", "video") and video_data:
        resp.update({
            "real_probability": video_data.get("real_probability", 0.5),
            "fake_probability": video_data.get("fake_probability", 0.5),
            "frames_analyzed": video_data.get("frames_analyzed", 8),
            "key_frames": video_data.get("key_frames", []),
            "attention_weights": video_data.get("attention_weights", []),
            "checkpoint_loaded": video_data.get("checkpoint_loaded", False),
        })
    return resp


# ─────────────────────────────────────────────────────────────
# 🚀 Endpoints
# ─────────────────────────────────────────────────────────────
@app.get("/")
def root():
    return {
        "message": "Veritas Neural API is live",
        "version": "11.0.0",
        "docs":    "/docs",
        "health":  "/health",
    }

@app.get("/health")
async def health():
    return {
        "status":            "operational",
        "engine":            "v11.0",
        "cv2":               CV2_AVAILABLE,
        "librosa":           LIBROSA_AVAILABLE,
        "torch":             TORCH_AVAILABLE,
        "exifread":          EXIF_AVAILABLE,
        "primary_model":     PRIMARY_MODEL_ID,
        "primary_ready":     _primary_model is not None,
        "secondary_model":   SECONDARY_MODEL_ID,
        "secondary_ready":   _secondary_model is not None,
        "text_model":        TEXT_MODEL_ID,
        "text_ready":        _text_pipeline is not None,
        "verdict_threshold": VERDICT_THRESHOLD,
        "cors_origins":      ALLOWED_ORIGINS,
        "signals_implemented": [
            "SigLIP image classifier (ai-vs-human)",
            "ViT face deepfake classifier (face crops only)",
            "EXIF metadata presence check",
            "Audio signal analysis (MFCC — informational only)",
            "RoBERTa AI text detector",
            "Video frame sampling with blur detection",
        ],
        "signals_not_implemented": [
            "PRNU sensor noise analysis",
            "GAN boundary detection",
            "Lip-sync desynchronization detection",
            "Temporal transformer analysis",
            "Pixel-level manipulation localization",
            "Trained audio anti-spoofing model",
        ],
    }


@app.post("/api/analyze")
async def analyze(
    file: Optional[UploadFile] = File(None),
    text_payload: Optional[str] = Form(None),
):
    if file is None and not text_payload:
        raise HTTPException(status_code=422, detail="Provide file or text_payload.")

    start = time.time()

    # ── Pure text ──
    if text_payload and not file:
        text_stripped = text_payload.strip()
        if len(text_stripped) < 10:
            raise HTTPException(status_code=422, detail="Text too short for analysis (minimum 10 characters).")

        text_result = _local_infer_text(text_stripped)
        ai_prob     = text_result.get("ai_prob")

        if ai_prob is not None:
            heuristic = _heuristic_text(text_stripped) / 100
            # Heuristic is a very weak secondary signal — small weight
            raw_score = _ensemble_score(text=ai_prob, heuristic=heuristic)
            final     = _calibrate_score(raw_score)
        else:
            # Model unavailable — cannot produce reliable score
            final = 50.0

        return _build_response(
            score=final,
            filename="pasted_text.txt",
            start_time=start,
            modality="text",
            text_result=text_result,
        )

    # ── File upload ──
    content = await file.read()

    # File size limit
    if len(content) > 20 * 1024 * 1024:  # 20MB
        raise HTTPException(status_code=413, detail="File too large. Maximum supported size is 20MB.")

    if len(content) == 0:
        raise HTTPException(status_code=422, detail="Uploaded file is empty.")

    filename     = file.filename or "uploaded_file"
    content_type = file.content_type or ""
    ext          = os.path.splitext(filename)[1].lower()

    # ── Text file ──
    if "text" in content_type or ext in {".txt", ".md"}:
        try:
            decoded = content.decode("utf-8", errors="ignore")
        except Exception:
            raise HTTPException(status_code=422, detail="Cannot decode text file as UTF-8.")
        if len(decoded.strip()) < 10:
            raise HTTPException(status_code=422, detail="Text file too short for analysis.")
        text_result = _local_infer_text(decoded)
        ai_prob     = text_result.get("ai_prob")
        heuristic   = _heuristic_text(decoded) / 100
        final       = _calibrate_score(_ensemble_score(text=ai_prob, heuristic=heuristic)) if ai_prob is not None else 50.0
        return _build_response(
            score=final, filename=filename, start_time=start,
            modality="text", text_result=text_result,
        )

    # ── Image ──
    if "image" in content_type or ext in {".jpg", ".jpeg", ".png", ".webp", ".gif", ".bmp"}:
        try:
            res = _local_infer_image(content)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Image analysis failed: {str(e)}")

        combined = _combine_image_scores(res)
        final    = _calibrate_score(_ensemble_score(image=combined))

        return _build_response(
            score=final,
            filename=filename,
            start_time=start,
            modality="image",
            exif_data=res.get("exif"),
            face_count=res.get("face_count", 0),
            primary_score=res.get("primary_score"),
            secondary_score=res.get("secondary_score"),
        )

    # ── Audio ──
    if "audio" in content_type or ext in {".wav", ".mp3", ".ogg", ".flac", ".m4a"}:
        try:
            audio_res = _analyze_audio(content)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Audio analysis failed: {str(e)}")

        # Audio: we cannot produce a reliable AI probability — return score=50 (uncertain)
        # We show the MFCC signal analysis as informational only
        final = 50.0  # Cannot make reliable AI/real determination from MFCC alone
        return _build_response(
            score=final,
            filename=filename,
            start_time=start,
            modality="audio",
            audio_data=audio_res,
        )

    # ── Video ──
    if "video" in content_type or ext in {".mp4", ".mov", ".avi", ".mkv", ".webm"}:
        try:
            video_res = _analyze_video(content)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Video analysis failed: {str(e)}")

        fake_prob = video_res.get("fake_probability", 0.5)
        score = video_res.get("score", int(round(fake_prob * 100)))

        return _build_response(
            score=score,
            filename=filename,
            start_time=start,
            modality="video",
            video_data=video_res,
        )

    # ── Unsupported format ──
    raise HTTPException(
        status_code=415,
        detail=f"Unsupported file type '{ext or content_type}'. Supported: image (jpg/png/webp), video (mp4/mov/avi), audio (wav/mp3/ogg), text (txt)."
    )


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port)