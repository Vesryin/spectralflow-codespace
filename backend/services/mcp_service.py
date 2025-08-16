import random
from typing import Dict, Any, List

# --- Model Simulation ---

def _format_history_for_simulation(history: List[Dict[str, str]]) -> str:
    """Formats a conversation history into a single string for simulation."""
    return "\n".join([f"{msg['role']}: {msg['content']}" for msg in history])

def _call_openhermes(history: List[Dict[str, str]]) -> Dict[str, Any]:
    """Simulates a call to the OpenHermes model."""
    print("Attempting to call OpenHermes...")
    # Simulate a potential failure
    if random.random() < 0.2: # 20% chance of failure
        print("OpenHermes call failed.")
        raise ConnectionError("Failed to connect to OpenHermes model")
    print("OpenHermes call successful.")
    formatted_history = _format_history_for_simulation(history)
    return {"response": f"OpenHermes responds to history:\n---\n{formatted_history}\n---"}

def _call_claude(history: List[Dict[str, str]]) -> Dict[str, Any]:
    """Simulates a call to the Claude model."""
    print("Attempting to call Claude...")
    # Claude is more reliable in this simulation
    print("Claude call successful.")
    formatted_history = _format_history_for_simulation(history)
    return {"completion": f"Claude responds to history:\n---\n{formatted_history}\n---"}

# --- Main Service Logic ---

def generate_response(history: List[Dict[str, str]], preferred_model: str = "openhermes") -> Dict[str, Any]:
    """
    Generates a response from an AI model, with fallback logic.
    """
    try:
        if preferred_model == "openhermes":
            return _call_openhermes(history)
        elif preferred_model == "claude":
            return _call_claude(history)
        else:
            # Default to OpenHermes if preferred model is unknown
            return _call_openhermes(history)
    except ConnectionError:
        print(f"Primary model ({preferred_model}) failed. Falling back to Claude.")
        # Fallback logic
        return _call_claude(history)
