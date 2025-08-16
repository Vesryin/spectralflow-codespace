import sys
import os
import io
import soundfile as sf
import numpy as np

# Add the project root to the Python path to allow for module imports
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))

def create_dummy_wav():
    """Creates a short, silent WAV file in memory."""
    samplerate = 22050  # Sample rate matching Coqui TTS
    duration = 1.0  # seconds
    frequency = 440.0  # Hz
    
    # Generate a short sine wave to have some data
    t = np.linspace(0., duration, int(samplerate * duration), endpoint=False)
    amplitude = np.iinfo(np.int16).max * 0.5
    data = amplitude * np.sin(2. * np.pi * frequency * t)
    
    buffer = io.BytesIO()
    sf.write(buffer, data.astype(np.int16), samplerate, format='WAV')
    buffer.seek(0)
    return buffer.read()

def validate_service():
    """
    Validates the voice service by running transcription and synthesis
    with the actual models.
    """
    print("--- Starting Voice Service Validation ---")
    
    try:
        from backend.services.voice_service import voice_service
    except Exception as e:
        print(f"Failed to import voice_service. Error: {e}")
        return

    # 1. Test Transcription (STT)
    print("\n[1. Testing Transcription]")
    if voice_service.stt_model:
        print("Whisper model is loaded. Proceeding with transcription.")
        dummy_audio = create_dummy_wav()
        try:
            transcribed_text = voice_service.transcribe_audio(dummy_audio)
            print(f"   -> Transcription successful.")
            print(f"   -> Result: '{transcribed_text}'")
        except Exception as e:
            print(f"   -> Transcription FAILED. Error: {e}")
    else:
        print("   -> Whisper model not loaded. Skipping transcription test.")

    # 2. Test Synthesis (TTS)
    print("\n[2. Testing Synthesis]")
    if voice_service.tts_model:
        print("Coqui TTS model is loaded. Proceeding with synthesis.")
        test_text = "Hello, world. This is a test of the synthesis model."
        try:
            synthesized_audio = voice_service.synthesize_speech(test_text)
            if synthesized_audio and len(synthesized_audio) > 100: # Check if we got meaningful audio data
                print(f"   -> Synthesis successful.")
                print(f"   -> Generated audio size: {len(synthesized_audio)} bytes.")
            else:
                print(f"   -> Synthesis FAILED. Generated audio is empty or too small.")
        except Exception as e:
            print(f"   -> Synthesis FAILED. Error: {e}")
    else:
        print("   -> Coqui TTS model not loaded. Skipping synthesis test.")
        
    print("\n--- Validation Complete ---")

if __name__ == "__main__":
    validate_service()
