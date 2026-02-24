"""
Text preprocessing pipeline — same as used during training.
"""
import re

try:
    import nltk
    from nltk.stem import WordNetLemmatizer
    from nltk.corpus import stopwords
    nltk.download('stopwords', quiet=True)
    nltk.download('wordnet', quiet=True)
    nltk.download('omw-1.4', quiet=True)
    _stop_words = set(stopwords.words('english'))
    _lemmatizer = WordNetLemmatizer()
    _NLTK_AVAILABLE = True
except Exception:
    _NLTK_AVAILABLE = False
    _stop_words = set()

def preprocess_text(text: str, method: str = "lemmatize") -> str:
    """Clean text exactly as done during training."""
    # Remove HTML tags
    text = re.sub(r'<.*?>', '', text)
    # Remove non-alphabetic chars, lowercase
    text = re.sub(r'[^a-zA-Z\s]', '', text, flags=re.I | re.A).lower()
    tokens = text.split()

    if _NLTK_AVAILABLE:
        if method == "stem":
            from nltk.stem import PorterStemmer
            stemmer = PorterStemmer()
            processed = [stemmer.stem(w) for w in tokens if w not in _stop_words]
        else:
            processed = [_lemmatizer.lemmatize(w) for w in tokens if w not in _stop_words]
    else:
        processed = [w for w in tokens if len(w) > 2]  # minimal fallback

    return ' '.join(processed)
