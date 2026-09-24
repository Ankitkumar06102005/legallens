import React from 'react';
import { ArrowUpRight, ArrowRight } from 'lucide-react';

interface FinalCTAProps {
  onOpenWorkspace: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onOpenWorkspace }) => {
  return (
    <section className="py-24 md:py-36 bg-[#181817] text-[#F4F2ED] border-b border-[#2A2A26]">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12 text-center">
        
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A646]" />
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#D8D5CE]/80">
              Start Reading with Clarity
            </span>
          </div>

          <h2 className="font-serif text-4xl sm:text-6xl md:text-7xl text-[#F4F2ED] leading-[1.06] tracking-tight mb-6">
            Read the document.<br />
            Understand the details.
          </h2>

          <p className="text-base sm:text-lg text-[#D8D5CE]/80 leading-relaxed max-w-xl mx-auto mb-10">
            Explore a simpler way to understand legal documents. Decompose complex clauses, ask questions, and review with confidence.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <button
              onClick={onOpenWorkspace}
              className="w-full sm:w-auto bg-[#F4F2ED] text-[#171714] text-sm font-medium px-7 py-3.5 rounded hover:bg-[#EBE8E1] transition-all flex items-center justify-center gap-2 font-sans tracking-wide"
            >
              <span>Try LEGALENS</span>
              <ArrowUpRight className="w-4 h-4 text-[#9F7D24]" />
            </button>

            <a
              href="#how-it-works"
              className="w-full sm:w-auto border border-[#3A3A35] hover:border-[#6B6962] text-[#F4F2ED] text-sm font-medium px-7 py-3.5 rounded transition-colors flex items-center justify-center gap-2 font-sans"
            >
              <span>Explore how it works</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#D8D5CE]" />
            </a>
          </div>

          <p className="text-xs text-[#D8D5CE]/60">
            Client-isolated processing · Grounded context retrieval · Zero model retraining
          </p>
        </div>

      </div>
    </section>
  );
};
