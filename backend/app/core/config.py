from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    database_url: str = (
        "postgresql+psycopg://jobtracker:jobtracker@localhost:5432/jobtracker"
    )
    frontend_origins: str = "http://localhost:3000,http://127.0.0.1:3000"
    frontend_origin_regex: str = (
        r"https://.*\.app\.github\.dev$|https://.*\.githubpreview\.dev$"
    )
    llm_enabled: bool = False
    llm_provider: str = "openai_compatible"
    llm_api_base_url: str = ""
    llm_api_key: str = ""
    llm_model: str = "deepseek-v4-flash"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()
