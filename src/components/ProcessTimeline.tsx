import React from 'react';
import { Upload, Search, MessageSquare, Download } from 'lucide-react';

export const ProcessTimeline: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'Upload',
      subtitle: 'Drop in your agreement',
      description: 'Upload PDF, DOCX, or plain text agreements. OCR and parsing automatically segment clause boundaries.',
      icon: Upload
    },
    {
      number: '02',
      title: 'Analyze',
      subtitle: 'Review extracted structure',
      description: 'Review classified clauses, affirmative obligations, and financial commitments in plain English.',
      icon: Search
    },
    {
      number: '03',
      title: 'Ask & Verify',
      subtitle: 'Explore grounded answers',
      description: 'Ask specific questions with natural language and receive answers pinned directly to exact bracketed citations.',
      icon: MessageSquare
    },
    {
      number: '04',
      title: 'Export & Decide',
      subtitle: 'Carry insights forward',
      description: 'Generate an annotated document with margin notes to review offline or share with counsel before signing.',
      icon: Download
    }
  ];

  return (
    <section id="how-it-works" className="py-20 md:py-32 border-b border-[#D8D5CE] bg-[#F4F2ED]">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A646]" />
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#6B6962]">
              Workflow Simplicity
            </span>
          </div>

          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#171714] leading-[1.08] tracking-tight mb-4">
            Four steps.<br />
            Clearer answers.
          </h2>

          <p className="text-base sm:text-lg text-[#6B6962] leading-relaxed">
            From initial document ingest to grounded understanding and exportable review summaries.
          </p>
        </div>

        {/* Desktop Horizontal Process Timeline */}
        <div className="hidden lg:grid lg:grid-cols-4 gap-8 relative">
          
          {/* Subtle horizontal connecting rule */}
          <div className="absolute top-7 left-12 right-12 h-[1px] bg-[#D8D5CE] -z-0" />

          {steps.map((step) => {
            const IconComp = step.icon;
            return (
              <div key={step.number} className="relative z-10 flex flex-col items-start group">
                <div className="w-14 h-14 rounded-full bg-white border border-[#D8D5CE] flex items-center justify-center font-serif text-lg text-[#171714] mb-6 shadow-xs group-hover:border-[#C9A646] transition-colors">
                  <span className="font-mono text-sm text-[#C9A646] font-semibold">{step.number}</span>
                </div>

                <h3 className="font-serif text-2xl text-[#171714] font-medium mb-1">
                  {step.title}
                </h3>

                <p className="text-xs font-mono uppercase tracking-wider text-[#6B6962] mb-2.5">
                  {step.subtitle}
                </p>

                <p className="text-xs sm:text-[13px] text-[#6B6962] leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Mobile & Tablet Vertical Timeline */}
        <div className="lg:hidden space-y-8 relative pl-6 border-l border-[#D8D5CE]">
          {steps.map((step) => {
            const IconComp = step.icon;
            return (
              <div key={step.number} className="relative pl-4 group">
                {/* Bullet */}
                <div className="absolute -left-[31px] top-1 w-6 h-6 rounded-full bg-white border border-[#C9A646] flex items-center justify-center text-[10px] font-mono font-medium text-[#171714]">
                  {step.number}
                </div>

                <h3 className="font-serif text-2xl text-[#171714] font-medium mb-0.5">
                  {step.title}
                </h3>

                <p className="text-xs font-mono uppercase tracking-wider text-[#6B6962] mb-2">
                  {step.subtitle}
                </p>

                <p className="text-xs text-[#6B6962] leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
