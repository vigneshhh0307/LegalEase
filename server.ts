import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize GoogleGenAI
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

async function callGeminiWithRetry<T>(fn: () => Promise<T>, retries = 2, delayMs = 1200): Promise<T> {
  let lastError;
  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch (err: any) {
      lastError = err;
      if (i < retries) {
        await new Promise((resolve) => setTimeout(resolve, delayMs * (i + 1)));
      }
    }
  }
  throw lastError;
}

const MASTER_SYSTEM_PROMPT = `You are LegalEase AI, an AI-powered legal document drafting assistant designed to help users create clear, structured, professional legal documents.
Your primary objective is to transform user-provided information into a well-structured legal document while prioritizing accuracy, clarity, completeness, jurisdictional awareness, privacy, and responsible legal assistance.

CORE RULES:
1. You act as a legal-document drafting assistant, not as a lawyer or substitute for qualified legal counsel.
2. Never claim to be a licensed attorney or guarantee enforceability.
3. Respect Jurisdiction: Tailor the document strictly to the specified country and state/province. If unspecified or general, highlight this and urge local counsel review.
4. Professional Legal Structure:
   - Clear Title
   - Document Information / Recitals
   - Definitions
   - Numbered sections and subsections
   - Rights, obligations, representations & warranties
   - Payment / Consideration
   - Term & termination
   - Confidentiality, liability, indemnification, dispute resolution
   - Governing law & jurisdiction
   - Boilerplate (Severability, Entire Agreement, Amendments, Counterparts)
   - Professional signature blocks (with Name, Title, Signature lines, Date, and Witness/Notary when applicable)
5. NEVER fabricate facts, dates, dollar amounts, company numbers, or legal citations. Use clear placeholders like [FULL LEGAL NAME], [PRINCIPAL AMOUNT], [EFFECTIVE DATE], [GOVERNING JURISDICTION].
6. For high-risk documents (Wills, Real Estate, Shareholder Agreements, High-value Debt, IP assignments), include a clear, concise Review Warning Notice.
7. Output must be structured, clean, and complete.`;

