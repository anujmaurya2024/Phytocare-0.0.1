# 🌿 PhytoCare

> AI-powered potato plant disease detection platform  
> **CNN · FastAPI · React.js · TensorFlow · PlantVillage**

---

## 🚀 Quick Start (One Click)

**Double-click `START_ALL.bat`** in the root folder.

This will:
1. Kill anything on port 8000
2. Open a console for the FastAPI backend (installs deps + starts server)
3. Open a console for the React frontend (installs deps + starts Vite)
4. Open http://localhost:5173 in your browser

---

## 📁 Project Structure

```
major project/
├── START_ALL.bat              ← Double-click to run everything
│
├── backend/
│   ├── main.py                ← FastAPI app (/predict, /health, /diseases)
│   ├── requirements.txt       ← Python dependencies
│   ├── start_backend.bat      ← Start backend only
│   ├── model/
│   │   └── potato_model.h5    ← ⚠️ Place your trained model here!
│   └── training/
│       └── train.py           ← CNN training script (MobileNetV2)
│
└── frontend/
    ├── start_frontend.bat     ← Start frontend only
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── App.jsx
        ├── index.css          ← Full design system
        ├── api/
        │   └── predict.js     ← API client
        ├── components/
        │   ├── Navbar.jsx
        │   ├── HeroSection.jsx
        │   ├── UploadCard.jsx
        │   ├── ResultCard.jsx
        │   ├── DiseaseCard.jsx
        │   ├── StatsBar.jsx
        │   └── Footer.jsx
        └── pages/
            ├── Home.jsx
            ├── Diagnose.jsx
            ├── Diseases.jsx
            └── About.jsx
```

---

## 🧠 Model Setup

Place your trained weights file at:
```
backend/model/potato_model.h5
```

The backend will auto-detect it on startup.  
Without it, the app runs in **demo mode** (still functional, shows simulated predictions).

### Training from scratch

1. Download the PlantVillage potato subset from [Kaggle](https://www.kaggle.com/datasets/arjuntejaswi/plant-village)
2. Place it at `backend/data/PlantVillage/` with these subdirectories:
   - `Potato___Early_blight/`
   - `Potato___Late_blight/`
   - `Potato___healthy/`
3. Run:
   ```
   cd backend/training
   python train.py
   ```

---

## 🌐 URLs

| Service | URL |
|---|---|
| Web App | http://localhost:5173 |
| FastAPI Backend | http://localhost:8000 |
| Interactive API Docs | http://localhost:8000/docs |

---

## 🔬 API Reference

### `POST /predict`
Upload a leaf image to get a disease prediction.

**Request:** `multipart/form-data` with `file` field (JPEG/PNG/WebP, max 10MB)

**Response:**
```json
{
  "disease": "Early Blight",
  "confidence": 96.42,
  "all_scores": {
    "Early Blight": 96.42,
    "Late Blight": 2.11,
    "Healthy": 1.47
  },
  "demo_mode": false,
  "info": {
    "scientific_name": "Alternaria solani",
    "description": "...",
    "symptoms": ["..."],
    "treatment": ["..."],
    "severity": "moderate",
    "icon": "🍂"
  }
}
```

### `GET /health`
Returns API status and whether the model is loaded.

### `GET /diseases`
Returns full metadata for all disease classes.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Web Frontend | React.js 18 + Vite |
| Styling | Vanilla CSS (dark emerald glassmorphism) |
| Routing | React Router DOM v6 |
| Backend API | FastAPI + Uvicorn |
| ML Framework | TensorFlow / Keras |
| Model | MobileNetV2 (transfer learning) |
| Dataset | PlantVillage — Potato subset |

---

## 📊 Model Performance

| Metric | Value |
|---|---|
| Validation Accuracy | ~98% |
| Base Model | MobileNetV2 |
| Input Size | 224 × 224 × 3 |
| Classes | Early Blight · Late Blight · Healthy |
| Optimizer | Adam (lr=1e-4) |

---

