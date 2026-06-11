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
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### LM Studio
Start LM Studio local server:
```bash
http://127.0.0.1:1234/api/v1
```
Use a small model for best performance.

### Environment Variables
Copy:
```bash
backend/.env.example → backend/.env
frontend/.env.example → frontend/.env
```

### Google Calendar Setup
1. Create Google Cloud project
2. Enable Google Calendar API
3. Create OAuth Web Client
4. Add redirect URI:
```bash
http://127.0.0.1:8000/api/auth/google/callback
```

5. Download credentials and save as:
```bash
backend/credentials.json
```

