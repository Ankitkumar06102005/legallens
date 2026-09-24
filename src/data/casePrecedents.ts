export interface CasePrecedent {
  id: string;
  category: 'Contract Law' | 'Tenancy & Property' | 'Intellectual Property' | 'Damages & Liability';
  actOrCase: string;
  sectionOrCitation: string;
  jurisdiction: string;
  principle: string;
  summary: string;
  appliedContext: string;
  relevanceTag: string;
  fullAnalysis: string;
}

export const CASE_PRECEDENTS: CasePrecedent[] = [
  {
    id: 'case-hadley-baxendale',
    category: 'Damages & Liability',
    actOrCase: 'Hadley v. Baxendale',
    sectionOrCitation: '(1854) 9 Exch 341',
    jurisdiction: 'Common Law Precedent',
    principle: 'Foreseeability of Consequential Damages',
    summary: 'Damages for breach of contract are limited to those arising naturally from the usual course of things, or contemplated by both parties at contract formation.',
    appliedContext: 'Directly informs limitation of liability and consequential damage exclusions in commercial service agreements.',
    relevanceTag: 'Limitation of Liability',
    fullAnalysis: 'Established the fundamental two-limb test for contractual damages. First limb: damages arising naturally in the usual course of events. Second limb: special circumstances communicated and reasonably contemplated at execution. Today serves as the standard justification for why agreements explicitly disclaim "incidental, special, or consequential damages."'
  },
  {
    id: 'case-ica-sec73',
    category: 'Contract Law',
    actOrCase: 'Indian Contract Act, 1872',
    sectionOrCitation: 'Section 73 & Section 74',
    jurisdiction: 'Statutory Code',
    principle: 'Compensation for Loss or Damage Caused by Breach',
    summary: 'Codifies compensation rules for breach; distinguishes genuine pre-estimates of liquidated damage from unenforceable penalties.',
    appliedContext: 'Governs enforceability of late payment fees, deposit forfeiture, and early lease termination administrative charges.',
    relevanceTag: 'Liquidated Damages',
    fullAnalysis: 'Section 74 provides that when a contract names a sum to be paid in case of breach, the court will award reasonable compensation not exceeding the penalty amount stipulated. Prevents unconscionable extortion while allowing legitimate administrative transition recoupment.'
  },
  {
    id: 'case-tpa-sec106',
    category: 'Tenancy & Property',
    actOrCase: 'Transfer of Property Act, 1882',
    sectionOrCitation: 'Section 106 & Section 108',
    jurisdiction: 'Property Jurisprudence',
    principle: 'Rights and Liabilities of Lessor and Lessee',
    summary: 'Defines statutory notice periods for termination of periodic leases and establishes baseline obligations for habitable quiet enjoyment.',
    appliedContext: 'Establishes statutory benchmarks for 30-day and 60-day notice provisions and landlord entry protocols.',
    relevanceTag: 'Lease Termination & Notice',
    fullAnalysis: 'Protects both parties by establishing standardized notice horizons in the absence of written modification. Dictates lessor duty to disclose latent defects and lessee duty to yield back premises in tenantable order.'
  },
  {
    id: 'case-ucc-unconscionable',
    category: 'Contract Law',
    actOrCase: 'Uniform Commercial Code (UCC)',
    sectionOrCitation: 'Section 2-302',
    jurisdiction: 'Commercial Statutory Model',
    principle: 'Unconscionable Contracts and Clauses',
    summary: 'Empowers courts to refuse enforcement or sever any contractual clause deemed unconscionably one-sided at the time of agreement.',
    appliedContext: 'Applicable when reviewing mandatory arbitration clauses, excessive late penalties, or unilateral termination rights.',
    relevanceTag: 'Unfair Contract Terms',
    fullAnalysis: 'Provides an equitable safety valve against gross inequality of bargaining power. Encompasses both procedural unconscionability (hidden boilerplate, lack of meaningful choice) and substantive unconscionability (harsh, oppressive terms).'
  },
  {
    id: 'case-uts-def',
    category: 'Intellectual Property',
    actOrCase: 'Uniform Trade Secrets Act (UTSA)',
    sectionOrCitation: 'Section 1 (4)',
    jurisdiction: 'Intellectual Property Law',
    principle: 'Definitional Boundaries of Proprietary Information',
    summary: 'Defines trade secrets as information deriving independent economic value from not being generally known, and subject to reasonable efforts to maintain secrecy.',
    appliedContext: 'Determines the scope of valid NDA exclusions, survival horizons, and the boundary between general know-how and proprietary assets.',
    relevanceTag: 'Confidentiality & Trade Secrets',
    fullAnalysis: 'Clarifies why boilerplate NDAs cannot legally lock up employee general industry experience. Requires that the disclosing party prove active, commercially reasonable security protocols were in place to qualify for statutory protection.'
  }
];
