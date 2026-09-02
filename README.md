# ai-currency-converter / AI Currency Assistant

A minimal full-stack example that demonstrates a TypeScript (Vite) frontend and a Python (FastAPI-ready) backend which can be extended to use a generative AI service for enhancing currency-conversion workflows. This README has been expanded using the author's Rag_WeatherForecasting README as a reference and includes full local development, run, and test instructions.

[![Repo size](https://img.shields.io/github/repo-size/VikashKumar1424/ai-currency-converter)](https://github.com/VikashKumar1424/ai-currency-converter)
[![Languages](https://img.shields.io/github/languages/top/VikashKumar1424/ai-currency-converter)](https://github.com/VikashKumar1424/ai-currency-converter)

Table of Contents
- About
- Features
- Architecture
- Tech stack
- Prerequisites
- Quickstart
  - Backend (Python)
  - Frontend (TypeScript / Vite)
  - Run both (development)
- Environment variables
- Testing
- Troubleshooting
- Deployment
- Contributing
- License

About
-----

This repository contains a frontend app (frontend/) built with TypeScript and Vite, and a Python backend (backend/) that is structured to use FastAPI and generative AI libraries. The project is intended as a developer-friendly starting point for building an AI-augmented currency conversion assistant.

Features
--------
- Frontend: Vite + TypeScript project scaffold (dev/build/preview scripts in frontend/package.json)
- Backend: Python project using pyproject.toml (dependencies include FastAPI, an LLM client, and uv for running tasks)
- Ready to extend with an external AI provider and a currency rates provider
- Example health and conversion API endpoints for local development

Repository layout

```
ai-currency-assistant/
│
├── backend/
│   ├── app/
│   ├── tests/
│   ├── pyproject.toml
│   ├── uv.lock
│   ├── .env.example
│   └── README.md
│
├── frontend/
│   ├── src/
│   ├── index.html
│   ├── package.json
│   └── tsconfig.json
│
├── .gitignore
├── README.md
└── LICENSE
```

Architecture
------------

Browser (Vite/TypeScript Frontend) -> HTTP/JSON -> Python Backend (FastAPI) -> Optional external APIs (AI provider, Exchange Rates API) -> Optional cache/storage

Tech stack
----------
- Frontend: TypeScript, Vite
- Backend: Python (pyproject.toml), FastAPI (if implemented), uvicorn for serving
- AI client: google-genai or other provider (configurable)
- Dev/test: pytest, httpx (dev dependencies)

Prerequisites
-------------
- Node.js 16+ and npm (or pnpm/yarn) for the frontend
- Python 3.12+ (pyproject requires >=3.12)
- Git
- API credentials (for the AI provider and optional exchange rates provider) if you want to exercise that functionality

Quickstart
----------

Clone the repository:

```bash
git clone https://github.com/VikashKumar1424/ai-currency-converter.git
cd ai-currency-converter
```

Backend (Python) — Terminal 1
----------------------------

1. Change into the backend folder and create / copy a virtual environment (or use the repository's recommended `uv` workflow):

```bash
cd backend
python -m venv .venv
# macOS / Linux
source .venv/bin/activate
# Windows PowerShell
# .\.venv\Scripts\Activate.ps1
```

2. Install dependencies (using pip) or follow the `uv` workflow if used by this project:

```bash
python -m pip install --upgrade pip
pip install .
# For development extras (tests etc): pip install "[dev]" if defined
```

3. Configure environment variables: copy the example env and edit secrets (do NOT commit `.env`):

```bash
cp .env.example .env
# Edit backend/.env and set required keys, e.g. GEMINI_API_KEY or GENAI_API_KEY
```

4. Verify the API key is loaded by the backend configuration (this prints only a boolean, not the key):

```bash
uv run python -c "from app.config import GEMINI_API_KEY; print('Gemini key loaded:', bool(GEMINI_API_KEY))"
```

Expected output:

```
Gemini key loaded: True
```

5. Start the backend (development server with auto-reload):

```bash
uv run uvicorn app.main:app --reload --port 8000
```

Keep this terminal running.

Test backend (Terminal 2)
-------------------------

Open another terminal and run quick smoke tests against the running backend:

- Health endpoint

```bash
curl http://localhost:8000/api/health
```

Expected response (HTTP 200):

```json
{
  "status": "ok",
  "service": "AI Currency Assistant"
}
```

- Conversion request (example)

```bash
curl -X POST http://localhost:8000/api/convert \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 100,
    "from_currency": "USD",
    "to_currency": "INR"
  }'
```

Expected: HTTP 200 with JSON containing the converted amount and any metadata.

If the above calls return 200 with valid data, your backend is running correctly.

Frontend (Terminal 3)
---------------------

1. Change to the frontend directory and install dependencies:

```bash
cd frontend
npm install
```

2. Create a frontend environment file for Vite (optional):

```env
# frontend/.env.local
VITE_API_BASE_URL=http://localhost:8000
```

3. Start the dev server:

```bash
npm run dev
```

Open the app in your browser (default Vite port):

http://localhost:5173

Run both (development)
----------------------

1. Start the backend (port 8000) as shown above.
2. Start the frontend (Vite dev server) as shown above.
3. If you encounter CORS issues, either enable CORS in the backend or use a Vite proxy. Example Vite proxy snippet in `vite.config.ts`:

```ts
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      }
    }
  }
});
```

Environment variables
---------------------
Create `backend/.env` and `frontend/.env.local` as needed. Example backend `.env`:

```env
# backend/.env
GEMINI_API_KEY=your_genai_api_key_here
GENAI_API_KEY=your_genai_api_key_here
EXCHANGE_RATES_API_KEY=your_rates_api_key_here
PORT=8000
```

Example frontend `.env.local`:

```env
VITE_API_BASE_URL=http://localhost:8000
```

Testing
-------

- Backend tests (pytest):

```bash
cd backend
uv run pytest
```

- Frontend tests (if present) — see `frontend/package.json` scripts.

Troubleshooting
---------------

- Backend prints an informational message when the package console script is invoked — if you expect an API, ensure the FastAPI `app` object is exported and run uvicorn with the correct import path.
- Import errors on uvicorn: double-check the Python package import path and the module that contains the `app` object.
- Port conflicts: choose different ports or stop services occupying the port.
- CORS: configure FastAPI's CORS middleware or use the Vite proxy during development.

Deployment
----------

- Frontend: build with `cd frontend && npm run build` and serve the `dist` directory with a static web server or include as static assets in the backend.
- Backend: containerize or deploy to any Python-capable hosting. Ensure environment variables are set and that network routing/CORS are configured.

Optional: create Dockerfiles for frontend and backend and a `docker-compose.yml` that wires ports and env vars.

Security & secrets
------------------
- Keep API keys in environment variables or a secret manager (GitHub Secrets, Vault).
- Rotate keys regularly and avoid printing secrets to logs.

Acknowledgements & reference
----------------------------
This README was adapted and extended using the README and documentation style from the Rag_WeatherForecasting project by @VikashKumar1424 (https://github.com/VikashKumar1424/Rag_WeatherForecasting).

License
-------
See LICENSE at the repository root.

Author
------
[VikashKumar1424](https://github.com/VikashKumar1424)
