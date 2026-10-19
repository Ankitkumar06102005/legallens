import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Activity, AlertCircle, ArrowRight, Bell, BookOpen, CheckCircle2, FileText,
  FolderOpen, Gauge, MessageCircle, MoreHorizontal, Plus, Search, Send, Settings,
  ShieldCheck, Sparkles, X, Scale, Menu
} from 'lucide-react';
import { SAMPLE_DOCUMENTS, LegalDocument, LegalClause } from '../data/sampleDocuments';
import { AssistantMessage, askAssistantAsync, generateAssistantResponse } from '../services/aiAssistantService';

type View = 'overview' | 'documents' | 'assistant' | 'precedents' | 'analytics' | 'settings';

const navItems: { id: View; label: string; icon: React.ElementType }[] = [
  { id: 'overview', label: 'Dashboard', icon: Gauge },
  { id: 'documents', label: 'Documents', icon: FileText },
  { id: 'assistant', label: 'Legal assistant', icon: MessageCircle },
  { id: 'precedents', label: 'Precedents', icon: BookOpen },
  { id: 'analytics', label: 'Insights', icon: Activity },
  { id: 'settings', label: 'Settings', icon: Settings },
];

function getRiskCount(doc: LegalDocument) {
  return doc.clauses.filter((clause) => clause.attentionLevel === 'caution').length;
}

function makeUploadedDocument(fileName: string, text: string): LegalDocument {
  const paragraphs = text.split(/\n\s*\n/).map((p) => p.trim()).filter((p) => p.length > 30);
  const clauses: LegalClause[] = paragraphs.slice(0, 30).map((paragraph, index) => {
    const firstSentence = paragraph.split(/[.!?]/)[0]?.trim() || `Section ${index + 1}`;
    const risk = /terminat|liabilit|damag|forfeit|penalty|indemn|waiv|arbitration|automatic renewal/i.test(paragraph);
    return {
      id: `upload-${index + 1}`,
      number: String(index + 1).padStart(2, '0'),
      title: firstSentence.slice(0, 64) || `Extracted section ${index + 1}`,
      category: risk ? 'Risks & Conditions' : index === 0 ? 'Key Terms' : 'Obligations',
      page: 1,
      section: `Section ${index + 1}`,
      excerpt: paragraph.slice(0, 260),
      plainExplanation: 'Extracted from the uploaded text. Review the original wording before relying on this interpretation.',
      implication: risk ? 'Potentially important wording detected; review the full clause carefully.' : 'Review this clause in the context of the full agreement.',
      attentionLevel: risk ? 'caution' : 'standard',
      partiesAffected: ['Contracting parties'],
    };
  });
  const fallbackClauses = clauses.length ? clauses : SAMPLE_DOCUMENTS[0].clauses;
  return {
    ...SAMPLE_DOCUMENTS[0],
    id: `upload-${Date.now()}`,
    title: fileName.replace(/\.[^.]+$/, ''),
    type: 'Uploaded text document',
    effectiveDate: new Date().toLocaleDateString(),
    summary: `Text extraction completed. ${paragraphs.length} paragraphs found and ${clauses.length} sections segmented for review. Section labels are heuristic, not legal validation.`,
    totalClauses: clauses.length,
    clauses: fallbackClauses,
    fullText: text,
    suggestedQuestions: [
      'What are the main obligations in this document?',
      'Which clauses may need careful review?',
      'What does the termination wording say?',
    ],
  };
}

function Ring({ value, label }: { value: number; label: string }) {
  const circumference = 2 * Math.PI * 35;
  return (
    <div className="flex items-center gap-4">
      <div className="relative h-[88px] w-[88px] shrink-0">
        <svg viewBox="0 0 88 88" className="h-full w-full -rotate-90">
          <circle cx="44" cy="44" r="35" fill="none" stroke="#E9E4FB" strokeWidth="7" />
          <circle cx="44" cy="44" r="35" fill="none" stroke="#7661D8" strokeWidth="7" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={circumference * (1 - value / 100)} />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-xl font-semibold text-[#29263A]">{value}<span className="text-xs">%</span></div>
      </div>
      <div>
        <div className="font-semibold text-[#4D428E]">{label}</div>
        <p className="mt-1 max-w-[220px] text-sm leading-5 text-[#77728C]">Based on the sections extracted from the currently selected document.</p>
      </div>
    </div>
  );
}

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\\/$/, '');

type ApiStatus = 'checking' | 'online' | 'fallback';

