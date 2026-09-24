# LEGALENS — AI-Powered Legal Document Intelligence

<div align="center">

[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![React](https://img.shields.io/badge/React-19.0.1-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Gemini API](https://img.shields.io/badge/Google%20Gen%20AI-Gemini%202.5%20Flash-4285F4?logo=google&logoColor=white)](https://ai.google.dev/)
[![GitHub Pages](https://img.shields.io/badge/Deploy-GitHub%20Pages-222222?logo=github&logoColor=white)](https://ankitkumar06102005.github.io/legalens/)

**Legal Documents, Made Clear.**  
*Transform dense contracts, complex leases, and non-disclosure agreements into crystal-clear plain English with grounded section-by-section citations and real-time risk intelligence.*

[🌐 Live Demo](https://ankitkumar06102005.github.io/legalens/) · [📖 Documentation](#api-endpoints) · [⚡ Quickstart](#quickstart) · [🚀 Deployment](#deployment)

</div>

---

## 🌟 Overview

**LEGALENS** bridges the gap between intricate legal drafting and everyday decision-making. Designed with an editorial typography aesthetic, LEGALENS reads contracts, identifies high-risk covenants, answers domain-specific legal inquiries with verbatim grounding, and surfaces relevant judicial precedents.

Whether evaluating a residential lease, employment agreement, software master services contract, or custom uploaded document, LEGALENS delivers actionable clarity within seconds.

---

## 🚀 Key Features

- **📑 Interactive Document Analysis**: Clause-by-clause decomposition with categorized risk horizons (e.g. Caution, Notice horizons, Standard obligations).
- **🤖 Dual-Engine Conversational Assistant**:
  - Powered by **Google Gemini 2.5 Flash** (`@google/genai`) for deep synthetic reasoning.
  - Built-in **Grounded Local Intelligence Engine** providing instant verbatim citations and offline fallback.
- **🏛️ Case Law & Precedent Discovery**: Contextually matches contract clauses with landmark rulings and statutory provisions.
- **📂 LEGALENS Studio Workspace**:
  - Full-screen document interrogation suite.
  - Custom file ingestion (TXT, Markdown, Contracts) with automatic clause segmentation.
  - Multi-tab exploration: Extracted Clauses, Assistant, Precedents, and Report Export.
- **📥 Audit Report Generation**: Generates comprehensive intelligence summaries and download-ready reports.
- **🔒 Privacy by Design**: Zero permanent data storage; client-side grounded extraction with encrypted transient AI synthesis.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Lucide React, Motion
- **Styling**: Tailwind CSS v4, Google Fonts (Lora, Plus Jakarta Sans, JetBrains Mono)
- **Backend / Endpoints**: Express, Vite Dev Middleware Plugin, Node.js
- **AI & Reasoning**: Google Gen AI SDK (`@google/genai`), Gemini 2.5 Flash
- **Bundler & Tooling**: Vite 8, TypeScript 5.8, tsx

---

## 📡 API Endpoints

LEGALENS includes server-side endpoints accessible both via the Vite dev server and the production Express server:

### 1. Health & Status
```http
GET /api/health
```
**Response:**
```json
{
  "status": "healthy",
  "app": "LEGALENS AI Intelligence Platform",
  "version": "1.0.0",
  "geminiConfigured": true,
  "defaultModel": "gemini-2.5-flash",
  "uptimeSeconds": 142,
  "timestamp": "2026-09-24T11:00:00.000Z",
  "endpoints": [...]
}
```

### 2. Conversational Legal Assistant
```http
POST /api/chat
Content-Type: application/json
```
**Request Body:**
```json
{
  "message": "What is the penalty for early termination?",
  "docId": "residential-lease"
}
```
**Response:**
```json
{
  "id": "msg-1790247854453",
  "sender": "assistant",
  "timestamp": "04:34 pm",
  "text": "The agreement outlines termination conditions in Section 5. Specifically, either party may terminate by providing sixty (60) days' advance written notice...",
  "citations": [
    {
      "section": "Section 5",
      "page": 2,
      "title": "Early Termination & Transition Fee",
      "excerpt": "Either party may terminate this Agreement prior to expiration only upon delivering sixty (60) days' prior written notice..."
    }
  ],
  "attentionNote": "Contains clauses requiring careful advance notice.",
  "engine": "grounded-intelligence-v1"
}
```

### 3. Contract Analysis & Risk Scoring
```http
POST /api/analyze
Content-Type: application/json
```
**Request Body:**
```json
{
  "text": "Section 1. Rent is $2000 per month payable on the 1st.\n\nSection 2. Failure to pay will incur an immediate penalty of $100 and risk forfeiture of lease."
}
```
**Response:**
```json
{
  "documentTitle": "Uploaded Legal Document",
  "statistics": {
    "totalParagraphs": 2,
    "extractedClauses": 2,
    "highAttentionCount": 1
  },
  "riskProfile": {
    "rating": "MODERATE",
    "summary": "Identified 1 clauses with restrictive liabilities or forfeiture clauses requiring close scrutiny."
  },
  "clauses": [...]
}
```

---

## ⚡ Quickstart

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18+ or 20+ recommended)
- npm or pnpm

### 1. Clone the repository
```bash
git clone https://github.com/Ankitkumar06102005/legalens.git
cd legalens
```

### 2. Install dependencies
```bash
npm install
```

### 3. (Optional) Configure Gemini API Key
Create a `.env` file in the root directory:
```env
GEMINI_API_KEY="your-gemini-api-key-here"
```
*(If omitted, LEGALENS automatically uses its internal Grounded Intelligence Engine with 100% functionality).*

### 4. Start the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for production
```bash
npm run build
```

### 6. Run the production Express server
```bash
npm start
```

---

## 🚀 Deployment

### Option A: GitHub Pages (Automatic via GitHub Actions)
A preconfigured workflow is included at `.github/workflows/deploy.yml`.
1. Go to your repository on GitHub: `Settings` > `Pages`.
2. Under **Build and deployment** > **Source**, choose **GitHub Actions**.
3. Any push to `main` will build and publish your site automatically to:
   `https://ankitkumar06102005.github.io/legalens/`

### Option B: Vercel (1-Click Deployment)
A `vercel.json` configuration file is included.
1. Import the repository in [Vercel](https://vercel.com).
2. Framework preset: **Vite**.
3. Output directory: **dist**.
4. Click **Deploy**.

### Option C: Render / Railway / Cloud Run
Run the production server using the Dockerfile or:
```bash
npm run build
npm start
```

---

## ⚖️ Legal Disclaimer

LEGALENS is an informational and document-intelligence tool designed to enhance contract literacy. It does not provide legal advice, representation, or counsel. Consult a licensed attorney for formal legal matters.

---

## 📄 License

Licensed under the [Apache License, Version 2.0](LICENSE).
