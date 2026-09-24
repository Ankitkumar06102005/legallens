export interface PipelineStage {
  step: string;
  name: string;
  category: string;
  summary: string;
  technicalDetails: string[];
  latency: string;
}

export const RAG_PIPELINE_STAGES: PipelineStage[] = [
  {
    step: '01',
    name: 'Document Ingestion',
    category: 'Ingestion Layer',
    summary: 'Receives PDF, DOCX, or scanned legal briefs, stripping formatting artifacts while retaining structural headers.',
    technicalDetails: [
      'Multi-column layout linearization',
      'Optical Character Recognition (OCR) for scanned agreements',
      'Header-level table of contents reconstruction'
    ],
    latency: '~120ms'
  },
  {
    step: '02',
    name: 'Clause-Aware Chunking',
    category: 'Segmentation',
    summary: 'Avoids naive character splits. Partitions strictly along legal clause boundaries, section numbers, and schedules.',
    technicalDetails: [
      'Semantic boundary detection via regex & AST parser',
      'Preserves cross-clause references and definitions',
      'Recursive overlap window of 128 tokens'
    ],
    latency: '~45ms'
  },
  {
    step: '03',
    name: 'Dense & Sparse Embeddings',
    category: 'Vectorization',
    summary: 'Generates dual representations capturing both exact statutory terminology and high-level conceptual intent.',
    technicalDetails: [
      'Dense vector embedding for semantic intent & synonyms',
      'Sparse BM25 token frequencies for exact case law names',
      'Domain-adapted legal taxonomy weighting'
    ],
    latency: '~85ms'
  },
  {
    step: '04',
    name: 'Hybrid Retrieval Search',
    category: 'Indexing & Query',
    summary: 'Executes parallel reciprocal rank fusion across vector database and inverted keyword indices.',
    technicalDetails: [
      'Cosine similarity on dense legal vectors',
      'Lexical match on numbered sections (e.g., "Section 8.2")',
      'Reciprocal Rank Fusion (RRF) k=60'
    ],
    latency: '~35ms'
  },
  {
    step: '05',
    name: 'Cross-Encoder Reranking',
    category: 'Precision Filtering',
    summary: 'Evaluates candidate chunks against query semantics to discard irrelevant clauses and prevent noise propagation.',
    technicalDetails: [
      'Cross-attention score between full question and clause',
      'Exclusion of boilerplate non-substantive clauses',
      'Hard context window limit: Top 4 verified sections'
    ],
    latency: '~60ms'
  },
  {
    step: '06',
    name: 'Strict Context Synthesis',
    category: 'Grounded Generation',
    summary: 'Produces structured, plain-English explanations pinned strictly to extracted citations without speculative extrapolation.',
    technicalDetails: [
      'Constrained system prompt forbidding external speculation',
      'Mandatory brackets citation injection [Section, Page]',
      'Plain-language breakdown tailored to non-lawyers'
    ],
    latency: '~250ms'
  }
];