export function LegalensDashboard() {
  const [activeView, setActiveView] = useState<View>('overview');
  const [activeDocId, setActiveDocId] = useState(SAMPLE_DOCUMENTS[0].id);
  const [uploadedDocs, setUploadedDocs] = useState<LegalDocument[]>([]);
  const [messages, setMessages] = useState<AssistantMessage[]>([{
    id: 'welcome',
    sender: 'assistant',
    timestamp: 'Ready',
    text: 'I can help explain wording in the selected document. Ask a question and I will try to ground the answer in the document context.',
  }]);
  const [question, setQuestion] = useState('');
  const [thinking, setThinking] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedClauseId, setSelectedClauseId] = useState<string | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [apiStatus, setApiStatus] = useState<ApiStatus>('checking');
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 7000);
    fetch(`${API_BASE_URL}/api/health`, { signal: controller.signal })
      .then((response) => { if (!response.ok) throw new Error('API health check failed'); return response.json(); })
      .then((data) => setApiStatus(data?.status === 'healthy' ? 'online' : 'fallback'))
      .catch(() => setApiStatus('fallback'))
      .finally(() => window.clearTimeout(timeout));
    return () => { window.clearTimeout(timeout); controller.abort(); };
  }, []);

  const allDocs = useMemo(() => [...SAMPLE_DOCUMENTS, ...uploadedDocs], [uploadedDocs]);
  const currentDoc = allDocs.find((doc) => doc.id === activeDocId) || allDocs[0];
  const riskCount = getRiskCount(currentDoc);
  const selectedClause = currentDoc.clauses.find((clause) => clause.id === selectedClauseId);
  const visibleClauses = currentDoc.clauses.filter((clause) =>
    `${clause.title} ${clause.category} ${clause.excerpt} ${clause.section}`.toLowerCase().includes(search.toLowerCase())
  );

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploadError('');
    if (!/\.(txt|md|markdown)$/i.test(file.name)) {
      setUploadError('For this text-reader path, upload a .txt or .md file. PDF/DOCX need a dedicated extractor and are not parsed by this upload control yet.');
      event.target.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || '');
      if (!text.trim()) {
        setUploadError('This file appears to be empty or unreadable.');
        return;
      }
      const doc = makeUploadedDocument(file.name, text);
      setUploadedDocs((previous) => [doc, ...previous]);
      setActiveDocId(doc.id);
      setActiveView('documents');
      setSelectedClauseId(null);
      setMessages([{
        id: `upload-note-${Date.now()}`,
        sender: 'assistant',
        timestamp: 'Just now',
        text: `Loaded “${file.name}”. The browser text reader segmented ${doc.clauses.length} sections. The extracted labels are heuristic and should be checked against the source document.`,
        engine: 'browser-text-parser',
      }]);
    };
    reader.onerror = () => setUploadError('The file could not be read. Please try another text file.');
    reader.readAsText(file);
    event.target.value = '';
  };

  const sendQuestion = async (text?: string) => {
    const value = (text ?? question).trim();
    if (!value || thinking) return;
    setMessages((previous) => [...previous, {
      id: `user-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: value,
    }]);
    setQuestion('');
    setThinking(true);
    try {
      const answer = await askAssistantAsync(value, currentDoc);
      setMessages((previous) => [...previous, answer]);
    } catch {
      setMessages((previous) => [...previous, generateAssistantResponse(value, currentDoc)]);
    } finally {
      setThinking(false);
    }
  };

  const nav = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-6 py-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#E8E2FF] text-[#6754C8]"><Scale size={22} /></div>
        <div><div className="font-serif text-[23px] font-semibold tracking-tight text-[#28253A]">LEGALENS</div><div className="text-[10px] font-semibold uppercase tracking-[.19em] text-[#8B86A3]">Legal intelligence</div></div>
      </div>
      <div className="px-4 pb-3 pt-4 text-[10px] font-bold uppercase tracking-[.18em] text-[#A29CB7]">Workspace</div>
      <nav className="space-y-1 px-3">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => { setActiveView(id); setMobileNavOpen(false); }} className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-left text-[13px] font-medium transition ${activeView === id ? 'bg-[#EAE5FF] text-[#5845BA] shadow-sm' : 'text-[#77728D] hover:bg-white/70 hover:text-[#38334F]'}`}>
            <Icon size={17} strokeWidth={1.8} />{label}
            {id === 'documents' && <span className="ml-auto rounded-full bg-white/80 px-2 py-0.5 text-[10px]">{allDocs.length}</span>}
          </button>
        ))}
      </nav>
      <div className="mt-auto p-4">
        <div className="rounded-2xl border border-[#E7E1FB] bg-gradient-to-br from-[#F5F2FF] to-[#EAE4FF] p-4">
          <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-xl bg-white text-[#7561D5]"><Sparkles size={16} /></div>
          <div className="text-sm font-semibold text-[#3D355F]">Clarity, clause by clause.</div>
          <p className="mt-1 text-xs leading-5 text-[#81799F]">Explore the text, review important wording, and ask document-grounded questions.</p>
          <div className="mt-3 flex items-center gap-1.5 text-[10px] font-medium text-[#7666C8]"><ShieldCheck size={13} /> Informational use only</div>
        </div>
        <div className="mt-4 flex items-center gap-3 border-t border-[#EAE6F4] pt-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#D9D0FF] text-xs font-bold text-[#5A48B5]">LL</div>
          <div className="min-w-0 flex-1"><div className="truncate text-xs font-semibold text-[#403B55]">Personal workspace</div><div className="text-[10px] text-[#9690AA]">Local session</div></div>
          <MoreHorizontal size={17} className="text-[#9690AA]" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#A99AF1] p-0 text-[#302D42] sm:p-4 lg:p-7">
      <div className="mx-auto flex min-h-[calc(100vh-56px)] max-w-[1600px] overflow-hidden rounded-none border border-white/50 bg-[#F7F6FC] shadow-[0_28px_100px_rgba(55,42,110,.2)] sm:rounded-[28px]">
        <aside className="hidden w-[230px] shrink-0 border-r border-[#EAE6F5] bg-[#FBFAFE] lg:block">{nav}</aside>
        {mobileNavOpen && <div className="fixed inset-0 z-50 flex lg:hidden"><button aria-label="Close navigation" onClick={() => setMobileNavOpen(false)} className="absolute inset-0 bg-[#29213F]/40"/><aside className="relative z-10 w-[270px] bg-[#FBFAFE] shadow-2xl">{nav}</aside></div>}
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-[76px] shrink-0 items-center justify-between border-b border-[#EAE6F5] bg-white/80 px-4 sm:px-7">
            <div className="flex min-w-0 items-center gap-3">
              <button onClick={() => setMobileNavOpen(true)} className="rounded-lg p-2 text-[#716A8B] hover:bg-[#F0EDFA] lg:hidden" aria-label="Open navigation"><Menu size={20}/></button>
              <div className="min-w-0"><div className="flex items-center gap-2 text-[11px] text-[#9B95AF]"><span>Workspace</span><span>/</span><span className="truncate text-[#5D5676]">{navItems.find((item) => item.id === activeView)?.label}</span></div><h1 className="mt-1 truncate text-lg font-semibold tracking-tight text-[#2E2A40] sm:text-xl">{activeView === 'overview' ? 'Document overview' : navItems.find((item) => item.id === activeView)?.label}</h1></div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden items-center gap-2 rounded-full border border-[#E7E2F3] bg-[#FBFAFE] px-3 py-2 text-[11px] text-[#817A98] md:flex" title={apiStatus === "online" ? "The configured LEGALENS API health check succeeded." : apiStatus === "checking" ? "Checking the configured API." : "The API did not respond; assistant requests will use the configured fallback."}><span className={`h-2 w-2 rounded-full ${apiStatus === "online" ? "bg-[#67B995]" : apiStatus === "checking" ? "bg-[#D5A65E]" : "bg-[#C78B80]"}`}/>{apiStatus === "online" ? "API connected" : apiStatus === "checking" ? "Checking API…" : "Local fallback mode"}</div>
              <button aria-label="Notifications" className="rounded-xl p-2 text-[#8D86A5] hover:bg-[#F2EFFB]"><Bell size={18}/></button>
              <button onClick={() => fileRef.current?.click()} className="flex items-center gap-2 rounded-xl bg-[#6552C8] px-3 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#5543B4] sm:px-4"><Plus size={15}/><span className="hidden sm:inline">New document</span></button>
              <input ref={fileRef} type="file" accept=".txt,.md,.markdown" onChange={handleUpload} className="hidden" />
            </div>
          </header>
          <main className="grid min-h-0 flex-1 grid-cols-1 gap-5 overflow-y-auto p-4 sm:p-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(330px,.8fr)] xl:overflow-hidden">
            <section className="flex min-w-0 flex-col gap-5 xl:overflow-y-auto xl:pr-1">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div><div className="text-xs font-medium text-[#8B85A1]">MONDAY, YOUR DOCUMENT DESK</div><h2 className="mt-1 text-[23px] font-semibold tracking-tight text-[#302B45]">Understand what matters.</h2><p className="mt-1 text-sm text-[#89839F]">Review the wording, find key clauses, and ask grounded questions.</p></div>
                <div className="flex items-center gap-2 rounded-xl border border-[#E7E2F3] bg-white px-3 py-2"><span className="h-2 w-2 rounded-full bg-[#70BFA0]"/><span className="text-xs font-medium text-[#6E6885]">Document loaded</span></div>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-[#E8E3F4] bg-white p-5 shadow-[0_5px_20px_rgba(67,54,120,.035)]">
                  <div className="flex items-center justify-between"><div className="text-xs font-semibold text-[#7E7797]">REVIEW SNAPSHOT</div><div className="rounded-lg bg-[#F1EDFF] p-2 text-[#7763D4]"><Activity size={17}/></div></div>
                  <div className="mt-4"><Ring value={currentDoc.clauses.length ? Math.round((currentDoc.clauses.length - riskCount) / currentDoc.clauses.length * 100) : 0} label="Sections without risk flags" /></div>
                  <div className="mt-3 text-[11px] leading-4 text-[#9A94AD]">A simple count of heuristic flags—not a legal safety score or guarantee.</div>
                </div>
                <div className="rounded-2xl border border-[#E8E3F4] bg-white p-5 shadow-[0_5px_20px_rgba(67,54,120,.035)]">
                  <div className="flex items-center justify-between"><div className="text-xs font-semibold text-[#7E7797]">DOCUMENT SIGNALS</div><div className="rounded-lg bg-[#FFF5E7] p-2 text-[#C58C46]"><AlertCircle size={17}/></div></div>
                  <div className="mt-4 flex items-end gap-2"><span className="text-4xl font-semibold tracking-tight text-[#302B45]">{riskCount}</span><span className="pb-1 text-xs text-[#8F89A6]">flagged sections</span></div>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#F0EDF8]"><div className="h-full rounded-full bg-[#D7A56B]" style={{ width: `${currentDoc.clauses.length ? Math.min(100, riskCount / currentDoc.clauses.length * 100) : 0}%` }}/></div>
                  <div className="mt-3 flex items-center justify-between text-xs"><span className="text-[#8F89A6]">Extracted sections</span><span className="font-semibold text-[#5D547A]">{currentDoc.clauses.length}</span></div>
                </div>
              </div>
              <div className="overflow-hidden rounded-2xl border border-[#E7E2F3] bg-white shadow-[0_5px_20px_rgba(67,54,120,.035)]">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EEEAF7] px-5 py-4">
                  <div className="flex min-w-0 items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F0ECFF] text-[#6D5ACD]"><FileText size={19}/></div><div className="min-w-0"><div className="truncate text-sm font-semibold text-[#37324C]">{currentDoc.title}</div><div className="mt-0.5 text-[11px] text-[#9992AE]">{currentDoc.type} · {currentDoc.clauses.length} sections</div></div></div>
                  <select value={activeDocId} onChange={(e) => { setActiveDocId(e.target.value); setSelectedClauseId(null); }} className="max-w-[170px] rounded-lg border border-[#E8E3F4] bg-[#FBFAFE] px-2.5 py-2 text-xs text-[#6D6686] outline-none focus:border-[#9889E9] sm:max-w-[230px]">{allDocs.map((doc) => <option key={doc.id} value={doc.id}>{doc.title}</option>)}</select>
                </div>
                <div className="flex items-center gap-3 border-b border-[#F0EDF7] px-5 py-3"><Search size={15} className="text-[#A09AB5]"/><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search clauses or document text..." className="w-full bg-transparent text-xs text-[#514A6B] outline-none placeholder:text-[#B0AAC2]"/><span className="shrink-0 text-[10px] text-[#A09AB5]">{visibleClauses.length} results</span></div>
                <div className="max-h-[330px] divide-y divide-[#F0EDF7] overflow-y-auto">
                  {visibleClauses.map((clause) => <button key={clause.id} onClick={() => setSelectedClauseId(clause.id)} className={`block w-full px-5 py-4 text-left transition hover:bg-[#FAF9FE] ${selectedClauseId === clause.id ? 'bg-[#F3F0FF]' : ''}`}>
                    <div className="flex items-start gap-3"><div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${clause.attentionLevel === 'caution' ? 'bg-[#FFF2E5] text-[#C58C46]' : 'bg-[#EAF7F0] text-[#58A584]'}`}>{clause.attentionLevel === 'caution' ? <AlertCircle size={15}/> : <CheckCircle2 size={15}/>}</div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><span className="text-sm font-semibold text-[#4A435F]">{clause.title}</span><span className={`rounded-full px-2 py-0.5 text-[9px] font-semibold ${clause.attentionLevel === 'caution' ? 'bg-[#FFF2E5] text-[#B77B38]' : 'bg-[#EAF7F0] text-[#4D9A78]'}`}>{clause.attentionLevel === 'caution' ? 'Review' : 'Extracted'}</span></div><div className="mt-1 text-[10px] font-medium uppercase tracking-wide text-[#9C95B1]">{clause.section} · {clause.category}</div><p className="mt-2 line-clamp-2 text-xs leading-5 text-[#827B98]">{clause.excerpt}</p></div><ArrowRight size={15} className="mt-1 shrink-0 text-[#B4AEC7]"/></div>
                  </button>)}
                  {visibleClauses.length === 0 && <div className="p-8 text-center text-sm text-[#8F89A6]">No sections match that search.</div>}
                </div>
                {selectedClause && <div className="border-t border-[#EDE8F7] bg-[#FBFAFE] p-5"><div className="flex items-center justify-between"><div className="text-xs font-bold uppercase tracking-wider text-[#7765C9]">Section detail</div><button onClick={() => setSelectedClauseId(null)} aria-label="Close section detail"><X size={15} className="text-[#9690AA]"/></button></div><p className="mt-2 text-sm font-semibold text-[#403953]">{selectedClause.title}</p><p className="mt-2 text-xs leading-5 text-[#7D7694]">{selectedClause.plainExplanation}</p><div className="mt-3 rounded-xl bg-white p-3 text-xs leading-5 text-[#625B79]">{selectedClause.implication}</div></div>}
                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#F0EDF7] px-5 py-3"><span className="text-[10px] text-[#A09AB5]">Text extraction and flags are assistive; verify the source wording.</span><button onClick={() => setActiveView('documents')} className="flex items-center gap-1 text-xs font-semibold text-[#6B58CA] hover:text-[#4E3BB1]">Open document <ArrowRight size={13}/></button></div>
              </div>
              {uploadError && <div role="alert" className="flex items-start gap-2 rounded-xl border border-[#F0D7C7] bg-[#FFF8F2] p-3 text-xs leading-5 text-[#A66A3C]"><AlertCircle size={16} className="mt-0.5 shrink-0"/>{uploadError}</div>}
              {activeView === 'documents' && <div className="rounded-2xl border border-dashed border-[#D8D0F3] bg-white/70 p-5"><div className="flex items-center gap-3"><FolderOpen className="text-[#7865D3]"/><div><div className="text-sm font-semibold text-[#51496D]">Add a text document</div><div className="mt-1 text-xs text-[#928BA8]">TXT and Markdown are supported by this browser reader.</div></div><button onClick={() => fileRef.current?.click()} className="ml-auto rounded-xl bg-[#6B58CA] px-3 py-2 text-xs font-semibold text-white">Browse files</button></div></div>}
            </section>
            <aside className="flex min-h-[580px] min-w-0 flex-col overflow-hidden rounded-2xl border border-[#E6E0F5] bg-white shadow-[0_5px_20px_rgba(67,54,120,.04)] xl:min-h-0">
              <div className="flex items-center justify-between border-b border-[#EEEAF7] px-5 py-4"><div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EAE5FF] text-[#6C58CD]"><Sparkles size={18}/></div><div><div className="text-sm font-semibold text-[#37314D]">LEGALENS Assistant</div><div className="mt-0.5 flex items-center gap-1.5 text-[10px] text-[#9690AA]"><span className="h-1.5 w-1.5 rounded-full bg-[#65B994]"/>Document-aware help</div></div></div><button aria-label="More assistant options" className="rounded-lg p-2 text-[#9D96B3] hover:bg-[#F5F2FC]"><MoreHorizontal size={18}/></button></div>
              <div className="border-b border-[#F0EDF7] bg-[#FBFAFE] px-5 py-3"><div className="text-[10px] font-bold uppercase tracking-[.16em] text-[#A09AB5]">Current document</div><div className="mt-1 truncate text-xs font-semibold text-[#5C5478]">{currentDoc.title}</div></div>
              <div className="flex-1 space-y-4 overflow-y-auto bg-[#FDFDFF] p-4 sm:p-5">
                <div className="max-w-[95%] rounded-2xl rounded-tl-md border border-[#ECE7F7] bg-white p-4 shadow-sm"><div className="mb-2 flex items-center gap-2 text-[10px] font-semibold text-[#7664C8]"><Sparkles size={12}/> LEGALENS</div><p className="text-xs leading-5 text-[#706985]">I can help you explore <span className="font-semibold text-[#51496D]">{currentDoc.title}</span>. Ask about a clause, obligation, risk signal, or defined term.</p><div className="mt-3 flex flex-wrap gap-2">{currentDoc.suggestedQuestions.slice(0, 2).map((prompt) => <button key={prompt} onClick={() => sendQuestion(prompt)} className="rounded-full border border-[#E4DDF8] bg-[#F8F6FF] px-3 py-1.5 text-left text-[10px] font-medium text-[#6F5DC3] transition hover:bg-[#EEE9FF]">{prompt}</button>)}</div></div>
                {messages.filter((message) => message.id !== 'welcome').map((message) => <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[95%] rounded-2xl p-4 text-xs leading-5 shadow-sm ${message.sender === 'user' ? 'rounded-tr-md bg-[#6A57C9] text-white' : 'rounded-tl-md border border-[#ECE7F7] bg-white text-[#706985]'}`}><div className={`mb-1.5 text-[10px] font-semibold ${message.sender === 'user' ? 'text-white/70' : 'text-[#7664C8]'}`}>{message.sender === 'user' ? 'You' : 'LEGALENS'}{message.engine ? ` · ${message.engine}` : ''}</div><p className="whitespace-pre-wrap">{message.text}</p>{message.citations && message.citations.length > 0 && <div className="mt-3 border-t border-[#EEEAF7] pt-2"><div className="mb-1 text-[10px] font-semibold text-[#6B58CA]">Referenced sections</div>{message.citations.map((citation, index) => <div key={index} className="mt-1 rounded-lg bg-[#F7F5FE] p-2 text-[10px] text-[#77708F]"><span className="font-semibold">{citation.section} · {citation.title}</span><div className="mt-1">{citation.excerpt}</div></div>)}</div>}{message.attentionNote && <div className="mt-2 flex gap-1.5 rounded-lg bg-[#FFF6E9] p-2 text-[10px] text-[#A9773D]"><AlertCircle size={13} className="shrink-0"/>{message.attentionNote}</div>}</div></div>)}
                {thinking && <div className="flex items-center gap-2 rounded-xl bg-[#F7F5FE] px-3 py-3 text-xs text-[#8279A1]"><span className="flex gap-1"><i className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#8D7AE0]"/><i className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#8D7AE0] [animation-delay:120ms]"/><i className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#8D7AE0] [animation-delay:240ms]"/></span>Reviewing document context…</div>}
              </div>
              <div className="border-t border-[#EEEAF7] bg-white p-4"><div className="rounded-2xl border border-[#E5DFF5] bg-[#FBFAFE] p-2 transition focus-within:border-[#A79AE9] focus-within:ring-2 focus-within:ring-[#E9E4FF]"><textarea value={question} onChange={(e) => setQuestion(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); void sendQuestion(); } }} rows={2} placeholder="Ask about this document…" className="w-full resize-none bg-transparent px-2 py-1.5 text-xs leading-5 text-[#51496D] outline-none placeholder:text-[#AAA4BC]"/><div className="flex items-center justify-between px-1"><div className="flex items-center gap-1.5 text-[9px] text-[#A09AB5]"><ShieldCheck size={12}/> Verify answers against the source</div><button disabled={!question.trim() || thinking} onClick={() => void sendQuestion()} className="flex items-center gap-2 rounded-xl bg-[#6B58CA] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#5643B8] disabled:cursor-not-allowed disabled:opacity-40"><Send size={13}/>Send</button></div></div><div className="mt-2 text-center text-[9px] leading-4 text-[#AAA4BC]">Informational assistance only · Not legal advice</div></div>
            </aside>
          </main>
          <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-[#EAE6F5] bg-white/70 px-5 py-3 text-[10px] text-[#A09AB5]"><span className="flex items-center gap-1.5"><ShieldCheck size={12}/> LEGALENS · Legal document intelligence</span><span>AI output can be incomplete. Always verify against the original document.</span></footer>
        </div>
      </div>
    </div>
  );
}
