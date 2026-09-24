import React, { useState } from 'react';
import { Send, Sparkles, BookOpen, AlertCircle, FileText, CornerDownLeft, RefreshCw } from 'lucide-react';
import { SAMPLE_DOCUMENTS } from '../data/sampleDocuments';
import { AssistantMessage, generateAssistantResponse, askAssistantAsync } from '../services/aiAssistantService';

interface AiAssistantSectionProps {
  onOpenWorkspace: () => void;
}

export const AiAssistantSection: React.FC<AiAssistantSectionProps> = ({ onOpenWorkspace }) => {
  const currentDoc = SAMPLE_DOCUMENTS[0]; // Residential Lease

  const [messages, setMessages] = useState<AssistantMessage[]>([
    {
      id: 'init-1',
      sender: 'user',
      timestamp: '10:14 AM',
      text: 'What are the termination conditions in this agreement?'
    },
    {
      id: 'init-2',
      sender: 'assistant',
      timestamp: '10:14 AM',
      text: 'The agreement outlines early termination conditions in Section 5. Either party may terminate prior to the 12-month expiration only by delivering sixty (60) days\' advance written notice. If you vacate prior to month six (6), you agree to forfeit one-half of the initial security deposit as liquidated administrative transition fees, unless an approved replacement tenant is accepted.',
      citations: [
        {
          section: 'Section 5',
          page: 2,
          title: 'Early Termination & Transition Fee',
          excerpt: 'Either party may terminate this Agreement prior to expiration... delivering sixty (60) days\' prior written notice... forfeit one-half of the initial security deposit...'
        }
      ],
      attentionNote: 'Requires a 60-day written notice horizon.'
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (textToSend?: string) => {
    const q = (textToSend || inputQuery).trim();
    if (!q) return;

    const userMsg: AssistantMessage = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: q
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    try {
      const resp = await askAssistantAsync(q, currentDoc);
      setMessages(prev => [...prev, resp]);
    } catch {
      const fallback = generateAssistantResponse(q, currentDoc);
      setMessages(prev => [...prev, fallback]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'msg-reset',
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: `Workspace initialized for ${currentDoc.title}. You can ask about payment terms, maintenance responsibilities, security deposit conditions, or notice requirements.`
      }
    ]);
  };

  return (
    <section id="assistant" className="py-20 md:py-32 border-b border-[#D8D5CE] bg-[#FAF8F5]">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A646]" />
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#6B6962]">
              Interactive Legal Assistant
            </span>
          </div>

          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#171714] leading-[1.08] tracking-tight mb-4">
            Ask anything.<br />
            About your document.
          </h2>

          <p className="text-base sm:text-lg text-[#6B6962] leading-relaxed">
            Ask questions in natural language and explore your document through an AI assistant designed to work with its contents.
          </p>
        </div>

        {/* Chat Interface Container */}
        <div className="max-w-4xl mx-auto bg-white border border-[#D8D5CE] rounded-lg shadow-sm overflow-hidden flex flex-col">
          
          {/* Top Bar / Context Indicator */}
          <div className="bg-[#EBE8E1] px-5 py-3.5 border-b border-[#D8D5CE] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <FileText className="w-4 h-4 text-[#C9A646]" />
              <div>
                <span className="font-medium text-[#171714]">
                  {currentDoc.title}
                </span>
                <span className="text-[#6B6962] hidden sm:inline ml-2 text-[11px]">
                  · Grounded against 14 parsed clauses
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleResetChat}
                className="text-[11px] text-[#6B6962] hover:text-[#171714] flex items-center gap-1 transition-colors"
                title="Clear conversation"
              >
                <RefreshCw className="w-3 h-3" />
                <span className="hidden sm:inline">Reset</span>
              </button>
              <button
                onClick={onOpenWorkspace}
                className="text-[11px] font-medium text-[#171714] bg-white px-2.5 py-1 rounded border border-[#D8D5CE] hover:bg-[#FAF8F5] transition-colors"
              >
                Open Studio
              </button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="p-6 sm:p-8 space-y-6 min-h-[380px] max-h-[500px] overflow-y-auto bg-[#FCFBF9]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div className="text-[10px] font-mono text-[#6B6962] mb-1 px-1">
                  {msg.sender === 'user' ? 'You' : 'LEGALENS Assistant'} · {msg.timestamp}
                </div>

                <div
                  className={`max-w-[90%] sm:max-w-[80%] rounded-lg p-4 text-xs sm:text-[13px] leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#171714] text-[#F4F2ED]'
                      : 'bg-white border border-[#D8D5CE] text-[#171714] shadow-xs'
                  }`}
                >
                  <p>{msg.text}</p>

                  {/* Citations Box */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-[#D8D5CE]/60 space-y-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#6B6962] block">
                        Direct Grounding Citations:
                      </span>
                      {msg.citations.map((cite, cIdx) => (
                        <div
                          key={cIdx}
                          className="bg-[#FAF8F5] p-2 rounded border border-[#D8D5CE]/70 text-[11px]"
                        >
                          <div className="flex items-center justify-between text-[#171714] font-medium mb-1">
                            <span className="text-[#C9A646] font-mono font-semibold">
                              [{cite.section} · Page {cite.page}]
                            </span>
                            <span className="text-[#6B6962] text-[10px]">
                              {cite.title}
                            </span>
                          </div>
                          <p className="font-serif italic text-[#6B6962] leading-normal line-clamp-2">
                            "{cite.excerpt}"
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {msg.attentionNote && (
                    <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-[#A47732] font-medium">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{msg.attentionNote}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-[#6B6962] font-mono py-2">
                <span className="w-2 h-2 rounded-full bg-[#C9A646] animate-pulse" />
                <span>Retrieving relevant clauses and synthesizing citation...</span>
              </div>
            )}
          </div>

          {/* Suggested Questions Pills / Tabs */}
          <div className="px-6 py-3 bg-[#F4F2ED] border-t border-[#D8D5CE] flex items-center gap-2 overflow-x-auto text-xs">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#6B6962] shrink-0">
              Suggested:
            </span>
            {currentDoc.suggestedQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="shrink-0 bg-white hover:bg-[#EBE8E1] text-[#171714] px-3 py-1.5 rounded border border-[#D8D5CE] text-xs transition-colors"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <div className="p-4 bg-white border-t border-[#D8D5CE] flex items-center gap-3">
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about your document (e.g., late fees, security deposit, repairs)..."
              className="flex-1 bg-[#FAF8F5] border border-[#D8D5CE] focus:border-[#171714] focus:outline-none rounded px-4 py-2.5 text-xs sm:text-sm text-[#171714] placeholder-[#6B6962]/70 transition-colors"
            />
            <button
              onClick={() => handleSend()}
              disabled={!inputQuery.trim() || isTyping}
              className="bg-[#171714] hover:bg-[#2A2A26] disabled:opacity-40 text-[#F4F2ED] px-4 py-2.5 rounded transition-all flex items-center gap-1.5 text-xs font-medium shrink-0"
              aria-label="Send message"
            >
              <span>Ask</span>
              <Send className="w-3.5 h-3.5 text-[#C9A646]" />
            </button>
          </div>

          {/* Legal Disclaimer Ribbon */}
          <div className="px-5 py-2.5 bg-[#FAF8F5] border-t border-[#D8D5CE]/60 text-[11px] text-[#6B6962] flex items-center justify-between">
            <span>
              LEGALENS provides informational insights and is not a substitute for professional legal advice.
            </span>
            <span className="hidden sm:inline font-mono text-[10px]">
              Strict Context Verification
            </span>
          </div>

        </div>

      </div>
    </section>
  );
};
