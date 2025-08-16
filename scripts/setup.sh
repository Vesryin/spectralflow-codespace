#!/bin/bash
set -e

# Base venv directory
VENV_DIR="/workspaces/.venvs"
mkdir -p "$VENV_DIR"

# List of projects
PROJECTS=("spectre" "lodestar" "futureAI")

# Function to setup project
setup_project() {
    local project=$1
    local requirements="/workspaces/$project/requirements.txt"
    local project_venv="$VENV_DIR/$project"

    # Create venv if it doesn't exist
    if [ ! -d "$project_venv" ]; then
        python3 -m venv "$project_venv"
        echo "✅ Created venv for $project"
    fi

    source "$project_venv/bin/activate"
    pip install --upgrade pip setuptools wheel

    # Install project-specific requirements if present
    if [ -f "$requirements" ]; then
        pip install -r "$requirements"
        echo "✅ Installed requirements for $project"
    fi
    deactivate
}

# Setup all projects automatically
for project in "${PROJECTS[@]}"; do
    if [ -d "/workspaces/$project" ]; then
        setup_project "$project"
    else
        echo "⚠️ Project directory /workspaces/$project not found. Skipping."
    fi
done

# Preload common Hugging Face models
python3 - <<EOF
from transformers import AutoModel, AutoTokenizer
model_names = ["gpt2", "bert-base-uncased", "CompVis/stable-diffusion-v1-4"]
for name in model_names:
    try:
        AutoTokenizer.from_pretrained(name)
        AutoModel.from_pretrained(name)
        print(f"✅ {name} cached")
    except:
        print(f"⚠️ Could not cache {name}")
EOF

# Create shared directories for all projects
mkdir -p /workspaces/models /workspaces/data /workspaces/logs

echo "✅ All project venvs and shared environment ready!"
