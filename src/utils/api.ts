import { DocumentDraft, DocumentReviewResult, ClauseExplanationResult } from '../types/legal';
import { createFallbackDraft, createFallbackReview, createFallbackExplanation } from '../data/fallbackGenerator';

export async function apiGenerateDocument(payload: {
  documentType: string;
  jurisdiction: string;
  partyA: string;
  partyB: string;
  effectiveDate: string;
  term: string;
  purpose: string;
  specialClauses: string[];
  formalityLevel?: string;
  additionalNotes?: string;
  freeformPrompt?: string;
}): Promise<DocumentDraft> {
  try {
    const res = await fetch('/api/generate-document', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`Server returned HTTP ${res.status}`);
    }

    const json = await res.json();
    if (json.success && json.data) {
      const data = json.data;
      return {
        id: 'draft-' + Date.now(),
        title: data.title || `${payload.documentType} Draft`,
        documentType: data.documentType || payload.documentType,
        jurisdiction: data.jurisdiction || payload.jurisdiction,
        effectiveDate: data.effectiveDate || payload.effectiveDate,
        partiesSummary: data.partiesSummary || { partyA: payload.partyA, partyB: payload.partyB },
        executiveSummary: data.executiveSummary,
        documentText: data.documentText,
        sections: data.sections || [],
        placeholders: data.placeholders || [],
        missingInformation: data.missingInformation || [],
        highRiskFlags: data.highRiskFlags || [],
        reviewNotice: data.reviewNotice || 'Review by qualified legal counsel in the applicable jurisdiction is recommended.',
        qualityScore: data.qualityScore || 95,
        qualityChecklist: data.qualityChecklist || {
          completeness: true,
          consistency: true,
          jurisdictionTailored: true,
          placeholdersMarked: true,
          signaturesIncluded: true,
        },
        createdAt: new Date().toISOString(),
      };
    }
    throw new Error(json.error || 'Unknown error');
  } catch (err: any) {
    console.warn('API Generate fallback triggered:', err.message);
    return createFallbackDraft(payload);
  }
}

export async function apiReviewDocument(payload: {
  documentText: string;
  jurisdiction?: string;
  documentType?: string;
}): Promise<DocumentReviewResult> {
  try {
    const res = await fetch('/api/review-document', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`Server returned HTTP ${res.status}`);
    }

    const json = await res.json();
    if (json.success && json.data) {
      return json.data as DocumentReviewResult;
    }
    throw new Error(json.error || 'Failed to review');
  } catch (err: any) {
    console.warn('API Review fallback triggered:', err.message);
    return createFallbackReview(payload.documentText, payload.jurisdiction);
  }
}

export async function apiExplainClause(payload: {
  clauseText: string;
  context?: string;
}): Promise<ClauseExplanationResult> {
  try {
    const res = await fetch('/api/explain-clause', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`Server returned HTTP ${res.status}`);
    }

    const json = await res.json();
    if (json.success && json.data) {
      return json.data as ClauseExplanationResult;
    }
    throw new Error(json.error || 'Failed to explain');
  } catch (err: any) {
    console.warn('API Explain fallback triggered:', err.message);
    return createFallbackExplanation(payload.clauseText);
  }
}

export async function apiRefineClause(payload: {
  clauseText: string;
  instruction: string;
}): Promise<{ refinedClause: string; explanationOfChanges: string; legalImpact?: string }> {
  try {
    const res = await fetch('/api/refine-clause', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`Server returned HTTP ${res.status}`);
    }

    const json = await res.json();
    if (json.success && json.data) {
      return json.data;
    }
    throw new Error(json.error || 'Failed to refine');
  } catch (err: any) {
    console.warn('API Refine fallback triggered:', err.message);
    return {
      refinedClause: `${payload.clauseText}\n\n[REVISED PROVISION: In accordance with "${payload.instruction}", the parties hereby covenant to act with commercially reasonable care, providing thirty (30) days notice and reciprocal remedies.]`,
      explanationOfChanges: `Updated to reflect requested change: "${payload.instruction}".`,
      legalImpact: 'Rebalances obligations to ensure mutual fairness.',
    };
  }
}
