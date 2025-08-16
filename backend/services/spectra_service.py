import json
import os
from typing import Dict, List
from backend.models.memory import Memory
from backend.models.spectra import SpectraStatus

# Define the path for long-term memory storage
MEMORY_FILE = os.path.join(os.path.dirname(__file__), '..', '..', 'memory-bank', 'long_term_memories.json')

class ConversationManager:
    def __init__(self):
        self.short_term_memory: Dict[str, List[Dict[str, str]]] = {}
        self.long_term_memory: List[Memory] = self._load_long_term_memory()

    def _load_long_term_memory(self) -> List[Memory]:
        if not os.path.exists(MEMORY_FILE):
            return []
        with open(MEMORY_FILE, 'r') as f:
            memories_data = json.load(f)
        return [Memory(**data) for data in memories_data]

    def _save_long_term_memory(self):
        with open(MEMORY_FILE, 'w') as f:
            json.dump([mem.dict() for mem in self.long_term_memory], f, indent=4)

    def add_message(self, session_id: str, role: str, content: str):
        if session_id not in self.short_term_memory:
            self.short_term_memory[session_id] = []
        self.short_term_memory[session_id].append({"role": role, "content": content})

    def get_history(self, session_id: str) -> List[Dict[str, str]]:
        return self.short_term_memory.get(session_id, [])

    def save_memory(self, memory: Memory):
        self.long_term_memory.append(memory)
        self._save_long_term_memory()

    def retrieve_memories(self, character_id: int) -> List[Memory]:
        return [mem for mem in self.long_term_memory if mem.character_id == character_id]

# Instantiate the manager
conversation_manager = ConversationManager()

def get_status() -> SpectraStatus:
    """
    Retrieves Spectra's current status.
    In the future, this will involve more complex logic.
    """
    return SpectraStatus(status="Contemplative", mood="Calm")
