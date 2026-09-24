import { GoogleGenAI } from '@google/genai';
import { SAMPLE_DOCUMENTS, LegalDocument } from '../data/sampleDocuments.ts';
import { generateAssistantResponse } from '../services/aiAssistantService.ts';

export interface ChatRequestBody {
  message: string;
  docId?: string;
  docTitle?: string;
  docContext?: string;
}

export interface AnalyzeRequestBody {
  text: string;
  title?: string;
}

export async function handleHealthCheck() {
  const hasKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY');
  return {
    status: 'healthy',
    app: 'LEGALENS AI Intelligence Platform',
    version: '1.0.0',
    geminiConfigured: hasKey,
    defaultModel: 'gemini-2.5-flash',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    endpoints: [
      { method: 'GET', path: '/api/health', description: 'System health, status, and Gemini configuration' },
      { method: 'POST', path: '/api/chat', description: 'Grounded legal question answering with Gemini + fallback' },
      { method: 'POST', path: '/api/analyze', description: 'Automated contract clause parsing and risk scoring' }
    ]
  };
}

export async function handleChatRequest(body: ChatRequestBody) {
  const { message, docId, docTitle, docContext } = body;
  if (!message || typeof message !== 'string') {
    throw new Error('Message is required');
  }

  // Find corresponding document from sample documents or construct lightweight context
  const matchedDoc = SAMPLE_DOCUMENTS.find(d => d.id === docId) || SAMPLE_DOCUMENTS[0];
  const targetDoc: LegalDocument = docContext ? {
    ...matchedDoc,
    title: docTitle || matchedDoc.title,
    fullText: docContext
  } : matchedDoc;

  const apiKey = process.env.GEMINI_API_KEY;
  const isKeyValid = apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.length > 5;

  if (isKeyValid) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `You are LEGALENS, an elite legal document analysis intelligence assistant.
Your task is to answer the user's question with surgical precision, strictly grounded in the document context below.

DOCUMENT TITLE: ${targetDoc.title}
DOCUMENT CLAUSES:
${targetDoc.clauses.map(c => `[${c.section}: ${c.title}] (Page ${c.page}): "${c.excerpt}"\nPlain Meaning: ${c.plainExplanation}\nImplication: ${c.implication}`).join('\n\n')}

FULL TEXT (EXCERPT):
${targetDoc.fullText.slice(0, 3000)}

USER QUESTION: "${message}"

INSTRUCTIONS:
1. Provide a direct, crystal-clear, plain-language answer explaining what the document stipulates.
2. Highlight exact clause/section references and page numbers.
3. If there are risks, notice horizons, or forfeiture conditions, state them clearly.
4. Output your answer in JSON format with these exact keys:
{
  "text": "Clear explanation of the answer",
  "citations": [
    {
      "section": "Section number or name",
      "page": 1,
      "title": "Clause title",
      "excerpt": "Verbatim short quote"
    }
  ],
  "attentionNote": "Short risk alert if applicable, or null"
}
Output only valid JSON.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const responseText = response.text || '';
      try {
        const parsed = JSON.parse(responseText);
        return {
          id: 'gemini-' + Date.now(),
          sender: 'assistant' as const,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: parsed.text || responseText,
          citations: parsed.citations || [],
          attentionNote: parsed.attentionNote || undefined,
          engine: 'gemini-2.5-flash'
        };
      } catch {
        return {
          id: 'gemini-' + Date.now(),
          sender: 'assistant' as const,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: responseText,
          citations: [],
          engine: 'gemini-2.5-flash'
        };
      }
    } catch (err) {
      console.warn('Gemini API call failed, falling back to local grounded reasoning engine:', err);
    }
  }

  // Graceful local grounded fallback
  const localResponse = generateAssistantResponse(message, targetDoc);
  return {
    ...localResponse,
    engine: 'grounded-intelligence-v1'
  };
}

export async function handleAnalyzeRequest(body: AnalyzeRequestBody) {
  const { text, title = 'Uploaded Legal Document' } = body;
  if (!text || typeof text !== 'string') {
    throw new Error('Document text is required for analysis');
  }

  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 25);
  
  const clauses = paragraphs.slice(0, 10).map((p, idx) => {
    const cleanP = p.trim();
    const firstSentence = cleanP.split('.')[0] || `Clause ${idx + 1}`;
    const isCaution = /terminat|liab|penalty|forfeit|breach|indemn|default|surrender/i.test(cleanP);
    const isNotice = /notice|written|prior|calendar days|within/i.test(cleanP);
    const isObligation = /shall|must|agrees to|responsible|repair|maintain/i.test(cleanP);

    const category = idx === 0 
      ? 'Key Terms' 
      : isCaution 
      ? 'Risks & Conditions' 
      : isObligation 
      ? 'Obligations' 
      : 'Covenants';

    const attentionLevel = isCaution ? 'caution' : isNotice ? 'notice' : 'standard';

    return {
      id: `analyzed-clause-${idx + 1}`,
      number: String(idx + 1).padStart(2, '0'),
      title: firstSentence.slice(0, 48) + (firstSentence.length > 48 ? '...' : ''),
      section: `Section ${idx + 1}`,
      page: Math.floor(idx / 3) + 1,
      category,
      excerpt: cleanP.slice(0, 220) + (cleanP.length > 220 ? '...' : ''),
      plainExplanation: `Operative clause specifying terms for: ${firstSentence}. Defines obligations and party requirements.`,
      implication: isCaution 
        ? 'High-priority provision: verify legal liabilities, timelines, or penalty triggers prior to execution.' 
        : 'Standard affirmative covenant binding both parties.',
      attentionLevel,
      partiesAffected: ['Signatories']
    };
  });

  const highRiskCount = clauses.filter(c => c.attentionLevel === 'caution').length;
  const noticeCount = clauses.filter(c => c.attentionLevel === 'notice').length;

  return {
    documentTitle: title,
    timestamp: new Date().toISOString(),
    statistics: {
      totalParagraphs: paragraphs.length,
      extractedClauses: clauses.length,
      highAttentionCount: highRiskCount,
      noticeRequirementsCount: noticeCount,
      estimatedReadingTimeMinutes: Math.max(1, Math.ceil(text.split(/\s+/).length / 200))
    },
    riskProfile: {
      rating: highRiskCount > 2 ? 'ELEVATED_ATTENTION' : highRiskCount > 0 ? 'MODERATE' : 'STANDARD',
      summary: highRiskCount > 0 
        ? `Identified ${highRiskCount} clauses with restrictive liabilities or forfeiture clauses requiring close scrutiny.` 
        : 'No disproportionate liability clauses detected.'
    },
    clauses
  };
}
