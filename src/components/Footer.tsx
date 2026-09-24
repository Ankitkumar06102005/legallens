import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#FAF8F5] border-t border-[#D8D5CE] py-16 text-xs text-[#6B6962]">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
        
        {/* Top Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#D8D5CE]">
          
          {/* Brand & Description */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-7 h-7 rounded-full border border-[#171714] flex items-center justify-center">
                <div className="w-3 h-3 rounded-full border border-[#C9A646] flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-[#171714]" />
                </div>
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-[#171714]">
                LEGALENS
              </span>
            </div>

            <p className="text-xs text-[#6B6962] leading-relaxed max-w-sm mb-4">
              AI-powered legal document intelligence. Helping individuals, founders, and professionals understand complex agreements with clarity.
            </p>

            <div className="text-[11px] text-[#6B6962]">
              Standardized on New York, Common Law & Statutory frameworks.
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-2">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#171714] font-semibold block mb-3">
              Platform
            </span>
            <ul className="space-y-2">
              <li>
                <a href="#how-it-works" className="hover:text-[#171714] transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#understand" className="hover:text-[#171714] transition-colors">
                  Taxonomy
                </a>
              </li>
              <li>
                <a href="#capabilities" className="hover:text-[#171714] transition-colors">
                  Capabilities
                </a>
              </li>
              <li>
                <a href="#assistant" className="hover:text-[#171714] transition-colors">
                  Interactive Assistant
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#171714] font-semibold block mb-3">
              Research & Jurisprudence
            </span>
            <ul className="space-y-2">
              <li>
                <a href="#case-law" className="hover:text-[#171714] transition-colors">
                  Case Precedents
                </a>
              </li>
              <li>
                <a href="#security" className="hover:text-[#171714] transition-colors">
                  Security Architecture
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-[#171714] transition-colors">
                  Document Types
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#171714] font-semibold block mb-3">
              Legal Disclaimer
            </span>
            <p className="text-[11px] leading-relaxed text-[#6B6962] bg-white p-3 border border-[#D8D5CE] rounded">
              LEGALENS provides AI-generated informational insights and document analysis. It does not provide legal advice and does not replace the counsel of a licensed attorney.
            </p>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#6B6962]">
          <div>
            © 2026 LEGALENS. All rights reserved.
          </div>
          
          <div className="flex items-center gap-6">
            <a href="#security" className="hover:text-[#171714] transition-colors">
              Privacy Commitments
            </a>
            <span>·</span>
            <a href="#security" className="hover:text-[#171714] transition-colors">
              Data Practices
            </a>
            <span>·</span>
            <a href="#assistant" className="hover:text-[#171714] transition-colors">
              Grounded AI Framework
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};
