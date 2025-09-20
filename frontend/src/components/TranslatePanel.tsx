import React, { useState } from 'react';
import axios from 'axios';

export default function TranslatePanel() {
  const [text, setText] = useState('Hello world');
  const [target, setTarget] = useState('es');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const onTranslate = async () => {
    if (!text.trim() || !target.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const resp = await axios.post('/api/translate', { text, targetLanguage: target });
      setResult(resp.data.translatedText || resp.data.translated_text || JSON.stringify(resp.data));
    } catch (e: any) {
      setError(e?.response?.data?.error || 'Translate failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: '#fff', padding: 12, borderRadius: 8 }}>
      <h4 style={{ marginTop: 0 }}>Translate (server-side)</h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Text to translate"
          rows={3}
          style={{ width: '100%' }}
        />
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <label htmlFor="target">Target lang (ISO):</label>
          <input id="target" value={target} onChange={(e) => setTarget(e.target.value)} placeholder="e.g., es, fr, de" />
          <button onClick={onTranslate} disabled={loading}>
            {loading ? 'Translating...' : 'Translate'}
          </button>
        </div>
        {error && <div style={{ color: '#b00020' }}>{error}</div>}
        {result && (
          <div style={{ background: '#f6f6f6', padding: 8, borderRadius: 6 }}>
            <strong>Result:</strong>
            <div>{result}</div>
          </div>
        )}
      </div>
    </div>
  );
}
