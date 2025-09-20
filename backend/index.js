require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// File upload configuration
const upload = multer({ 
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// GET version for quick browser testing: /api/translate?text=Hello&targetLanguage=es
app.get('/api/translate', async (req, res) => {
  try {
    const text = req.query.text;
    const targetLanguage = req.query.targetLanguage || req.query.target || req.query.lang;
    if (!text || !targetLanguage) {
      return res.status(400).json({
        error: 'Text and target language must be provided',
        usage: '/api/translate?text=Hello%20world&targetLanguage=es'
      });
    }
    
    // Demo mode mock response
    if (DEMO_MODE) {
      const mockTranslations = {
        'es': (text) => {
          const translations = {
            'This service agreement governs term, renewal, payment terms, confidentiality, liability caps, indemnification, data protection, assignment limits, and governing law.': 'Este acuerdo de servicio rige el término, renovación, términos de pago, confidencialidad, límites de responsabilidad, indemnización, protección de datos, límites de asignación y ley aplicable.',
            'Auto-renews yearly unless 30 days notice': 'Se renueva automáticamente cada año a menos que se notifique con 30 días de anticipación',
            'Fees due in 15 days; late fees may accrue': 'Tarifas vencidas en 15 días; pueden acumularse tarifas por retraso',
            'Confidentiality obligations last 3 years': 'Las obligaciones de confidencialidad duran 3 años',
            'Liability capped to last 6 months of fees': 'Responsabilidad limitada a los últimos 6 meses de tarifas',
            'Indemnity for misuse or legal violations': 'Indemnización por uso indebido o violaciones legales',
            'Indemnification': 'Indemnización',
            'A promise to cover losses or claims against another party.': 'Una promesa de cubrir pérdidas o reclamos contra otra parte.',
            'Confidential Information': 'Información Confidencial',
            'Non-public info a party must protect from disclosure.': 'Información no pública que una parte debe proteger de la divulgación.',
            'Auto-Renewal': 'Renovación Automática',
            'Contract renews automatically unless notice is given.': 'El contrato se renueva automáticamente a menos que se dé aviso.',
            'Limitation of Liability': 'Limitación de Responsabilidad',
            'A monetary cap on damages a party must pay.': 'Un límite monetario en los daños que una parte debe pagar.',
            'Governing Law': 'Ley Aplicable',
            'The jurisdiction\'s law that applies to the contract.': 'La ley de la jurisdicción que se aplica al contrato.'
          };
          return translations[text] || `[Traducido al español] ${text}`;
        },
        'fr': (text) => {
          const translations = {
            'This service agreement governs term, renewal, payment terms, confidentiality, liability caps, indemnification, data protection, assignment limits, and governing law.': 'Cet accord de service régit le terme, le renouvellement, les conditions de paiement, la confidentialité, les plafonds de responsabilité, l\'indemnisation, la protection des données, les limites d\'attribution et la loi applicable.',
            'Auto-renews yearly unless 30 days notice': 'Se renouvelle automatiquement chaque année sauf avis de 30 jours',
            'Fees due in 15 days; late fees may accrue': 'Frais dus dans 15 jours; des frais de retard peuvent s\'accumuler',
            'Confidentiality obligations last 3 years': 'Les obligations de confidentialité durent 3 ans',
            'Liability capped to last 6 months of fees': 'Responsabilité plafonnée aux 6 derniers mois de frais',
            'Indemnity for misuse or legal violations': 'Indemnité pour mauvaise utilisation ou violations légales'
          };
          return translations[text] || `[Traduit en français] ${text}`;
        },
        'de': (text) => {
          const translations = {
            'This service agreement governs term, renewal, payment terms, confidentiality, liability caps, indemnification, data protection, assignment limits, and governing law.': 'Diese Servicevereinbarung regelt Laufzeit, Verlängerung, Zahlungsbedingungen, Vertraulichkeit, Haftungsgrenzen, Schadloshaltung, Datenschutz, Zuweisungsgrenzen und geltendes Recht.',
            'Auto-renews yearly unless 30 days notice': 'Verlängert sich automatisch jährlich, es sei denn, 30 Tage im Voraus benachrichtigt',
            'Fees due in 15 days; late fees may accrue': 'Gebühren fällig in 15 Tagen; Verspätungsgebühren können anfallen',
            'Confidentiality obligations last 3 years': 'Vertraulichkeitsverpflichtungen dauern 3 Jahre',
            'Liability capped to last 6 months of fees': 'Haftung auf die letzten 6 Monate der Gebühren begrenzt',
            'Indemnity for misuse or legal violations': 'Schadloshaltung für Missbrauch oder Rechtsverletzungen'
          };
          return translations[text] || `[Ins Deutsche übersetzt] ${text}`;
        },
        'hi': (text) => `[हिंदी में अनुवादित] ${text}`,
        'ta': (text) => `[தமிழில் மொழிபெயர்க்கப்பட்டது] ${text}`,
        'te': (text) => `[తెలుగులో అనువదించబడింది] ${text}`,
        'mr': (text) => `[मराठीमध्ये भाषांतरित] ${text}`,
        'zh': (text) => `[中文翻译] ${text}`,
        'ja': (text) => `[日本語に翻訳] ${text}`
      };
      const translator = mockTranslations[targetLanguage];
      const translatedText = translator ? translator(text) : `[Demo Translation to ${targetLanguage}] ${text}`;
      
      return res.json({
        originalText: text,
        translatedText: translatedText,
        targetLanguage: targetLanguage,
        detectedSourceLanguage: 'en'
      });
    }
    
    const translation = await translateText(String(text), String(targetLanguage));
    res.json({
      originalText: text,
      translatedText: translation.translatedText,
      targetLanguage: targetLanguage,
      detectedSourceLanguage: translation.detectedSourceLanguage
    });
  } catch (error) {
    console.error('Translation error (GET):', error?.response?.data || error);
    const detail = error?.response?.data || { message: error?.message || 'Unknown error' };
    res.status(500).json({ error: 'Failed to translate text', detail });
  }
});

// Environment variables
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const GOOGLE_CLOUD_API_KEY = process.env.GOOGLE_CLOUD_API_KEY;
const GOOGLE_GEMINI_API_KEY = process.env.GOOGLE_GEMINI_API_KEY;
const LLM_PROVIDER = (process.env.LLM_PROVIDER || 'openai').toLowerCase(); // 'openai' | 'gemini'
const PORT = process.env.PORT || 8080;
const DEMO_MODE = String(process.env.DEMO_MODE || 'false').toLowerCase() === 'true';

// Ensure uploads directory exists
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Helper: robustly parse JSON from LLM responses (handles code fences and extra text)
function safeParseJson(text) {
  if (typeof text !== 'string') return { ok: false, error: 'Non-string response from LLM' };
  const original = text;
  // Strip common code fences
  text = text.trim();
  if (text.startsWith('```')) {
    // remove leading fence line
    text = text.replace(/^```(?:json|JSON)?\n?/i, '');
    // remove trailing fence
    text = text.replace(/\n?```\s*$/, '');
  }
  // Try direct parse first
  try {
    return { ok: true, value: JSON.parse(text) };
  } catch (_) {}
  // Attempt to extract the first balanced JSON object/array
  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');
  const firstBracket = text.indexOf('[');
  const lastBracket = text.lastIndexOf(']');
  let candidate = '';
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    candidate = text.slice(firstBrace, lastBrace + 1);
  } else if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
    candidate = text.slice(firstBracket, lastBracket + 1);
  }
  if (candidate) {
    try {
      return { ok: true, value: JSON.parse(candidate) };
    } catch (_) {}
  }
  // Give up, return helpful snippet
  const snippet = (original || '').slice(0, 400);
  return { ok: false, error: 'Failed to parse JSON from LLM response', snippet };
}

