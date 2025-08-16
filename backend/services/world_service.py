from backend.models.world import WorldState, WorldTime

def get_state() -> WorldState:
    """
    Retrieves the current state of the world.
    """
    return WorldState(status="World is stable.")

def get_time() -> WorldTime:
    """
    Retrieves the current time in the world.
    """
    return WorldTime(time="Twilight")
