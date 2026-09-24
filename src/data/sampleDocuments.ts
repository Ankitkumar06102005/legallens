export interface LegalClause {
  id: string;
  number: string;
  title: string;
  category: 'Key Terms' | 'Important Clauses' | 'Obligations' | 'Risks & Conditions' | 'Definitions';
  page: number;
  section: string;
  excerpt: string;
  plainExplanation: string;
  implication: string;
  attentionLevel: 'standard' | 'notice' | 'caution';
  keyObligations?: string[];
  partiesAffected: string[];
}

export interface LegalDocument {
  id: string;
  title: string;
  type: string;
  effectiveDate: string;
  parties: { role: string; name: string }[];
  summary: string;
  totalClauses: number;
  clauses: LegalClause[];
  fullText: string;
  suggestedQuestions: string[];
}

export const SAMPLE_DOCUMENTS: LegalDocument[] = [
  {
    id: 'residential-lease',
    title: 'Residential Lease Agreement',
    type: 'Tenancy & Real Estate',
    effectiveDate: 'October 1, 2026',
    parties: [
      { role: 'Lessor / Landlord', name: 'Highland Properties Management LLC' },
      { role: 'Lessee / Tenant', name: 'Julian Vance & Sarah Lin' }
    ],
    summary: 'A standard residential dwelling lease governing a 12-month term for Unit 4B at 412 Waverly Terrace. Includes clear provisions on security deposit escrow, monthly rental schedule, maintenance responsibilities, and early termination notice requirements.',
    totalClauses: 14,
    suggestedQuestions: [
      'What are the termination conditions in this agreement?',
      'How and when is my security deposit returned?',
      'What are my obligations regarding unit maintenance and repairs?',
      'Can the landlord enter the premises without advance notice?',
      'What fees apply if rent is received after the 5th of the month?'
    ],
    fullText: `RESIDENTIAL LEASE AGREEMENT

This Agreement is entered into this 1st day of October, 2026, between Highland Properties Management LLC ("Landlord") and Julian Vance and Sarah Lin ("Tenant").

1. PREMISES & TERM
Landlord leases to Tenant the premises located at Apartment 4B, 412 Waverly Terrace, for a term of twelve (12) calendar months, commencing on October 1, 2026, and ending at 11:59 PM on September 30, 2027, unless terminated earlier in accordance with this Agreement.

2. RENT & PAYMENT SCHEDULE
Tenant agrees to pay a monthly rent of $3,250.00 USD, payable on or before the first (1st) day of each calendar month. A grace period is provided until the fifth (5th) calendar day. Payments received after 11:59 PM on the fifth day shall incur a late charge of $150.00 or 5% of the outstanding balance, whichever is greater.

3. SECURITY DEPOSIT & CONDITIONS OF REFUND
Tenant shall deposit with Landlord the sum of $3,250.00 as security for full and faithful performance of this Agreement. Said deposit shall be held in an interest-bearing escrow account at First Commercial Bank. Within thirty (30) days following lawful surrender of the premises, Landlord shall return said deposit with accrued interest, minus lawful deductions for physical damages exceeding ordinary wear and tear, accompanied by an itemized written statement.

4. MAINTENANCE & REPAIRS
Tenant shall maintain the premises in a clean, sanitary, and tenantable condition. Landlord remains solely responsible for structural repairs, HVAC systems, exterior plumbing, and common area amenities, provided such damage is not caused by Tenant negligence or intentional misconduct. Tenant shall promptly provide written notice of required repairs exceeding $250.00.

5. EARLY TERMINATION & NOTICE REQUIREMENTS
Either party may terminate this Agreement prior to expiration of the initial term only upon delivering sixty (60) days' prior written notice. If Tenant terminates without statutory cause prior to month six (6), Tenant agrees to forfeit one-half of the initial security deposit as liquidated administrative transition fees, unless a qualified replacement tenant is accepted by Landlord.

6. LANDLORD ACCESS & PRIVACY
Landlord or its authorized agents reserve the right to enter the premises upon giving at least twenty-four (24) hours' written notice for routine inspections, necessary repairs, or showing the unit to prospective purchasers or tenants. In emergency circumstances posing immediate risk to life or structural integrity, prior notice is waived.

7. INDEMNITY & GOVERNING LAW
Each party agrees to hold harmless the other party from liabilities arising from their respective gross negligence. This Agreement shall be governed by and construed under the laws of the State of New York.`,
    clauses: [
      {
        id: 'c-term',
        number: '01',
        title: 'Premises & Lease Term',
        category: 'Key Terms',
        page: 1,
        section: 'Section 1',
        excerpt: 'commencing on October 1, 2026, and ending at 11:59 PM on September 30, 2027, unless terminated earlier...',
        plainExplanation: 'Establishes a fixed 1-year tenancy period for Unit 4B with a specific expiry date.',
        implication: 'Does not automatically renew as month-to-month without mutual agreement or addendum.',
        attentionLevel: 'standard',
        partiesAffected: ['Landlord', 'Tenant']
      },
      {
        id: 'c-rent',
        number: '02',
        title: 'Monthly Rent & Late Surcharge',
        category: 'Obligations',
        page: 1,
        section: 'Section 2',
        excerpt: 'monthly rent of $3,250.00 USD, payable on or before the first (1st) day... late charge of $150.00 or 5%...',
        plainExplanation: 'Specifies monthly rent due date with a 5-day grace period, after which a $150 late fee attaches.',
        implication: 'Financial obligation strictly enforced on the 6th day of every month.',
        attentionLevel: 'notice',
        keyObligations: ['Submit payment by 1st of month', 'Grace period expires midnight on 5th'],
        partiesAffected: ['Tenant']
      },
      {
        id: 'c-deposit',
        number: '03',
        title: 'Security Deposit & Escrow Refund',
        category: 'Important Clauses',
        page: 1,
        section: 'Section 3',
        excerpt: 'sum of $3,250.00 as security... held in an interest-bearing escrow account... Within thirty (30) days following lawful surrender...',
        plainExplanation: 'Equal to one month rent; must be kept in escrow and returned within 30 days of move-out minus documented damages.',
        implication: 'Protects tenant funds in statutory escrow; deductions must be itemized in writing.',
        attentionLevel: 'standard',
        partiesAffected: ['Landlord', 'Tenant']
      },
      {
        id: 'c-repairs',
        number: '04',
        title: 'Maintenance Responsibilities & Notice',
        category: 'Obligations',
        page: 1,
        section: 'Section 4',
        excerpt: 'Landlord remains solely responsible for structural repairs, HVAC systems, exterior plumbing... Tenant shall promptly provide written notice...',
        plainExplanation: 'Divides duties: landlord handles structural/mechanical systems; tenant maintains interior sanitary condition.',
        implication: 'Notice requirement protects tenant from negligence claims if mechanical faults are reported promptly.',
        attentionLevel: 'notice',
        keyObligations: ['Report structural faults >$250 in writing', 'Maintain sanitary baseline'],
        partiesAffected: ['Tenant', 'Landlord']
      },
      {
        id: 'c-termination',
        number: '05',
        title: 'Early Termination & Transition Fee',
        category: 'Risks & Conditions',
        page: 2,
        section: 'Section 5',
        excerpt: 'sixty (60) days\' prior written notice... Tenant agrees to forfeit one-half of the initial security deposit as liquidated administrative transition fees...',
        plainExplanation: 'Requires 60 days advance written notice to break lease. Moving out before month 6 forfeits 50% of deposit.',
        implication: 'Substantial notice window and potential penalty; warrants planning before any unexpected relocation.',
        attentionLevel: 'caution',
        keyObligations: ['Deliver written notice 60 days in advance', 'Review replacement tenant options'],
        partiesAffected: ['Tenant']
      },
      {
        id: 'c-access',
        number: '06',
        title: 'Landlord Access & Emergency Rights',
        category: 'Important Clauses',
        page: 2,
        section: 'Section 6',
        excerpt: 'giving at least twenty-four (24) hours\' written notice for routine inspections... In emergency circumstances... prior notice is waived.',
        plainExplanation: 'Guarantees 24-hour advance warning before non-emergency entry for maintenance or prospective tenant tours.',
        implication: 'Protects privacy while preserving emergency intervention rights.',
        attentionLevel: 'standard',
        partiesAffected: ['Landlord', 'Tenant']
      }
    ]
  },
  {
    id: 'mutual-nda',
    title: 'Mutual Non-Disclosure Agreement',
    type: 'Confidentiality & Intellectual Property',
    effectiveDate: 'August 14, 2026',
    parties: [
      { role: 'Disclosing / Receiving Party', name: 'Aetheria Labs Inc.' },
      { role: 'Disclosing / Receiving Party', name: 'Kestrel Ventures GmbH' }
    ],
    summary: 'A reciprocal non-disclosure contract designed for evaluating strategic technological partnerships. Delineates strict carve-outs for publicly known information and limits duration of obligations to three years from disclosure date.',
    totalClauses: 10,
    suggestedQuestions: [
      'What information qualifies as Confidential Information under this NDA?',
      'How long do the confidentiality obligations survive after termination?',
      'What are the standard exclusions from confidentiality?',
      'Are there any remedies or injunctive relief clauses?'
    ],
    fullText: `MUTUAL NON-DISCLOSURE AGREEMENT

This Agreement is made on August 14, 2026, between Aetheria Labs Inc. and Kestrel Ventures GmbH.

1. SCOPE OF CONFIDENTIAL INFORMATION
"Confidential Information" refers to any proprietary, technical, financial, or commercial information disclosed by either party, whether in tangible, digital, or oral form, marked as confidential or reasonably understood to be proprietary.

2. EXCLUSIONS FROM OBLIGATION
Confidential Information does not include data which: (a) is or becomes publicly available through no breach; (b) was already rightfully known without restriction prior to disclosure; (c) is independently developed without reference to the Disclosing Party's data; or (d) is required to be disclosed by legal subpoena.

3. STANDARD OF CARE
Each party agrees to safeguard received confidential materials using at least the same degree of care it employs for its own sensitive data, but in no event less than a commercially reasonable standard.

4. SURVIVAL OF OBLIGATIONS
The confidentiality obligations under this Agreement shall persist for a period of three (3) years from the date of final disclosure, except trade secrets, which remain protected indefinitely.

5. REMEDIES & INJUNCTIVE RELIEF
Parties recognize that monetary damages may be inadequate in the event of an unauthorized leak, entitling the injured party to seek equitable injunctive relief without requirement of posting a bond.`,
    clauses: [
      {
        id: 'nda-scope',
        number: '01',
        title: 'Definition of Confidential Data',
        category: 'Definitions',
        page: 1,
        section: 'Section 1',
        excerpt: 'any proprietary, technical, financial, or commercial information disclosed by either party...',
        plainExplanation: 'Broadly covers both written and oral business or technological disclosures.',
        implication: 'Both parties are mutually bounded regardless of who provides the information first.',
        attentionLevel: 'standard',
        partiesAffected: ['Both Parties']
      },
      {
        id: 'nda-exclusions',
        number: '02',
        title: 'Standard Carve-Out Exceptions',
        category: 'Important Clauses',
        page: 1,
        section: 'Section 2',
        excerpt: 'does not include data which is publicly available... independently developed... or required by subpoena.',
        plainExplanation: 'Exempts common-knowledge data, independently built technology, and legally mandated disclosures.',
        implication: 'Essential safe harbor ensuring ongoing internal development is not impeded.',
        attentionLevel: 'notice',
        partiesAffected: ['Both Parties']
      },
      {
        id: 'nda-survival',
        number: '03',
        title: '3-Year Term & Indefinite Trade Secrets',
        category: 'Risks & Conditions',
        page: 1,
        section: 'Section 4',
        excerpt: 'shall persist for a period of three (3) years... except trade secrets, which remain protected indefinitely.',
        plainExplanation: 'Sets a 36-month shelf-life for ordinary business files, while source code/formulas remain shielded forever.',
        implication: 'Review internal data tracking to ensure trade secret classification is unambiguous.',
        attentionLevel: 'caution',
        partiesAffected: ['Both Parties']
      }
    ]
  },
  {
    id: 'master-services',
    title: 'Master Professional Services Agreement',
    type: 'Commercial Services & Licensing',
    effectiveDate: 'November 1, 2026',
    parties: [
      { role: 'Client', name: 'Meridian Capital Partners' },
      { role: 'Service Provider', name: 'Synthetix Software Engineering' }
    ],
    summary: 'A commercial contract governing enterprise custom software architecture, deliverables milestones, intellectual property assignments upon full payment, and aggregate liability caps.',
    totalClauses: 16,
    suggestedQuestions: [
      'Who owns the intellectual property created under this statement of work?',
      'What are the payment milestones and dispute procedures?',
      'Is there a liability cap protecting either party?'
    ],
    fullText: `MASTER PROFESSIONAL SERVICES AGREEMENT

This Agreement is entered into on November 1, 2026, by and between Meridian Capital Partners ("Client") and Synthetix Software Engineering ("Provider").

1. DELIVERABLES & ACCEPTANCE CRITERIA
Provider will deliver milestones according to attached Statements of Work. Client will have ten (10) business days following receipt to inspect deliverables against published acceptance criteria.

2. INTELLECTUAL PROPERTY RIGHTS
Upon complete payment of all fees owed under the applicable SOW, Provider assigns to Client all right, title, and interest in custom bespoke deliverables, excluding Provider Pre-existing Toolkits and Libraries.

3. LIMITATION OF LIABILITY
Neither party shall be liable for indirect, incidental, special, or consequential damages. In no event shall either party's aggregate monetary liability exceed the total fees paid or payable by Client in the preceding six (6) months.`,
    clauses: [
      {
        id: 'msa-ip',
        number: '01',
        title: 'IP Assignment Conditioned on Full Payment',
        category: 'Risks & Conditions',
        page: 1,
        section: 'Section 2',
        excerpt: 'Upon complete payment of all fees owed... Provider assigns to Client all right, title, and interest...',
        plainExplanation: 'Title to the software only transfers once the final invoice is paid in full.',
        implication: 'Client does not legally own deliverables while payment disputes remain pending.',
        attentionLevel: 'caution',
        partiesAffected: ['Client', 'Provider']
      },
      {
        id: 'msa-cap',
        number: '02',
        title: '6-Month Aggregate Liability Cap',
        category: 'Important Clauses',
        page: 2,
        section: 'Section 3',
        excerpt: 'In no event shall either party\'s aggregate monetary liability exceed the total fees paid... in the preceding six (6) months.',
        plainExplanation: 'Caps maximum legal recovery at fees paid over the last half-year, barring consequential damages.',
        implication: 'Limits financial risk exposure for both vendor and client in the event of software malfunction.',
        attentionLevel: 'notice',
        partiesAffected: ['Client', 'Provider']
      }
    ]
  }
];
