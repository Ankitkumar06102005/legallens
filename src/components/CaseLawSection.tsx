import React, { useState } from 'react';
import { Scale, ArrowUpRight, BookOpen, X, ChevronRight, ExternalLink } from 'lucide-react';
import { CASE_PRECEDENTS, CasePrecedent } from '../data/casePrecedents';

export const CaseLawSection: React.FC = () => {
  const [selectedPrecedent, setSelectedPrecedent] = useState<CasePrecedent | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('All');

  const categories = ['All', 'Contract Law', 'Tenancy & Property', 'Damages & Liability', 'Intellectual Property'];

  const filteredPrecedents = activeFilter === 'All'
    ? CASE_PRECEDENTS
    : CASE_PRECEDENTS.filter(p => p.category === activeFilter);

  return (
    <section id="case-law" className="py-20 md:py-32 border-b border-[#D8D5CE] bg-[#FAF8F5]">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-6 border-b border-[#D8D5CE]">
          <div>
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C9A646]" />
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#6B6962]">
                Jurisprudence Engine
              </span>
            </div>

            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#171714] leading-[1.08] tracking-tight">
              Explore the law behind the language.
            </h2>
          </div>

          <p className="text-sm text-[#6B6962] max-w-md leading-relaxed">
            Discover related legal concepts and relevant case precedents to deepen your understanding of why clauses are drafted the way they are.
          </p>
        </div>

        {/* Filter Segmented Control */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-3.5 py-1.5 rounded text-xs font-medium whitespace-nowrap transition-colors border ${
                activeFilter === cat
                  ? 'bg-[#171714] text-[#F4F2ED] border-[#171714]'
                  : 'bg-white text-[#6B6962] border-[#D8D5CE] hover:text-[#171714] hover:bg-[#EBE8E1]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Precedents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrecedents.map((prec) => (
            <div
              key={prec.id}
              className="bg-white border border-[#D8D5CE] rounded-lg p-6 flex flex-col justify-between hover:border-[#C9A646]/80 transition-all shadow-xs group"
            >
              <div>
                {/* Category & Section Tag */}
                <div className="flex items-center justify-between gap-2 mb-3 text-xs">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#6B6962]">
                    {prec.category}
                  </span>
                  <span className="font-mono text-[11px] text-[#C9A646] font-medium">
                    {prec.sectionOrCitation}
                  </span>
                </div>

                <h3 className="font-serif text-2xl text-[#171714] font-medium mb-1.5 group-hover:text-[#9F7D24] transition-colors">
                  {prec.actOrCase}
                </h3>

                <div className="text-xs font-medium text-[#171714] mb-3">
                  {prec.principle}
                </div>

                <p className="text-xs text-[#6B6962] leading-relaxed mb-4">
                  {prec.summary}
                </p>

                <div className="p-2.5 bg-[#FAF8F5] border-l-2 border-[#C9A646] rounded-r text-[11px] text-[#171714] leading-normal">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[#6B6962] block mb-0.5">
                    Relevance in Contracts:
                  </span>
                  {prec.appliedContext}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#D8D5CE]/60 flex items-center justify-between">
                <span className="text-[10px] font-mono text-[#6B6962]">
                  {prec.jurisdiction}
                </span>

                <button
                  onClick={() => setSelectedPrecedent(prec)}
                  className="text-xs font-medium text-[#171714] hover:text-[#C9A646] flex items-center gap-1 transition-colors"
                >
                  <span>Explore precedent</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal for Deep Dive Case Precedent */}
        {selectedPrecedent && (
          <div className="fixed inset-0 z-50 bg-[#171714]/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
            <div className="bg-[#FAF8F5] border border-[#D8D5CE] rounded-lg max-w-2xl w-full p-6 sm:p-8 shadow-xl max-h-[90vh] overflow-y-auto">
              
              <div className="flex items-start justify-between pb-4 mb-4 border-b border-[#D8D5CE]">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#C9A646] block">
                    {selectedPrecedent.category} · {selectedPrecedent.jurisdiction}
                  </span>
                  <h3 className="font-serif text-3xl text-[#171714] font-medium mt-1">
                    {selectedPrecedent.actOrCase}
                  </h3>
                  <p className="text-xs font-mono text-[#6B6962] mt-0.5">
                    Citation: {selectedPrecedent.sectionOrCitation}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedPrecedent(null)}
                  className="p-1.5 hover:bg-[#EBE8E1] rounded text-[#171714] transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs sm:text-sm">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#6B6962] block mb-1">
                    Operative Legal Principle
                  </span>
                  <p className="font-medium text-[#171714] text-base font-serif">
                    {selectedPrecedent.principle}
                  </p>
                </div>

                <div className="p-4 bg-white border border-[#D8D5CE] rounded-md">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#6B6962] block mb-1.5">
                    Comprehensive Analysis & Holding
                  </span>
                  <p className="text-[#171714] leading-relaxed">
                    {selectedPrecedent.fullAnalysis}
                  </p>
                </div>

                <div className="p-3 bg-[#FAF8F5] border-l-2 border-[#C9A646] rounded-r">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#6B6962] block mb-1">
                    How LEGALENS Applies This to Your Documents
                  </span>
                  <p className="text-xs text-[#171714] leading-normal">
                    {selectedPrecedent.appliedContext}
                  </p>
                </div>

                <div className="pt-2 text-[11px] text-[#6B6962] flex items-center justify-between">
                  <span>Educational statutory reference</span>
                  <span className="italic">Not formal legal representation</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#D8D5CE] flex justify-end">
                <button
                  onClick={() => setSelectedPrecedent(null)}
                  className="bg-[#171714] text-[#F4F2ED] text-xs font-medium px-4 py-2 rounded hover:bg-[#2A2A26] transition-colors"
                >
                  Close Precedent Analysis
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
};
