import React, { useRef, useState } from 'react';
import axios from 'axios';
import DocumentViewer from './components/DocumentViewer';
import UploadForm from './components/UploadForm';
import SummaryPanel from './components/SummaryPanel';
import RiskChart from './components/RiskChart';
import ClauseTable from './components/ClauseTable';
import HeroVisual from './components/HeroVisual';

interface SummaryResponse {
  summary: string;
  key_points: string[];
  terminology: { term: string; short_def: string }[];
}

interface ClauseItem {
  clause_id: string;
  clause_type: string;
  text: string;
  start_index: number;
  end_index: number;
  risk_score: number;
  reason: string;
}

function App() {
  const [docText, setDocText] = useState<string>('');
  const [summary, setSummary] = useState<SummaryResponse | null>(null);
  const [clauses, setClauses] = useState<ClauseItem[]>([]);
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const clausePanelRef = useRef<HTMLDivElement | null>(null);

  const handleSummarize = async () => {
    if (!docText.trim()) return;
    setLoading('summarize');
    setError(null);
    try {
      const resp = await axios.post('/api/summarize', { text: docText });
      setSummary(resp.data);
    } catch (e: any) {
      setError(e?.response?.data?.error || 'Failed to summarize');
    } finally {
      setLoading(null);
    }
  };

  const handleHighlight = async () => {
    if (!docText.trim()) return;
    setLoading('highlight');
    setError(null);
    try {
      const resp = await axios.post('/api/highlight', { text: docText });
      setClauses(resp.data);
      // Bring the clauses section into view so it isn't hidden below the fold
      setTimeout(() => {
        clausePanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    } catch (e: any) {
      setError(e?.response?.data?.error || 'Failed to analyze clauses');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="main-layout">
      <div className="left-pane">
        <h2 className="dashboard-title" style={{ marginTop: 0 }}>Legal Dashboard</h2>
        <UploadForm onUploaded={(t)=>setDocText(t)} />

        <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
          <button onClick={handleSummarize} disabled={loading!==null}>
            {loading==='summarize' ? 'Summarizing...' : 'Generate Summary'}
          </button>
          <button onClick={handleHighlight} disabled={loading!==null}>
            {loading==='highlight' ? 'Analyzing...' : 'Analyze Clauses'}
          </button>
        </div>

        {error && (
          <div style={{ marginTop: 12, color: '#ff8080' }}>{error}</div>
        )}

        <div style={{ marginTop: 16 }} className="doc-box">
          <DocumentViewer text={docText} clauses={clauses} />
        </div>

      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16, padding: 18, overflowY: 'auto' }}>
        <HeroVisual />
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16 }}>
          <SummaryPanel data={summary} />
          <RiskChart clauses={clauses} />
        </div>
        <div ref={clausePanelRef}>
          <ClauseTable clauses={clauses} />
        </div>
      </div>
    </div>
  );
}

export default App;
