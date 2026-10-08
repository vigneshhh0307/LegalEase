export interface PlaceholderItem {
  placeholder: string;
  category?: string;
  description?: string;
  value?: string;
}

export interface DocumentSection {
  number: string;
  title: string;
  summary?: string;
}

export interface DocumentDraft {
  id: string;
  title: string;
  documentType: string;
  jurisdiction: string;
  effectiveDate?: string;
  partiesSummary?: {
    partyA: string;
    partyB: string;
  };
  executiveSummary?: string;
  documentText: string;
  sections?: DocumentSection[];
  placeholders: PlaceholderItem[];
  missingInformation: string[];
  highRiskFlags?: string[];
  reviewNotice: string;
  qualityScore: number;
  qualityChecklist?: {
    completeness: boolean;
    consistency: boolean;
    jurisdictionTailored: boolean;
    placeholdersMarked: boolean;
    signaturesIncluded: boolean;
  };
  createdAt: string;
  lastModified?: string;
}

export interface ReviewIssue {
  id: string;
  category: 'Missing Clause' | 'Ambiguity' | 'One-Sided Term' | 'Inconsistency' | 'Jurisdiction Risk' | string;
  severity: 'High' | 'Medium' | 'Low';
  title: string;
  affectedSection?: string;
  problemStatement: string;
  recommendedFix: string;
  suggestedLanguage?: string;
}

export interface MissingClauseItem {
  clauseName: string;
  importance: 'Critical' | 'Important' | 'Recommended' | string;
  reason: string;
  sampleClause?: string;
}

export interface DocumentReviewResult {
  overallRiskScore: number; // 0-100 (higher = safer)
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Critical';
  executiveSummary: string;
  identifiedIssues: ReviewIssue[];
  missingClauses: MissingClauseItem[];
  keyStrengths?: string[];
  jurisdictionNotice?: string;
  disclaimer?: string;
}

export interface ClauseAlternative {
  label: string;
  description: string;
  clauseText: string;
}

export interface ClauseExplanationResult {
  clauseName: string;
  plainLanguageExplanation: string;
  purpose: string;
  whoBenefits?: string;
  practicalImplications: string[];
  commonPitfalls: string[];
  negotiationTips: string[];
  alternatives?: ClauseAlternative[];
}

export interface DocumentTemplate {
  id: string;
  title: string;
  category: 'Commercial' | 'Employment' | 'Real Estate' | 'Corporate' | 'Dispute & Notice' | 'Personal & Estate';
  description: string;
  documentType: string;
  suggestedJurisdiction: string;
  defaultParties: {
    partyALabel: string;
    partyBLabel: string;
    partyAExample: string;
    partyBExample: string;
  };
  keyClauses: string[];
  isHighRisk?: boolean;
  samplePrompt: string;
  presetText?: string;
}
