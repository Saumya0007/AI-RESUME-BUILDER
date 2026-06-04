from fastapi import APIRouter
from pydantic import BaseModel

from app.services.embedding_service import (
    create_embedding
)

from app.services.chroma_service import (
    search_resume
)

from app.services.groq_service import (
    ask_groq
)

router = APIRouter()

class QuestionRequest(BaseModel):
    question: str

@router.post("/chat-resume")
def chat_resume(data: QuestionRequest):

    # User question
    question = data.question

    # Convert question to embedding
    query_embedding = create_embedding(question)

    # Search ChromaDB
    results = search_resume(query_embedding)

    # Extract retrieved context
    retrieved_docs = results["documents"][0]

    context = "\n".join(retrieved_docs)

    # Ask Groq LLM
    answer = ask_groq(context, question)

    return {
        "question": question,
        "answer": answer
    }