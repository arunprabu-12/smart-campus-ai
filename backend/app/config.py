"""
App configuration loaded from environment variables.
See .env.example for required keys.
"""
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = "postgresql://user:password@localhost:5432/academic_platform"
    jwt_secret_key: str = "change_this_secret"
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 1440
    gemini_api_key: str = ""
    youtube_api_key: str = ""
    chroma_persist_dir: str = "./chroma_data"
    chatpdf_api_key: str = ""
    # Qwen/Qwen3-8B via HuggingFace Inference API
    hf_api_key: str = ""
    # Admin secret — must match X-Admin-Secret header on /auth/admin-login
    admin_secret_key: str = "change_admin_secret"
    # College app webhook secret — matches X-College-Secret header
    college_app_secret: str = "college_erp_secret"

    class Config:
        import os
        env_file = os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env")


settings = Settings()
