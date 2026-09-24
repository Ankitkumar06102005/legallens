import React from 'react';
import { Users, BookOpen, Building2, Briefcase, GraduationCap, Compass } from 'lucide-react';

export const BrandStory: React.FC = () => {
  const audiences = [
    { label: 'Startup Founders', desc: 'Review vendor MSAs, IP assignments, and client terms before signing.', icon: Building2 },
    { label: 'Freelancers & Contractors', desc: 'Spot delayed payment clauses, excessive scope creep, or unfair liability.', icon: Briefcase },
    { label: 'Tenants & Individuals', desc: 'Decipher residential leases, security deposit rules, and notice periods.', icon: Users },
    { label: 'Law Students & Researchers', desc: 'Examine contract structures and explore the case precedents behind them.', icon: GraduationCap }
  ];

  return (
    <section className="py-20 md:py-32 border-b border-[#D8D5CE] bg-[#FAF8F5]">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left: Brand Philosophy */}
          <div className="lg:col-span-6">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C9A646]" />
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#6B6962]">
                Our Philosophy
              </span>
            </div>

            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#171714] leading-[1.08] tracking-tight mb-6">
              Legal intelligence,<br />
              designed for clarity.
            </h2>

            <p className="text-base text-[#171714] leading-relaxed mb-4">
              LEGALENS was created from a simple conviction: legal documents are complex, but understanding them shouldn't be.
            </p>

            <p className="text-sm text-[#6B6962] leading-relaxed mb-6">
              Most people encounter contracts during defining life moments — signing a lease, accepting an employment offer, launching a venture, or engaging a key client. Too often, impenetrable terminology and dense legalese force individuals to sign blindly or feel intimidated.
            </p>

            <div className="p-4 bg-white border border-[#D8D5CE] rounded-lg text-xs leading-relaxed text-[#171714] border-l-3 border-l-[#C9A646]">
              "We believe AI should not produce vague summaries or generic advice. It should act as an attentive magnifying glass — illuminating specific clauses, clarifying terminology, and grounding every answer in the document you hold."
            </div>
          </div>

          {/* Right: Target Audience Focus */}
          <div className="lg:col-span-6">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#6B6962] block mb-4">
              Built for Those Navigating Contracts:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {audiences.map((aud, idx) => {
                const IconComp = aud.icon;
                return (
                  <div
                    key={idx}
                    className="p-5 bg-white border border-[#D8D5CE] rounded-lg shadow-2xs flex flex-col justify-between hover:border-[#C9A646]/80 transition-colors"
                  >
                    <div>
                      <div className="w-8 h-8 rounded-full bg-[#FAF8F5] border border-[#D8D5CE] flex items-center justify-center mb-3">
                        <IconComp className="w-4 h-4 text-[#C9A646]" />
                      </div>
                      <h3 className="font-serif text-lg text-[#171714] font-medium mb-1">
                        {aud.label}
                      </h3>
                      <p className="text-xs text-[#6B6962] leading-relaxed">
                        {aud.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
