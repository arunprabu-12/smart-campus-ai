"""
App entrypoint. Registers all routers (spec section 20 — main system flow).
Run with: uvicorn app.main:app --reload
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine, check_db_connection
from app.routers import auth, students, courses, assignments, tests, results, advisor, admin, study_plan, attendance, admin_auth, search

app = FastAPI(title="AI Academic Platform API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # TODO: restrict to frontend origin in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(students.router)
app.include_router(courses.router)
app.include_router(assignments.router)
app.include_router(tests.router)
app.include_router(results.router)
app.include_router(advisor.router)
app.include_router(admin.router)
app.include_router(study_plan.router)
app.include_router(attendance.router)
app.include_router(admin_auth.router)
app.include_router(search.router)

@app.on_event("startup")
def on_startup():
    if not check_db_connection():
        raise RuntimeError(
            "Could not connect to the database. Check DATABASE_URL in .env — "
            "for Neon, confirm the string ends with ?sslmode=require and that "
            "the project isn't paused."
        )
    # TODO: use Alembic migrations instead of create_all() once schema stabilizes
    Base.metadata.create_all(bind=engine)


@app.get("/health")
def health_check():
    return {"status": "ok", "database_connected": check_db_connection()}
