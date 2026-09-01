from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from rag_playlist import answer_question


app = FastAPI(title="RAG Playlist API")


# Allow frontend to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class QuestionRequest(BaseModel):
    question: str


@app.get("/")
def home():
    return {
        "message": "RAG Playlist API is running"
    }


@app.post("/ask")
def ask_question(request: QuestionRequest):

    answer, sources = answer_question(request.question)

    return {
        "answer": answer,
        "sources": sources
    }