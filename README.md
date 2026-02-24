# 🎬 Sentiment Analysis Dashboard

A full-stack ML dashboard for IMDB movie sentiment analysis, featuring 4 models (Naive Bayes, Logistic Regression, Bidirectional LSTM, DistilBERT), live predictions with LIME explanations, and rich data visualizations.

---

## 🗂️ Project Structure

```
sentiment-dashboard/
├── frontend/          ← React + Vite + Tailwind + Recharts + Framer Motion
│   └── src/
│       ├── pages/     ← 5 full pages
│       ├── components/← Navbar, StatCard, ConfidenceGauge, LimeHighlighter, charts/
│       ├── services/  ← API calls (axios)
│       └── hooks/     ← usePrediction custom hook
│
├── backend/           ← FastAPI Python backend
│   ├── main.py        ← All API routes
│   ├── schemas.py     ← Pydantic models
│   ├── models/
│   │   ├── loader.py  ← Loads all 4 models on startup
│   │   └── saved/     ← Place your .pkl / .h5 / distilbert/ files here
│   └── services/
│       ├── preprocess.py ← Text cleaning pipeline
│       ├── predict.py    ← Inference logic for all model types
│       └── explain.py    ← LIME explanation generation
│
├── save_models.py     ← Helper to save trained models for the API
└── sentiment_analysis.py ← Original training script
```

---

## 🚀 Quick Start

### 1. Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate    # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Download NLTK data
python -c "import nltk; nltk.download('stopwords'); nltk.download('wordnet')"

# Start the API
uvicorn main:app --reload --port 8000
```

The API will start at `http://localhost:8000`. Swagger docs at `http://localhost:8000/docs`.

**Note:** Without saved model files in `backend/models/saved/`, the backend runs in **demo mode** using keyword heuristics. This still lets you test the full UI.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 🔗 Connecting Real Models

After running `sentiment_analysis.py`, save your models:

```python
# At the end of sentiment_analysis.py, add:
import sys
sys.path.insert(0, '.')
from save_models import save_sklearn, save_lstm, save_distilbert, save_keras_tokenizer

save_sklearn(nb_pipeline, 'naive_bayes_pipeline')
save_sklearn(best_lr_model, 'logistic_regression_pipeline')
save_keras_tokenizer(tokenizer)
save_lstm(rnn_model)
save_distilbert(model_bert, tokenizer_bert)
```

For TensorFlow/Transformers support, uncomment these in `backend/requirements.txt`:
```
tensorflow==2.15.0
transformers==4.36.2
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/predict` | Single model prediction + LIME |
| `POST` | `/predict/compare` | All 4 models on same input |
| `GET`  | `/metrics` | Pre-computed test set metrics |
| `GET`  | `/dataset/stats` | EDA data (lengths, word freqs) |
| `GET`  | `/errors` | Misclassification examples |
| `GET`  | `/training-history` | Loss/accuracy per epoch |

### Example Request

```bash
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{"text": "This movie was absolutely fantastic!", "model": "logistic_regression"}'
```

---

## 🎨 Pages

| Page | Route | Features |
|------|-------|---------|
| **Home** | `/` | Hero, stat cards, pipeline diagram, tech stack |
| **Data Explorer** | `/data` | Length histograms, sentiment donut, word frequency bars, paginated table |
| **Live Predictor** | `/predictor` | Textarea input, model selector, confidence gauge, LIME word highlighting |
| **Model Comparison** | `/comparison` | Metrics table, grouped bars, ROC curves, radar chart, confusion matrices, training history |
| **Error Analysis** | `/errors` | Filterable misclassification table, high-confidence failures, error by length, sarcasm examples |

---

## 🛠️ Tech Stack

**Frontend:** React 18, Vite, Tailwind CSS, Recharts, Framer Motion, React Router v6  
**Backend:** FastAPI, Pydantic v2, uvicorn  
**ML:** scikit-learn, TensorFlow/Keras, HuggingFace Transformers, LIME, NLTK
