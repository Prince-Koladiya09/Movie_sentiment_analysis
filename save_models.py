"""
save_models.py — Run this script AFTER training your models in sentiment_analysis.py
to save them in the format expected by the FastAPI backend.

Usage:
    python save_models.py

This script assumes you have the following variables in scope from training:
- nb_pipeline         (sklearn Pipeline)
- best_lr_model       (sklearn Pipeline from GridSearchCV)
- rnn_model           (Keras model)
- tokenizer           (Keras Tokenizer)
- model_bert          (TF DistilBERT model)
- tokenizer_bert      (HuggingFace tokenizer)
"""

import pickle
import os
from pathlib import Path

SAVE_DIR = Path("backend/models/saved")
SAVE_DIR.mkdir(parents=True, exist_ok=True)


def save_sklearn(model, name):
    path = SAVE_DIR / f"{name}.pkl"
    with open(path, "wb") as f:
        pickle.dump(model, f)
    print(f"✅ Saved {name} → {path}")


def save_keras_tokenizer(tokenizer):
    path = SAVE_DIR / "tokenizer.pkl"
    with open(path, "wb") as f:
        pickle.dump(tokenizer, f)
    print(f"✅ Saved Keras tokenizer → {path}")


def save_lstm(model):
    path = SAVE_DIR / "rnn_lstm.h5"
    model.save(str(path))
    print(f"✅ Saved LSTM model → {path}")


def save_distilbert(model, tokenizer):
    path = SAVE_DIR / "distilbert"
    model.save_pretrained(str(path))
    tokenizer.save_pretrained(str(path))
    print(f"✅ Saved DistilBERT → {path}")


if __name__ == "__main__":
    print("This script should be run after training. Import your trained models and call the save functions.")
    print("\nExample:")
    print("  from save_models import save_sklearn, save_lstm, save_distilbert, save_keras_tokenizer")
    print("  save_sklearn(nb_pipeline, 'naive_bayes_pipeline')")
    print("  save_sklearn(best_lr_model, 'logistic_regression_pipeline')")
    print("  save_keras_tokenizer(tokenizer)")
    print("  save_lstm(rnn_model)")
    print("  save_distilbert(model_bert, tokenizer_bert)")
