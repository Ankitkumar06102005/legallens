import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { handleHealthCheck, handleChatRequest, handleAnalyzeRequest } from './src/server/apiHandler';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// CORS & security headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// API Routes
app.get('/api/health', async (req: Request, res: Response) => {
  try {
    const data = await handleHealthCheck();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Health check failed' });
  }
});

app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const data = await handleChatRequest(req.body);
    res.json(data);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to process chat query' });
  }
});

app.post('/api/analyze', async (req: Request, res: Response) => {
  try {
    const data = await handleAnalyzeRequest(req.body);
    res.json(data);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to analyze document' });
  }
});

// Serve static frontend assets from dist in production
const distPath = path.resolve(__dirname, 'dist');
app.use(express.static(distPath));

// SPA Fallback
app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`[LEGALENS Server] Running on http://localhost:${PORT}`);
  console.log(`[LEGALENS Server] API Endpoints: /api/health, /api/chat, /api/analyze`);
});
