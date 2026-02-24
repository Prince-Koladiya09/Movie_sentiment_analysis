"""
Model Loader — loads all 4 trained models on startup.
Falls back to lightweight demo models if saved files are not found.
"""
import os
import pickle
import numpy as np
from pathlib import Path

SAVED_DIR = Path(__file__).parent / "saved"

class ModelLoader:
    def __init__(self):
        self.models = {}
        self.tokenizer = None          # Keras tokenizer for LSTM
        self.bert_tokenizer = None     # HuggingFace tokenizer
        self.tfidf = None              # Shared TF-IDF vectorizer

    def load_all(self):
        """Try to load saved models; fall back to demo stubs if not found."""
        self._load_sklearn_models()
        self._load_lstm()
        self._load_distilbert()
        print(f"Loaded models: {list(self.models.keys())}")

    # ── Scikit-learn ──────────────────────────────────────────────────────────

    def _load_sklearn_models(self):
        nb_path = SAVED_DIR / "naive_bayes_pipeline.pkl"
        lr_path = SAVED_DIR / "logistic_regression_pipeline.pkl"

        if nb_path.exists():
            with open(nb_path, "rb") as f:
                self.models["naive_bayes"] = {"type": "sklearn", "pipeline": pickle.load(f)}
            print("✅ Naive Bayes loaded from file")
        else:
            self.models["naive_bayes"] = {"type": "demo", "label": "naive_bayes"}
            print("⚠️  Naive Bayes: using demo stub (no saved model found)")

        if lr_path.exists():
            with open(lr_path, "rb") as f:
                self.models["logistic_regression"] = {"type": "sklearn", "pipeline": pickle.load(f)}
            print("✅ Logistic Regression loaded from file")
        else:
            self.models["logistic_regression"] = {"type": "demo", "label": "logistic_regression"}
            print("⚠️  Logistic Regression: using demo stub")

    # ── LSTM ──────────────────────────────────────────────────────────────────

    def _load_lstm(self):
        model_path = SAVED_DIR / "rnn_lstm.h5"
        tok_path   = SAVED_DIR / "tokenizer.pkl"

        if model_path.exists() and tok_path.exists():
            try:
                import tensorflow as tf
                lstm_model = tf.keras.models.load_model(str(model_path))
                with open(tok_path, "rb") as f:
                    self.tokenizer = pickle.load(f)
                self.models["rnn_lstm"] = {"type": "lstm", "model": lstm_model}
                print("✅ RNN (LSTM) loaded from file")
            except Exception as e:
                print(f"⚠️  LSTM load failed ({e}); using demo stub")
                self.models["rnn_lstm"] = {"type": "demo", "label": "rnn_lstm"}
        else:
            self.models["rnn_lstm"] = {"type": "demo", "label": "rnn_lstm"}
            print("⚠️  RNN (LSTM): using demo stub (no saved model found)")

    # ── DistilBERT ────────────────────────────────────────────────────────────

    def _load_distilbert(self):
        bert_path = SAVED_DIR / "distilbert"

        if bert_path.exists():
            try:
                from transformers import DistilBertTokenizer, TFDistilBertForSequenceClassification
                self.bert_tokenizer = DistilBertTokenizer.from_pretrained(str(bert_path))
                bert_model = TFDistilBertForSequenceClassification.from_pretrained(str(bert_path))
                self.models["distilbert"] = {"type": "bert", "model": bert_model}
                print("✅ DistilBERT loaded from file")
            except Exception as e:
                print(f"⚠️  DistilBERT load failed ({e}); using demo stub")
                self.models["distilbert"] = {"type": "demo", "label": "distilbert"}
        else:
            self.models["distilbert"] = {"type": "demo", "label": "distilbert"}
            print("⚠️  DistilBERT: using demo stub (no saved model found)")
