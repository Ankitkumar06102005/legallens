import React, { useState } from 'react';
import { 
  FileText, 
  KeyRound, 
  MessageSquare, 
  Scale, 
  Download, 
  ShieldCheck, 
  ArrowUpRight, 
  ChevronRight, 
  Check 
} from 'lucide-react';

interface FeatureItem {
  number: string;
  name: string;
  oneLiner: string;
  description: string;
  icon: React.ElementType;
  previewTag: string;
  previewDetails: string[];
}

const FEATURES: FeatureItem[] = [
  {
    number: '01',
    name: 'AI Document Analysis',
    oneLiner: 'Extract meaningful information from legal documents with structural precision.',
    description: 'Parses complex multi-page contracts, linearizes tables, isolates recitals, and decomposes dense prose into distinct clauses without breaking cross-references.',
    icon: FileText,
    previewTag: 'Structural Ingestion',
    previewDetails: ['Clause boundary segmentation', 'Exemption detection', 'Schedule & exhibit mapping']
  },
  {
    number: '02',
    name: 'Smart Keyword & Entity Extraction',
    oneLiner: 'Identify important legal terms, defined phrases, and contracting entities.',
    description: 'Surfaces governing jurisdictions, effective dates, consideration values, defined term directories, and parties bound by affirmative covenants.',
    icon: KeyRound,
    previewTag: 'Entity Resolution',
    previewDetails: ['Defined term cross-indexing', 'Financial thresholds ($)', 'Calendar notice deadlines']
  },
  {
    number: '03',
    name: 'Legal RAG Document Chatbot',
    oneLiner: 'Ask questions in natural language and receive context-grounded responses.',
    description: 'Grounds every AI response strictly in the retrieved clauses of your document, providing exact bracket citations [Section, Page] rather than speculative advice.',
    icon: MessageSquare,
    previewTag: 'Strict Retrieval',
    previewDetails: ['Zero-hallucination guardrails', 'Inline section citations', 'Plain-language synthesis']
  },
  {
    number: '04',
    name: 'Case-Law & Precedent Discovery',
    oneLiner: 'Explore relevant legal precedents and statutory principles behind clauses.',
    description: 'Connects standard provisions (e.g. liquidated damages, unconscionability, trade secret survival) with authoritative statutory references and governing jurisprudence.',
    icon: Scale,
    previewTag: 'Jurisprudence Bridge',
    previewDetails: ['Statutory references (ICA, UCC, TPA)', 'Common law precedents', 'Standard legal tests']
  },
  {
    number: '05',
    name: 'Annotated Document Export',
    oneLiner: 'Download documents with highlighted clauses and organized explanations.',
    description: 'Generate clean, shareable document reviews complete with margin notes, highlighted operative terms, and categorized attention flags for offline review.',
    icon: Download,
    previewTag: 'Print & PDF Ready',
    previewDetails: ['Margin notes & callouts', 'Color-coded condition tags', 'Shareable review summary']
  },
  {
    number: '06',
    name: 'Secure Document Workspace',
    oneLiner: 'Present privacy and security practices accurately with client-isolated parsing.',
    description: 'Documents are processed ephemerally within isolated runtime sandboxes. Your private contracts are never retained or utilized to train general AI models.',
    icon: ShieldCheck,
    previewTag: 'Zero-Retention Model',
    previewDetails: ['Ephemeral memory processing', 'TLS 1.3 encrypted transit', 'No model retraining']
  }
];

interface FeaturesSectionProps {
  onOpenWorkspace: () => void;
}

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({ onOpenWorkspace }) => {
  const [activeFeature, setActiveFeature] = useState<number>(0);

  return (
    <section id="capabilities" className="py-20 md:py-32 border-b border-[#D8D5CE] bg-[#F4F2ED]">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-6 border-b border-[#D8D5CE]">
          <div>
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C9A646]" />
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#6B6962]">
                Core Platform Capabilities
              </span>
            </div>
            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#171714] leading-[1.08] tracking-tight">
              Know what matters.
            </h2>
          </div>
          <p className="text-sm text-[#6B6962] max-w-md leading-relaxed">
            A cohesive suite of document intelligence tools designed to help you read, query, and verify contracts with speed and peace of mind.
          </p>
        </div>

        {/* Alternating Layout: Left Feature List & Right Interactive Spotlight */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left: Numbered Editorial Rows */}
          <div className="lg:col-span-7 divide-y divide-[#D8D5CE] border-y border-[#D8D5CE]">
            {FEATURES.map((feat, idx) => {
              const isActive = activeFeature === idx;
              const IconComp = feat.icon;

              return (
                <div
                  key={feat.number}
                  onClick={() => setActiveFeature(idx)}
                  className={`py-5 px-4 transition-all cursor-pointer group ${
                    isActive ? 'bg-white/80 rounded-sm' : 'hover:bg-[#EBE8E1]/60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 sm:gap-6">
                      <span className={`font-mono text-xs pt-1 tracking-wider ${
                        isActive ? 'text-[#C9A646] font-medium' : 'text-[#6B6962] group-hover:text-[#171714]'
                      }`}>
                        {feat.number}
                      </span>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-serif text-xl sm:text-2xl text-[#171714] font-medium">
                            {feat.name}
                          </h3>
                          {isActive && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A646]" />
                          )}
                        </div>
                        <p className="text-xs sm:text-sm text-[#6B6962] leading-relaxed">
                          {feat.oneLiner}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 pt-1">
                      <IconComp className={`w-4 h-4 transition-colors ${
                        isActive ? 'text-[#C9A646]' : 'text-[#6B6962] group-hover:text-[#171714]'
                      }`} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Feature Spotlight Panel */}
          <div className="lg:col-span-5 sticky top-28">
            <div className="bg-white border border-[#D8D5CE] rounded-lg p-7 shadow-sm">
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#D8D5CE]">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-semibold text-[#C9A646]">
                    CAPABILITY {FEATURES[activeFeature].number}
                  </span>
                  <span className="text-[#D8D5CE]">/</span>
                  <span className="text-[11px] font-mono text-[#6B6962]">
                    {FEATURES[activeFeature].previewTag}
                  </span>
                </div>
                <button
                  onClick={onOpenWorkspace}
                  className="text-xs text-[#171714] hover:text-[#C9A646] flex items-center gap-1 transition-colors"
                >
                  <span>Test live</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <h4 className="font-serif text-2xl sm:text-3xl text-[#171714] font-medium mb-3">
                {FEATURES[activeFeature].name}
              </h4>

              <p className="text-xs sm:text-sm text-[#6B6962] leading-relaxed mb-6">
                {FEATURES[activeFeature].description}
              </p>

              {/* Verified Sub-capabilities */}
              <div className="bg-[#FAF8F5] border border-[#D8D5CE] rounded p-4 mb-6">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#6B6962] block mb-2.5">
                  Platform Verification Specs:
                </span>
                <ul className="space-y-2">
                  {FEATURES[activeFeature].previewDetails.map((detail, dIdx) => (
                    <li key={dIdx} className="text-xs text-[#171714] flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-[#EBE8E1] flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5 text-[#557A5A]" />
                      </div>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={onOpenWorkspace}
                className="w-full bg-[#171714] text-[#F4F2ED] text-xs font-medium py-3 rounded hover:bg-[#2A2A26] transition-colors flex items-center justify-center gap-2"
              >
                <span>Launch Document Workspace</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#C9A646]" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
