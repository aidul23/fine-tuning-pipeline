from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    # SQLite by default; set DATABASE_URL=postgresql+psycopg2://user:pass@localhost/dbname for Postgres
    database_url: str = "sqlite:///./data/ft.db"

    # Root for dataset files and future model artifacts (relative to cwd unless absolute)
    storage_root: Path = Path("./storage")

    def datasets_dir(self) -> Path:
        return self.storage_root / "datasets"

    def models_dir(self) -> Path:
        return self.storage_root / "models"


settings = Settings()
