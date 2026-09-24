<div align="center">

# ⚖️ LegalLens
### *AI-Powered Contract Understanding & Risk Discovery*

Upload a contract. Understand the language. Discover the risk.

![React](https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react&logoColor=111827)
![Node](https://img.shields.io/badge/Node.js-Backend-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-API-000000?style=for-the-badge&logo=express)
![OpenAI](https://img.shields.io/badge/OpenAI-LLM-412991?style=for-the-badge&logo=openai)
![Google Cloud](https://img.shields.io/badge/Google%20Cloud-Translation-4285F4?style=for-the-badge&logo=googlecloud)

</div>

---

## 🔎 Overview

LegalLens is an AI-assisted contract analysis prototype that helps users understand legal documents through summarization, clause-level risk highlighting, comparison, and translation. The application combines a React interface, a Node/Express API, server-side document processing, and LLM-powered analysis.

> **Important:** LegalLens is an informational decision-support prototype, not a substitute for advice from a qualified legal professional.

## 🏗️ Architecture

```mermaid
flowchart TD
    U[User] --> UI[React + React Three Fiber UI]
    UI --> UP[UploadForm]
    UP --> API[Node.js + Express API]
    API --> EXT[PDF/TXT Text Extraction]
    EXT --> TXT[Normalized Document Text]
    TXT --> SUM[/api/summarize]
    TXT --> RISK[/api/highlight]
    TXT --> CMP[/api/compare]
    SUM --> LLM[OpenAI Model]
    RISK --> LLM
    CMP --> LLM
    LLM --> JSON[Structured Analysis JSON]
    JSON --> VIEW[DocumentViewer / Dashboard3D]
    UI --> TR[/api/translate]
    TR --> GC[Google Cloud Translation]
    GC --> UI
```

## 🔄 End-to-end workflow

1. **Upload:** the user submits a PDF or TXT document through the React upload interface.
2. **Extraction:** Express receives the file and extracts readable text using `pdf-parse` when required.
3. **Analysis:** the backend sends document text to the configured OpenAI model for summarization, clause analysis, or comparison.
4. **Risk visualization:** clause spans and risk scores are returned as JSON and rendered in the document viewer.
5. **Comparison:** two documents or clauses can be compared to identify differences and provide safer alternative wording.
6. **Translation:** translation requests are handled server-side through Google Cloud Translation so credentials remain private.

## 🧰 Core capabilities

| Capability | Endpoint | Output |
|---|---|---|
| Upload | `/api/upload` | Extracted document text |
| Summarize | `/api/summarize` | Summary, key points, terminology |
| Risk highlighting | `/api/highlight` | Clause spans and risk scores |
| Compare | `/api/compare` | Differences and safer alternatives |
| Translate | `/api/translate` | Translated document text |
| Health | `/api/health` | Service status |

## 📁 Project structure

```text
legallens/
├── backend/
│   ├── index.js
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── public/index.html
│   └── src/
│       ├── App.tsx
│       ├── index.tsx
│       └── components/
│           ├── Dashboard3D.tsx
│           ├── DocumentViewer.tsx
│           └── UploadForm.tsx
└── README.md
```

## 🚀 Local setup

### Backend

```bash
cd backend
cp .env.example .env
npm install
npm start
```

Configure the server environment:

```env
OPENAI_API_KEY=your_key
GOOGLE_CLOUD_API_KEY=your_key
PORT=8080
```

Health check: `http://localhost:8080/api/health`

### Frontend

```bash
cd frontend
npm install
npm start
```

The frontend development server proxies API requests to the backend on port `8080`.

## 🔐 Security notes

- API keys are kept on the server and must never be exposed in frontend code.
- `.env` is gitignored; use a secret manager for production deployments.
- PDF extraction may require OCR support for scanned or image-only documents.

---

<div align="center">Built to make complex contracts easier to understand.</div>
