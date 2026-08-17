"""
SQLAlchemy engine/session setup.
Import `get_db` as a FastAPI dependency in routers.
"""
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base

from app.config import settings

# pool_pre_ping=True: Neon (serverless Postgres) can suspend idle connections.
# Without this, requests after a period of inactivity fail with a stale-connection
# error instead of transparently reconnecting.
engine = create_engine(settings.database_url, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def check_db_connection() -> bool:
    """Run on startup — fails loudly instead of silently if Neon isn't reachable."""
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return True
    except Exception as e:
        print(f"[DB CONNECTION FAILED] {e}")
        return False
