# SachCheck 📰🔍

SachCheck is an **AI-powered Fake News Detection platform** that helps users verify whether a news article is real or fake.

The system uses **Machine Learning + News verification APIs** to analyze news content and provide a credibility prediction.

Users can paste a news headline or article and the system will analyze it and return a **fake or real probability score**.

---

## 🌐 Features

- AI based fake news detection
- News credibility score
- Real-time verification using News API
- Search trending news
- Clean and responsive UI
- Fast prediction system

---

## 🧠 How It Works

SachCheck uses a **hybrid detection system**:

1️⃣ **Machine Learning Model**

- Trained on fake and real news datasets
- Uses NLP techniques to analyze text
- Predicts whether news is fake or real

2️⃣ **News API Verification**

- Searches trusted news sources
- Checks if similar news exists
- Helps validate the credibility

3️⃣ **AI + Logic Decision Engine**

- Combines ML prediction and source verification
- Generates a final credibility result

---

## ⚙️ Tech Stack

### Frontend
- React
- Vite
- CSS

### Backend
- Python
- FastAPI / Flask (depending on your backend)

### Machine Learning
- Scikit-learn
- Pandas
- NLP text processing

### APIs
- NewsAPI

---

## 📂 Project Structure
```
SachCheck
│
├── backend
│ ├── app
│ ├── config
│ ├── data
│ ├── model
│ ├── docs
│ ├── .env
│ └── requirements.txt
│
├── frontend
│ ├── src
│ ├── public
│ ├── dist
│ └── package.json

```
---

## 🚀 Installation

### 1️⃣ Clone the repository
git clone https://github.com/ashraful-04/sachcheck.git

cd sachcheck

---

### 2️⃣ Setup Backend
cd backend
pip install -r requirements.txt

Run the backend server:
python main.py

or
uvicorn main:app --reload

---

### 3️⃣ Setup Frontend
cd frontend
npm install

Run frontend:
npm run dev

---

## 🔑 Environment Variables

Create a `.env` file in backend folder and add:
NEWS_API_KEY=your_api_key_here

You can get the API key from:

https://newsapi.org

---

## 📊 Dataset

The model uses a fake news dataset such as:

- IFND Dataset
- Kaggle Fake News Dataset

Dataset should be placed inside:
backend/data/

Example:
backend/data/IFND.csv

---

## 🎯 Future Improvements

- Improve AI model accuracy
- Add multilingual fake news detection
- Browser extension for instant verification
- Social media integration

---

## 👨‍💻 Author

Ashraful Alom
