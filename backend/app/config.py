import os
from dotenv import load_dotenv

load_dotenv()

GOOGLE_API_KEY = (
    os.getenv("GOOGLE_API_KEY")
)

GEMINI_MODEL = os.getenv(
    "GEMINI_MODEL",
    "gemini-3.1-flash-lite-preview"
)

if not GOOGLE_API_KEY:
    raise RuntimeError(
        "GOOGLE_API_KEY is missing."
    )