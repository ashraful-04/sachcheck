import os
from dotenv import load_dotenv

# Resolve .env relative to this file so it works regardless of CWD
_ENV_PATH = os.path.join(os.path.dirname(__file__), "..", ".env")
load_dotenv(dotenv_path=_ENV_PATH)

NEWS_API_KEY = os.getenv("NEWS_API_KEY", "")
NEWS_API_BASE_URL = "https://newsapi.org/v2"

MODEL_DIR = os.path.join(os.path.dirname(__file__), "..", "model")
DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")
