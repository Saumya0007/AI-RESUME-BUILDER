from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.rag.upload_resume import (
    router as upload_router
)

from app.rag.chat_resume import (
    router as chat_router
)

from app.rag.ats_check import (
    router as ats_router
)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload_router)
app.include_router(chat_router)
app.include_router(ats_router)

@app.get("/")
def home():
    return {
        "message": "AI Career Copilot Backend Running"
    }

@app.get("/health")
def health():
    return {
        "status": "healthy"
    }