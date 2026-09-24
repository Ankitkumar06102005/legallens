import React, { useState } from 'react';
import { ShieldCheck, AlertCircle, FileSearch, ArrowRight, BookOpen, Compass } from 'lucide-react';
import { SAMPLE_DOCUMENTS, LegalClause } from '../data/sampleDocuments';

interface DocumentAnalysisSectionProps {
  onOpenWorkspace: () => void;
}

export const DocumentAnalysisSection: React.FC<DocumentAnalysisSectionProps> = ({ onOpenWorkspace }) => {
  const doc = SAMPLE_DOCUMENTS[0]; // Residential Lease
  const [selectedClauseId, setSelectedClauseId] = useState<string>('c-termination');

  const selectedClause: LegalClause = doc.clauses.find(c => c.id === selectedClauseId) || doc.clauses[0];

  return (
    <section className="py-20 md:py-32 border-b border-[#D8D5CE] bg-[#FAF8F5]">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A646]" />
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#6B6962]">
              Interactive Extraction
            </span>
          </div>

          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#171714] leading-[1.08] tracking-tight mb-4">
            Complex, made clear.
          </h2>

          <p className="text-base sm:text-lg text-[#6B6962] leading-relaxed">
            Identify important clauses, understand obligations, and uncover the meaning behind complicated legal language.
          </p>
        </div>

        {/* Interactive Document Analysis Mockup */}
        <div className="bg-white border border-[#D8D5CE] rounded-lg shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          
          {/* Left: Document Text with Highlighted Clauses */}
          <div className="lg:col-span-7 p-6 sm:p-8 border-b lg:border-b-0 lg:border-r border-[#D8D5CE] bg-[#FCFBF9]">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#D8D5CE]/70 text-xs">
              <div className="flex items-center gap-2">
                <FileSearch className="w-4 h-4 text-[#C9A646]" />
                <span className="font-mono text-[11px] uppercase tracking-wider text-[#6B6962]">
                  Live Document Canvas · Section View
                </span>
              </div>
              <span className="font-mono text-[11px] text-[#6B6962]">
                Interactive Selection
              </span>
            </div>

            <div className="space-y-6 font-serif text-[14px] leading-relaxed text-[#171714]">
              
              {/* Clause: Term */}
              <div 
                onClick={() => setSelectedClauseId('c-term')}
                className={`p-3 rounded border transition-all cursor-pointer ${
                  selectedClauseId === 'c-term'
                    ? 'bg-[#C9A646]/15 border-[#C9A646]'
                    : 'border-transparent hover:bg-[#EBE8E1]/60'
                }`}
              >
                <div className="flex items-center justify-between font-sans text-xs font-medium text-[#171714] mb-1">
                  <span>SECTION 1. PREMISES & TERM</span>
                  <span className="text-[10px] font-mono text-[#6B6962]">PAGE 1</span>
                </div>
                <p className="font-sans text-xs text-[#6B6962] leading-normal">
                  "Landlord leases to Tenant the premises located at Apartment 4B, 412 Waverly Terrace, for a term of twelve (12) calendar months, commencing on October 1, 2026, and ending at 11:59 PM on September 30, 2027..."
                </p>
              </div>

              {/* Clause: Security Deposit */}
              <div 
                onClick={() => setSelectedClauseId('c-deposit')}
                className={`p-3 rounded border transition-all cursor-pointer ${
                  selectedClauseId === 'c-deposit'
                    ? 'bg-[#C9A646]/15 border-[#C9A646]'
                    : 'border-transparent hover:bg-[#EBE8E1]/60'
                }`}
              >
                <div className="flex items-center justify-between font-sans text-xs font-medium text-[#171714] mb-1">
                  <span>SECTION 3. SECURITY DEPOSIT & CONDITIONS OF REFUND</span>
                  <span className="text-[10px] font-mono text-[#6B6962]">PAGE 1</span>
                </div>
                <p className="font-sans text-xs text-[#6B6962] leading-normal">
                  "Tenant shall deposit with Landlord the sum of $3,250.00 as security for full and faithful performance. Said deposit shall be held in an <mark className="bg-[#C9A646]/25 px-1 rounded">interest-bearing escrow account</mark> at First Commercial Bank. Within <mark className="bg-[#C9A646]/25 px-1 rounded">thirty (30) days following lawful surrender</mark>, Landlord shall return said deposit with accrued interest, minus lawful deductions..."
                </p>
              </div>

              {/* Clause: Obligations / Maintenance */}
              <div 
                onClick={() => setSelectedClauseId('c-repairs')}
                className={`p-3 rounded border transition-all cursor-pointer ${
                  selectedClauseId === 'c-repairs'
                    ? 'bg-[#C9A646]/15 border-[#C9A646]'
                    : 'border-transparent hover:bg-[#EBE8E1]/60'
                }`}
              >
                <div className="flex items-center justify-between font-sans text-xs font-medium text-[#171714] mb-1">
                  <span>SECTION 4. MAINTENANCE & REPAIRS</span>
                  <span className="text-[10px] font-mono text-[#6B6962]">PAGE 2</span>
                </div>
                <p className="font-sans text-xs text-[#6B6962] leading-normal">
                  "Tenant shall maintain premises in clean and tenantable condition. <mark className="bg-[#C9A646]/25 px-1 rounded">Landlord remains solely responsible for structural repairs, HVAC systems, exterior plumbing</mark>. Tenant shall promptly provide written notice of required repairs exceeding $250.00."
                </p>
              </div>

              {/* Clause: Early Termination (Notice / Attention) */}
              <div 
                onClick={() => setSelectedClauseId('c-termination')}
                className={`p-3.5 rounded border transition-all cursor-pointer relative ${
                  selectedClauseId === 'c-termination'
                    ? 'bg-[#C9A646]/20 border-[#C9A646] ring-1 ring-[#C9A646]/40'
                    : 'bg-[#FAF8F5] border-[#D8D5CE] hover:border-[#C9A646]/70'
                }`}
              >
                <div className="flex items-center justify-between font-sans text-xs font-medium text-[#171714] mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#A47732]" />
                    SECTION 5. EARLY TERMINATION & ADMINISTRATIVE FEES
                  </span>
                  <span className="text-[10px] font-mono font-medium text-[#9F7D24] uppercase">
                    Notice Required
                  </span>
                </div>
                <p className="font-sans text-xs text-[#171714] leading-normal">
                  "Either party may terminate this Agreement prior to expiration of initial term only upon delivering <mark className="bg-[#C9A646]/35 text-[#171714] px-1 rounded font-medium">sixty (60) days' prior written notice</mark>. If Tenant terminates without statutory cause prior to month six (6), Tenant agrees to <mark className="bg-[#C9A646]/35 text-[#171714] px-1 rounded font-medium">forfeit one-half of the initial security deposit</mark> as liquidated administrative transition fees..."
                </p>
              </div>

            </div>

            <div className="mt-8 pt-4 border-t border-[#D8D5CE]/60 flex items-center justify-between text-xs text-[#6B6962]">
              <span className="font-mono text-[11px]">Click any clause above to view structured AI insight</span>
              <span className="font-mono text-[11px]">Active Clause: {selectedClause.section}</span>
            </div>
          </div>

          {/* Right: Structured Analysis Panel */}
          <div className="lg:col-span-5 p-6 sm:p-8 bg-[#F4F2ED] flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-3 mb-6 border-b border-[#D8D5CE]">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#6B6962] block">
                    Extracted Insight
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl text-[#171714] font-medium mt-0.5">
                    {selectedClause.title}
                  </h3>
                </div>
                <span className={`text-[11px] font-mono uppercase px-2.5 py-1 rounded font-medium ${
                  selectedClause.attentionLevel === 'caution'
                    ? 'bg-[#A64B43]/10 text-[#A64B43] border border-[#A64B43]/20'
                    : selectedClause.attentionLevel === 'notice'
                    ? 'bg-[#A47732]/10 text-[#A47732] border border-[#A47732]/20'
                    : 'bg-[#557A5A]/10 text-[#557A5A] border border-[#557A5A]/20'
                }`}>
                  {selectedClause.attentionLevel === 'caution' ? 'Review Closely' : selectedClause.category}
                </span>
              </div>

              {/* Analysis Content */}
              <div className="space-y-4 text-xs">
                
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#6B6962] block mb-1">
                    Plain-English Summary
                  </span>
                  <p className="text-sm text-[#171714] leading-relaxed">
                    {selectedClause.plainExplanation}
                  </p>
                </div>

                <div className="p-3.5 bg-white border border-[#D8D5CE] rounded-md">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#6B6962] block mb-1">
                    Practical Implication
                  </span>
                  <p className="text-xs text-[#171714] leading-relaxed">
                    {selectedClause.implication}
                  </p>
                </div>

                {selectedClause.keyObligations && (
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#6B6962] block mb-1.5">
                      Identified Responsibilities
                    </span>
                    <div className="space-y-1.5">
                      {selectedClause.keyObligations.map((ob, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-[#171714] bg-white/70 p-2 rounded border border-[#D8D5CE]/50">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#C9A646] mt-1.5 shrink-0" />
                          <span>{ob}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Grounding Source */}
                <div className="pt-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#6B6962] block mb-1">
                    Document Grounding
                  </span>
                  <div className="p-2.5 bg-[#FAF8F5] border border-[#D8D5CE] rounded text-[11px] font-mono text-[#6B6962]">
                    <div className="flex justify-between mb-1 text-[#171714] font-medium">
                      <span>{selectedClause.section}</span>
                      <span>Page {selectedClause.page}</span>
                    </div>
                    <p className="font-sans italic line-clamp-2 text-[#6B6962]">
                      "{selectedClause.excerpt}"
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Action Bar */}
            <div className="mt-8 pt-4 border-t border-[#D8D5CE] flex items-center justify-between">
              <button
                onClick={onOpenWorkspace}
                className="text-xs font-medium text-[#171714] hover:text-[#C9A646] flex items-center gap-1.5 transition-colors"
              >
                <span>Examine full document in studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
