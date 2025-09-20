import React, { useMemo, useState } from 'react';
import axios from 'axios';

interface SummaryResponse {
  summary: string;
  key_points: string[];
  terminology: { term: string; short_def: string }[];
}

export default function SummaryPanel({ data }: { data: SummaryResponse | null }) {
  const [lang, setLang] = useState('en');
  const [translating, setTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [translated, setTranslated] = useState<{
    summary?: string;
    key_points?: string[];
    terminology?: { term: string; short_def: string }[];
  } | null>(null);

  const summaryText = useMemo(() => translated?.summary || data?.summary || '', [translated, data]);
  const keyPoints = useMemo(() => translated?.key_points || data?.key_points || [], [translated, data]);
  const terminology = useMemo(() => translated?.terminology || data?.terminology || [], [translated, data]);

  const speak = (text: string, langCode: string) => {
    if (!('speechSynthesis' in window)) return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = langCode;
    utter.rate = 1;
    utter.pitch = 1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  };

  const doTranslate = async () => {
    if (!data) return;
    setTranslating(true);
    setError(null);
    try {
      if (lang === 'en') {
        setTranslated(null);
        return;
      }

      // Translate summary
      const summaryResp = await axios.post('/api/translate', { text: data.summary, targetLanguage: lang });
      const translatedSummary = summaryResp.data.translatedText || '';

      // Translate key points
      const translatedKeyPoints = await Promise.all(
        data.key_points.map(async (point) => {
          const resp = await axios.post('/api/translate', { text: point, targetLanguage: lang });
          return resp.data.translatedText || point;
        })
      );

      // Translate terminology
      const translatedTerminology = await Promise.all(
        data.terminology.map(async (term) => {
          const termResp = await axios.post('/api/translate', { text: term.term, targetLanguage: lang });
          const defResp = await axios.post('/api/translate', { text: term.short_def, targetLanguage: lang });
          return {
            term: termResp.data.translatedText || term.term,
            short_def: defResp.data.translatedText || term.short_def
          };
        })
      );

      setTranslated({
        summary: translatedSummary,
        key_points: translatedKeyPoints,
        terminology: translatedTerminology
      });
    } catch (e: any) {
      const detail = e?.response?.data?.detail;
      if (detail && typeof detail === 'object') {
        const msg = detail?.error?.message || detail?.message || JSON.stringify(detail);
        setError(msg);
      } else {
        setError(e?.response?.data?.error || 'Translation failed');
      }
    } finally {
      setTranslating(false);
    }
  };

  return (
    <div className="panel summary-panel">
      <div className="panel-head">
        <h3 className="panel-title">Summary</h3>
        <div className="inline-controls">
          <select value={lang} onChange={(e)=>setLang(e.target.value)} title="Target language">
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            <option value="hi">Hindi</option>
            <option value="ta">Tamil</option>
            <option value="te">Telugu</option>
            <option value="mr">Marathi</option>
            <option value="zh">Chinese</option>
            <option value="ja">Japanese</option>
          </select>
          <button onClick={doTranslate} disabled={!data || translating}>{translating ? 'Translating...' : 'Translate'}</button>
          <button onClick={()=> summaryText && speak(summaryText, lang)} disabled={!summaryText}>Speak</button>
        </div>
      </div>

      {error && <div className="error-text">{error}</div>}

      {data ? (
        <div className="summary-grid">
          <div className="card">
            <h4>Overview</h4>
            <p className="summary-text">{summaryText}</p>
          </div>
          <div className="card">
            <h4>Key Points</h4>
            <ul className="bullets">
              {keyPoints.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          </div>
          <div className="card">
            <h4>Terminology</h4>
            <ul className="terms">
              {terminology.map((t, i) => (
                <li key={i}><strong>{t.term}:</strong> {t.short_def}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div className="placeholder">No summary yet. Click "Generate Summary".</div>
      )}
    </div>
  );
}
