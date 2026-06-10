import json
from datetime import date

import httpx
from fastapi import HTTPException

from app.core.config import settings


def build_calendar_agent_prompt(command: str) -> str:
    today = date.today().isoformat()

    return f"""
You are an AI calendar event extraction agent.

Return ONLY valid JSON.
No explanation.
No markdown.
No code block.

Current date: {today}
Timezone: {settings.app_timezone}

Known Tesco shift template:
- event_type: tesco_shift
- default title: Shift @ Tesco
- default start_time: 15:00
- default end_time: 23:00
- default reminder_minutes: 30
- default color_id: 9
- default color_label: Work

Known shift leaders:
- FH
- PK

User command:
{command}

Rules:
- If user says tomorrow, calculate tomorrow from current date.
- Use date format YYYY-MM-DD.
- Use time format HH:mm.
- If user says 3 to 11 for Tesco shift, treat it as 15:00 to 23:00.
- If time is missing for Tesco shift, use 15:00 to 23:00.
- If reminder is missing, use 30.
- If color is missing, use 9 and Work.
- If shift leader is missing, set shift_leader to null.
- If shift leader exists, title must be "Shift @ Tesco - FH" or "Shift @ Tesco - PK".
- If shift leader is missing, title must be "Shift @ Tesco".

Return exactly this JSON structure:
{{
  "intent": "create_calendar_event",
  "event_type": "tesco_shift",
  "title": "Shift @ Tesco - FH",
  "date": "YYYY-MM-DD",
  "start_time": "15:00",
  "end_time": "23:00",
  "shift_leader": "FH",
  "reminder_minutes": 30,
  "color_id": "9",
  "color_label": "Work",
  "missing_fields": []
}}
"""


def clean_ai_json_response(content: str) -> str:
    cleaned = content.strip()

    if cleaned.startswith("```json"):
        cleaned = cleaned.replace("```json", "", 1).strip()

    if cleaned.startswith("```"):
        cleaned = cleaned.replace("```", "", 1).strip()

    if cleaned.endswith("```"):
        cleaned = cleaned[:-3].strip()

    first_brace = cleaned.find("{")
    last_brace = cleaned.rfind("}")

    if first_brace != -1 and last_brace != -1:
        cleaned = cleaned[first_brace:last_brace + 1]

    return cleaned


def extract_content_from_lm_studio_response(data: dict) -> str:
    """
    Supports multiple possible LM Studio response shapes.
    """

    if "choices" in data:
        return data["choices"][0]["message"]["content"]

    if "output" in data:
        output = data["output"]

        if isinstance(output, str):
            return output

        if isinstance(output, list):
            text_parts = []

            for item in output:
                if isinstance(item, str):
                    text_parts.append(item)

                if isinstance(item, dict):
                    if "text" in item:
                        text_parts.append(item["text"])
                    elif "content" in item:
                        text_parts.append(item["content"])

            return "\n".join(text_parts)

    if "message" in data and isinstance(data["message"], dict):
        return data["message"].get("content", "")

    if "content" in data:
        return data["content"]

    if "response" in data:
        return data["response"]

    if "text" in data:
        return data["text"]

    raise HTTPException(
        status_code=500,
        detail=f"Unexpected LM Studio response format: {data}",
    )


async def generate_event_json_from_command(command: str) -> dict:
    prompt = build_calendar_agent_prompt(command)

    url = f"{settings.lm_studio_base_url}/chat"

    payload = {
        "model": settings.lm_studio_model,
        "input": prompt,
        "temperature": 0,
        "stream": False,
    }

    try:
        async with httpx.AsyncClient(
            timeout=settings.lm_studio_timeout_seconds
        ) as client:
            response = await client.post(url, json=payload)

        response.raise_for_status()

    except httpx.ConnectError:
        raise HTTPException(
            status_code=503,
            detail="Could not connect to LM Studio. Make sure LM Studio server is running on http://localhost:1234.",
        )

    except httpx.TimeoutException:
        raise HTTPException(
            status_code=504,
            detail="LM Studio took too long to respond. Try a smaller model or wait for the first model response to finish.",
        )

    except httpx.HTTPStatusError as error:
        raise HTTPException(
            status_code=error.response.status_code,
            detail=f"LM Studio returned an error: {error.response.text}",
        )

    data = response.json()
    content = extract_content_from_lm_studio_response(data)
    cleaned_content = clean_ai_json_response(content)

    try:
        return json.loads(cleaned_content)

    except json.JSONDecodeError:
        raise HTTPException(
            status_code=500,
            detail=f"AI returned invalid JSON: {cleaned_content}",
        )