// Endpoint: Generate Document
app.post('/api/generate-document', async (req: Request, res: Response) => {
  try {
    const {
      documentType,
      jurisdiction,
      partyA,
      partyB,
      effectiveDate,
      term,
      purpose,
      specialClauses = [],
      formalityLevel = 'Standard Commercial Agreement',
      additionalNotes = '',
      freeformPrompt = '',
    } = req.body;

    const prompt = `Please generate a comprehensive, professional legal document draft adhering to the LegalEase Master System Prompt specifications.

DOCUMENT REQUIREMENTS:
- Document Type: ${documentType || 'Legal Agreement'}
- Intended Jurisdiction: ${jurisdiction || 'General Commercial Law (Jurisdiction to be specified)'}
- First Party / Disclosing / Employer / Landlord: ${partyA || '[FIRST PARTY NAME]'}
- Second Party / Receiving / Employee / Tenant: ${partyB || '[SECOND PARTY NAME]'}
- Effective Date: ${effectiveDate || '[EFFECTIVE DATE]'}
- Term / Duration: ${term || '[DURATION / TERM]'}
- Stated Purpose / Scope: ${purpose || '[PURPOSE AND SCOPE]'}
- Special Clauses / Requirements to include: ${Array.isArray(specialClauses) ? specialClauses.join(', ') : specialClauses}
- Formality Level: ${formalityLevel}
- Specific User Instructions & Notes: ${additionalNotes || freeformPrompt || 'Standard robust commercial protective provisions'}

Please provide a JSON response with the following schema:
{
  "title": "Full Official Document Title",
  "documentType": "${documentType || 'Agreement'}",
  "jurisdiction": "${jurisdiction || 'Unspecified - General Template'}",
  "effectiveDate": "Identified or [EFFECTIVE DATE]",
  "partiesSummary": {
    "partyA": "Brief name/role",
    "partyB": "Brief name/role"
  },
  "executiveSummary": "A concise 2-3 sentence overview of this document's scope and purpose.",
  "documentText": "The complete, pristine, ready-to-use legal document. Use clear section numbering (e.g. 1. DEFINITIONS, 2. SCOPE OF SERVICES, 2.1 Subsection). Include standard recital WHEREAS clauses, definitions, covenants, warranties, remedies, governing law, and professional signature blocks at the end with signature lines and dates. Use uppercase bracketed placeholders like [AMOUNT], [ADDRESS] for any details not explicitly provided.",
  "sections": [
    { "number": "1", "title": "Definitions & Interpretations", "summary": "Key legal terms defined" },
    { "number": "2", "title": "Scope & Obligations", "summary": "Core deliverables and covenants" }
  ],
  "placeholders": [
    { "placeholder": "[FULL LEGAL NAME OF PARTY A]", "category": "Parties", "description": "Legal registered entity name or individual name" },
    { "placeholder": "[GOVERNING STATE/PROVINCE]", "category": "Jurisdiction", "description": "Applicable governing law state or court jurisdiction" }
  ],
  "missingInformation": [
    "List of any crucial practical details the user needs to establish before execution"
  ],
  "highRiskFlags": [
    "Concise warnings if high risk (e.g. non-compete enforceability in California, estate execution formalities, etc.)"
  ],
  "reviewNotice": "Legal notice stating this is a drafting tool and advising attorney review for the target jurisdiction.",
  "qualityScore": 95,
  "qualityChecklist": {
    "completeness": true,
    "consistency": true,
    "jurisdictionTailored": true,
    "placeholdersMarked": true,
    "signaturesIncluded": true
  }
}`;

    const response = await callGeminiWithRetry(() =>
      ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: MASTER_SYSTEM_PROMPT,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              documentType: { type: Type.STRING },
              jurisdiction: { type: Type.STRING },
              effectiveDate: { type: Type.STRING },
              partiesSummary: {
                type: Type.OBJECT,
                properties: {
                  partyA: { type: Type.STRING },
                  partyB: { type: Type.STRING },
                },
              },
              executiveSummary: { type: Type.STRING },
              documentText: { type: Type.STRING },
              sections: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    number: { type: Type.STRING },
                    title: { type: Type.STRING },
                    summary: { type: Type.STRING },
                  },
                },
              },
              placeholders: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    placeholder: { type: Type.STRING },
                    category: { type: Type.STRING },
                    description: { type: Type.STRING },
                  },
                },
              },
              missingInformation: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              highRiskFlags: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              reviewNotice: { type: Type.STRING },
              qualityScore: { type: Type.INTEGER },
              qualityChecklist: {
                type: Type.OBJECT,
                properties: {
                  completeness: { type: Type.BOOLEAN },
                  consistency: { type: Type.BOOLEAN },
                  jurisdictionTailored: { type: Type.BOOLEAN },
                  placeholdersMarked: { type: Type.BOOLEAN },
                  signaturesIncluded: { type: Type.BOOLEAN },
                },
              },
            },
            required: ['title', 'documentText', 'placeholders', 'reviewNotice'],
          },
        },
      })
    );

    const text = response.text || '{}';
    const parsed = JSON.parse(text);
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Error generating document:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate document',
    });
  }
});

