import os
import uuid
import logging
from fastapi import FastAPI, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any
from dotenv import load_dotenv

# Import pipeline functions from core and utils
from utils.audio_processor import process_input
from core.transcriber import transcribe_all
from core.summarizer import summarize, generate_title
from core.extractor import extract_action_items, extract_key_decisions, extract_questions
from core.rag_engine import build_rag_chain, ask_question

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("AI-Video-Assistant-API")

load_dotenv()

# Read allowed CORS origins from environment (defaults to localhost:3000)
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")

app = FastAPI(
    title="AI Video Assistant API",
    description="Backend API endpoints for audio processing, transcription, summarization, and RAG chat"
)

# Enable CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for task status and results (SQLite or Postgres recommended for production)
tasks_db: Dict[str, Dict[str, Any]] = {}
rag_chains_db: Dict[str, Any] = {}

class AnalysisRequest(BaseModel):
    source: str
    language: str = "english"

class ChatRequest(BaseModel):
    task_id: str
    question: str

def run_analysis_pipeline(task_id: str, source: str, language: str):
    """
    Executes the long-running video processing and AI pipeline in the background.
    """
    try:
        logger.info(f"Task {task_id}: Starting audio processing")
        tasks_db[task_id]["status"] = "processing"
        
        # Step 1: Audio Processing (downloading and chunking)
        tasks_db[task_id]["current_step"] = "audio"
        chunks = process_input(source)
        
        # Step 2: Transcription
        logger.info(f"Task {task_id}: Starting transcription")
        tasks_db[task_id]["current_step"] = "transcript"
        transcript = transcribe_all(chunks, language)
        
        # Step 3: Title Generation
        logger.info(f"Task {task_id}: Generating title")
        tasks_db[task_id]["current_step"] = "title"
        title = generate_title(transcript)
        
        # Step 4: Summarization
        logger.info(f"Task {task_id}: Generating summary")
        tasks_db[task_id]["current_step"] = "summary"
        summary = summarize(transcript)
        
        # Step 5: Insights & Key Decisions Extraction
        logger.info(f"Task {task_id}: Extracting insights")
        tasks_db[task_id]["current_step"] = "extract"
        action_items = extract_action_items(transcript)
        decisions = extract_key_decisions(transcript)
        questions = extract_questions(transcript)
        
        # Step 6: RAG Engine Build (indexing vectors)
        logger.info(f"Task {task_id}: Building vector store & RAG chain")
        tasks_db[task_id]["current_step"] = "rag"
        rag_chain = build_rag_chain(transcript)
        rag_chains_db[task_id] = rag_chain
        
        # Finished
        logger.info(f"Task {task_id}: Pipeline completed successfully!")
        tasks_db[task_id]["status"] = "completed"
        tasks_db[task_id]["current_step"] = "done"
        tasks_db[task_id]["result"] = {
            "title": title,
            "transcript": transcript,
            "summary": summary,
            "action_items": action_items,
            "key_decisions": decisions,
            "open_questions": questions
        }
    except Exception as e:
        logger.error(f"Task {task_id} failed: {str(e)}", exc_info=True)
        tasks_db[task_id]["status"] = "failed"
        tasks_db[task_id]["error"] = str(e)

@app.post("/api/analyze")
def analyze_video(payload: AnalysisRequest, background_tasks: BackgroundTasks):
    """
    Submits a video URL or filepath for async background analysis.
    """
    if not payload.source.strip():
        raise HTTPException(status_code=400, detail="Source cannot be empty")
        
    task_id = str(uuid.uuid4())
    tasks_db[task_id] = {
        "status": "pending",
        "current_step": "init",
        "error": None,
        "result": None
    }
    
    background_tasks.add_task(
        run_analysis_pipeline, task_id, payload.source, payload.language
    )
    
    return {
        "task_id": task_id,
        "status": "pending",
        "message": "Analysis pipeline queued."
    }

@app.get("/api/tasks/{task_id}")
def get_task_status(task_id: str):
    """
    Retrieves progress status and pipeline results of a specific task.
    """
    if task_id not in tasks_db:
        raise HTTPException(status_code=404, detail="Task not found")
    return tasks_db[task_id]

@app.post("/api/chat")
def chat_with_transcript(payload: ChatRequest):
    """
    Queries the RAG engine for a specific meeting conversation using context from index.
    """
    task_id = payload.task_id
    if task_id not in rag_chains_db:
        raise HTTPException(
            status_code=404, 
            detail="RAG conversation session not found or task is not yet completed."
        )
    
    try:
        rag_chain = rag_chains_db[task_id]
        answer = ask_question(rag_chain, payload.question)
        return {"answer": answer}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"RAG Engine error: {str(e)}")

# Command to run: uvicorn api:app --reload --port 8000
