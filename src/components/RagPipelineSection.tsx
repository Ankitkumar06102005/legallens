import React, { useState } from 'react';
import { ArrowRight, ChevronRight, Layers, Cpu, Search, Filter, ShieldCheck, FileCheck } from 'lucide-react';
import { RAG_PIPELINE_STAGES } from '../data/ragPipeline';

export const RagPipelineSection: React.FC = () => {
  const [activeStageIndex, setActiveStageIndex] = useState<number>(3); // Hybrid Search default

  const currentStage = RAG_PIPELINE_STAGES[activeStageIndex];

  return (
    <section className="py-20 md:py-32 border-b border-[#D8D5CE] bg-[#F4F2ED]">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A646]" />
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#6B6962]">
              Architectural Rigor
            </span>
          </div>

          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#171714] leading-[1.08] tracking-tight mb-4">
            Answers grounded in context.
          </h2>

          <p className="text-base sm:text-lg text-[#6B6962] leading-relaxed">
            LEGALENS connects document understanding with retrieval-based AI to help generate responses grounded in relevant information.
          </p>
        </div>

        {/* Simplified Pipeline Horizontal Strip on Desktop */}
        <div className="mb-12 overflow-x-auto pb-4">
          <div className="flex items-center min-w-[760px] justify-between relative">
            {/* Background connecting line */}
            <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-[#D8D5CE] -translate-y-1/2 z-0" />

            {RAG_PIPELINE_STAGES.map((stage, idx) => {
              const isSelected = activeStageIndex === idx;
              return (
                <button
                  key={stage.step}
                  onClick={() => setActiveStageIndex(idx)}
                  className={`relative z-10 flex flex-col items-center group transition-all text-center px-2`}
                >
                  {/* Step node */}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-mono text-xs transition-all duration-200 border ${
                      isSelected
                        ? 'bg-[#171714] text-[#F4F2ED] border-[#171714] scale-110 shadow-sm'
                        : 'bg-[#FAF8F5] text-[#6B6962] border-[#D8D5CE] group-hover:border-[#171714]'
                    }`}
                  >
                    {stage.step}
                  </div>

                  <span className={`text-xs mt-2.5 font-medium transition-colors whitespace-nowrap ${
                    isSelected ? 'text-[#171714] font-semibold' : 'text-[#6B6962] group-hover:text-[#171714]'
                  }`}>
                    {stage.name}
                  </span>

                  <span className="text-[10px] font-mono text-[#6B6962]/70 uppercase">
                    {stage.latency}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Deep Dive Panel */}
        <div className="bg-white border border-[#D8D5CE] rounded-lg p-6 sm:p-8 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Stage Overview */}
            <div className="lg:col-span-6">
              <div className="flex items-center gap-2 mb-2 text-xs">
                <span className="font-mono text-[#C9A646] font-semibold">
                  STAGE {currentStage.step}
                </span>
                <span className="text-[#D8D5CE]">/</span>
                <span className="font-mono text-[#6B6962] uppercase tracking-wider text-[11px]">
                  {currentStage.category}
                </span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl text-[#171714] font-medium mb-3">
                {currentStage.name}
              </h3>

              <p className="text-sm text-[#6B6962] leading-relaxed mb-6">
                {currentStage.summary}
              </p>

              <div className="p-3 bg-[#FAF8F5] border border-[#D8D5CE] rounded text-xs text-[#171714] flex items-center justify-between">
                <span className="text-[#6B6962]">Target Processing Latency</span>
                <span className="font-mono font-medium text-[#C9A646]">
                  {currentStage.latency}
                </span>
              </div>
            </div>

            {/* Right Technical Specs */}
            <div className="lg:col-span-6 bg-[#FCFBF9] border border-[#D8D5CE] rounded-md p-5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#6B6962] block mb-3">
                Algorithmic Safeguards & Mechanics:
              </span>

              <ul className="space-y-3">
                {currentStage.technicalDetails.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-[#171714]">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#C9A646] mt-1.5 shrink-0" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-5 pt-3 border-t border-[#D8D5CE]/60 flex items-center justify-between text-[11px] text-[#6B6962]">
                <span>Grounded Retrieval Policy</span>
                <span className="font-mono text-[#557A5A]">Strict Context Filter Enforced</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
