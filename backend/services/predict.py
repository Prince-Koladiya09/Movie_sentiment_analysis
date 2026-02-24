"""
Prediction logic for all 4 model types.
Demo stubs return heuristic-based results when real models aren't loaded.
"""
import re
import numpy as np
from services.preprocess import preprocess_text

# Simple keyword heuristic for demo mode
_POS_WORDS = set([
    'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'superb', 'brilliant',
    'outstanding', 'love', 'loved', 'best', 'perfect', 'beautiful', 'enjoy', 'enjoyed',
    'impressive', 'stunning', 'masterpiece', 'terrific', 'delightful', 'recommend',
])
_NEG_WORDS = set([
    'bad', 'terrible', 'awful', 'horrible', 'worst', 'boring', 'waste', 'poor',
    'disappointing', 'dull', 'stupid', 'weak', 'fail', 'failed', 'hate', 'hated',
    'avoid', 'mediocre', 'pathetic', 'ridiculous', 'unbearable', 'unwatchable',
])

def _demo_predict(text: str, seed_offset: int = 0) -> dict:
    """Heuristic prediction used when the real model isn't loaded."""
    words = set(re.sub(r'[^a-z\s]', '', text.lower()).split())
    pos_score = len(words & _POS_WORDS)
    neg_score = len(words & _NEG_WORDS)

    # Add tiny variation per model so results look different
    np.random.seed(hash(text[:30]) % 1000 + seed_offset)
    noise = np.random.uniform(-0.05, 0.05)

    raw = (pos_score - neg_score) / max(pos_score + neg_score, 1) + noise
    confidence = min(max(abs(raw) * 0.4 + 0.5 + noise, 0.51), 0.97)
    sentiment = "positive" if raw >= 0 else "negative"
    return {"sentiment": sentiment, "confidence": round(float(confidence), 4)}


def predict_with_model(loader, model_name: str, text: str) -> dict:
    model_entry = loader.models.get(model_name)
    if model_entry is None:
        raise ValueError(f"Model '{model_name}' not found")

    mtype = model_entry["type"]

    # ── Demo stub ─────────────────────────────────────────────────────────────
    if mtype == "demo":
        offsets = {"naive_bayes": 0, "logistic_regression": 10, "rnn_lstm": 20, "distilbert": 30}
        return _demo_predict(text, offsets.get(model_name, 0))

    # ── Scikit-learn pipeline ─────────────────────────────────────────────────
    if mtype == "sklearn":
        pipeline = model_entry["pipeline"]
        processed = preprocess_text(text)
        proba = pipeline.predict_proba([processed])[0]
        idx = int(np.argmax(proba))
        return {
            "sentiment": "positive" if idx == 1 else "negative",
            "confidence": round(float(proba[idx]), 4),
        }

    # ── LSTM ──────────────────────────────────────────────────────────────────
    if mtype == "lstm":
        from tensorflow.keras.preprocessing.sequence import pad_sequences
        model = model_entry["model"]
        processed = preprocess_text(text)
        seq = loader.tokenizer.texts_to_sequences([processed])
        padded = pad_sequences(seq, maxlen=200, padding='post', truncating='post')
        prob = float(model.predict(padded, verbose=0)[0][0])
        sentiment = "positive" if prob > 0.5 else "negative"
        confidence = prob if prob > 0.5 else 1 - prob
        return {"sentiment": sentiment, "confidence": round(confidence, 4)}

    # ── DistilBERT ────────────────────────────────────────────────────────────
    if mtype == "bert":
        import tensorflow as tf
        model = model_entry["model"]
        enc = loader.bert_tokenizer(
            text, return_tensors="tf", truncation=True, padding=True, max_length=128
        )
        logits = model(**enc).logits
        probs = tf.nn.softmax(logits, axis=-1).numpy()[0]
        idx = int(np.argmax(probs))
        return {
            "sentiment": "positive" if idx == 1 else "negative",
            "confidence": round(float(probs[idx]), 4),
        }

    raise ValueError(f"Unknown model type: {mtype}")
