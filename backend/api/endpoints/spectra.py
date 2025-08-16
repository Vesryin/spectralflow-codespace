from fastapi import APIRouter, Depends
from backend.models.spectra import SpectraStatus
from backend.services import spectra_service, mcp_service
from backend.services.spectra_service import conversation_manager
from pydantic import BaseModel
from typing import Dict, Any

router = APIRouter()

class ChatRequest(BaseModel):
    session_id: str
    prompt: str
    preferred_model: str = "openhermes"

@router.get("/status", response_model=SpectraStatus)
async def get_spectra_status():
    return spectra_service.get_status()

@router.post("/chat", response_model=Dict[str, Any])
async def chat_with_spectra(request: ChatRequest):
    # Add user message to history
    conversation_manager.add_message(request.session_id, "user", request.prompt)
    
    # Get conversation history
    history = conversation_manager.get_history(request.session_id)
    
    # Generate response using the full history
    response = mcp_service.generate_response(history, request.preferred_model)
    
    # Add AI response to history
    # Assuming the response format is a dict with a "response" key
    ai_content = response.get("response", "I am not sure how to respond to that.")
    conversation_manager.add_message(request.session_id, "assistant", ai_content)
    
    return response
