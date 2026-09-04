import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    SECRET_KEY = os.getenv(
        "SECRET_KEY",
        "nutrisaathi-dev-secret"
    )

    OPENFOODFACTS_BASE_URL = os.getenv(
        "OPENFOODFACTS_BASE_URL",
        "https://world.openfoodfacts.org"
    )

    DATABASE_PATH = os.getenv(
        "DATABASE_PATH",
        "database/nutrisaathi.db"
    )

    CLAUDE_API_KEY = os.getenv(
        "CLAUDE_API_KEY",
        ""
    )