import React, { useState } from 'react';
import { Download, FileText, CheckCircle2, Printer, ArrowDownToLine, Eye } from 'lucide-react';
import { SAMPLE_DOCUMENTS } from '../data/sampleDocuments';

export const AnnotatedPdfSection: React.FC = () => {
  const doc = SAMPLE_DOCUMENTS[0]; // Residential Lease
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownloadAnnotated = () => {
    // Generate an actual downloadable structured summary file
    const content = `==================================================================
LEGALENS ANNOTATED DOCUMENT INTELLIGENCE EXPORT
Document: ${doc.title}
Generated: ${new Date().toLocaleDateString()}
Notice: LEGALENS provides informational insights and is not legal counsel.
==================================================================

DOCUMENT SUMMARY:
${doc.summary}

PARTIES BOUND:
${doc.parties.map(p => `- ${p.role}: ${p.name}`).join('\n')}

EXTRACTED KEY CLAUSES & MARGIN ANNOTATIONS:
------------------------------------------------------------------
${doc.clauses.map((c, idx) => `
[CLAUSE ${idx + 1}] ${c.section}: ${c.title.toUpperCase()}
Category: ${c.category} | Attention Level: ${c.attentionLevel.toUpperCase()}
Page Reference: Page ${c.page}

EXCERPT:
"${c.excerpt}"

PLAIN-ENGLISH EXPLANATION:
${c.plainExplanation}

PRACTICAL IMPLICATION:
${c.implication}

${c.keyObligations ? `KEY CONDITIONS:\n${c.keyObligations.map(o => `  * ${o}`).join('\n')}` : ''}
------------------------------------------------------------------`).join('\n')}

FULL TEXT ARCHIVE:
${doc.fullText}
==================================================================
`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `LEGALENS_Annotated_${doc.title.replace(/\s+/g, '_')}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 4000);
  };

  return (
    <section className="py-20 md:py-32 border-b border-[#D8D5CE] bg-[#F4F2ED]">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-6 border-b border-[#D8D5CE]">
          <div>
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C9A646]" />
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#6B6962]">
                Portable Intelligence
              </span>
            </div>

            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#171714] leading-[1.08] tracking-tight">
              Take your insights with you.
            </h2>
          </div>

          <p className="text-sm text-[#6B6962] max-w-md leading-relaxed">
            Generate an annotated version of your document with important clauses highlighted and explanations organized for convenient offline review.
          </p>
        </div>

        {/* Visual PDF Export Preview */}
        <div className="bg-white border border-[#D8D5CE] rounded-lg shadow-sm overflow-hidden max-w-4xl mx-auto">
          
          {/* Top Bar simulating a document viewer toolbar */}
          <div className="bg-[#EBE8E1] px-5 py-3 border-b border-[#D8D5CE] flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <FileText className="w-4 h-4 text-[#C9A646]" />
              <span className="font-mono text-xs text-[#171714]">
                Residential_Lease_Agreement_Annotated_LEGALENS.pdf
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={handleDownloadAnnotated}
                className="bg-[#171714] text-[#F4F2ED] hover:bg-[#2A2A26] px-3 py-1.5 rounded text-xs font-medium flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <ArrowDownToLine className="w-3.5 h-3.5 text-[#C9A646]" />
                <span>{downloadSuccess ? 'Downloaded Document' : 'Download Annotated File'}</span>
              </button>
            </div>
          </div>

          {/* Paper Sheet Preview */}
          <div className="p-8 sm:p-12 bg-[#FAF8F5] min-h-[460px] border-b border-[#D8D5CE] relative font-serif">
            
            {/* Sheet Watermark Header */}
            <div className="flex items-start justify-between border-b border-[#D8D5CE] pb-4 mb-6 text-xs text-[#6B6962]">
              <div>
                <span className="font-sans font-semibold text-[#171714] tracking-wider uppercase text-[10px] block">
                  LEGALENS Document Intelligence Summary
                </span>
                <span className="font-mono text-[11px]">Annotated Edition · 4 Key Clauses Flagged</span>
              </div>
              <span className="font-mono text-[11px]">Page 1 / 4</span>
            </div>

            {/* Simulated Document Text with Marginal Annotations */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              
              {/* Document Text Column */}
              <div className="md:col-span-8 space-y-5 text-xs sm:text-[13px] leading-relaxed text-[#171714]">
                <h4 className="font-sans font-bold text-sm tracking-wide text-[#171714]">
                  SECTION 5. EARLY TERMINATION & LIQUIDATED DAMAGES
                </h4>
                
                <p className="bg-[#FAF8F5] p-3 rounded border-l-2 border-[#C9A646] font-sans">
                  "Either party may terminate this Agreement prior to expiration of the initial term only upon delivering <mark className="bg-[#C9A646]/30 text-[#171714] px-1 rounded">sixty (60) days' prior written notice</mark>. If Tenant terminates without statutory cause prior to month six (6), Tenant agrees to <mark className="bg-[#C9A646]/30 text-[#171714] px-1 rounded">forfeit one-half of the initial security deposit</mark> as liquidated administrative transition fees..."
                </p>

                <h4 className="font-sans font-bold text-sm tracking-wide text-[#171714] pt-2">
                  SECTION 3. SECURITY DEPOSIT ESCROW
                </h4>

                <p className="font-sans text-[#6B6962]">
                  "Tenant shall deposit with Landlord the sum of $3,250.00 as security. Said deposit shall be held in an <mark className="bg-[#C9A646]/20 text-[#171714] px-1 rounded">interest-bearing escrow account</mark> at First Commercial Bank. Within thirty (30) days following surrender, Landlord shall return deposit with itemized statement..."
                </p>
              </div>

              {/* Right Margin Callout Annotation Box */}
              <div className="md:col-span-4 space-y-4">
                <div className="p-3.5 bg-white border border-[#D8D5CE] rounded text-[11px] shadow-xs">
                  <div className="flex items-center justify-between font-mono text-[10px] text-[#A47732] font-medium mb-1">
                    <span>MARGIN NOTE #1</span>
                    <span>SEC 5</span>
                  </div>
                  <p className="font-sans text-[#171714] leading-normal font-medium mb-1">
                    Notice Horizon Requirement
                  </p>
                  <p className="font-sans text-[#6B6962] text-[10px] leading-normal">
                    Requires 60 calendar days written notice. Potential 50% deposit forfeiture if vacating in the first 6 months.
                  </p>
                </div>

                <div className="p-3.5 bg-white border border-[#D8D5CE] rounded text-[11px] shadow-xs">
                  <div className="flex items-center justify-between font-mono text-[10px] text-[#557A5A] font-medium mb-1">
                    <span>MARGIN NOTE #2</span>
                    <span>SEC 3</span>
                  </div>
                  <p className="font-sans text-[#171714] leading-normal font-medium mb-1">
                    Escrow Protection
                  </p>
                  <p className="font-sans text-[#6B6962] text-[10px] leading-normal">
                    Requires statutory 30-day refund window with itemized ledger for any deductions exceeding ordinary wear.
                  </p>
                </div>
              </div>

            </div>

            {/* Bottom Disclaimer */}
            <div className="mt-8 pt-4 border-t border-[#D8D5CE] flex items-center justify-between text-[11px] text-[#6B6962] font-sans">
              <span>Annotated for personal review purposes.</span>
              <span className="italic">Not a formal legal opinion or substitute for legal counsel.</span>
            </div>

          </div>

          {/* Action Footer */}
          <div className="p-5 bg-white flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-[#6B6962]">
              Downloads include high-contrast highlighted clauses, margin analysis notes, and risk tags.
            </p>
            <button
              onClick={handleDownloadAnnotated}
              className="w-full sm:w-auto bg-[#171714] text-[#F4F2ED] text-xs font-medium px-5 py-2.5 rounded hover:bg-[#2A2A26] transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-3.5 h-3.5 text-[#C9A646]" />
              <span>Download Annotated Summary</span>
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
