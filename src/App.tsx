/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { UnderstandSection } from './components/UnderstandSection';
import { DocumentAnalysisSection } from './components/DocumentAnalysisSection';
import { ProcessTimeline } from './components/ProcessTimeline';
import { FeaturesSection } from './components/FeaturesSection';
import { AiAssistantSection } from './components/AiAssistantSection';
import { RagPipelineSection } from './components/RagPipelineSection';
import { CaseLawSection } from './components/CaseLawSection';
import { AnnotatedPdfSection } from './components/AnnotatedPdfSection';
import { PrivacySection } from './components/PrivacySection';
import { BrandStory } from './components/BrandStory';
import { FinalCTA } from './components/FinalCTA';
import { Footer } from './components/Footer';
import { WorkspaceModal } from './components/WorkspaceModal';
import { SAMPLE_DOCUMENTS } from './data/sampleDocuments';

export default function App() {
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState<string>('residential-lease');

  const currentDoc = SAMPLE_DOCUMENTS.find(d => d.id === selectedDocId) || SAMPLE_DOCUMENTS[0];

  const handleOpenWorkspace = (docId?: string) => {
    if (docId) setSelectedDocId(docId);
    setIsWorkspaceOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F4F2ED] text-[#171714] flex flex-col font-sans selection:bg-[#C9A646]/25 selection:text-[#171714]">
      {/* Editorial Navigation */}
      <Navbar
        onOpenWorkspace={() => handleOpenWorkspace()}
        onSelectDoc={(id) => handleOpenWorkspace(id)}
        currentDocTitle={currentDoc.title}
      />

      {/* Main Editorial Body */}
      <main className="flex-grow">
        {/* 1. Hero Section */}
        <Hero onOpenWorkspace={() => handleOpenWorkspace()} />

        {/* 2. Process Timeline (How LawLens Works) */}
        <ProcessTimeline />

        {/* 3. Understand Complex Documents (Read. Understand. Decide.) */}
        <UnderstandSection />

        {/* 4. Interactive Document Analysis (Complex, made clear.) */}
        <DocumentAnalysisSection onOpenWorkspace={() => handleOpenWorkspace()} />

        {/* 5. Core Platform Capabilities (Know what matters.) */}
        <FeaturesSection onOpenWorkspace={() => handleOpenWorkspace()} />

        {/* 6. Interactive AI Legal Assistant */}
        <AiAssistantSection onOpenWorkspace={() => handleOpenWorkspace()} />

        {/* 7. Legal RAG / Technical Differentiator Pipeline */}
        <RagPipelineSection />

        {/* 8. Case-Law & Precedent Discovery */}
        <CaseLawSection />

        {/* 9. Annotated PDF Export Preview */}
        <AnnotatedPdfSection />

        {/* 10. Privacy & Security */}
        <PrivacySection />

        {/* 11. Brand Philosophy & Target Audience */}
        <BrandStory />

        {/* 12. Closing CTA */}
        <FinalCTA onOpenWorkspace={() => handleOpenWorkspace()} />
      </main>

      {/* Footer with Legal Disclaimer */}
      <Footer />

      {/* Interactive Full Workspace / Document Intelligence Studio */}
      <WorkspaceModal
        isOpen={isWorkspaceOpen}
        onClose={() => setIsWorkspaceOpen(false)}
        selectedDocId={selectedDocId}
      />
    </div>
  );
}
