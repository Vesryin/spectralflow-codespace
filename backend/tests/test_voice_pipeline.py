import unittest
from unittest.mock import patch, MagicMock
from fastapi.testclient import TestClient
from backend.main import app
import io

class TestVoicePipeline(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)
        self.session_id = "test_voice_session_456"
        # Create a dummy WAV file in memory
        self.dummy_audio_bytes = self._create_dummy_wav()

    def _create_dummy_wav(self):
        # This is a simple placeholder for a WAV file's byte data.
        # In a real scenario, you'd use a library to create a valid WAV header.
        return b"RIFF\x00\x00\x00\x00WAVEfmt \x10\x00\x00\x00\x01\x00\x01\x00\x44\xac\x00\x00\x88X\x01\x00\x02\x00\x10\x00data\x00\x00\x00\x00"

    @patch('backend.services.voice_service.voice_service.transcribe_audio')
    @patch('backend.services.voice_service.voice_service.synthesize_speech')
    @patch('backend.services.mcp_service.generate_response')
    def test_voice_pipeline_flow(self, mock_generate_response, mock_synthesize_speech, mock_transcribe_audio):
        # --- Mocking Setup ---
        mock_transcribe_audio.return_value = "This is a test."
        mock_generate_response.return_value = {"response": "This is a mocked response."}
        mock_synthesize_speech.return_value = b"mocked_audio_response"

        # --- API Call ---
        files = {'audio_file': ('test.wav', self.dummy_audio_bytes, 'audio/wav')}
        response = self.client.post(
            f"/spectra/voice?session_id={self.session_id}",
            files=files
        )

        # --- Assertions ---
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.content, b"mocked_audio_response")

        # Verify that the services were called correctly
        mock_transcribe_audio.assert_called_once_with(self.dummy_audio_bytes)
        mock_generate_response.assert_called_once()
        mock_synthesize_speech.assert_called_once_with("This is a mocked response.")

if __name__ == "__main__":
    unittest.main()
