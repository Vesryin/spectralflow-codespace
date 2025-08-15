# Base container for Python AI + Node.js
FROM mcr.microsoft.com/devcontainers/python:3.12-bullseye

# Install system utilities
RUN apt-get update && apt-get install -y --no-install-recommends \
    git wget curl build-essential libssl-dev \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Python AI packages
RUN pip install --upgrade pip setuptools wheel
RUN pip install \
    torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu \
    transformers diffusers accelerate \
    jupyterlab pandas numpy matplotlib scikit-learn seaborn

# Node.js for web interfaces (Gradio, React)
ARG VARIANT="18"
RUN curl -fsSL https://deb.nodesource.com/setup_${VARIANT}.x | bash - \
    && apt-get install -y nodejs

# Copy setup scripts and run
COPY ./scripts /tmp/scripts
RUN bash /tmp/scripts/setup.sh
