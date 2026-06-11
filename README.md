# Calendar Agent

Calendar Agent is a full-stack AI-powered calendar assistant that helps users create Google Calendar events faster using saved presets and natural language commands.

## Features

- React.js frontend
- FastAPI backend
- Google Calendar OAuth integration
- Google Calendar event creation
- Local AI integration through LM Studio
- Preset-based event creation
- Dynamic preset-aware AI agent
- Editable event preview before creation
- Event history
- Google Calendar disconnect/change account
- Toast notifications
- GSAP-powered UI animations
- SQLite storage
- Docker-ready structure

## Tech Stack

### Frontend
- React.js
- Vite
- TailwindCSS
- Axios
- GSAP

### Backend
- FastAPI
- SQLAlchemy
- SQLite
- Pydantic
- Google Calendar API
- LM Studio local AI API

## Local Setup

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