// Helper function to call OpenAI API
async function callOpenAI(messages, maxTokens = 1000) {
  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-4o-mini',
      messages: messages,
      max_tokens: maxTokens,
      temperature: 0.1
    }, {
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API Error:', error.response?.data || error.message);
    throw new Error('Failed to process with OpenAI API');
  }
}

// Helper function to call Google Gemini API (Generative Language)
// We will collapse system+user messages into a single prompt text, preserving role labels.
async function callGemini(messages, maxTokens = 1000) {
  if (!GOOGLE_GEMINI_API_KEY) {
    throw new Error('GOOGLE_GEMINI_API_KEY not set');
  }
  try {
    const model = 'gemini-1.5-flash-latest';
    const promptText = messages.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n\n');
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GOOGLE_GEMINI_API_KEY}`;
    const resp = await axios.post(url, {
      contents: [
        {
          role: 'user',
          parts: [{ text: promptText }]
        }
      ],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: maxTokens
      }
    }, {
      headers: { 'Content-Type': 'application/json' }
    });
    const candidates = resp.data?.candidates || [];
    const text = candidates[0]?.content?.parts?.[0]?.text || '';
    if (!text) throw new Error('Empty response from Gemini');
    return text;
  } catch (error) {
    console.error('Gemini API Error:', error.response?.data || error.message);
    throw new Error('Failed to process with Google Gemini API');
  }
}

// Unified LLM dispatcher
async function callLLM(messages, maxTokens = 1000) {
  if (LLM_PROVIDER === 'gemini') {
    return callGemini(messages, maxTokens);
  }
  return callOpenAI(messages, maxTokens);
}

// Helper function to call Google Translate API
async function translateText(text, targetLanguage) {
  try {
    const response = await axios.post(
      `https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_CLOUD_API_KEY}`,
      {
        q: text,
        target: targetLanguage,
        format: 'text'
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    return response.data.data.translations[0];
  } catch (error) {
    console.error('Google Translate API Error:', error.response?.data || error.message);
    // Re-throw the original error so the route handler can include detailed diagnostics
    throw error;
  }
}

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    hasOpenAI: !!OPENAI_API_KEY,
    hasGoogleCloud: !!GOOGLE_CLOUD_API_KEY,
    hasGemini: !!GOOGLE_GEMINI_API_KEY,
    llmProvider: LLM_PROVIDER,
    demoMode: DEMO_MODE
  });
});

// File upload and text extraction
app.post('/api/upload', upload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    let extractedText = '';

    if (req.file.mimetype === 'application/pdf') {
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(dataBuffer);
      extractedText = pdfData.text;
    } else if (req.file.mimetype === 'text/plain') {
      extractedText = fs.readFileSync(filePath, 'utf8');
    } else {
      return res.status(400).json({ error: 'Unsupported file type. Please upload PDF or TXT files.' });
    }

    // Clean up uploaded file
    fs.unlinkSync(filePath);

    res.json({
      success: true,
      text: extractedText,
      filename: req.file.originalname,
      wordCount: extractedText.split(/\s+/).length
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to process uploaded file' });
  }
});

// Document summarization
app.post('/api/summarize', async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'No text provided' });
    }
    // Demo mode mock response
    if (DEMO_MODE) {
      return res.json({
        summary: 'This service agreement governs term, renewal, payment terms, confidentiality, liability caps, indemnification, data protection, assignment limits, and governing law.',
        key_points: [
          'Auto-renews yearly unless 30 days notice',
          'Fees due in 15 days; late fees may accrue',
          'Confidentiality obligations last 3 years',
          'Liability capped to last 6 months of fees',
          'Indemnity for misuse or legal violations'
        ],
        terminology: [
          { term: 'Indemnification', short_def: 'A promise to cover losses or claims against another party.' },
          { term: 'Confidential Information', short_def: 'Non-public info a party must protect from disclosure.' },
          { term: 'Auto-Renewal', short_def: 'Contract renews automatically unless notice is given.' },
          { term: 'Limitation of Liability', short_def: 'A monetary cap on damages a party must pay.' },
          { term: 'Governing Law', short_def: 'The jurisdiction’s law that applies to the contract.' }
        ]
      });
    }

    const systemPrompt = {
      role: 'system',
      content: `You are a concise legal assistant focused on converting legal documents into plain-language summaries. Return results as strict JSON with these fields: {
        "summary": string,            // 2-6 bullet sentences in plain English
        "key_points": [string],      // array of 5-8 short bullets (each <= 20 words)
        "terminology": [{"term":string,"short_def":string}] // 5 important legal terms from the doc
      }
      Do not include additional commentary.`
    };

    const userPrompt = {
      role: 'user',
      content: `Document: ${text}

      Produce:
      - a concise summary (2–6 sentences) in plain English,
      - 5–8 key points,
      - 5 legal terms with a one-line plain-English definition each.

      Return JSON only.`
    };

    const response = await callLLM([systemPrompt, userPrompt], 1200);
    const parsed = safeParseJson(response);
    if (!parsed.ok) {
      console.error('Summarization JSON parse failed:', parsed.error, parsed.snippet);
      return res.status(502).json({ error: 'Model returned invalid JSON', detail: parsed.error, snippet: parsed.snippet });
    }
    
    res.json(parsed.value);

  } catch (error) {
    console.error('Summarization error:', error);
    res.status(500).json({ error: 'Failed to generate summary' });
  }
});

// Clause analysis and risk highlighting
app.post('/api/highlight', async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'No text provided' });
    }
    // Demo mode mock response
    if (DEMO_MODE) {
      const sample = [
        {
          clause_id: 'c1',
          clause_type: 'Termination',
          text: 'renews automatically for successive one (1) year terms unless either party provides thirty (30) days prior written notice',
          start_index: Math.max(0, String(text).toLowerCase().indexOf('renews automatically')),
          end_index: Math.max(0, String(text).toLowerCase().indexOf('renews automatically')) + 120,
          risk_score: 55,
          reason: 'Auto-renewal with short notice can surprise users'
        },
        {
          clause_id: 'c2',
          clause_type: 'Payment',
          text: 'Late payments accrue interest at 1.5% per month',
          start_index: Math.max(0, String(text).toLowerCase().indexOf('late payments')),
          end_index: Math.max(0, String(text).toLowerCase().indexOf('late payments')) + 55,
          risk_score: 45,
          reason: 'Interest penalty may be high for consumers'
        },
        {
          clause_id: 'c3',
          clause_type: 'Liability',
          text: 'IN NO EVENT SHALL EITHER PARTY BE LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES',
          start_index: Math.max(0, String(text).toLowerCase().indexOf('in no event shall')),
          end_index: Math.max(0, String(text).toLowerCase().indexOf('in no event shall')) + 110,
          risk_score: 65,
          reason: 'Broad limitation reduces recoverable damages'
        }
      ];
      return res.json(sample.filter(x => x.start_index >= 0));
    }

    const systemPrompt = {
      role: 'system',
      content: `You are a legal clause analyzer. For each clause in the document, identify clause text spans, classify clause type from a fixed list, and assign a risk_score 0-100 with brief reason. Return strict JSON array of objects with fields:
      {
        "clause_id": string,         // unique id
        "clause_type": string,       // one of: Termination, Payment, Liability, Confidentiality, Indemnity, Jurisdiction, Assignment, Warranty, DataProtection, Other
        "text": string,              // clause text
        "start_index": int,          // char offset in document
        "end_index": int,            // char offset in document
        "risk_score": int,           // 0 (low) - 100 (high)
        "reason": string             // short plain-English justification for the score (<= 30 words)
      }
      Return JSON only. If a clause crosses pages, that's fine.`
    };

    const userPrompt = {
      role: 'user',
      content: `Analyze the following contract: ${text}.

      Extract clauses and return a JSON array as specified by the system prompt. Use conservative risk scoring for consumer-facing contracts; higher scores for unusual penalties, automatic renewals, unilateral changes, broad liability shifts, or ambiguous language. Return JSON only.`
    };

    const response = await callLLM([systemPrompt, userPrompt], 1500);
    const parsed = safeParseJson(response);
    if (!parsed.ok) {
      console.error('Clause analysis JSON parse failed:', parsed.error, parsed.snippet);
      return res.status(502).json({ error: 'Model returned invalid JSON', detail: parsed.error, snippet: parsed.snippet });
    }
    
    res.json(parsed.value);

  } catch (error) {
    console.error('Clause analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze clauses' });
  }
});

