# Use official lightweight Python image
FROM python:3.11-slim

# Install system dependencies (FFmpeg is required for Whisper and chunking)
RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Set working directory inside the container
WORKDIR /app

# Install uv for extremely fast python package resolution and installation
RUN pip install --no-cache-dir uv

# Copy only the requirements file first to utilize Docker layer caching
COPY Requirements.txt .

# Install dependencies directly into the system python site-packages
RUN uv pip install --system --no-cache -r Requirements.txt

# Copy all backend source files into the container
COPY . .

# Expose port 8000 for the FastAPI server
EXPOSE 8000

# Start FastAPI server using uvicorn
CMD ["uvicorn", "api:app", "--host", "0.0.0.0", "--port", "8000"]
