from fastapi import APIRouter, Depends, UploadFile, File
from fastapi.responses import StreamingResponse
from backend.models.spectra import SpectraStatus
from backend.services import spectra_service, mcp_service, voice_service
from backend.services.spectra_service import conversation_manager
from pydantic import BaseModel
from typing import Dict, Any
import io

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
    # The response from the simulation might have 'response' or 'completion'
    if "response" in response:
        ai_content = response.get("response")
    elif "completion" in response:
        ai_content = response.get("completion")
    else:
        ai_content = "I am not sure how to respond to that."
        
    conversation_manager.add_message(request.session_id, "assistant", ai_content)
    
    return response

@router.post("/voice")
async def voice_chat_with_spectra(session_id: str, audio_file: UploadFile = File(...)):
    # Read audio data
    audio_data = await audio_file.read()

    # Transcribe audio to text
    transcribed_text = voice_service.voice_service.transcribe_audio(audio_data)

    if not transcribed_text.strip():
        # Return empty audio if transcription fails or is empty
        return StreamingResponse(io.BytesIO(b""), media_type="audio/wav")

    # Add user message to history
    conversation_manager.add_message(session_id, "user", transcribed_text)
    
    # Get conversation history
    history = conversation_manager.get_history(session_id)
    
    # Generate a text response using the full history
    response_data = mcp_service.generate_response(history)
    
    # Extract the text from the response
    if "response" in response_data:
        ai_text = response_data.get("response")
    elif "completion" in response_data:
        ai_text = response_data.get("completion")
    else:
        ai_text = "I am not sure how to respond."

    # Add AI response to history
    conversation_manager.add_message(session_id, "assistant", ai_text)

    # Synthesize the text response to audio
    synthesized_audio = voice_service.voice_service.synthesize_speech(ai_text)

    # Return the synthesized audio as a streaming response
    return StreamingResponse(io.BytesIO(synthesized_audio), media_type="audio/wav")