// Clause comparison
app.post('/api/compare', async (req, res) => {
  try {
    const { clauseA, clauseB } = req.body;
    
    if (!clauseA || !clauseB) {
      return res.status(400).json({ error: 'Both clauses must be provided' });
    }
    // Demo mode mock response
    if (DEMO_MODE) {
      return res.json({
        clause_a: { text: clauseA },
        clause_b: { text: clauseB },
        differences: [
          { type: 'wording', detail: 'Clause A has stricter payment terms (15 days) vs Clause B (30 days).' },
          { type: 'substantive', detail: 'Clause B omits a cure period language found in Clause A.' }
        ],
        impact_summary: 'Clause A is more favorable to the provider (faster payments, clearer cure). Clause B more lenient to customer.',
        safer_alternative: 'Payments due within 30 days of invoice; include a 10-day cure period before suspension or termination.'
      });
    }

    const systemPrompt = {
      role: 'system',
      content: `You are a clause comparison engine. Input will contain two clause texts. Return strict JSON:
      {
        "clause_a": { "text": string },
        "clause_b": { "text": string },
        "differences": [ {"type":"substantive"|"wording"|"omission","detail":string} ],
        "impact_summary": string,   // 1-2 sentences explaining user-facing risk difference
        "safer_alternative": string  // recommended plain-English clause to reduce risk
      }
      Return JSON only.`
    };

    const userPrompt = {
      role: 'user',
      content: `Compare clause A and clause B.

      Clause A: ${clauseA}
      Clause B: ${clauseB}

      Return JSON per system prompt. Focus on rights and obligations, payment, termination, penalties, and notice periods.`
    };

    const response = await callLLM([systemPrompt, userPrompt], 1000);
    const parsed = safeParseJson(response);
    if (!parsed.ok) {
      console.error('Clause comparison JSON parse failed:', parsed.error, parsed.snippet);
      return res.status(502).json({ error: 'Model returned invalid JSON', detail: parsed.error, snippet: parsed.snippet });
    }
    
    res.json(parsed.value);

  } catch (error) {
    console.error('Clause comparison error:', error);
    res.status(500).json({ error: 'Failed to compare clauses' });
  }
});

