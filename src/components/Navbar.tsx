import React, { useState } from 'react';
import { FileText, Menu, X, ArrowUpRight, Compass, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  onOpenWorkspace: () => void;
  onSelectDoc: (docId: string) => void;
  currentDocTitle: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenWorkspace,
  onSelectDoc,
  currentDocTitle
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#F4F2ED]/95 backdrop-blur-md border-b border-[#D8D5CE] transition-all">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12 h-18 flex items-center justify-between">
        
        {/* Brand Zone */}
        <a href="#" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-full border border-[#171714] flex items-center justify-center relative transition-transform duration-300 group-hover:scale-105">
            <div className="w-3.5 h-3.5 rounded-full border border-[#C9A646] flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-[#171714]" />
            </div>
          </div>
          <span className="font-serif text-2xl font-bold tracking-tight text-[#171714]">
            LEGALENS
          </span>
        </a>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-[13px] tracking-wide text-[#6B6962] font-medium">
          <a href="#how-it-works" className="hover:text-[#171714] transition-colors py-1">
            How It Works
          </a>
          <a href="#understand" className="hover:text-[#171714] transition-colors py-1">
            Analysis
          </a>
          <a href="#capabilities" className="hover:text-[#171714] transition-colors py-1">
            Capabilities
          </a>
          <a href="#assistant" className="hover:text-[#171714] transition-colors py-1">
            AI Assistant
          </a>
          <a href="#case-law" className="hover:text-[#171714] transition-colors py-1">
            Case Law
          </a>
          <a href="#security" className="hover:text-[#171714] transition-colors py-1">
            Security
          </a>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onSelectDoc('residential-lease')}
            className="hidden lg:flex items-center gap-1.5 text-xs text-[#6B6962] hover:text-[#171714] px-3 py-1.5 rounded-md hover:bg-[#EBE8E1] transition-colors"
            title="Active document context"
          >
            <FileText className="w-3.5 h-3.5 text-[#C9A646]" />
            <span className="truncate max-w-[140px]">{currentDocTitle}</span>
          </button>

          <button
            onClick={onOpenWorkspace}
            className="bg-[#171714] text-[#F4F2ED] text-xs font-medium px-4 py-2 rounded hover:bg-[#2A2A26] active:scale-[0.98] transition-all flex items-center gap-1.5 tracking-wide shadow-sm"
          >
            <span>Try LEGALENS</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#C9A646]" />
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#171714] hover:bg-[#EBE8E1] rounded transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#F4F2ED] border-b border-[#D8D5CE] px-6 py-5 flex flex-col gap-4 text-sm font-medium text-[#171714] animate-fadeIn">
          <a
            href="#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="py-1.5 border-b border-[#D8D5CE]/60"
          >
            How It Works
          </a>
          <a
            href="#understand"
            onClick={() => setMobileMenuOpen(false)}
            className="py-1.5 border-b border-[#D8D5CE]/60"
          >
            Document Analysis
          </a>
          <a
            href="#capabilities"
            onClick={() => setMobileMenuOpen(false)}
            className="py-1.5 border-b border-[#D8D5CE]/60"
          >
            Core Capabilities
          </a>
          <a
            href="#assistant"
            onClick={() => setMobileMenuOpen(false)}
            className="py-1.5 border-b border-[#D8D5CE]/60"
          >
            Interactive Assistant
          </a>
          <a
            href="#case-law"
            onClick={() => setMobileMenuOpen(false)}
            className="py-1.5 border-b border-[#D8D5CE]/60"
          >
            Case Law Discovery
          </a>
          <a
            href="#security"
            onClick={() => setMobileMenuOpen(false)}
            className="py-1.5 border-b border-[#D8D5CE]/60"
          >
            Privacy & Security
          </a>
          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenWorkspace();
              }}
              className="w-full bg-[#171714] text-[#F4F2ED] py-2.5 rounded text-center text-xs font-medium flex items-center justify-center gap-2"
            >
              <span>Launch Document Studio</span>
              <ArrowUpRight className="w-4 h-4 text-[#C9A646]" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
