import os
import cv2
import numpy as np
import torch

# Safely load OpenCV Haar Cascade classifier for face detection
_face_cascade = None
if hasattr(cv2, "CascadeClassifier") and hasattr(cv2, "data") and hasattr(cv2.data, "haarcascades"):
    try:
        _cascade_path = cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
        if os.path.exists(_cascade_path):
            _face_cascade = cv2.CascadeClassifier(_cascade_path)
    except Exception as e:
        print(f"[PREPROCESSING] Warning loading Haar cascade: {e}")
        _face_cascade = None

IMAGENET_MEAN = np.array([0.485, 0.456, 0.406], dtype=np.float32).reshape(1, 1, 3)
IMAGENET_STD  = np.array([0.229, 0.224, 0.225], dtype=np.float32).reshape(1, 1, 3)


def crop_face_or_center(frame: np.ndarray, padding_ratio: float = 0.25) -> np.ndarray:
    """
    Detect the largest face in the frame using OpenCV Haar Cascade with padding.
    If no face is detected or cascade unavailable, fall back to center square crop.
    Returns RGB frame resized to (300, 300).
    """
    h, w, c = frame.shape
    faces = []

    if _face_cascade is not None and not _face_cascade.empty():
        try:
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            detected = _face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(60, 60))
            if len(detected) > 0:
                faces = detected
        except Exception:
            faces = []

    if len(faces) > 0:
        # Find largest face by area (w * h)
        largest_face = max(faces, key=lambda b: b[2] * b[3])
        fx, fy, fw, fh = largest_face

        # Apply padding
        pw = int(fw * padding_ratio)
        ph = int(fh * padding_ratio)

        x1 = max(0, fx - pw)
        y1 = max(0, fy - ph)
        x2 = min(w, fx + fw + pw)
        y2 = min(h, fy + fh + ph)

        crop = frame[y1:y2, x1:x2]
    else:
        # Fallback to center-crop square
        crop_dim = min(h, w)
        start_x = (w - crop_dim) // 2
        start_y = (h - crop_dim) // 2
        crop = frame[start_y : start_y + crop_dim, start_x : start_x + crop_dim]

    if crop.size == 0:
        crop = frame

    crop_rgb = cv2.cvtColor(crop, cv2.COLOR_BGR2RGB)
    resized = cv2.resize(crop_rgb, (300, 300), interpolation=cv2.INTER_LINEAR)
    return resized


def preprocess_video_frames(
    video_path: str,
    num_frames: int = 8,
    target_size: tuple = (300, 300)
) -> tuple[torch.Tensor, list[dict]]:
    """
    Extracts exactly num_frames (8) evenly spaced frames from video_path.
    Applies face crop (or center crop fallback) and ImageNet normalization.
    Returns:
        tensor: [1, num_frames, 3, 300, 300]
        frame_info: list of metadata dicts for analyzed frames
    """
    if not os.path.exists(video_path):
        raise FileNotFoundError(f"Video file not found at '{video_path}'")

    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        raise ValueError(f"OpenCV could not open video file '{video_path}'")

    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    fps = cap.get(cv2.CAP_PROP_FPS) or 30.0

    if total_frames <= 0:
        cap.release()
        raise ValueError("Uploaded video has zero frames or cannot be decoded.")

    # Select exactly 8 uniformly spaced frame indices
    if total_frames >= num_frames:
        frame_indices = np.linspace(0, total_frames - 1, num_frames, dtype=int)
    else:
        # Repeat indices if video is very short
        frame_indices = np.array([int(i % total_frames) for i in range(num_frames)])

    processed_frames = []
    frame_info = []

    for i, target_idx in enumerate(frame_indices):
        cap.set(cv2.CAP_PROP_POS_FRAMES, target_idx)
        ret, frame = cap.read()
        if not ret or frame is None:
            # Fallback black frame if read fails
            frame = np.zeros((target_size[1], target_size[0], 3), dtype=np.uint8)

        timestamp_sec = float(target_idx / fps)
        mm = int(timestamp_sec // 60)
        ss = int(timestamp_sec % 60)
        timestamp_str = f"{mm}:{ss:02d}"

        # Crop face/center and resize (RGB 300x300)
        cropped_rgb = crop_face_or_center(frame, padding_ratio=0.25)

        # Normalize with ImageNet mean/std
        normalized = (cropped_rgb.astype(np.float32) / 255.0 - IMAGENET_MEAN) / IMAGENET_STD
        # Transpose HWC [300, 300, 3] -> CHW [3, 300, 300]
        chw_tensor = np.transpose(normalized, (2, 0, 1))
        processed_frames.append(chw_tensor)

        frame_info.append({
            "frame_index": int(target_idx),
            "sequence_index": i,
            "timestamp_sec": round(timestamp_sec, 2),
            "timestamp_str": timestamp_str,
        })

    cap.release()

    # Stack into sequence tensor: [1, 8, 3, 300, 300]
    sequence_arr = np.stack(processed_frames, axis=0)  # [8, 3, 300, 300]
    batch_tensor = torch.from_numpy(sequence_arr).unsqueeze(0).float()  # [1, 8, 3, 300, 300]

    return batch_tensor, frame_info
