# 🎬 Movie Sentiment Analysis: From Bag-of-Words to BERT

<div align="center">

[![Python](https://img.shields.io/badge/Python-3.9%2B-blue.svg?style=for-the-badge&logo=python)](https://www.python.org/)
[![TensorFlow](https://img.shields.io/badge/TensorFlow-2.x-orange.svg?style=for-the-badge&logo=tensorflow)](https://www.tensorflow.org/)
[![Transformers](https://img.shields.io/badge/🤗%20Transformers-4.x-yellow.svg?style=for-the-badge&logo=hugging-face)](https://huggingface.co/docs/transformers/index)

</div>

An end-to-end NLP project that classifies IMDB movie reviews as positive or negative, journeying from classic machine learning techniques to state-of-the-art Transformer models.

---

## 🌟 About The Project



---

## ✨ Key Features

* **Comprehensive EDA:** In-depth exploratory data analysis with visualizations of review lengths and word clouds for sentiment-specific vocabulary.
* **Advanced Preprocessing:** A robust text cleaning pipeline to handle HTML tags, stopwords, and punctuation, with options for both stemming and lemmatization.
* **Baseline Modeling:** Establishes a performance baseline using TF-IDF vectorization with n-grams, coupled with classic models like Naive Bayes and Logistic Regression.
* **Deep Learning Implementation:** Implements a Bidirectional LSTM network to capture sequential context and long-range dependencies in the text.
* **State-of-the-Art Transformers:** Fine-tunes a pre-trained DistilBERT model from Hugging Face for superior performance with transfer learning.
* **Model Interpretability:** Uses LIME (Local Interpretable Model-agnostic Explanations) to peek inside the "black box" and understand *why* a model makes a certain prediction.
* **Robust Evaluation:** Employs `GridSearchCV` for hyperparameter tuning and compares all models across a suite of metrics including Accuracy, Precision, Recall, F1-Score, and AUC-ROC.

---

## 🛠️ Built With

This project leverages some of the most popular libraries in the Python data science ecosystem.

* **[TensorFlow](https://www.tensorflow.org/) & [Keras](https://keras.io/):** For building and training deep learning models.
* **[Hugging Face Transformers](https://huggingface.co/docs/transformers/index):** For accessing and fine-tuning the DistilBERT model.
* **[Scikit-learn](https://scikit-learn.org/):** For baseline models, preprocessing, and evaluation metrics.
* **[NLTK](https://www.nltk.org/):** For core NLP preprocessing tasks like tokenization and stopword removal.
* **[Pandas](https://pandas.pydata.org/):** For efficient data manipulation.
* **[Matplotlib](https://matplotlib.org/) & [Seaborn](https://seaborn.pydata.org/):** For data visualization.
* **[LIME](https://github.com/marcotcr/lime):** For model interpretability.

---

## 🧠 Challenges and Solutions

Building an effective NLP model comes with its own set of challenges. Here’s how this project tackled them:

| Challenge 🤔                                     | Solution ✔️                                                                                                                                              |
| ------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Messy, Unstructured Text Data** | A multi-step preprocessing function was created using `regex` to remove HTML tags and punctuation, followed by NLTK for stopword removal and lemmatization. |
| **Models Ignoring Word Order & Context** | While TF-IDF is efficient, it loses sequential information. This was overcome by implementing a Bidirectional LSTM network which reads text in both directions.  |
| **Achieving Top-Tier Performance** | To push beyond the limits of models trained from scratch, the project leveraged transfer learning by fine-tuning a pre-trained DistilBERT model.             |
| **The "Black Box" Nature of Complex Models** | To build trust and understand model failures, LIME was integrated to provide visual, word-level explanations for individual predictions, making the model's logic transparent. |

---

## ⚙️ Project Complexities

Beyond the initial challenges, this project navigated several layers of complexity inherent in modern NLP workflows:

* **Hyperparameter Tuning:** Finding the optimal settings for models isn't trivial. This project used `GridSearchCV` for classic models and required careful manual tuning of the learning rate, dropout values, number of LSTM units, and batch sizes for the deep learning models to achieve peak performance without overfitting.

* **Computational Resource Management:** Training deep learning models is resource-intensive. The Bidirectional LSTM and especially the DistilBERT model required significant training time. A key complexity was balancing model performance with practical training times, showcasing why a distilled model like `DistilBERT` is often a great choice over larger models like `BERT-large`.

* **Vocabulary and Embedding Management:** The full IMDB vocabulary is vast. A complexity was managing this by capping the vocabulary size to the most frequent words and using an Out-of-Vocabulary (`<OOV>`) token. This keeps the model's embedding layer computationally feasible while handling rare words gracefully.

* **Handling Linguistic Nuance:** Sentiment is often conveyed through subtle means like sarcasm, irony, or conditional statements. While advanced models like DistilBERT can capture some of this nuance through its attention mechanism, it remains a significant challenge and a primary source of misclassifications, requiring qualitative error analysis to understand the model's limitations.

---

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

* Python 3.9+
* Pip & Virtualenv

### Installation

1.  **Clone the repository**
    ```sh
    git clone [https://github.com/your-username/your-repository-name.git](https://github.com/your-username/your-repository-name.git)
    cd your-repository-name
    ```
2.  **Create and activate a virtual environment**
    ```sh
    python -m venv venv
    source venv/bin/activate  # On macOS/Linux
    # OR
    .\venv\Scripts\activate   # On Windows
    ```
3.  **Install required packages**
    ```sh
    pip install -r requirements.txt
    ```

### Usage

You can explore the project by running the Jupyter Notebook or the Python script:

* **For Jupyter Notebook:**
    ```sh
    jupyter notebook sentiment_analysis.ipynb
    ```
* **For Python Script:**
    ```sh
    python sentiment_analysis.py
    ```
