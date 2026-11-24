# WandrGo Itinerary Planner — Local LLM Travel Planner

A premium AI-powered travel itinerary planner with a FastAPI backend and Ollama (free local LLM).

## Prerequisites

1. **Python 3.10+** (or Python 3.7+)
2. **Ollama** — Install from [ollama.com/download](https://ollama.com/download)
3. Pull the model:
   ```bash
   ollama pull qwen2.5:3b
   ```
   *(or `qwen2.5:7b` for higher quality)*

## Quick Start

```bash
# 1. Install Python deps
cd wandrgo-itinerary-planner/backend
pip install -r requirements.txt

# 2. Make sure Ollama is running
ollama serve

# 3. Start the server
uvicorn main:app --reload --port 8000

# 4. Open in browser
# http://localhost:8000
```

## Features

- 🗺 AI-generated day-by-day travel itineraries
- 💰 Budget breakdown & estimation
- 🍽 Food & restaurant recommendations
- 💬 Multi-turn AI chat assistant (trip-aware)
- 🎯 Interest-based personalization
- 🧠 Zero-shot prompt engineering
- 💸 **Completely free** — runs locally via Ollama

## Changing the Model

Edit `MODEL` in `backend/main.py`:

```python
MODEL = "qwen2.5:3b"      # Default — fast and lightweight
MODEL = "qwen2.5:7b"      # Higher accuracy — great JSON output
MODEL = "llama3.2:3b"     # Alternative
MODEL = "mistral:7b"      # Another option
```

## Architecture

```
Browser → FastAPI (Python) → Ollama (localhost:11434) → Local LLM
```
