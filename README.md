# 🎬 SentimentAI — Movie Review Analysis Dashboard

> End-to-end NLP pipeline exploring sentiment classification from Bag-of-Words to BERT ✨

A full-stack ML dashboard for IMDB movie sentiment analysis, featuring 4 models (Naive Bayes, Logistic Regression, Bidirectional LSTM, DistilBERT), rich data visualizations, LIME explanations, error analysis, and feature importance — all powered by a FastAPI backend and a beautiful React frontend.

**All metrics, charts, and data are generated from real model training — no mock or hardcoded data.**

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🧠 4 ML Models | Naive Bayes, Logistic Regression, Bidirectional LSTM, DistilBERT |
| 📊 Model Comparison | Metrics table, ROC curves, PR curves, radar chart, confusion matrices, training history |
| 📈 Data Explorer | Length histograms, sentiment donut, word frequency charts, sample review table |
| 🐛 Error Analysis | Filterable misclassification table, confidence distribution, high-confidence failures |
| 🔍 LIME Explanations | Pre-computed word-level importance for diverse test samples |
| ⭐ Feature Importance | Top positive/negative words from LR coefficients and NB log-probabilities |
| 🤝 Model Agreement | Heatmap showing how often model pairs agree, universally hard cases |
| 🌙 Beautiful UI | Warm design system with Framer Motion animations |

---

## 🗺️ Architecture Overview

```
train_and_export.py
      │
      ▼
Trains 4 models on IMDB 50K reviews
      │
      ▼
Computes all metrics, curves, errors, explanations
      │
      ▼
Writes 11 JSON files → backend/data/exports/
      │
      ▼
FastAPI reads those files on each request (no ML at runtime)
      │
      ▼
React fetches on page load → Recharts renders everything
```

The backend is **static** — it serves pre-computed JSON files only. No model inference happens at request time. Train once, serve forever.

---

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- Node.js v18+

### Step 1 — Backend Setup

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate

pip install -r requirements.txt
```

### Step 2 — Train models & export data

```bash
# From the project root (not inside backend/)
python train_and_export.py
```

This trains all available models and writes 11 JSON files to `backend/data/exports/`. The dashboard shows a "run training first" prompt on every page until this step is complete.

**Training time estimates:**

| Model | Time | Requires |
|-------|------|----------|
| Naive Bayes | ~30 sec | scikit-learn (default) |
| Logistic Regression | ~2 min | scikit-learn (default) |
| Bidirectional LSTM | ~15 min | `pip install tensorflow` |
| DistilBERT | ~30 min | `pip install transformers tensorflow` |

> ⚠️ TensorFlow and Transformers are **optional**. If not installed, those models are simply skipped and won't appear in the dashboard. NB and LR always run.

### Step 3 — Start the backend

```bash
cd backend
uvicorn main:app --reload --port 8000
```

### Step 4 — Start the frontend

```bash
cd frontend
npm install
npm run dev
# Opens at http://localhost:5173
```

---

## 📁 Project Structure

```
sentiment-dashboard/
├── train_and_export.py          # Run once — trains all models, writes JSON
│
├── backend/
│   ├── main.py                  # FastAPI app — serves static JSON files only
│   ├── requirements.txt         # Python dependencies
│   ├── models/
│   │   └── saved/               # Trained model files saved here after training
│   └── data/
│       └── exports/             # Generated JSON files (created by train_and_export.py)
│           ├── metrics.json
│           ├── confusion_matrices.json
│           ├── roc_curves.json
│           ├── pr_curves.json
│           ├── training_history.json
│           ├── error_samples.json
│           ├── lime_examples.json
│           ├── confidence_dist.json
│           ├── feature_importance.json
│           ├── dataset_stats.json
│           └── model_agreement.json
│
└── frontend/
    └── src/
        ├── pages/
        │   ├── Home.jsx             # Hero, stat cards, pipeline diagram
        │   ├── DataExplorer.jsx     # Charts + paginated review table
        │   ├── ModelComparison.jsx  # Metrics, ROC, PR, radar, confusion matrices
        │   ├── ErrorAnalysis.jsx    # Filterable misclassification table
        │   ├── LimeExplorer.jsx     # Pre-computed LIME word explanations
        │   └── FeatureImportance.jsx # Top words by model weight
        ├── components/
        │   ├── Navbar.jsx
        │   └── UI.jsx               # Shared: StatCard, Badge, ErrorBanner
        ├── hooks/
        │   └── useData.js           # Data fetching hook (loading / error / data)
        ├── services/
        │   └── api.js               # Axios client — all API call functions
        └── constants.js             # Model colors, chart styles
