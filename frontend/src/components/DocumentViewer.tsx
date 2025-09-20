import React from 'react';

interface ClauseItem {
  clause_id: string;
  clause_type: string;
  text: string;
  start_index: number;
  end_index: number;
  risk_score: number;
  reason: string;
}

export default function DocumentViewer({ text, clauses }: { text: string; clauses: ClauseItem[] }) {
  return (
    <div className="document-viewer">
      <h4>Document</h4>
      <div className="doc-text" style={{ whiteSpace: 'pre-wrap', padding: 12, borderRadius: 8, maxHeight: 400, overflowY: 'auto' }}>
        {renderHighlighted(text, clauses)}
      </div>
    </div>
  );
}

function renderHighlighted(text: string, clauses: ClauseItem[]) {
  if (!text) return <div>No document</div>;
  const sorted = (clauses || []).slice().sort((a,b)=>a.start_index - b.start_index);
  const fragments: React.ReactNode[] = [];
  let cursor = 0;
  for (const c of sorted) {
    const before = text.slice(cursor, c.start_index);
    if (before) fragments.push(<span key={`b-${cursor}`}>{before}</span>);
    const highlighted = text.slice(c.start_index, c.end_index);
    fragments.push(
      <mark key={c.clause_id} style={{ background: riskColor(c.risk_score) }} title={`${c.clause_type}: ${c.reason}`}>
        {highlighted}
      </mark>
    );
    cursor = c.end_index;
  }
  const tail = text.slice(cursor);
  if (tail) fragments.push(<span key="tail">{tail}</span>);
  return fragments;
}

function riskColor(score: number) {
  if (score >= 70) return 'rgba(255,80,80,0.4)';
  if (score >= 40) return 'rgba(255,200,80,0.3)';
  return 'rgba(120,255,120,0.2)';
}