// Translation endpoint
app.post('/api/translate', async (req, res) => {
  try {
    const { text, targetLanguage } = req.body;
    
    if (!text || !targetLanguage) {
      return res.status(400).json({ error: 'Text and target language must be provided' });
    }

    // Demo mode mock response
    if (DEMO_MODE) {
      const mockTranslations = {
        'es': (text) => {
          const translations = {
            'This service agreement governs term, renewal, payment terms, confidentiality, liability caps, indemnification, data protection, assignment limits, and governing law.': 'Este acuerdo de servicio rige el término, renovación, términos de pago, confidencialidad, límites de responsabilidad, indemnización, protección de datos, límites de asignación y ley aplicable.',
            'Auto-renews yearly unless 30 days notice': 'Se renueva automáticamente cada año a menos que se notifique con 30 días de anticipación',
            'Fees due in 15 days; late fees may accrue': 'Tarifas vencidas en 15 días; pueden acumularse tarifas por retraso',
            'Confidentiality obligations last 3 years': 'Las obligaciones de confidencialidad duran 3 años',
            'Liability capped to last 6 months of fees': 'Responsabilidad limitada a los últimos 6 meses de tarifas',
            'Indemnity for misuse or legal violations': 'Indemnización por uso indebido o violaciones legales',
            'Indemnification': 'Indemnización',
            'A promise to cover losses or claims against another party.': 'Una promesa de cubrir pérdidas o reclamos contra otra parte.',
            'Confidential Information': 'Información Confidencial',
            'Non-public info a party must protect from disclosure.': 'Información no pública que una parte debe proteger de la divulgación.',
            'Auto-Renewal': 'Renovación Automática',
            'Contract renews automatically unless notice is given.': 'El contrato se renueva automáticamente a menos que se dé aviso.',
            'Limitation of Liability': 'Limitación de Responsabilidad',
            'A monetary cap on damages a party must pay.': 'Un límite monetario en los daños que una parte debe pagar.',
            'Governing Law': 'Ley Aplicable',
            'The jurisdiction\'s law that applies to the contract.': 'La ley de la jurisdicción que se aplica al contrato.'
          };
          return translations[text] || `[Traducido al español] ${text}`;
        },
        'fr': (text) => {
          const translations = {
            'This service agreement governs term, renewal, payment terms, confidentiality, liability caps, indemnification, data protection, assignment limits, and governing law.': 'Cet accord de service régit le terme, le renouvellement, les conditions de paiement, la confidentialité, les plafonds de responsabilité, l\'indemnisation, la protection des données, les limites d\'attribution et la loi applicable.',
            'Auto-renews yearly unless 30 days notice': 'Se renouvelle automatiquement chaque année sauf avis de 30 jours',
            'Fees due in 15 days; late fees may accrue': 'Frais dus dans 15 jours; des frais de retard peuvent s\'accumuler',
            'Confidentiality obligations last 3 years': 'Les obligations de confidentialité durent 3 ans',
            'Liability capped to last 6 months of fees': 'Responsabilité plafonnée aux 6 derniers mois de frais',
            'Indemnity for misuse or legal violations': 'Indemnité pour mauvaise utilisation ou violations légales'
          };
          return translations[text] || `[Traduit en français] ${text}`;
        },
        'de': (text) => {
          const translations = {
            'This service agreement governs term, renewal, payment terms, confidentiality, liability caps, indemnification, data protection, assignment limits, and governing law.': 'Diese Servicevereinbarung regelt Laufzeit, Verlängerung, Zahlungsbedingungen, Vertraulichkeit, Haftungsgrenzen, Schadloshaltung, Datenschutz, Zuweisungsgrenzen und geltendes Recht.',
            'Auto-renews yearly unless 30 days notice': 'Verlängert sich automatisch jährlich, es sei denn, 30 Tage im Voraus benachrichtigt',
            'Fees due in 15 days; late fees may accrue': 'Gebühren fällig in 15 Tagen; Verspätungsgebühren können anfallen',
            'Confidentiality obligations last 3 years': 'Vertraulichkeitsverpflichtungen dauern 3 Jahre',
            'Liability capped to last 6 months of fees': 'Haftung auf die letzten 6 Monate der Gebühren begrenzt',
            'Indemnity for misuse or legal violations': 'Schadloshaltung für Missbrauch oder Rechtsverletzungen'
          };
          return translations[text] || `[Ins Deutsche übersetzt] ${text}`;
        },
        'hi': (text) => `[हिंदी में अनुवादित] ${text}`,
        'ta': (text) => `[தமிழில் மொழிபெயர்க்கப்பட்டது] ${text}`,
        'te': (text) => `[తెలుగులో అనువదించబడింది] ${text}`,
        'mr': (text) => `[मराठीमध्ये भाषांतरित] ${text}`,
        'zh': (text) => `[中文翻译] ${text}`,
        'ja': (text) => `[日本語に翻訳] ${text}`
      };
      const translator = mockTranslations[targetLanguage];
      const translatedText = translator ? translator(text) : `[Demo Translation to ${targetLanguage}] ${text}`;
      
      return res.json({
        originalText: text,
        translatedText: translatedText,
        targetLanguage: targetLanguage,
        detectedSourceLanguage: 'en'
      });
    }

    const translation = await translateText(text, targetLanguage);
    
    res.json({
      originalText: text,
      translatedText: translation.translatedText,
      targetLanguage: targetLanguage,
      detectedSourceLanguage: translation.detectedSourceLanguage
    });

  } catch (error) {
    console.error('Translation error:', error?.response?.data || error);
    const detail = error?.response?.data || { message: error?.message || 'Unknown error' };
    res.status(500).json({ error: 'Failed to translate text', detail });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 LegalLens backend server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  
  if (!OPENAI_API_KEY) {
    console.warn('⚠️  OPENAI_API_KEY not found in environment variables');
  }
  
  if (!GOOGLE_CLOUD_API_KEY) {
    console.warn('⚠️  GOOGLE_CLOUD_API_KEY not found in environment variables');
  }
  if (!GOOGLE_GEMINI_API_KEY && LLM_PROVIDER === 'gemini') {
    console.warn('⚠️  GOOGLE_GEMINI_API_KEY not found but LLM_PROVIDER is set to gemini');
  }
});

module.exports = app;
