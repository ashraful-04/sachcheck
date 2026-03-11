# AI-Based Fake News Detection System  
## Step-by-Step Implementation Guide

---

# 1. Project Overview

This project detects whether a piece of news or social media content is **fake or real** using two stages.

## NewsAPI Verification
The system first checks whether the news appears in **trusted journalism sources** using NewsAPI.

## Machine Learning Classification
If no matching article is found, a **Logistic Regression model** trained on the **BharatFakeNewsKosh dataset** predicts the credibility.

### System Output

The system outputs:

- Classification label
- Confidence score
- Reasoning (keywords influencing prediction)
- Verified sources (if available)

---

# 2. Tech Stack

## Backend

- Python  
- FastAPI  
- Scikit-Learn  
- TF-IDF  
- NewsAPI  
- Sentence Transformers *(optional for similarity)*  

## Machine Learning

- Logistic Regression  
- Sigmoid Probability  
- Feature Weight Explanation  

---

# 3. Project Folder Structure

Create the project structure first.

```

fake-news-detector
│
├── app
│   ├── main.py
│   ├── model.py
│   ├── news_verifier.py
│   ├── credibility_checker.py
│   ├── reasoning.py
│
├── data
│   └── dataset.csv
│
├── model
│   ├── classifier.pkl
│   └── vectorizer.pkl
│
├── config
│   └── sources.json
│
├── requirements.txt
└── README.md

````

---

# 4. Setup Environment

## Create Python Environment

```bash
python -m venv venv
source venv/bin/activate
````

## Install Dependencies

```bash
pip install fastapi
pip install uvicorn
pip install scikit-learn
pip install pandas
pip install numpy
pip install requests
pip install python-dotenv
pip install sentence-transformers
```

Save dependencies:

```bash
pip freeze > requirements.txt
```

---

# 5. Dataset Preparation

Download dataset:

**BharatFakeNewsKosh**

Place it inside:

```
data/dataset.csv
```

Dataset columns usually include:

```
title
content
label
```

Combine text fields if necessary.

Example preprocessing:

```python
text = title + " " + content
```

---

# 6. Text Preprocessing

Clean the dataset.

Typical steps:

* lowercase text
* remove punctuation
* remove URLs
* remove stopwords

### Processing Pipeline

```
text
 ↓
clean text
 ↓
TF-IDF vectorization
```

---

# 7. TF-IDF Vectorization

Convert text into numerical features.

```python
TfidfVectorizer(
    max_features=5000,
    ngram_range=(1,2)
)
```

### Why Bigrams?

Fake news often uses phrases such as:

```
breaking news
secret plan
government hiding
```

---

# 8. Train Logistic Regression Model

Train the classifier.

```
X → TFIDF(text)
y → label
```

Split dataset:

```
80% training
20% testing
```

Train model:

```python
LogisticRegression()
```

Output:

```
Probability = sigmoid(score)
```

Save model:

```
classifier.pkl
vectorizer.pkl
```

---

# 9. Classification Labels

Convert probabilities into labels.

Example thresholds:

```
0.00–0.20 → Fake
0.20–0.40 → Likely Fake
0.40–0.60 → Uncertain
0.60–0.80 → Likely Real
0.80–1.00 → Real
```

---

# 10. Reasoning System

Logistic regression coefficients show **important words**.

Extract top features.

```
top positive weights → real indicators
top negative weights → fake indicators
```

Example output:

```
Reasoning:

Words influencing classification:

• shocking
• secret
• conspiracy
```

---

# 11. NewsAPI Integration

Register for API key:

```
https://newsapi.org
```

Example request:

```
GET https://newsapi.org/v2/everything?q=keyword
```

Process response.

If similar article exists:

```
status = real
sources = [...]
```

---

# 12. Similarity Matching

Avoid exact string matching.

Use **semantic similarity**.

```
sentence embeddings
↓
cosine similarity
↓
threshold (0.8)
```

If similarity exceeds the threshold:

```
news verified
```

---

# 13. Source Credibility Checker

Create JSON file:

```
config/sources.json
```

Example:

```json
{
  "trusted": [
    "bbc.com",
    "reuters.com",
    "thehindu.com"
  ],
  "suspicious": [
    "randomnewsblog.xyz"
  ]
}
```

Workflow:

```
extract domain
↓
check whitelist / blacklist
```

---

# 14. FastAPI Backend

Create API server.

### API Endpoints

```
POST /verify-news
GET /top-news
GET /search-news
POST /check-source
```

Example workflow:

```
user input
↓
newsapi check
↓
if not found
↓
ml model
```

FastAPI automatically generates documentation:

```
/docs
```

---

# 15. Main Prediction Flow

```
Input Text
   ↓
NewsAPI verification
   ↓
Match found?
 ↓        ↓
YES       NO
↓          ↓
Return     ML classifier
sources    ↓
           probability
           ↓
           label
           ↓
           reasoning
```

---

# 16. API Example Response

```json
{
 "prediction": "Likely Fake",
 "confidence": 0.81,
 "reasoning": [
   "sensational language",
   "lack of credible sources"
 ],
 "verified_sources": []
}
```

---

# 17. Additional Features

## Top News

```
GET /top-news
```

Categories:

```
India
Global
Business
Sports
```

---

## News Search

```
GET /search-news?q=keyword
```

Returns related articles.

---

## Credibility Check

```
POST /check-source
```

Input:

```
url
```

Output:

```
trusted / suspicious
```

---

# 18. Running the Server

Start FastAPI:

```bash
uvicorn app.main:app --reload
```

Open API documentation:

```
http://127.0.0.1:8000/docs
```

---

# 19. Testing the System

Example **real news**

```
ISRO launches satellite
```

Example **fake news**

```
Scientists confirm aliens in Himalayas
```

Verify outputs:

```
prediction
confidence
reasoning
```

---

# 20. Deployment (Optional)

Possible deployment options:

```
Render
Railway
AWS
```

Backend-only deployment is sufficient for demonstration.

---

# 21. Future Improvements

Possible extensions:

```
multilingual detection
social media rumor detection
image misinformation detection
transformer models
```
