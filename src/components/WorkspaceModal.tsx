import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  FileText, 
  Search, 
  MessageSquare, 
  Scale, 
  Download, 
  ArrowUpRight, 
  AlertCircle, 
  CheckCircle2, 
  Send, 
  RefreshCw,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import { SAMPLE_DOCUMENTS, LegalDocument, LegalClause } from '../data/sampleDocuments';
import { CASE_PRECEDENTS } from '../data/casePrecedents';
import { AssistantMessage, generateAssistantResponse, askAssistantAsync } from '../services/aiAssistantService';

interface WorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDocId?: string;
}

export const WorkspaceModal: React.FC<WorkspaceModalProps> = ({
  isOpen,
  onClose,
  selectedDocId = 'residential-lease'
}) => {
  if (!isOpen) return null;

  const [activeDocId, setActiveDocId] = useState<string>(selectedDocId);
  const [activeTab, setActiveTab] = useState<'clauses' | 'assistant' | 'precedents' | 'export'>('clauses');
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedClause, setSelectedClause] = useState<LegalClause | null>(null);

  // Custom document upload state
  const [customDocs, setCustomDocs] = useState<LegalDocument[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Assistant messages state
  const [chatMessages, setChatMessages] = useState<AssistantMessage[]>([
    {
      id: 'ws-init-1',
      sender: 'assistant',
      timestamp: 'Just now',
      text: 'Document loaded into LEGALENS intelligence engine. Ask any question to retrieve grounded context with exact section citations.'
    }
  ]);
  const [assistantInput, setAssistantInput] = useState('');
  const [isAssistantThinking, setIsAssistantThinking] = useState(false);

  // Current active document
  const allDocs = [...SAMPLE_DOCUMENTS, ...customDocs];
  const currentDoc = allDocs.find(d => d.id === activeDocId) || allDocs[0];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = (event.target?.result as string) || '';
      
      // Basic automatic clause decomposition from paragraphs
      const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim().length > 30);
      
      const parsedClauses: LegalClause[] = paragraphs.slice(0, 6).map((p, idx) => {
        const firstSentence = p.split('.')[0] || `Section ${idx + 1}`;
        const hasWarning = /terminat|liab|damag|forfeit|penalty|indemn/i.test(p);
        
        return {
          id: `custom-clause-${idx}`,
          number: `0${idx + 1}`,
          title: firstSentence.slice(0, 40) + '...',
          category: idx === 0 ? 'Key Terms' : hasWarning ? 'Risks & Conditions' : 'Obligations',
          page: 1,
          section: `Section ${idx + 1}`,
          excerpt: p.slice(0, 180) + '...',
          plainExplanation: `Extracted clause governing ${firstSentence.toLowerCase()}. Outlines affirmative responsibilities.`,
          implication: hasWarning ? 'Review this condition carefully prior to signing.' : 'Standard operational clause.',
          attentionLevel: hasWarning ? 'caution' : 'standard',
          partiesAffected: ['Contracting Parties']
        };
      });

      const newDoc: LegalDocument = {
        id: 'custom-' + Date.now(),
        title: file.name.replace(/\.[^/.]+$/, ''),
        type: 'User Uploaded Contract',
        effectiveDate: new Date().toLocaleDateString(),
        parties: [{ role: 'Signatory', name: 'Uploaded Party' }],
        summary: `Custom document parsed via LEGALENS reader. Identified ${paragraphs.length} paragraphs and ${parsedClauses.length} key operative clauses.`,
        totalClauses: parsedClauses.length,
        clauses: parsedClauses.length > 0 ? parsedClauses : currentDoc.clauses,
        fullText: content,
        suggestedQuestions: [
          'What are the primary obligations under this document?',
          'Are there any termination or forfeiture provisions?',
          'What governing law or jurisdiction applies?'
        ]
      };

      setCustomDocs(prev => [newDoc, ...prev]);
      setActiveDocId(newDoc.id);
      setIsUploading(false);
      
      setChatMessages([
        {
          id: 'ws-up-1',
          sender: 'assistant',
          timestamp: 'Just now',
          text: `Successfully ingested "${file.name}". ${parsedClauses.length} key clauses parsed. You can now interrogate the document or examine extracted clauses.`
        }
      ]);
    };

    reader.readAsText(file);
  };

  const handleSendAssistant = async (customText?: string) => {
    const q = (customText || assistantInput).trim();
    if (!q) return;

    const userMsg: AssistantMessage = {
      id: 'ws-usr-' + Date.now(),
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: q
    };

    setChatMessages(prev => [...prev, userMsg]);
    setAssistantInput('');
    setIsAssistantThinking(true);

    try {
      const resp = await askAssistantAsync(q, currentDoc);
      setChatMessages(prev => [...prev, resp]);
    } catch {
      const fallback = generateAssistantResponse(q, currentDoc);
      setChatMessages(prev => [...prev, fallback]);
    } finally {
      setIsAssistantThinking(false);
    }
  };

  const handleExportText = () => {
    const content = `==================================================================
LEGALENS INTELLIGENCE REPORT
Document: ${currentDoc.title} (${currentDoc.type})
Date: ${new Date().toLocaleDateString()}
Notice: LEGALENS provides informational insights and is not legal counsel.
==================================================================

EXECUTIVE SUMMARY:
${currentDoc.summary}

EXTRACTED CLAUSES (${currentDoc.clauses.length} items):
------------------------------------------------------------------
${currentDoc.clauses.map((c, i) => `
[${i + 1}] ${c.section} — ${c.title.toUpperCase()}
Category: ${c.category} | Attention: ${c.attentionLevel.toUpperCase()}
Page Reference: Page ${c.page}
Excerpt: "${c.excerpt}"
Explanation: ${c.plainExplanation}
Implication: ${c.implication}
`).join('\n------------------------------------------------------------------\n')}

FULL TEXT ARCHIVE:
${currentDoc.fullText}
==================================================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `LEGALENS_${currentDoc.title.replace(/\s+/g, '_')}_Report.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#171714]/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6 animate-fadeIn">
      <div className="bg-[#FAF8F5] border border-[#D8D5CE] rounded-lg w-full max-w-7xl h-[92vh] max-h-[960px] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Workspace Top Bar */}
        <div className="bg-[#EBE8E1] px-5 py-3 border-b border-[#D8D5CE] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full border border-[#171714] flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full border border-[#C9A646]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-lg font-medium text-[#171714]">
                  LEGALENS Studio
                </span>
                <span className="text-xs text-[#6B6962] font-mono hidden sm:inline">
                  / Document Intelligence Environment
                </span>
              </div>
            </div>
          </div>

          {/* Document Switcher & Upload */}
          <div className="flex items-center gap-2">
            <select
              value={activeDocId}
              onChange={(e) => {
                setActiveDocId(e.target.value);
                setSelectedClause(null);
              }}
              className="bg-white border border-[#D8D5CE] text-xs text-[#171714] px-2.5 py-1.5 rounded focus:outline-none focus:border-[#171714] max-w-[160px] sm:max-w-[240px] truncate"
            >
              <optgroup label="Sample Standard Contracts">
                {SAMPLE_DOCUMENTS.map(d => (
                  <option key={d.id} value={d.id}>{d.title}</option>
                ))}
              </optgroup>
              {customDocs.length > 0 && (
                <optgroup label="Your Uploaded Contracts">
                  {customDocs.map(d => (
                    <option key={d.id} value={d.id}>{d.title}</option>
                  ))}
                </optgroup>
              )}
            </select>

            <label className="cursor-pointer bg-white hover:bg-[#FAF8F5] text-[#171714] border border-[#D8D5CE] px-2.5 py-1.5 rounded text-xs font-medium flex items-center gap-1.5 transition-colors">
              <Upload className="w-3.5 h-3.5 text-[#C9A646]" />
              <span className="hidden sm:inline">Upload File</span>
              <input
                type="file"
                accept=".txt,.pdf,.md,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            <button
              onClick={onClose}
              className="p-1.5 hover:bg-[#D8D5CE]/60 rounded text-[#171714] transition-colors ml-2"
              aria-label="Close workspace"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Workspace Body: 2-Column Split View */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          
          {/* Left Column: Full Document Reading Canvas */}
          <div className="lg:col-span-6 xl:col-span-7 border-b lg:border-b-0 lg:border-r border-[#D8D5CE] flex flex-col bg-[#FCFBF9] overflow-hidden">
            
            {/* Reading Header / Search */}
            <div className="p-3.5 border-b border-[#D8D5CE] bg-[#FAF8F5] flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 flex-1">
                <Search className="w-3.5 h-3.5 text-[#6B6962]" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Filter text in document..."
                  className="bg-transparent focus:outline-none w-full text-xs text-[#171714] placeholder-[#6B6962]"
                />
              </div>
              <div className="text-[11px] font-mono text-[#6B6962] shrink-0">
                {currentDoc.clauses.length} Key Clauses
              </div>
            </div>

            {/* Document Scroll Content */}
            <div className="flex-1 p-6 sm:p-8 overflow-y-auto font-serif text-[14px] leading-relaxed text-[#171714]">
              <div className="max-w-2xl mx-auto">
                <div className="mb-6 pb-4 border-b border-[#D8D5CE]">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#6B6962] block mb-1">
                    {currentDoc.type} · Effective: {currentDoc.effectiveDate}
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl text-[#171714] font-medium">
                    {currentDoc.title}
                  </h2>
                  <p className="text-xs font-sans text-[#6B6962] mt-2 leading-normal">
                    {currentDoc.summary}
                  </p>
                </div>

                {/* Parsed Clauses Quick Select Pills */}
                <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-2 text-xs">
                  <span className="text-[10px] font-mono text-[#6B6962] uppercase tracking-wider shrink-0">
                    Jump to:
                  </span>
                  {currentDoc.clauses.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        setSelectedClause(c);
                        setActiveTab('clauses');
                      }}
                      className={`shrink-0 px-2.5 py-1 rounded text-[11px] font-sans border transition-colors ${
                        selectedClause?.id === c.id
                          ? 'bg-[#171714] text-[#F4F2ED] border-[#171714]'
                          : 'bg-white text-[#6B6962] border-[#D8D5CE] hover:text-[#171714]'
                      }`}
                    >
                      {c.section}
                    </button>
                  ))}
                </div>

                {/* Full Document Body Text */}
                <div className="whitespace-pre-line font-serif text-[13px] sm:text-[14px] leading-relaxed text-[#171714]/90 bg-white p-6 border border-[#D8D5CE] rounded-lg shadow-2xs">
                  {currentDoc.fullText}
                </div>
              </div>
            </div>

            {/* Reading Footer */}
            <div className="p-3 bg-[#FAF8F5] border-t border-[#D8D5CE] flex items-center justify-between text-[11px] text-[#6B6962]">
              <span>Grounded Document Sandbox</span>
              <span className="font-mono">Zero retention processing</span>
            </div>
          </div>

          {/* Right Column: Tabbed Intelligence Panel */}
          <div className="lg:col-span-6 xl:col-span-5 flex flex-col bg-[#F4F2ED] overflow-hidden">
            
            {/* Tab Navigation */}
            <div className="bg-[#EBE8E1] px-4 pt-2 border-b border-[#D8D5CE] flex items-center gap-1 overflow-x-auto">
              <button
                onClick={() => setActiveTab('clauses')}
                className={`px-3.5 py-2 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'clauses'
                    ? 'border-[#171714] text-[#171714] bg-white rounded-t'
                    : 'border-transparent text-[#6B6962] hover:text-[#171714]'
                }`}
              >
                Clauses & Risks ({currentDoc.clauses.length})
              </button>

              <button
                onClick={() => setActiveTab('assistant')}
                className={`px-3.5 py-2 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'assistant'
                    ? 'border-[#171714] text-[#171714] bg-white rounded-t'
                    : 'border-transparent text-[#6B6962] hover:text-[#171714]'
                }`}
              >
                AI Assistant
              </button>

              <button
                onClick={() => setActiveTab('precedents')}
                className={`px-3.5 py-2 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'precedents'
                    ? 'border-[#171714] text-[#171714] bg-white rounded-t'
                    : 'border-transparent text-[#6B6962] hover:text-[#171714]'
                }`}
              >
                Precedents
              </button>

              <button
                onClick={() => setActiveTab('export')}
                className={`px-3.5 py-2 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'export'
                    ? 'border-[#171714] text-[#171714] bg-white rounded-t'
                    : 'border-transparent text-[#6B6962] hover:text-[#171714]'
                }`}
              >
                Export Report
              </button>
            </div>

            {/* Tab Content Container */}
            <div className="flex-1 p-5 sm:p-6 overflow-y-auto">
              
              {/* TAB 1: CLAUSES & RISKS */}
              {activeTab === 'clauses' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-[#6B6962] pb-2 border-b border-[#D8D5CE]">
                    <span>Select any clause for structured extraction</span>
                    <span className="font-mono text-[10px]">Indexed from text</span>
                  </div>

                  {currentDoc.clauses.map((clause) => {
                    const isSelected = selectedClause?.id === clause.id;
                    return (
                      <div
                        key={clause.id}
                        onClick={() => setSelectedClause(clause)}
                        className={`p-4 rounded-lg border transition-all cursor-pointer bg-white ${
                          isSelected
                            ? 'border-[#C9A646] ring-1 ring-[#C9A646]/50 shadow-xs'
                            : 'border-[#D8D5CE] hover:border-[#C9A646]/70'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <span className="font-sans font-medium text-xs text-[#171714]">
                            {clause.section} — {clause.title}
                          </span>
                          <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-medium ${
                            clause.attentionLevel === 'caution'
                              ? 'bg-[#A64B43]/10 text-[#A64B43]'
                              : clause.attentionLevel === 'notice'
                              ? 'bg-[#A47732]/10 text-[#A47732]'
                              : 'bg-[#557A5A]/10 text-[#557A5A]'
                          }`}>
                            {clause.category}
                          </span>
                        </div>

                        <p className="text-xs text-[#171714] leading-relaxed mb-2">
                          {clause.plainExplanation}
                        </p>

                        <div className="p-2 bg-[#FAF8F5] border-l-2 border-[#C9A646] rounded-r text-[11px] text-[#6B6962] leading-normal">
                          <span className="font-medium text-[#171714] block mb-0.5">Practical Implication:</span>
                          {clause.implication}
                        </div>

                        {isSelected && clause.keyObligations && (
                          <div className="mt-3 pt-2.5 border-t border-[#D8D5CE]/60">
                            <span className="text-[10px] font-mono uppercase tracking-wider text-[#6B6962] block mb-1">
                              Action Items:
                            </span>
                            <ul className="space-y-1">
                              {clause.keyObligations.map((o, idx) => (
                                <li key={idx} className="text-[11px] text-[#171714] flex items-center gap-1.5">
                                  <span className="w-1 h-1 rounded-full bg-[#C9A646]" />
                                  <span>{o}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* TAB 2: AI ASSISTANT */}
              {activeTab === 'assistant' && (
                <div className="flex flex-col h-full justify-between">
                  <div className="space-y-4 overflow-y-auto max-h-[460px] pr-1">
                    {chatMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                      >
                        <div className="text-[10px] font-mono text-[#6B6962] mb-1">
                          {msg.sender === 'user' ? 'You' : 'LEGALENS Assistant'} · {msg.timestamp}
                        </div>

                        <div
                          className={`p-3.5 rounded-lg text-xs leading-relaxed max-w-[90%] ${
                            msg.sender === 'user'
                              ? 'bg-[#171714] text-[#F4F2ED]'
                              : 'bg-white border border-[#D8D5CE] text-[#171714] shadow-xs'
                          }`}
                        >
                          <p>{msg.text}</p>

                          {msg.citations && msg.citations.length > 0 && (
                            <div className="mt-2.5 pt-2.5 border-t border-[#D8D5CE]/60 text-[11px] space-y-1">
                              <span className="font-mono text-[10px] text-[#C9A646] uppercase font-semibold block">
                                Grounded Citations:
                              </span>
                              {msg.citations.map((c, idx) => (
                                <div key={idx} className="bg-[#FAF8F5] p-2 rounded border border-[#D8D5CE]/70">
                                  <span className="font-medium text-[#171714]">[{c.section} · Page {c.page}]</span>
                                  <p className="italic text-[#6B6962] mt-0.5 font-serif">"{c.excerpt}"</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}

                    {isAssistantThinking && (
                      <div className="text-xs font-mono text-[#6B6962] flex items-center gap-2 py-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C9A646] animate-ping" />
                        <span>Searching retrieved document chunks...</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#D8D5CE]">
                    {/* Suggested Pills */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-2 text-[11px]">
                      {currentDoc.suggestedQuestions.slice(0, 2).map((q, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendAssistant(q)}
                          className="shrink-0 bg-white hover:bg-[#EBE8E1] border border-[#D8D5CE] px-2.5 py-1 rounded text-[#171714] transition-colors"
                        >
                          {q}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={assistantInput}
                        onChange={(e) => setAssistantInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendAssistant()}
                        placeholder="Ask about this document..."
                        className="flex-1 bg-white border border-[#D8D5CE] focus:border-[#171714] focus:outline-none rounded px-3 py-2 text-xs text-[#171714]"
                      />
                      <button
                        onClick={() => handleSendAssistant()}
                        disabled={!assistantInput.trim() || isAssistantThinking}
                        className="bg-[#171714] text-[#F4F2ED] px-3 py-2 rounded text-xs hover:bg-[#2A2A26] disabled:opacity-40 transition-colors"
                      >
                        <Send className="w-3.5 h-3.5 text-[#C9A646]" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: PRECEDENTS */}
              {activeTab === 'precedents' && (
                <div className="space-y-4">
                  <p className="text-xs text-[#6B6962] leading-relaxed">
                    Statutory benchmarks and case law governing standard terms in contracts like {currentDoc.title}:
                  </p>

                  {CASE_PRECEDENTS.slice(0, 3).map((prec) => (
                    <div
                      key={prec.id}
                      className="p-4 bg-white border border-[#D8D5CE] rounded-lg shadow-2xs"
                    >
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-serif text-lg font-medium text-[#171714]">
                          {prec.actOrCase}
                        </span>
                        <span className="font-mono text-[10px] text-[#C9A646]">
                          {prec.sectionOrCitation}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-[#171714] mb-1">
                        {prec.principle}
                      </p>
                      <p className="text-xs text-[#6B6962] leading-normal mb-2">
                        {prec.summary}
                      </p>
                      <div className="p-2 bg-[#FAF8F5] border-l-2 border-[#C9A646] rounded-r text-[11px] text-[#171714]">
                        <span className="font-mono text-[10px] uppercase text-[#6B6962] block">Relevance:</span>
                        {prec.appliedContext}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 4: EXPORT REPORT */}
              {activeTab === 'export' && (
                <div className="space-y-5">
                  <div className="p-5 bg-white border border-[#D8D5CE] rounded-lg">
                    <h4 className="font-serif text-xl font-medium text-[#171714] mb-1">
                      Download Annotated Summary
                    </h4>
                    <p className="text-xs text-[#6B6962] leading-relaxed mb-4">
                      Generates a full-text report containing extracted clauses, risk levels, margin notes, and grounding references.
                    </p>

                    <button
                      onClick={handleExportText}
                      className="w-full bg-[#171714] text-[#F4F2ED] py-2.5 rounded text-xs font-medium flex items-center justify-center gap-2 hover:bg-[#2A2A26] transition-colors"
                    >
                      <Download className="w-3.5 h-3.5 text-[#C9A646]" />
                      <span>Download Annotated Report (.txt)</span>
                    </button>
                  </div>

                  <div className="p-4 bg-[#FAF8F5] border border-[#D8D5CE] rounded text-xs text-[#6B6962] leading-normal">
                    <span className="font-semibold text-[#171714] block mb-1">Notice:</span>
                    LEGALENS outputs are informational and designed for educational and contract navigation assistance. They do not constitute formal legal counsel.
                  </div>
                </div>
              )}

            </div>

            {/* Panel Bottom Bar */}
            <div className="p-3 bg-[#EBE8E1] border-t border-[#D8D5CE] flex items-center justify-between text-[11px] text-[#6B6962]">
              <span>Document ID: {currentDoc.id}</span>
              <span className="font-mono text-[#557A5A]">● Engine Active</span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
