import React, { useState } from 'react';
import axios from 'axios';

interface ClauseItem {
  clause_id: string;
  clause_type: string;
  text: string;
  start_index: number;
  end_index: number;
  risk_score: number;
  reason: string;
}

export default function ClauseTable({ clauses }: { clauses: ClauseItem[] }) {
  const [lang, setLang] = useState('en');
  const [translating, setTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [translatedClauses, setTranslatedClauses] = useState<{[key: string]: {text: string, reason: string}}>({});

  const doTranslate = async () => {
    if (!clauses || clauses.length === 0) return;
    setTranslating(true);
    setError(null);
    try {
      if (lang === 'en') {
        setTranslatedClauses({});
        return;
      }

      const translations: {[key: string]: {text: string, reason: string}} = {};
      
      for (const clause of clauses) {
        const [textResp, reasonResp] = await Promise.all([
          axios.post('/api/translate', { text: clause.text, targetLanguage: lang }),
          axios.post('/api/translate', { text: clause.reason, targetLanguage: lang })
        ]);
        
        translations[clause.clause_id] = {
          text: textResp.data.translatedText || clause.text,
          reason: reasonResp.data.translatedText || clause.reason
        };
      }
      
      setTranslatedClauses(translations);
    } catch (e: any) {
      setError(e?.response?.data?.error || 'Translation failed');
    } finally {
      setTranslating(false);
    }
  };
  return (
    <div className="panel">
      <div className="panel-head">
        <h3 className="panel-title">Clauses</h3>
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
          <button onClick={doTranslate} disabled={!clauses || clauses.length === 0 || translating}>
            {translating ? 'Translating...' : 'Translate'}
          </button>
        </div>
      </div>
      
      {error && <div className="error-text">{error}</div>}
      
      {clauses && clauses.length ? (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Risk</th>
                <th>Excerpt</th>
                <th>Reason</th>
              </tr>
            </thead>
            <tbody>
              {clauses.map(c => {
                const translation = translatedClauses[c.clause_id];
                return (
                  <tr key={c.clause_id}>
                    <td>{c.clause_type}</td>
                    <td>
                      <span className={`risk-pill ${c.risk_score>=70?'high':c.risk_score>=40?'med':'low'}`}>{c.risk_score}</span>
                    </td>
                    <td className="excerpt">{translation?.text || c.text}</td>
                    <td className="reason">{translation?.reason || c.reason}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="placeholder">No analysis yet. Click "Analyze Clauses".</div>
      )}
    </div>
  );
}
