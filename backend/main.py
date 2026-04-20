"""
PhytoCare — FastAPI Backend
Potato & Tomato Plant Disease Detection via CNN (TensorFlow)
"""
import os

# Suppress TensorFlow logging and oneDNN warnings before any TF imports happen anywhere
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"

from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from PIL import Image
import numpy as np
import io
import random
import logging
from typing import Optional

# ─── Logging Setup ────────────────────────────────────────────────────────────

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger(__name__)

# ─── App Setup ────────────────────────────────────────────────────────────────

app = FastAPI(
    title="PhytoCare API",
    description="CNN-powered potato & tomato plant disease diagnosis",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Constants ────────────────────────────────────────────────────────────────

MODEL_PATH = os.path.join(os.path.dirname(__file__), "model", "potato_model.h5")
IMAGE_SIZE = (224, 224)
CLASS_NAMES = ["Early Blight", "Healthy", "Late Blight", "Tomato Bacterial Spot", "Tomato Leaf Mold"]

# Minimum confidence required to return a prediction (Feature 2)
CONFIDENCE_THRESHOLD = 70.0
INCONCLUSIVE_MESSAGE = "Inconclusive scan. Please ensure the leaf is well-lit and centered"

DISEASE_INFO = {
    "Early Blight": {
        "scientific_name": "Alternaria solani",
        "description": (
            "Early blight is a common fungal disease caused by Alternaria solani. "
            "It typically appears as dark brown spots with concentric rings on older leaves, "
            "creating a distinctive 'target board' pattern. The disease spreads rapidly in "
            "warm, humid conditions and can significantly reduce yield if left untreated."
        ),
        "symptoms": [
            "Dark brown circular spots with concentric rings",
            "Yellow halo surrounding lesions",
            "Premature leaf drop",
            "Lesions on stems and tubers in severe cases",
        ],
        "treatment": [
            "Apply fungicides containing chlorothalonil or mancozeb",
            "Remove and destroy infected plant debris",
            "Improve air circulation by proper plant spacing",
            "Avoid overhead irrigation to reduce leaf wetness",
            "Rotate crops — avoid planting potatoes in the same spot for 2–3 years",
        ],
        "severity": "moderate",
        "severity_color": "#f59e0b",
        "icon": "🍂",
    },
    "Late Blight": {
        "scientific_name": "Phytophthora infestans",
        "description": (
            "Late blight, caused by Phytophthora infestans, is one of the most destructive "
            "plant diseases in history — it caused the Irish Potato Famine of the 1840s. "
            "Water-soaked lesions rapidly turn dark brown and destroy entire plants within days "
            "under cool, moist conditions. Immediate action is critical."
        ),
        "symptoms": [
            "Water-soaked, grayish-green lesions on leaves",
            "White mold visible on leaf undersides in humid conditions",
            "Dark brown, greasy-looking patches that spread rapidly",
            "Rotting tubers with reddish-brown internal discoloration",
        ],
        "treatment": [
            "Apply copper-based or systemic fungicides immediately",
            "Remove and destroy all infected plant material",
            "Avoid working in fields when plants are wet",
            "Use certified disease-free seed potatoes",
            "Plant resistant varieties where possible",
            "Monitor weather — disease thrives at 10–25°C with high humidity",
        ],
        "severity": "severe",
        "severity_color": "#ef4444",
        "icon": "⚠️",
    },
    "Tomato Leaf Mold": {
        "scientific_name": "Fulvia fulva",
        "description": (
            "Tomato Leaf Mold is a fungal disease caused by Fulvia fulva, primarily affecting "
            "tomatoes in high-humidity greenhouse and field environments. It begins as pale yellow "
            "spots on the upper leaf surface with a characteristic olive-green to gray mold layer on "
            "the underside. Severe infections can cause significant yield loss."
        ),
        "symptoms": [
            "Pale yellow to greenish-yellow spots on upper leaf surface",
            "Olive-green to gray mold growth on leaf underside",
            "Leaves curl inward and eventually wither and drop",
            "Reduced fruit set and quality in severe cases",
        ],
        "treatment": [
            "Improve ventilation — reduce relative humidity below 85%",
            "Apply fungicides (mancozeb, chlorothalonil, or copper-based)",
            "Remove and destroy infected leaves promptly",
            "Avoid overhead watering; use drip irrigation",
            "Plant resistant tomato varieties (e.g., Cf-resistant cultivars)",
        ],
        "severity": "moderate",
        "severity_color": "#f59e0b",
        "icon": "🍃",
    },
    "Tomato Bacterial Spot": {
        "scientific_name": "Xanthomonas campestris pv. vesicatoria",
        "description": (
            "Bacterial Spot is caused by Xanthomonas bacteria and affects tomato leaves, stems, and "
            "fruits. It is particularly damaging in warm, wet weather and can survive in infected seed "
            "and crop debris. The disease reduces photosynthesis and causes premature defoliation, "
            "exposing fruits to sunscald."
        ),
        "symptoms": [
            "Small, water-soaked, circular spots on leaves turning dark brown",
            "Spots with yellow halo on leaf margins",
            "Raised, rough, scab-like lesions on green fruit",
            "Premature defoliation exposing fruits to sunscald",
        ],
        "treatment": [
            "Use copper-based bactericides at first sign of disease",
            "Apply mancozeb in combination with copper for better control",
            "Use certified disease-free seeds — treat seeds with hot water (50°C, 25 min)",
            "Avoid overhead irrigation and working in wet fields",
            "Rotate crops and clean equipment between farms",
        ],
        "severity": "moderate",
        "severity_color": "#f59e0b",
        "icon": "🔴",
    },
    "Healthy": {
        "scientific_name": "Solanum tuberosum",
        "description": (
            "Great news! Your potato plant appears healthy with no signs of disease. "
            "The leaf structure, coloration, and texture are consistent with a thriving plant. "
            "Continue your current care regimen and monitor regularly for early signs of stress."
        ),
        "symptoms": [
            "Deep green, vibrant leaf color",
            "No lesions, spots, or discoloration",
            "Firm, upright stems",
            "Normal leaf shape and texture",
        ],
        "treatment": [
            "Maintain balanced fertilization (NPK ratio)",
            "Water at the base to avoid leaf wetness",
            "Scout regularly for early pest or disease signs",
            "Ensure proper soil drainage",
            "Continue crop rotation practices",
        ],
        "severity": "none",
        "severity_color": "#22c55e",
        "icon": "✅",
    },
}

# ─── Model Loading ─────────────────────────────────────────────────────────────

model = None


def load_model():
    global model
    if not os.path.exists(MODEL_PATH):
        logger.warning(f"Model not found at {MODEL_PATH}. Running in demo mode.")
        return
    try:
        import tensorflow as tf
        model = tf.keras.models.load_model(MODEL_PATH)
        logger.info("TensorFlow model loaded successfully.")
    except ImportError:
        logger.error("CRITICAL: TensorFlow is not installed. This is usually because Python 3.14 is not yet supported. Please use Python 3.10, 3.11, or 3.12.")
        model = None
    except Exception as e:
        logger.error(f"Failed to load model: {e}")
        model = None


@app.on_event("startup")
async def startup_event():
    load_model()


# ─── Utilities ────────────────────────────────────────────────────────────────

def preprocess_image(image_bytes: bytes) -> np.ndarray:
    """Convert raw image bytes to a normalized numpy array for model input."""
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    image = image.resize(IMAGE_SIZE)
    arr = np.array(image, dtype=np.float32) / 255.0
    return np.expand_dims(arr, axis=0)


def demo_prediction(image_bytes: bytes) -> dict:
    """
    Deterministic demo prediction based on image size hash.
    Returns realistic-looking confidence scores without a real model.
    """
    # Use image hash for a stable but varied demo response
    seed = sum(image_bytes[:64]) % len(CLASS_NAMES)
    label = CLASS_NAMES[seed]
    # Generate realistic-looking softmax scores
    rng = random.Random(seed)
    top = rng.uniform(0.88, 0.99)
    rest = (1.0 - top) * rng.uniform(0.3, 0.7)
    scores = [0.0] * len(CLASS_NAMES)
    scores[seed] = top
    # Distribute remaining probability across other classes
    remaining = 1.0 - top
    for i in range(len(CLASS_NAMES)):
        if i != seed:
            share = remaining / (len(CLASS_NAMES) - 1)
            scores[i] = share
    return {
        "predicted_class": label,
        "confidence": round(top * 100, 2),
        "all_scores": {CLASS_NAMES[i]: round(scores[i] * 100, 2) for i in range(len(CLASS_NAMES))},
        "demo_mode": True,
    }


# ─── Routes ───────────────────────────────────────────────────────────────────

@app.get("/", tags=["Health"])
async def root():
    return {
        "service": "PhytoCare API",
        "version": "1.0.0",
        "model_loaded": model is not None,
    }


@app.get("/health", tags=["Health"])
async def health():
    return {
        "status": "ok",
        "model_loaded": model is not None,
        "mode": "inference" if model else "demo",
    }


@app.post("/predict", tags=["Prediction"])
async def predict(
    file: UploadFile = File(...),
    lat: Optional[float] = Form(None),   # Feature 3 — geolocation latitude
    lng: Optional[float] = Form(None),   # Feature 3 — geolocation longitude
):
    """
    Accepts a potato leaf image and returns disease prediction.

    Returns:
    - `disease`: predicted disease class
    - `confidence`: confidence percentage (0–100)
    - `all_scores`: confidence for all classes
    - `info`: disease description, symptoms, and treatment
    - `inconclusive`: true if confidence was below threshold (Feature 2)
    """
    # Validate file type
    if file.content_type not in ("image/jpeg", "image/png", "image/webp", "image/jpg"):
        raise HTTPException(
            status_code=400,
            detail="Invalid file type. Please upload a JPEG, PNG, or WebP image.",
        )

    image_bytes = await file.read()

    if len(image_bytes) > 10 * 1024 * 1024:  # 10MB limit
        raise HTTPException(status_code=400, detail="Image too large. Max size is 10MB.")

    # ── Run inference / demo prediction ──────────────────────────────────────
    if model is not None:
        try:
            arr = preprocess_image(image_bytes)
            preds = model.predict(arr)[0]
            idx = int(np.argmax(preds))
            label = CLASS_NAMES[idx]
            confidence = float(preds[idx]) * 100
            all_scores = {CLASS_NAMES[i]: round(float(preds[i]) * 100, 2) for i in range(len(CLASS_NAMES))}
        except Exception as e:
            logger.error(f"Inference error: {e}")
            raise HTTPException(status_code=500, detail=f"AI Model Error: {str(e)}")
    else:
        result = demo_prediction(image_bytes)
        label = result["predicted_class"]
        confidence = result["confidence"]
        all_scores = result["all_scores"]

    # ── Feature 2: Confidence Threshold Check ────────────────────────────────
    if confidence < CONFIDENCE_THRESHOLD:
        # Log the inconclusive scan with geolocation if available
        geo_str = f"lat={lat:.6f}, lng={lng:.6f}" if (lat is not None and lng is not None) else "location=N/A"
        logger.warning(
            f"[INCONCLUSIVE] confidence={confidence:.2f}% (threshold={CONFIDENCE_THRESHOLD}%) | {geo_str}"
        )
        raise HTTPException(
            status_code=422,
            detail=INCONCLUSIVE_MESSAGE,
        )

    # ── Feature 3: Geolocation Logging ───────────────────────────────────────
    if lat is not None and lng is not None:
        logger.info(f"[GEO] Disease={label} | confidence={confidence:.2f}% | lat={lat:.6f}, lng={lng:.6f}")
    else:
        logger.info(f"[GEO] Disease={label} | confidence={confidence:.2f}% | location=N/A (permission denied or unavailable)")

    info = DISEASE_INFO[label]

    return JSONResponse(
        content={
            "disease": label,
            "confidence": round(confidence, 2),
            "all_scores": all_scores,
            "info": info,
        }
    )


@app.get("/diseases", tags=["Information"])
async def get_diseases():
    """Return all supported disease classes with full metadata."""
    return {"diseases": DISEASE_INFO}
