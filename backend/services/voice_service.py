import whisper
import torch
from TTS.api import TTS
import numpy as np
import io
import soundfile as sf

class VoiceService:
    def __init__(self):
        self.stt_model = None
        self.tts_model = None
        self._load_models()

    def _load_models(self):
        try:
            print("Loading Speech-to-Text (Whisper) model...")
            self.stt_model = whisper.load_model("base")
            print("Whisper model loaded successfully.")
        except Exception as e:
            print(f"Error loading Whisper model: {e}")

        try:
            print("Loading Text-to-Speech (Coqui TTS) model...")
            device = "cuda" if torch.cuda.is_available() else "cpu"
            self.tts_model = TTS("tts_models/en/ljspeech/tacotron2-DDC").to(device)
            print("Coqui TTS model loaded successfully.")
        except Exception as e:
            print(f"Error loading Coqui TTS model: {e}")

    def transcribe_audio(self, audio_data: bytes) -> str:
        if not self.stt_model:
            raise RuntimeError("Whisper STT model is not loaded.")
        
        try:
            # The audio data is expected to be in a standard format like WAV.
            # Whisper needs a file path or a NumPy array. We'll convert the bytes.
            audio_array, samplerate = sf.read(io.BytesIO(audio_data))
            
            # Ensure the audio is mono and in the correct format for Whisper
            if audio_array.ndim > 1:
                audio_array = audio_array.mean(axis=1)
            
            # Transcribe
            result = self.stt_model.transcribe(audio_array.astype(np.float32))
            return result["text"]
        except Exception as e:
            print(f"Error during audio transcription: {e}")
            return ""

    def synthesize_speech(self, text: str) -> bytes:
        if not self.tts_model:
            raise RuntimeError("Coqui TTS model is not loaded.")
            
        try:
            # Synthesize speech and get it as a list of integers (wav data)
            wav_data = self.tts_model.tts(text=text)
            
            # Convert to a NumPy array
            wav_np = np.array(wav_data, dtype=np.float32)
            
            # Use soundfile to write the NumPy array to a byte buffer as a WAV file
            buffer = io.BytesIO()
            sf.write(buffer, wav_np, self.tts_model.synthesizer.output_sample_rate, format='WAV')
            buffer.seek(0)
            
            return buffer.read()
        except Exception as e:
            print(f"Error during speech synthesis: {e}")
            return b""

# Instantiate the service so it's ready to be imported and used
voice_service = VoiceService()
