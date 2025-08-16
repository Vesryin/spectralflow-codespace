from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Htrae World Engine"
    DATABASE_URL: str = "sqlite:///./htrae.db"
    # Add other settings like API keys here

    class Config:
        env_file = ".env"

settings = Settings()
