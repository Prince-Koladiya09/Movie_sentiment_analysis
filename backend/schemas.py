from pydantic import BaseModel
from typing import List, Dict, Any, Optional


class PredictRequest(BaseModel):
    text: str
    model: str = "logistic_regression"


class CompareRequest(BaseModel):
    text: str


class LimeWord(BaseModel):
    word: str
    weight: float


class PredictResponse(BaseModel):
    model: str
    sentiment: str           # "positive" | "negative"
    confidence: float        # 0.0 – 1.0
    lime_words: List[LimeWord] = []
    inference_time_ms: float = 0.0


class CompareResponse(BaseModel):
    results: Dict[str, Any]
