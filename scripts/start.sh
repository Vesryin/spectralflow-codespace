#!/bin/bash
set -e

VENV_DIR="/workspaces/.venvs"
SETTINGS_FILE="/workspaces/.vscode/settings.json"
LOG_DIR="/workspaces/logs"
LAST_PROJECT_FILE="$VENV_DIR/.last_project"

PROJECTS=("spectre" "lodestar" "futureAI")

# -----------------------------
# Prompt for project selection
# -----------------------------
echo "Select the AI project to start:"

if [ -f "$LAST_PROJECT_FILE" ]; then
    LAST_PROJECT=$(cat "$LAST_PROJECT_FILE")
    echo "Last selected project: $LAST_PROJECT"
    echo "Press Enter to use last project or choose a new one."
fi

PS3="Enter the number of the project: "
select PROJECT in "${PROJECTS[@]}"; do
    if [ -z "$PROJECT" ]; then
        if [ -n "$LAST_PROJECT" ]; then
            PROJECT="$LAST_PROJECT"
            echo "✅ Using last project: $PROJECT"
            break
        else
            echo "⚠️ Invalid choice. Try again."
        fi
    else
        echo "✅ Selected project: $PROJECT"
        break
    fi
done

# Save selection for next time
mkdir -p "$VENV_DIR"
echo "$PROJECT" > "$LAST_PROJECT_FILE"

PROJECT_DIR="/workspaces/$PROJECT"
PROJECT_VENV="$VENV_DIR/$PROJECT"

# -----------------------------
# Activate venv
# -----------------------------
if [ ! -d "$PROJECT_VENV" ]; then
    echo "⚠️ Venv for $PROJECT not found. Run setup.sh first."
    exit 1
fi

source "$PROJECT_VENV/bin/activate"

# -----------------------------
# Update VS Code Python interpreter
# -----------------------------
mkdir -p "$(dirname "$SETTINGS_FILE")"

jq --arg pythonPath "$PROJECT_VENV/bin/python" \
   '. + { "python.pythonPath": $pythonPath }' \
   "$SETTINGS_FILE" > "${SETTINGS_FILE}.tmp" 2>/dev/null || echo "{\"python.pythonPath\":\"$PROJECT_VENV/bin/python\"}" > "${SETTINGS_FILE}.tmp"

mv "${SETTINGS_FILE}.tmp" "$SETTINGS_FILE"
echo "✅ VS Code Python interpreter set to $PROJECT_VENV/bin/python"

# -----------------------------
# Launch services
# -----------------------------
mkdir -p "$LOG_DIR"

# Jupyter
if [ -d "$PROJECT_DIR/notebooks" ]; then
    nohup jupyter lab --notebook-dir="$PROJECT_DIR/notebooks" --ip=0.0.0.0 --port=8888 --allow-root &> "$LOG_DIR/jupyter.log" &
    echo "✅ Jupyter started on port 8888"
fi

# API server
if [ -f "$PROJECT_DIR/app.py" ]; then
    nohup python "$PROJECT_DIR/app.py" &> "$LOG_DIR/api.log" &
    echo "✅ API server started"
fi

# Gradio UI
if [ -f "$PROJECT_DIR/gradio_ui.py" ]; then
    nohup python "$PROJECT_DIR/gradio_ui.py" &> "$LOG_DIR/gradio.log" &
    echo "✅ Gradio UI started"
fi

echo "✅ All selected services for $PROJECT launched!"
deactivate
