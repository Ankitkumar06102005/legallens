import React from 'react';
import { ShieldCheck, Lock, EyeOff, Server, RefreshCw } from 'lucide-react';

export const PrivacySection: React.FC = () => {
  const commitments = [
    {
      number: '01',
      title: 'Document Privacy',
      subtitle: 'Zero model training on user agreements',
      body: 'Your contracts, confidential clauses, and personal identifiable information are never ingested into foundational AI model training sets. Documents remain solely accessible to your current reading session.',
      icon: EyeOff
    },
    {
      number: '02',
      title: 'Secure In-Flight Processing',
      subtitle: 'Encrypted transfer & ephemeral memory',
      body: 'All document transmissions are secured over standard TLS 1.3 encrypted connections. Parsing occurs in ephemeral runtime containers that exist only for the duration of your analysis session.',
      icon: Lock
    },
    {
      number: '03',
      title: 'Controlled Session Isolation',
      subtitle: 'Strict memory sandboxing',
      body: 'Analysis vectors and parsed clause caches are isolated by ephemeral session tokens. No cross-tenant document indexing or cross-session caching is permitted.',
      icon: Server
    },
    {
      number: '04',
      title: 'Transparent Data Practices',
      subtitle: 'Immediate purge upon session conclusion',
      body: 'When you close your browser tab or reset your session, memory buffers holding parsed clause chunks are discarded immediately. We do not maintain unencrypted archival copies of uploaded files.',
      icon: RefreshCw
    }
  ];

  return (
    <section id="security" className="py-20 md:py-32 border-b border-[#D8D5CE] bg-[#FAF8F5]">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A646]" />
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#6B6962]">
              Security & Custody
            </span>
          </div>

          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#171714] leading-[1.08] tracking-tight mb-4">
            Private.<br />
            Secure.<br />
            Yours.
          </h2>

          <p className="text-base sm:text-lg text-[#6B6962] leading-relaxed">
            Legal documents can contain sensitive information. LEGALENS communicates clearly how documents are processed, stored, and protected.
          </p>
        </div>

        {/* 4 Information Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {commitments.map((c) => {
            const IconComp = c.icon;
            return (
              <div
                key={c.number}
                className="bg-white border border-[#D8D5CE] rounded-lg p-6 sm:p-8 flex flex-col justify-between shadow-xs hover:border-[#C9A646]/70 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs text-[#C9A646] font-semibold">
                      PRINCIPLE {c.number}
                    </span>
                    <IconComp className="w-4 h-4 text-[#6B6962]" />
                  </div>

                  <h3 className="font-serif text-2xl text-[#171714] font-medium mb-1">
                    {c.title}
                  </h3>

                  <p className="text-xs font-medium text-[#6B6962] mb-3">
                    {c.subtitle}
                  </p>

                  <p className="text-xs sm:text-sm text-[#6B6962] leading-relaxed">
                    {c.body}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#D8D5CE]/60 flex items-center justify-between text-[11px] text-[#557A5A]">
                  <span className="flex items-center gap-1.5 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified Architecture Principle
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
