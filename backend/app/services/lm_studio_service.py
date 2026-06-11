import json
from datetime import date

import httpx
from fastapi import HTTPException

from app.core.config import settings


def format_presets_for_prompt(presets: list) -> str:
    if not presets:
        return """
No saved presets found.
If the command is still clear, create a general calendar event.
"""

    preset_blocks = []

    for preset in presets:
        preset_blocks.append(
            f"""
Preset:
- event_type: {preset.key}
- label: {preset.label}
- default_title: {preset.default_title}
- default_start_time: {preset.default_start_time}
- default_end_time: {preset.default_end_time}
- default_reminder_minutes: {preset.default_reminder_minutes}
- default_color_id: {preset.default_color_id}
- color_label: {preset.color_label}
"""
        )

    return "\n".join(preset_blocks)


def build_calendar_agent_prompt(command: str, presets: list) -> str:
    today = date.today().isoformat()
    preset_context = format_presets_for_prompt(presets)

    return f"""
You are CalPilot, an AI calendar event extraction agent.

Your job:
Convert the user's natural language command into structured JSON for creating a Google Calendar event.

Return ONLY valid JSON.
No markdown.
No explanation.
No extra text.
No comments.
No code fences.

Current date: {today}
Timezone: {settings.app_timezone}

Saved user presets:
{preset_context}

Known shift leaders:
- FH
- PK

Important interpretation rules:
- Use date format YYYY-MM-DD.
- Use time format HH:mm.
- If the user says "tomorrow", calculate tomorrow from current date.
- If the user says "next Monday", calculate the next upcoming Monday after current date.
- If the user says "Friday", use the next upcoming Friday.
- If user says "3 to 11" for a work shift, interpret it as 15:00 to 23:00 unless context clearly means morning.
- If user says "7 to 9" for study/gym/personal event, interpret it as 19:00 to 21:00 unless context clearly means morning.
- Match the command to the closest saved preset by label, title, or event_type.
- If the command matches a saved preset and time is missing, use that preset's default_start_time and default_end_time.
- If reminder is missing, use the matched preset's default_reminder_minutes.
- If color is missing, use the matched preset's default_color_id and color_label.
- If no preset matches, use event_type "general_event", color_id "1", color_label "General", and reminder_minutes 30.
- If a required field is missing and cannot be inferred, add it to missing_fields.
- Required fields: date, start_time, end_time, title.
- Do not create the event. Only return JSON.
- If a Tesco shift leader is given, include it in title, for example "Shift @ Tesco - FH".
- If no shift leader is given, shift_leader must be null.

User command:
{command}

Return exactly this JSON structure:
{{
    "intent": "create_calendar_event",
    "event_type": "preset_key_or_general_event",
    "title": "Event title",
    "date": "YYYY-MM-DD",
    "start_time": "HH:mm",
    "end_time": "HH:mm",
    "shift_leader": null,
    "reminder_minutes": 30,
    "color_id": "1",
    "color_label": "General",
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


def apply_backend_fallbacks(event_data: dict, presets: list) -> dict:
    """
    Safety layer.
    Even if AI misses a preset default, backend applies known defaults.
    """

    event_type = event_data.get("event_type")
    matched_preset = None

    for preset in presets:
        if preset.key == event_type:
            matched_preset = preset
            break

    if matched_preset:
        if not event_data.get("title"):
            event_data["title"] = matched_preset.default_title

        if not event_data.get("start_time"):
            event_data["start_time"] = matched_preset.default_start_time

        if not event_data.get("end_time"):
            event_data["end_time"] = matched_preset.default_end_time

        if not event_data.get("reminder_minutes"):
            event_data["reminder_minutes"] = matched_preset.default_reminder_minutes

        if not event_data.get("color_id"):
            event_data["color_id"] = matched_preset.default_color_id

        if not event_data.get("color_label"):
            event_data["color_label"] = matched_preset.color_label

    event_data.setdefault("intent", "create_calendar_event")
    event_data.setdefault("event_type", "general_event")
    event_data.setdefault("reminder_minutes", 30)
    event_data.setdefault("color_id", "1")
    event_data.setdefault("color_label", "General")
    event_data.setdefault("shift_leader", None)
    event_data.setdefault("missing_fields", [])

    missing_fields = event_data.get("missing_fields") or []

    for required_field in ["title", "date", "start_time", "end_time"]:
        if not event_data.get(required_field) and required_field not in missing_fields:
            missing_fields.append(required_field)

    event_data["missing_fields"] = missing_fields

    return event_data


async def generate_event_json_from_command(command: str, presets: list) -> dict:
    prompt = build_calendar_agent_prompt(command, presets)

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
            detail="LM Studio took too long to respond. Try reducing context length or using a smaller model.",
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
        parsed_data = json.loads(cleaned_content)
        return apply_backend_fallbacks(parsed_data, presets)

    except json.JSONDecodeError:
        raise HTTPException(
            status_code=500,
            detail=f"AI returned invalid JSON: {cleaned_content}",
        )