// Endpoint: Review Existing Document (Mode B)
app.post('/api/review-document', async (req: Request, res: Response) => {
  try {
    const { documentText, jurisdiction, documentType } = req.body;

    if (!documentText || documentText.trim().length === 0) {
      return res.status(400).json({ success: false, error: 'Document text is required for review' });
    }

    const prompt = `Conduct a thorough, professional legal review of the following legal document draft.
Jurisdiction Context: ${jurisdiction || 'General / Unspecified'}
Document Type Context: ${documentType || 'General Contract'}

Analyze:
1. Missing Critical Clauses (e.g. governing law, severability, dispute resolution, limitation of liability, entire agreement, termination)
2. Ambiguous or Vague Language (clauses that invite dispute or lack clear metrics)
3. One-sided or Unfavorable Terms (imbalanced indemnities, uncapped liability, unfair termination penalties)
4. Internal Inconsistencies or Undefined Capitalized Terms
5. Jurisdiction-specific concerns
6. Overall Quality Score (0-100) and actionable improvement recommendations

DOCUMENT CONTENT:
"""
${documentText.slice(0, 30000)}
"""`;

    const response = await callGeminiWithRetry(() =>
      ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: `${MASTER_SYSTEM_PROMPT}\nYou are operating in MODE B: Contract Review. Provide rigorous, objective, practical legal feedback without declaring a formal legal opinion.`,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              overallRiskScore: { type: Type.INTEGER, description: '1 to 100 risk score where 100 is cleanest and lowest risk' },
              riskLevel: { type: Type.STRING, description: 'Low, Moderate, High, or Critical' },
              executiveSummary: { type: Type.STRING },
              identifiedIssues: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    category: { type: Type.STRING, description: 'Missing Clause, Ambiguity, One-Sided Term, Inconsistency, or Jurisdiction Risk' },
                    severity: { type: Type.STRING, description: 'High, Medium, or Low' },
                    title: { type: Type.STRING },
                    affectedSection: { type: Type.STRING },
                    problemStatement: { type: Type.STRING },
                    recommendedFix: { type: Type.STRING },
                    suggestedLanguage: { type: Type.STRING },
                  },
                  required: ['category', 'severity', 'title', 'problemStatement', 'recommendedFix'],
                },
              },
              missingClauses: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    clauseName: { type: Type.STRING },
                    importance: { type: Type.STRING },
                    reason: { type: Type.STRING },
                    sampleClause: { type: Type.STRING },
                  },
                },
              },
              keyStrengths: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              jurisdictionNotice: { type: Type.STRING },
              disclaimer: { type: Type.STRING },
            },
            required: ['overallRiskScore', 'riskLevel', 'executiveSummary', 'identifiedIssues', 'missingClauses'],
          },
        },
      })
    );

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Error reviewing document:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to review document',
    });
  }
});

// Endpoint: Explain Legal Concept or Clause (Mode C)
app.post('/api/explain-clause', async (req: Request, res: Response) => {
  try {
    const { clauseText, context } = req.body;

    if (!clauseText || clauseText.trim().length === 0) {
      return res.status(400).json({ success: false, error: 'Clause text or question is required' });
    }

    const prompt = `Explain the following legal clause or concept in plain, crystal-clear language.
Context / Document Type: ${context || 'General Commercial Agreement'}

LEGAL TEXT OR CONCEPT:
"""
${clauseText.slice(0, 10000)}
"""`;

    const response = await callGeminiWithRetry(() =>
      ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: `${MASTER_SYSTEM_PROMPT}\nYou are operating in MODE C: Explain. Provide:
1. Plain-Language Explanation (no legalese)
2. Primary Purpose of the Clause
3. Practical Real-World Implications (who pays, who carries risk, what happens on breach)
4. Hidden Traps & Common Concerns
5. Balanced Alternative Drafting Options (e.g. Standard, Mutual/Balanced, Party-Favorable)`,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              clauseName: { type: Type.STRING },
              plainLanguageExplanation: { type: Type.STRING },
              purpose: { type: Type.STRING },
              whoBenefits: { type: Type.STRING },
              practicalImplications: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              commonPitfalls: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              negotiationTips: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              alternatives: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    label: { type: Type.STRING },
                    description: { type: Type.STRING },
                    clauseText: { type: Type.STRING },
                  },
                },
              },
            },
            required: ['clauseName', 'plainLanguageExplanation', 'purpose', 'practicalImplications'],
          },
        },
      })
    );

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Error explaining clause:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to explain clause',
    });
  }
});

// Endpoint: Refine / Rewrite Clause
app.post('/api/refine-clause', async (req: Request, res: Response) => {
  try {
    const { clauseText, instruction } = req.body;

    const prompt = `Refine this legal clause according to the instruction: "${instruction || 'Make balanced and mutual'}"

ORIGINAL CLAUSE:
"""
${clauseText}
"""

Return a JSON with:
{
  "refinedClause": "The improved legal wording",
  "explanationOfChanges": "What was altered and why",
  "legalImpact": "How the legal obligations or balance shifted"
}`;

    const response = await callGeminiWithRetry(() =>
      ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: MASTER_SYSTEM_PROMPT,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              refinedClause: { type: Type.STRING },
              explanationOfChanges: { type: Type.STRING },
              legalImpact: { type: Type.STRING },
            },
            required: ['refinedClause', 'explanationOfChanges'],
          },
        },
      })
    );

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Error refining clause:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Setup Vite in Dev or serve static in Prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`LegalEase Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