```

---

## 📡 API Reference

All endpoints read from pre-generated JSON files. No ML inference at request time.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Health check + list of available export files |
| `GET` | `/metrics` | Accuracy, Precision, Recall, F1, AUC-ROC, inference time per model |
| `GET` | `/confusion-matrices` | TP / TN / FP / FN counts per model |
| `GET` | `/roc-curves` | FPR / TPR arrays (200 points per model) |
| `GET` | `/pr-curves` | Precision / Recall arrays (200 points per model) |
| `GET` | `/training-history` | Loss + accuracy per epoch (LSTM and DistilBERT only) |
| `GET` | `/errors` | Misclassifications — filterable by `model`, `error_type`, `min_confidence` |
| `GET` | `/confidence-distribution` | Correct vs wrong prediction counts by confidence bucket |
| `GET` | `/feature-importance` | Top 30 positive/negative words per model |
| `GET` | `/lime-examples` | Pre-computed LIME explanations — filterable by `model` |
| `GET` | `/dataset/stats` | Length distributions, sentiment balance, sample reviews |
| `GET` | `/model-agreement` | Pairwise agreement matrix + universally hard cases |

**Filter example:**
```
GET /errors?model=Naive+Bayes&error_type=False+Positive&min_confidence=0.85
```

---

## 🎨 Pages

| Page | Route | What's Inside |
|------|-------|---------------|
| **Home** | `/` | Hero, real best-model stats, pipeline diagram, tech stack |
| **Dataset** | `/data` | Length histograms, sentiment donut, LR word importance, length vs accuracy, sample reviews |
| **Models** | `/comparison` | Metrics table, bar/radar charts, ROC curves, PR curves, confusion matrices, training curves, inference speed, model agreement |
| **Errors** | `/errors` | Confidence distribution, high-confidence failures, filterable misclassifications table |
| **Explanations** | `/lime` | LIME word-level explanations with positive/negative weight bars |
| **Features** | `/features` | Top words from LR coefficients and NB log-probabilities, diverging bar chart |

---

## 📊 What Each JSON File Contains

| File | Generated From | Contains |
|------|---------------|----------|
| `metrics.json` | `sklearn.metrics` after each model | Accuracy, F1, AUC, inference ms |
| `confusion_matrices.json` | `confusion_matrix()` | TP/TN/FP/FN for each model |
| `roc_curves.json` | `roc_curve()` | 200 FPR/TPR points per model |
| `pr_curves.json` | `precision_recall_curve()` | 200 precision/recall points |
| `training_history.json` | Keras `fit()` history | Loss + accuracy per epoch (LSTM, BERT) |
| `error_samples.json` | Comparing `y_pred` vs `y_test` | Top 60 highest-confidence errors per model |
| `confidence_dist.json` | Histogram of `max(p, 1-p)` | Correct vs wrong counts per confidence bucket |
| `feature_importance.json` | `clf.coef_[0]` and `feature_log_prob_` | Top 30 words per sentiment per model |
| `lime_examples.json` | `LimeTextExplainer.explain_instance()` | Word weights for 12 diverse samples |
| `dataset_stats.json` | Pandas + numpy on full IMDB df | Lengths, frequencies, sample reviews |
| `model_agreement.json` | Pairwise `np.mean(p1 == p2)` | Agreement matrix + universally hard samples |

---

## 🛠️ Tech Stack

### Frontend

| Technology | Purpose |
|------------|---------|
| React 18 + Vite | UI framework + fast dev server |
| Tailwind CSS | Utility-first styling with custom warm palette |
| Recharts | Line, bar, pie, radar chart components |
| Framer Motion | Smooth page and element animations |
| React Router v6 | Client-side routing |
| Axios | HTTP client with base URL config |
| Lucide React | Clean icon set |

### Backend & ML

| Technology | Purpose |
|------------|---------|
| FastAPI | Async Python API framework |
| Pydantic v2 | Response schema validation |
| uvicorn | ASGI server |
| scikit-learn | Naive Bayes + Logistic Regression pipelines |
| TensorFlow/Keras | Bidirectional LSTM model (optional) |
| HuggingFace Transformers | DistilBERT fine-tuning (optional) |
| LIME | Local Interpretable Model-agnostic Explanations |
| NLTK | Stopword removal + lemmatization |
| pandas + numpy | Dataset loading and statistics |

---

## ⚙️ Environment Variables

Create `frontend/.env` to override the API URL:

```
VITE_API_URL=http://localhost:8000
```

---

## 📦 IMDB Dataset

The training script loads the dataset automatically in this order:

1. Looks for `IMDB Dataset.csv` in the project root
2. Falls back to downloading via HuggingFace `datasets` library (`pip install datasets`)
3. If neither is available, exits with a clear error message

The dataset is 50,000 reviews — 25,000 positive and 25,000 negative (perfectly balanced). 80% is used for training, 20% for testing.

---

## 🚢 Deployment

### Backend (e.g. Render)
- Install command: `pip install -r requirements.txt`
- Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- Upload the `backend/data/exports/` JSON files alongside the code (generated locally by `train_and_export.py`)
- No GPU or large RAM required at runtime — backend only reads JSON

### Frontend (e.g. Vercel)
- Set `VITE_API_URL` to your deployed backend URL
- Build command: `npm run build`
- Output directory: `dist`

---

