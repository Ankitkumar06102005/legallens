# LegalLens (prototype)

LegalLens simplifies contracts with AI: summarization, clause risk highlighting, and clause comparison. Frontend is React + react-three-fiber; backend is Node + Express. Google Cloud Translation runs server-side only.

## Repo layout

```
/Legalens
  /backend
    index.js
    package.json
    .env.example
  /frontend
    package.json
    public/index.html
    src/
      App.tsx
      index.tsx
      components/
        Dashboard3D.tsx
        DocumentViewer.tsx
        UploadForm.tsx
  README.md
  .gitignore
```

## Prerequisites
- Node.js 18+
- Yarn or npm
- API keys (keep private):
  - OPENAI_API_KEY (for LLM summarization & analysis)
  - GOOGLE_CLOUD_API_KEY (for Translation API)

## Quick start (local dev)

1) Backend
- Copy example env and add your keys:
```
cd backend
cp .env.example .env   # on Windows PowerShell: copy .env.example .env
```
- Edit `.env` and set:
```
OPENAI_API_KEY=sk-...
GOOGLE_CLOUD_API_KEY=AIza...
PORT=8080
```
- Install and run:
```
yarn
yarn start
# or: npm install && npm start
```
- Health check: http://localhost:8080/api/health

2) Frontend
```
cd ../frontend
yarn
yarn start
# or: npm install && npm start
```
The frontend dev server proxies API calls to http://localhost:8080.

## Features
- Upload PDF/TXT → server extracts text (`/api/upload`)
- Summarize (`/api/summarize`) → JSON with summary, key points, terminology
- Clause analysis (`/api/highlight`) → JSON array with spans + risk scores
- Compare (`/api/compare`) → JSON with differences + safer alternative
- Translate (`/api/translate`) → Google Cloud Translation API

## Security
- Never put API keys in the frontend. Use environment variables on the server.
- `.env` is gitignored. For production, use a secret manager.

## Notes
- PDF extraction uses `pdf-parse`. For complex PDFs, consider OCR or a more robust parser.
- LLM model: `gpt-4o-mini` placeholder — change to your available model.
