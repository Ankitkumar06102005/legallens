import React, { useState } from 'react';
import { ArrowUpRight, ChevronRight, CheckCircle2, ShieldAlert, FileText, Scale } from 'lucide-react';

interface CategoryItem {
  number: string;
  label: string;
  subtitle: string;
  detail: string;
  extractedExample: string;
  sourceDoc: string;
  practicalValue: string;
}

const CATEGORIES: CategoryItem[] = [
  {
    number: '01',
    label: 'Key Terms',
    subtitle: 'Parties, dates, consideration & essential covenants',
    detail: 'Isolates contractual fundamentals so you can immediately see who is legally bound, the operative dates, and the core transaction values.',
    extractedExample: 'Julian Vance & Sarah Lin (Tenants) · 12-Month Lease · $3,250.00 Monthly Rent',
    sourceDoc: 'Residential Lease Agreement · Sec 1–2',
    practicalValue: 'Prevents overlooked effective dates and misidentified contracting entities.'
  },
  {
    number: '02',
    label: 'Important Clauses',
    subtitle: 'Provisions governing breach, renewal & dispute pathways',
    detail: 'Surfaces governing law, dispute escalation mechanisms, confidentiality standards, and statutory escrow requirements.',
    extractedExample: 'Security Deposit of $3,250.00 held in statutory escrow; refund required within 30 days of surrender.',
    sourceDoc: 'Residential Lease Agreement · Sec 3',
    practicalValue: 'Ensures statutory rights regarding deposits and judicial remedies are honored.'
  },
  {
    number: '03',
    label: 'Obligations',
    subtitle: 'Affirmative duties and recurring compliance requirements',
    detail: 'Extracts action items required of each party, distinguishing tenant duties from landlord covenants or client milestones.',
    extractedExample: 'Tenant must maintain sanitary premises and provide prompt written notice of structural repairs >$250.',
    sourceDoc: 'Residential Lease Agreement · Sec 4',
    practicalValue: 'Turns static boilerplate into an actionable checklist of compliance duties.'
  },
  {
    number: '04',
    label: 'Risks & Conditions',
    subtitle: 'Liquidated damages, forfeiture terms & notice horizons',
    detail: 'Flags conditions that carry financial penalties, forfeiture risks, or asymmetric notice requirements before you execute.',
    extractedExample: 'Early lease termination before month 6 forfeits 50% of deposit; requires 60 days advance written notice.',
    sourceDoc: 'Residential Lease Agreement · Sec 5',
    practicalValue: 'Eliminates unexpected fees and provides advance warning on strict notice periods.'
  },
  {
    number: '05',
    label: 'Definitions',
    subtitle: 'Clarifications for domain-specific terminology & jargon',
    detail: 'Breaks down complex legalisms (such as "Indemnification", "Severability", "Force Majeure", "Liquidated Damages") into plain language.',
    extractedExample: '"Liquidated Damages": A pre-determined sum agreed to in advance to compensate for administrative losses if breached.',
    sourceDoc: 'Legal Glossary & Statutory Interpretation',
    practicalValue: 'Translates archaic legalese into clear, accessible concepts for non-lawyers.'
  }
];

export const UnderstandSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<number>(0);

  return (
    <section id="understand" className="py-20 md:py-32 border-b border-[#D8D5CE] bg-[#F4F2ED]">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
        
        {/* Section Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Editorial Statement */}
          <div className="lg:col-span-5">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C9A646]" />
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#6B6962]">
                Structure & Taxonomy
              </span>
            </div>

            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#171714] leading-[1.08] tracking-tight mb-6">
              Read.<br />
              Understand.<br />
              Decide.
            </h2>

            <p className="text-base text-[#6B6962] leading-relaxed mb-8">
              LEGALENS transforms dense legal language into organized, understandable insights so you can focus on what matters.
            </p>

            {/* Active Category Deep Dive Card */}
            <div className="bg-white border border-[#D8D5CE] p-6 rounded-lg shadow-sm hidden sm:block">
              <div className="flex items-center justify-between mb-3 text-xs">
                <span className="font-mono text-[#C9A646] font-medium">
                  {CATEGORIES[selectedCategory].number} / TAXONOMY CLASS
                </span>
                <span className="text-[#6B6962] font-mono text-[11px]">
                  {CATEGORIES[selectedCategory].sourceDoc}
                </span>
              </div>

              <h4 className="font-serif text-xl text-[#171714] font-medium mb-2">
                {CATEGORIES[selectedCategory].label}
              </h4>

              <p className="text-xs text-[#6B6962] leading-relaxed mb-4">
                {CATEGORIES[selectedCategory].detail}
              </p>

              <div className="p-3 bg-[#FAF8F5] border border-[#D8D5CE]/80 rounded text-xs">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#6B6962] block mb-1">
                  Extracted Clause Preview:
                </span>
                <p className="text-[#171714] italic font-serif text-[13px] leading-relaxed">
                  "{CATEGORIES[selectedCategory].extractedExample}"
                </p>
                <div className="mt-2 pt-2 border-t border-[#D8D5CE]/60 text-[11px] text-[#557A5A] font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{CATEGORIES[selectedCategory].practicalValue}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Category Rows */}
          <div className="lg:col-span-7">
            <div className="divide-y divide-[#D8D5CE] border-y border-[#D8D5CE]">
              {CATEGORIES.map((item, index) => {
                const isSelected = selectedCategory === index;
                return (
                  <div
                    key={item.number}
                    onClick={() => setSelectedCategory(index)}
                    className={`py-5 px-4 transition-all duration-200 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group ${
                      isSelected
                        ? 'bg-white/80'
                        : 'hover:bg-[#EBE8E1]/50'
                    }`}
                  >
                    <div className="flex items-start gap-4 sm:gap-6">
                      <span className={`font-mono text-sm tracking-wider transition-colors pt-0.5 ${
                        isSelected ? 'text-[#C9A646] font-medium' : 'text-[#6B6962] group-hover:text-[#171714]'
                      }`}>
                        {item.number}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-serif text-xl sm:text-2xl text-[#171714] font-medium group-hover:translate-x-0.5 transition-transform">
                            {item.label}
                          </h3>
                          {isSelected && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A646]" />
                          )}
                        </div>
                        <p className="text-xs text-[#6B6962] mt-1 leading-normal">
                          {item.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <span className={`text-[11px] font-mono transition-opacity ${
                        isSelected ? 'text-[#171714] opacity-100' : 'text-[#6B6962] opacity-0 group-hover:opacity-100'
                      }`}>
                        Examine
                      </span>
                      <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${
                        isSelected ? 'rotate-90 text-[#C9A646]' : 'text-[#6B6962] group-hover:translate-x-0.5'
                      }`} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Mobile Category detail preview */}
            <div className="sm:hidden mt-6 bg-white border border-[#D8D5CE] p-4 rounded-lg">
              <h4 className="font-serif text-lg text-[#171714] font-medium mb-1">
                {CATEGORIES[selectedCategory].label}
              </h4>
              <p className="text-xs text-[#6B6962] mb-3">
                {CATEGORIES[selectedCategory].detail}
              </p>
              <div className="p-2.5 bg-[#FAF8F5] border border-[#D8D5CE] rounded text-xs italic font-serif">
                "{CATEGORIES[selectedCategory].extractedExample}"
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
