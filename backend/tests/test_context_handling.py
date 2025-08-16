import unittest
from fastapi.testclient import TestClient
from backend.main import app
from backend.services.spectra_service import conversation_manager

class TestContextHandling(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)
        self.session_id = "test_session_123"
        # Clear any previous history for this session_id
        if self.session_id in conversation_manager.short_term_memory:
            del conversation_manager.short_term_memory[self.session_id]

    def test_conversation_context_is_maintained(self):
        # --- First Exchange ---
        response1 = self.client.post(
            "/spectra/chat",
            json={"session_id": self.session_id, "prompt": "Hello, my name is Alex."}
        )
        self.assertEqual(response1.status_code, 200)
        
        # Verify history after first exchange
        history1 = conversation_manager.get_history(self.session_id)
        self.assertEqual(len(history1), 2)
        self.assertEqual(history1[0]["role"], "user")
        self.assertEqual(history1[0]["content"], "Hello, my name is Alex.")
        self.assertEqual(history1[1]["role"], "assistant")

        # --- Second Exchange ---
        response2 = self.client.post(
            "/spectra/chat",
            json={"session_id": self.session_id, "prompt": "Do you remember my name?"}
        )
        self.assertEqual(response2.status_code, 200)
        
        # Verify history after second exchange
        history2 = conversation_manager.get_history(self.session_id)
        self.assertEqual(len(history2), 4)
        self.assertEqual(history2[2]["role"], "user")
        self.assertEqual(history2[2]["content"], "Do you remember my name?")
        
        # Check if the AI's response acknowledges the history
        response_data = response2.json()
        # This assertion is based on the simulation logic in mcp_service.py
        self.assertIn("user: Hello, my name is Alex.", response_data.get("response", ""))

    def tearDown(self):
        # Clean up the session history
        if self.session_id in conversation_manager.short_term_memory:
            del conversation_manager.short_term_memory[self.session_id]

if __name__ == "__main__":
    unittest.main()
