from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    database_url: str = (
        "postgresql+psycopg://jobtracker:jobtracker@localhost:5432/jobtracker"
    )
    frontend_origins: str = "http://localhost:3000,http://127.0.0.1:3000"
    frontend_origin_regex: str = (
        r"https://.*\.app\.github\.dev$|https://.*\.githubpreview\.dev$"
    )

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()
