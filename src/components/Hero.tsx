import React, { useState } from 'react';
import { ArrowRight, ArrowUpRight, Sparkles, BookOpen, AlertCircle, CheckCircle2, ChevronRight } from 'lucide-react';
import { SAMPLE_DOCUMENTS } from '../data/sampleDocuments';

interface HeroProps {
  onOpenWorkspace: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenWorkspace }) => {
  const sampleDoc = SAMPLE_DOCUMENTS[0]; // Residential Lease
  const [activeClauseIndex, setActiveClauseIndex] = useState(4); // Early termination by default

  const activeClause = sampleDoc.clauses[activeClauseIndex] || sampleDoc.clauses[0];

  return (
    <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden border-b border-[#D8D5CE]">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
        
        {/* Editorial Header */}
        <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A646]" />
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#6B6962]">
              AI-Powered Legal Intelligence
            </span>
          </div>

          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-[76px] leading-[1.06] tracking-tight text-[#171714] text-balance mb-6">
            Legal documents,{' '}
            <span className="relative inline-block">
              <span className="relative z-10">made clearer.</span>
              <span 
                className="absolute left-0 bottom-2 w-full h-3 bg-[#C9A646]/25 -z-0 -rotate-1 rounded-sm"
                aria-hidden="true"
              />
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[#6B6962] leading-relaxed max-w-2xl mx-auto mb-8 font-normal">
            LEGALENS helps you understand complex legal documents, discover important clauses, ask questions, and explore relevant legal insights — all in one intelligent workspace.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-6">
            <button
              onClick={onOpenWorkspace}
              className="w-full sm:w-auto bg-[#171714] text-[#F4F2ED] text-sm font-medium px-6 py-3 rounded hover:bg-[#2A2A26] active:scale-[0.98] transition-all flex items-center justify-center gap-2 tracking-wide shadow-sm"
            >
              <span>Try LEGALENS</span>
              <ArrowUpRight className="w-4 h-4 text-[#C9A646]" />
            </button>

            <a
              href="#how-it-works"
              className="w-full sm:w-auto border border-[#D8D5CE] bg-white/60 hover:bg-white text-[#171714] text-sm font-medium px-6 py-3 rounded transition-colors flex items-center justify-center gap-2"
            >
              <span>See how it works</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#6B6962]" />
            </a>
          </div>

          <p className="text-xs text-[#6B6962] flex items-center justify-center gap-2">
            <span>Understand your documents.</span>
            <span className="text-[#D8D5CE]">·</span>
            <span>Make informed decisions.</span>
          </p>
        </div>

        {/* Hero Interactive Document Preview */}
        <div className="relative mt-8 max-w-5xl mx-auto">
          {/* Subtle paper backdrop halo */}
          <div className="absolute -inset-2 bg-gradient-to-b from-[#EBE8E1]/80 to-[#F4F2ED] rounded-xl -z-10 border border-[#D8D5CE]/80" />

          <div className="bg-[#FAF8F5] border border-[#D8D5CE] rounded-lg shadow-sm overflow-hidden">
            {/* Document Header Bar */}
            <div className="bg-[#EBE8E1] px-5 py-3 border-b border-[#D8D5CE] flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-[11px] text-[#6B6962]">DOC-2026-084</span>
                <span className="text-[#D8D5CE]">/</span>
                <span className="font-serif font-medium text-[#171714] text-sm">
                  Residential Lease Agreement
                </span>
              </div>
              <div className="flex items-center gap-3 text-[#6B6962]">
                <span className="hidden sm:inline font-mono text-[11px]">12 Pages · 14 Clauses Analyzed</span>
                <span className="inline-flex items-center gap-1.5 text-[#557A5A] font-medium text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Context Grounded
                </span>
              </div>
            </div>

            {/* Split View: Left Document Page & Right Margin AI Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[480px]">
              
              {/* Document Reading Column */}
              <div className="lg:col-span-7 p-6 sm:p-8 border-b lg:border-b-0 lg:border-r border-[#D8D5CE] bg-[#FAF8F5]">
                <div className="mb-6 pb-4 border-b border-[#D8D5CE]/60">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-[#6B6962] mb-1">
                    Standard Form · New York Real Property Law
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl text-[#171714] font-medium">
                    RESIDENTIAL LEASE AGREEMENT
                  </h3>
                  <div className="text-xs text-[#6B6962] mt-1.5">
                    Highland Properties LLC (Landlord) · Julian Vance & Sarah Lin (Tenant)
                  </div>
                </div>

                <div className="space-y-4 text-xs sm:text-[13px] leading-relaxed text-[#171714]/85 font-serif">
                  
                  {/* Clause 1 */}
                  <div 
                    onClick={() => setActiveClauseIndex(0)}
                    className={`p-2.5 rounded transition-all cursor-pointer border ${
                      activeClauseIndex === 0 
                        ? 'bg-[#C9A646]/10 border-[#C9A646]' 
                        : 'border-transparent hover:bg-[#EBE8E1]/60'
                    }`}
                  >
                    <p className="font-sans font-medium text-xs text-[#171714] mb-1">
                      1. PREMISES & LEASE TERM
                    </p>
                    <p className="text-[#6B6962] leading-normal font-sans">
                      Landlord leases Apartment 4B at 412 Waverly Terrace for a fixed term of twelve (12) calendar months, commencing on October 1, 2026, and ending at 11:59 PM on September 30, 2027.
                    </p>
                  </div>

                  {/* Clause 2 */}
                  <div 
                    onClick={() => setActiveClauseIndex(1)}
                    className={`p-2.5 rounded transition-all cursor-pointer border ${
                      activeClauseIndex === 1 
                        ? 'bg-[#C9A646]/10 border-[#C9A646]' 
                        : 'border-transparent hover:bg-[#EBE8E1]/60'
                    }`}
                  >
                    <p className="font-sans font-medium text-xs text-[#171714] mb-1">
                      2. RENT & LATE SURCHARGE
                    </p>
                    <p className="text-[#6B6962] leading-normal font-sans">
                      Monthly rent of $3,250.00 payable on the first day of each month. A grace period is provided until the 5th day; thereafter, a late surcharge of $150.00 or 5% applies.
                    </p>
                  </div>

                  {/* Clause 3 */}
                  <div 
                    onClick={() => setActiveClauseIndex(2)}
                    className={`p-2.5 rounded transition-all cursor-pointer border ${
                      activeClauseIndex === 2 
                        ? 'bg-[#C9A646]/10 border-[#C9A646]' 
                        : 'border-transparent hover:bg-[#EBE8E1]/60'
                    }`}
                  >
                    <p className="font-sans font-medium text-xs text-[#171714] mb-1">
                      3. SECURITY DEPOSIT ESCROW
                    </p>
                    <p className="text-[#6B6962] leading-normal font-sans">
                      Deposit of $3,250.00 shall be held in an interest-bearing escrow account at First Commercial Bank. Returnable within thirty (30) days following surrender with an itemized statement.
                    </p>
                  </div>

                  {/* Clause 5 (Early Termination - Highlighted) */}
                  <div 
                    onClick={() => setActiveClauseIndex(4)}
                    className={`p-3 rounded transition-all cursor-pointer border relative ${
                      activeClauseIndex === 4 
                        ? 'bg-[#C9A646]/15 border-[#C9A646] ring-1 ring-[#C9A646]/30' 
                        : 'border-dashed border-[#C9A646]/60 bg-[#C9A646]/5 hover:bg-[#C9A646]/10'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-sans font-medium text-xs text-[#171714]">
                        5. EARLY TERMINATION & ADMINISTRATIVE FEES
                      </span>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#9F7D24] font-medium bg-[#C9A646]/20 px-1.5 py-0.5 rounded">
                        Requires Notice
                      </span>
                    </div>
                    <p className="text-[#171714] leading-normal font-sans">
                      "Either party may terminate this Agreement prior to expiration only upon delivering <mark className="bg-[#C9A646]/30 text-[#171714] px-0.5 rounded">sixty (60) days' prior written notice</mark>. If Tenant vacates prior to month six (6), Tenant agrees to <mark className="bg-[#C9A646]/30 text-[#171714] px-0.5 rounded">forfeit one-half of the initial security deposit</mark> as liquidated administrative transition fees..."
                    </p>
                  </div>

                </div>

                <div className="mt-6 pt-4 border-t border-[#D8D5CE]/60 flex items-center justify-between text-xs text-[#6B6962]">
                  <span className="font-mono text-[11px]">Click clauses to examine AI insights</span>
                  <span className="font-mono text-[11px]">Page 1 of 4</span>
                </div>
              </div>

              {/* Right Margin AI Analysis Card */}
              <div className="lg:col-span-5 p-6 sm:p-7 bg-[#F4F2ED] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#C9A646]" />
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#6B6962] font-semibold">
                        AI Insight Panel
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-[#6B6962]">
                      {activeClause.section}
                    </span>
                  </div>

                  {/* Active Analysis Box */}
                  <div className="bg-white border border-[#D8D5CE] rounded-md p-4 shadow-sm mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-serif text-lg text-[#171714] font-medium">
                        {activeClause.title}
                      </h4>
                      <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded font-medium ${
                        activeClause.attentionLevel === 'caution'
                          ? 'bg-[#A64B43]/10 text-[#A64B43]'
                          : activeClause.attentionLevel === 'notice'
                          ? 'bg-[#A47732]/10 text-[#A47732]'
                          : 'bg-[#557A5A]/10 text-[#557A5A]'
                      }`}>
                        {activeClause.category}
                      </span>
                    </div>

                    <p className="text-xs text-[#171714] leading-relaxed mb-3">
                      {activeClause.plainExplanation}
                    </p>

                    <div className="p-2.5 bg-[#FAF8F5] border-l-2 border-[#C9A646] rounded-r text-[11px] text-[#6B6962] leading-normal">
                      <span className="font-medium text-[#171714] block mb-0.5">Practical Implication:</span>
                      {activeClause.implication}
                    </div>

                    {activeClause.keyObligations && (
                      <div className="mt-3 pt-2.5 border-t border-[#D8D5CE]/60">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-[#6B6962] block mb-1">
                          Key Conditions:
                        </span>
                        <ul className="space-y-1">
                          {activeClause.keyObligations.map((ob, idx) => (
                            <li key={idx} className="text-[11px] text-[#171714] flex items-center gap-1.5">
                              <span className="w-1 h-1 rounded-full bg-[#C9A646]" />
                              <span>{ob}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Grounded Citation Preview */}
                  <div className="text-[11px] text-[#6B6962] space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] uppercase tracking-wider">Grounding Source:</span>
                      <span className="font-mono text-[10px] text-[#171714] font-medium">
                        [{activeClause.section} · Page {activeClause.page}]
                      </span>
                    </div>
                    <p className="italic text-[#6B6962] text-[11px] line-clamp-2 bg-[#EBE8E1]/50 p-2 rounded border border-[#D8D5CE]/40">
                      "{activeClause.excerpt}"
                    </p>
                  </div>
                </div>

                {/* Open in Studio Button */}
                <div className="mt-6 pt-4 border-t border-[#D8D5CE]">
                  <button
                    onClick={onOpenWorkspace}
                    className="w-full text-xs font-medium bg-[#171714] text-[#F4F2ED] py-2.5 px-3 rounded hover:bg-[#2A2A26] transition-colors flex items-center justify-center gap-2"
                  >
                    <span>Open in Document Studio</span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#C9A646]" />
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
