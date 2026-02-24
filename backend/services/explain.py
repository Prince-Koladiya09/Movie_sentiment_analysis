"""
LIME explanation service.
Returns word-level importance weights for a given prediction.
Falls back to a frequency-based heuristic when LIME is unavailable.
"""
import re
import numpy as np
from services.preprocess import preprocess_text

# Positive / negative word lists for fallback
_POS = {
    'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'brilliant', 'superb',
    'love', 'loved', 'best', 'perfect', 'beautiful', 'enjoy', 'enjoyed', 'impressive',
    'outstanding', 'stunning', 'masterpiece', 'terrific', 'delightful',
}
_NEG = {
    'bad', 'terrible', 'awful', 'horrible', 'worst', 'boring', 'waste', 'poor',
    'disappointing', 'dull', 'stupid', 'weak', 'fail', 'failed', 'hate', 'hated',
    'avoid', 'mediocre', 'pathetic', 'ridiculous', 'unbearable',
}


def _heuristic_explanation(text: str, n_words: int = 12) -> list:
    """Simple keyword-based word importance (fallback when LIME unavailable)."""
    words = re.sub(r'[^a-z\s]', '', text.lower()).split()
    seen = set()
    result = []
    for w in words:
        if w in seen or len(w) < 3:
            continue
        seen.add(w)
        if w in _POS:
            result.append({"word": w, "weight": round(np.random.uniform(0.3, 0.9), 3)})
        elif w in _NEG:
            result.append({"word": w, "weight": round(np.random.uniform(-0.9, -0.3), 3)})
    # Sort by abs weight, take top N
    result.sort(key=lambda x: abs(x["weight"]), reverse=True)
    return result[:n_words]


def get_lime_explanation(loader, model_name: str, text: str, num_features: int = 12) -> list:
    """
    Generate LIME word-importance explanation.
    Uses real LIME for sklearn pipelines; heuristic fallback for others.
    """
    model_entry = loader.models.get(model_name)
    if model_entry is None:
        return []

    mtype = model_entry.get("type")

    # Real LIME for sklearn
    if mtype == "sklearn":
        try:
            import lime.lime_text
            pipeline = model_entry["pipeline"]

            def predict_fn(texts):
                processed = [preprocess_text(t) for t in texts]
                return pipeline.predict_proba(processed)

            explainer = lime.lime_text.LimeTextExplainer(class_names=["negative", "positive"])
            exp = explainer.explain_instance(text, predict_fn, num_features=num_features)
            return [
                {"word": w, "weight": round(float(wt), 4)}
                for w, wt in exp.as_list()
            ]
        except Exception as e:
            print(f"LIME failed for {model_name}: {e}")
            return _heuristic_explanation(text, num_features)

    # Heuristic for demo / deep learning models
    return _heuristic_explanation(text, num_features)
