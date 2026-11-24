"""
WandrGo Itinerary Planner - FastAPI Backend
Connects to Ollama (local LLM) for free AI-powered travel planning.
Compatible with Python 3.7+
"""

import json
import re
import httpx
from typing import Optional, List, Dict, Any
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel

# --- Config ---
OLLAMA_BASE = "http://localhost:11434"
MODEL = "qwen2.5:3b"

app = FastAPI(title="WandrGo Itinerary Planner", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- In-memory state ---
chat_histories = {}  # type: Dict[str, List]


# --- Pydantic Models ---
class TripParams(BaseModel):
    destination: str
    origin: Optional[str] = "not specified"
    days: int = 5
    start_date: Optional[str] = "flexible"
    travellers: int = 2
    budget: int = 25000
    budget_style: str = "mid-range"
    group_type: str = "couple"
    interests: List[str] = []
    pace: str = "moderate"
    accommodation: str = "hotel"
    dietary: Optional[str] = "no restrictions"
    notes: Optional[str] = "none"


class ChatRequest(BaseModel):
    message: str
    session_id: str = "default"
    itinerary_context: Optional[Dict[str, Any]] = None


# --- Helper to robustly extract JSON from LLM responses ---
def extract_json(raw_text: str) -> Dict[str, Any]:
    """
    Robust multi-stage JSON parser for LLM responses.
    Handles extra trailing text, markdown fences, preamble, and minor syntax issues.
    """
    text = raw_text.strip()

    # 1. Look for ```json ... ``` code fence
    json_match = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", text, re.IGNORECASE)
    if json_match:
        candidate = json_match.group(1).strip()
        try:
            return json.loads(candidate)
        except Exception:
            pass

    # 2. Use raw_decode starting from first '{' (safely ignores any trailing extra data)
    start_idx = text.find("{")
    if start_idx != -1:
        try:
            obj, _ = json.JSONDecoder().raw_decode(text[start_idx:])
            if isinstance(obj, dict):
                return obj
        except Exception:
            pass

    # 3. Slice between first '{' and last '}' and clean trailing commas/comments
    last_idx = text.rfind("}")
    if start_idx != -1 and last_idx != -1 and last_idx > start_idx:
        candidate = text[start_idx : last_idx + 1]
        try:
            return json.loads(candidate)
        except Exception:
            cleaned = re.sub(r",\s*([}\]])", r"\1", candidate)
            cleaned = re.sub(r"//.*?\n", "\n", cleaned)
            try:
                return json.loads(cleaned)
            except Exception:
                pass

    # 4. raw_decode on cleaned snippet
    if start_idx != -1:
        cleaned_snippet = re.sub(r",\s*([}\]])", r"\1", text[start_idx:])
        cleaned_snippet = re.sub(r"//.*?\n", "\n", cleaned_snippet)
        try:
            obj, _ = json.JSONDecoder().raw_decode(cleaned_snippet)
            if isinstance(obj, dict):
                return obj
        except Exception:
            pass

    return json.loads(text)


# --- Model & Ollama helper ---
async def get_active_model() -> str:
    """Find the best available model on the local Ollama instance."""
    global MODEL
    try:
        async with httpx.AsyncClient(timeout=4.0) as client:
            resp = await client.get("{}/api/tags".format(OLLAMA_BASE))
            if resp.status_code == 200:
                installed = [m["name"] for m in resp.json().get("models", [])]
                if installed:
                    # 1. If configured MODEL is directly available
                    for m in installed:
                        if MODEL == m or MODEL.split(":")[0] in m:
                            return m
                    # 2. Prefer any qwen2.5 model
                    for m in installed:
                        if "qwen" in m.lower():
                            MODEL = m
                            return m
                    # 3. Fallback to the first installed model
                    MODEL = installed[0]
                    return MODEL
    except Exception:
        pass
    return MODEL


async def ollama_chat(messages, max_tokens=4000, json_mode=False):
    """Send messages to Ollama and return the assistant reply."""
    active_model = await get_active_model()
    payload = {
        "model": active_model,
        "messages": messages,
        "stream": False,
        "options": {
            "num_predict": max_tokens,
            "temperature": 0.7,
        },
    }
    if json_mode:
        payload["format"] = "json"

    try:
        async with httpx.AsyncClient(timeout=300.0) as client:
            response = await client.post(
                "{}/api/chat".format(OLLAMA_BASE),
                json=payload,
            )
            # If Ollama rejected format="json", retry without it
            if response.status_code != 200 and json_mode:
                payload.pop("format", None)
                response = await client.post(
                    "{}/api/chat".format(OLLAMA_BASE),
                    json=payload,
                )
            if response.status_code != 200:
                raise HTTPException(
                    status_code=502,
                    detail="Ollama error (HTTP {}): {}".format(response.status_code, response.text),
                )
            data = response.json()
            return data["message"]["content"]
    except httpx.ConnectError:
        raise HTTPException(
            status_code=503,
            detail="Cannot connect to Ollama at localhost:11434. Please start Ollama by running 'ollama serve' in your terminal.",
        )


# --- API Routes ---
@app.get("/api/health")
async def health():
    """Check if Ollama is running and model is available."""
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            resp = await client.get("{}/api/tags".format(OLLAMA_BASE))
            if resp.status_code == 200:
                models = [m["name"] for m in resp.json().get("models", [])]
                active_model = await get_active_model()
                model_ready = any(active_model.split(":")[0] in m for m in models)
                return {
                    "status": "ok",
                    "ollama": True,
                    "model": active_model,
                    "model_ready": model_ready,
                    "available_models": models,
                }
    except Exception:
        pass
    return {"status": "error", "ollama": False, "model": MODEL, "model_ready": False}


@app.post("/api/generate-itinerary")
async def generate_itinerary(params: TripParams):
    """
    Generative AI: Zero-shot structured JSON generation via prompt engineering.
    The LLM reasons from scratch to produce a fully structured itinerary.
    """
    interests_str = ", ".join(params.interests) if params.interests else "general sightseeing"

    prompt = """You are a world-class AI travel planner. Create a comprehensive, personalized travel itinerary.

TRIP DETAILS:
- Destination: {destination}
- Travelling from: {origin}
- Duration: {days} days
- Start date: {start_date}
- Travellers: {travellers} ({group_type})
- Budget: ₹{budget} INR per person ({budget_style} style)
- Interests: {interests}
- Pace: {pace}
- Accommodation: {accommodation}
- Dietary: {dietary}
- Special notes: {notes}

Return ONLY a valid JSON object (no markdown, no extra text) with this EXACT structure:
{{
  "destination": "City, Country",
  "tagline": "one evocative sentence about the destination",
  "researchComplexity": {{
    "level": "Easy|Moderate|Complex|Expert",
    "score": 6,
    "reason": "brief reason",
    "visaRequired": true,
    "visaInfo": "visa details",
    "bestSeason": "best months to visit",
    "language": "local language",
    "currency": "INR (₹) / local currency",
    "timezone": "UTC offset"
  }},
  "budgetEstimation": {{
    "totalPerPerson": 35000,
    "accommodation": 12000,
    "food": 8000,
    "transport": 5000,
    "activities": 6000,
    "misc": 4000,
    "flightEstimate": 5000,
    "dailyAverage": 4500,
    "budgetTips": ["tip1", "tip2", "tip3"]
  }},
  "summary": "3-4 sentence overview of the trip",
  "highlights": ["highlight1", "highlight2", "highlight3", "highlight4"],
  "days": [
    {{
      "day": 1,
      "title": "Day title",
      "theme": "theme of the day",
      "activities": [
        {{
          "time": "09:00",
          "name": "Activity name",
          "description": "what you will do and experience",
          "duration": "2 hours",
          "cost": "₹500",
          "type": "attraction",
          "tip": "insider tip"
        }}
      ],
      "meals": {{
        "breakfast": "recommendation with place name",
        "lunch": "recommendation with place name",
        "dinner": "recommendation with place name"
      }},
      "dailyCost": "₹3,500",
      "transportNote": "how to get around this day"
    }}
  ],
  "placesToVisit": [
    {{
      "name": "Place name",
      "category": "Temple|Museum|Park|Market",
      "description": "why visit",
      "duration": "time needed",
      "cost": "free or ₹250",
      "bestTime": "morning or evening or anytime"
    }}
  ],
  "foodRecommendations": [
    {{
      "name": "Dish or restaurant name",
      "type": "street food|restaurant|cafe|market",
      "description": "what it is and why try it",
      "priceRange": "₹|₹₹|₹₹₹",
      "dietaryNotes": "veg or non-veg or vegan"
    }}
  ],
  "packingTips": ["tip1", "tip2", "tip3"],
  "importantNotes": ["note1", "note2"],
  "personalizedInsight": "A paragraph tailored to this traveller's interests, group type, and preferences"
}}

CRITICAL INSTRUCTIONS:
- STRICT ZERO-DUPLICATION RULE:
  * Do NOT recommend or schedule ANY place, monument, temple, park, museum, or sightseeing spot more than once.
  * Every single attraction across ALL days must be 100% UNIQUE. Never repeat a place on Day 2, Day 3, etc. that was already visited on any previous day.
  * The "placesToVisit" list must feature distinct places that are NOT duplicates of each other or of the day-by-day activities.
  * Every breakfast, lunch, and dinner recommendation must be a different unique eatery or restaurant.
- CURRENCY IN INDIAN RUPEES (INR / ₹):
  * ALL financial figures, estimates, costs, and budgets MUST be in Indian Rupees (INR / ₹). Do NOT use US Dollars ($).
  * Always use the ₹ symbol for cost strings (e.g. "₹500", "₹1,200", "₹3,500").
  * All numeric amounts in budgetEstimation must be realistic numbers in INR (₹).
- The "days" array MUST contain EXACTLY {days} day objects (day 1 through day {days}).
- Do NOT stop at just 1 day. Generate a COMPLETE entry for EVERY single day.
- Each day must have a unique title, theme, at least 3 unique activities, meals, dailyCost, and transportNote.
- Return ONLY the JSON, no other text.""".format(
        destination=params.destination,
        origin=params.origin,
        days=params.days,
        start_date=params.start_date,
        travellers=params.travellers,
        group_type=params.group_type,
        budget=params.budget,
        budget_style=params.budget_style,
        interests=interests_str,
        pace=params.pace,
        accommodation=params.accommodation,
        dietary=params.dietary,
        notes=params.notes,
    )

    messages = [{"role": "user", "content": prompt}]

    # Scale token limit with number of days: ~1500 tokens per day + 2000 for metadata
    token_limit = min(2000 + params.days * 1500, 16000)

    try:
        raw = await ollama_chat(messages, max_tokens=token_limit, json_mode=True)
        itinerary = extract_json(raw)

        # Helper to sanitize currency strings to INR (₹)
        def clean_inr_str(val):
            if val is None or val == "":
                return ""
            if isinstance(val, (int, float)):
                return "₹{:,}".format(int(val))
            s = str(val).strip().replace("$", "₹")
            return s

        # 1. Deduplicate activities across all days
        seen_activities = set()
        for day in itinerary.get("days", []):
            if "dailyCost" in day:
                day["dailyCost"] = clean_inr_str(day.get("dailyCost"))
            unique_acts = []
            for act in day.get("activities", []):
                act_name = act.get("name", "").strip()
                act_norm = act_name.lower()
                if act_norm:
                    if act_norm in seen_activities:
                        continue  # Skip duplicate place
                    seen_activities.add(act_norm)
                if "cost" in act:
                    act["cost"] = clean_inr_str(act.get("cost"))
                unique_acts.append(act)
            if unique_acts:
                day["activities"] = unique_acts

        # 2. Deduplicate placesToVisit & ensure they do not duplicate daily activities
        seen_places = set()
        unique_places = []
        for p in itinerary.get("placesToVisit", []):
            p_name = p.get("name", "").strip()
            p_norm = p_name.lower()
            if p_norm and (p_norm not in seen_places) and (p_norm not in seen_activities):
                seen_places.add(p_norm)
                if "cost" in p:
                    p["cost"] = clean_inr_str(p.get("cost"))
                unique_places.append(p)
        itinerary["placesToVisit"] = unique_places

        # 3. Deduplicate food recommendations
        seen_food = set()
        unique_food = []
        for f in itinerary.get("foodRecommendations", []):
            f_name = f.get("name", "").strip().lower()
            if f_name and (f_name not in seen_food):
                seen_food.add(f_name)
                if "priceRange" in f:
                    f["priceRange"] = str(f.get("priceRange")).replace("$", "₹")
                unique_food.append(f)
        itinerary["foodRecommendations"] = unique_food

        return {"success": True, "itinerary": itinerary}
    except json.JSONDecodeError as e:
        return {"success": False, "error": "JSON parse error: {}".format(str(e)), "raw": raw[:500]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/chat")
async def chat(req: ChatRequest):
    """
    Multi-turn conversational AI with in-context learning.
    Injects itinerary data into system prompt for trip-specific answers.
    """
    session = req.session_id

    if session not in chat_histories:
        chat_histories[session] = []

    # Build system prompt with itinerary context
    if req.itinerary_context:
        ctx = req.itinerary_context
        daily_avg = ctx.get("budgetEstimation", {}).get("dailyAverage", "moderate")
        if isinstance(daily_avg, (int, float)):
            daily_avg_str = "₹{:,}".format(int(daily_avg))
        else:
            daily_avg_str = str(daily_avg).replace("$", "₹")
            if not daily_avg_str.startswith("₹"):
                daily_avg_str = "₹" + daily_avg_str

        system = (
            "You are WandrGo, an expert AI travel itinerary planner. "
            "The user has a trip planned to {} "
            "for {} days. "
            "Daily average budget: {}. "
            "All budgets and currency are in Indian Rupees (INR / ₹). "
            "Give highly specific, helpful, concise advice based on their trip context."
        ).format(
            ctx.get("destination", "their destination"),
            len(ctx.get("days", [])),
            daily_avg_str,
        )
    else:
        system = "You are WandrGo, a friendly expert AI travel assistant and itinerary planner. Give helpful, specific, concise travel advice. All monetary figures should be in Indian Rupees (INR / ₹)."

    chat_histories[session].append({"role": "user", "content": req.message})

    # Build messages with system prompt + last 10 turns
    messages = [{"role": "system", "content": system}] + chat_histories[session][-10:]

    try:
        reply = await ollama_chat(messages, max_tokens=800)
        chat_histories[session].append({"role": "assistant", "content": reply})
        return {"success": True, "reply": reply}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# --- Serve Frontend ---
app.mount("/static", StaticFiles(directory="../frontend"), name="static")


@app.get("/")
async def serve_index():
    return FileResponse("../frontend/index.html")
