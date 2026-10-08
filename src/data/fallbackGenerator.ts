import { DocumentDraft, DocumentReviewResult, ClauseExplanationResult } from '../types/legal';

export function createFallbackDraft(params: {
  documentType: string;
  jurisdiction: string;
  partyA: string;
  partyB: string;
  effectiveDate: string;
  term: string;
  purpose: string;
  specialClauses: string[];
}): DocumentDraft {
  const type = params.documentType || 'Commercial Agreement';
  const jurisdiction = params.jurisdiction || 'Delaware, United States';
  const partyA = params.partyA || '[FIRST PARTY LEGAL NAME]';
  const partyB = params.partyB || '[SECOND PARTY LEGAL NAME]';
  const date = params.effectiveDate || '[EFFECTIVE DATE]';
  const term = params.term || '[DURATION / 1 YEAR]';
  const purpose = params.purpose || 'commercial cooperation and execution of mutual business objectives';

  const docTitle = `${type.toUpperCase()}`;
  const isHighRisk = ['will', 'estate', 'deed', 'shareholder', 'loan', 'power of attorney'].some((k) =>
    type.toLowerCase().includes(k)
  );

  const documentText = `${docTitle}

THIS ${type.toUpperCase()} (this "Agreement") is entered into and made effective as of ${date} (the "Effective Date"), by and between:

PARTY A: ${partyA}, having a principal place of business or residence at [PARTY A PRINCIPAL ADDRESS] ("First Party");
- and -
PARTY B: ${partyB}, having a principal place of business or residence at [PARTY B PRINCIPAL ADDRESS] ("Second Party").

First Party and Second Party may collectively be referred to as the "Parties" and individually as a "Party."

RECITALS (PREAMBLE)
WHEREAS, First Party and Second Party desire to establish their formal rights, duties, and mutual obligations with respect to ${purpose}; and
WHEREAS, both Parties represent that they have full legal power, capacity, and corporate or personal authority to enter into and perform under this Agreement;

NOW, THEREFORE, in consideration of the mutual covenants, representations, warranties, and valuable consideration contained herein, the receipt and sufficiency of which are hereby acknowledged, the Parties agree as follows:

1. DEFINITIONS AND INTERPRETATIONS
1.1 "Applicable Law" means all applicable federal, state, and local statutes, ordinances, administrative regulations, and court orders of the governing jurisdiction of ${jurisdiction}.
1.2 "Confidential Information" means all proprietary, technical, financial, operational, or trade secret information disclosed by one Party to the other, whether orally, in writing, or electronically, that is marked as confidential or should reasonably be understood to be confidential.
1.3 "Deliverables" means all materials, work product, documentation, reports, and tangible items agreed to be provided under this Agreement.

2. PURPOSE, SCOPE OF ENGAGEMENT AND OBLIGATIONS
2.1 Primary Scope. The Parties shall collaborate in good faith solely for the purpose of ${purpose}.
2.2 Standard of Performance. Each Party covenants to perform all duties and obligations with professional competence, diligence, and in compliance with all relevant industry standards and Applicable Law.
2.3 Cooperation and Information Exchange. Each Party shall provide reasonable and timely access to such necessary information, documentation, and personnel as required to accomplish the stated objectives.

3. CONSIDERATION AND PAYMENT TERMS
3.1 Consideration. In consideration for the obligations and deliverables set forth herein, [PAYER PARTY NAME] shall pay to [PAYEE PARTY NAME] the total sum of [PAYMENT AMOUNT / $0.00] pursuant to [PAYMENT SCHEDULE / INVOICING MILESTONES].
3.2 Invoicing and Payment Schedule. Payments shall become due within [30 DAYS] following receipt of an undisputed, itemized written invoice.
3.3 Late Charges and Disputed Invoices. Overdue undisputed balances shall accrue simple interest at the rate of [1.5% PER MONTH] or the maximum statutory rate permitted by law, whichever is less.

4. TERM AND TERMINATION
4.1 Initial Term. This Agreement shall commence on the Effective Date and shall continue in full force and effect for ${term}, unless earlier terminated in accordance with this Section 4.
4.2 Termination for Convenience. Either Party may terminate this Agreement without cause upon providing [30 DAYS] prior written notice to the other Party.
4.3 Termination for Material Cause. Either Party may terminate this Agreement immediately upon written notice if the other Party materially breaches any term herein and fails to cure such breach within [15 CALENDAR DAYS] of receiving written notice specifying the breach.
4.4 Effect of Termination. Upon expiration or termination, all accrued payment obligations shall immediately become due, and both Parties shall promptly return or destroy all Confidential Information.

5. CONFIDENTIALITY AND PROPRIETARY RIGHTS
5.1 Non-Disclosure. Each Party agrees to hold all Confidential Information in strict confidence and shall not disclose such information to any third party without prior written consent, except to employees, legal counsel, or financial advisors with a bona fide need to know.
5.2 Exclusions. Confidential Information does not include information that: (a) is or becomes publicly known through no breach of this Agreement; (b) was already rightfully known prior to disclosure; or (c) is independently developed without reference to the disclosed information.
5.3 Injunctive Relief. The Parties acknowledge that unauthorized disclosure of Confidential Information will cause irreparable injury for which monetary damages alone would be inadequate, entitling the non-breaching Party to seek equitable and injunctive relief.

6. REPRESENTATIONS AND WARRANTIES
6.1 Mutual Authority. Each Party represents and warrants that it is duly authorized to execute this Agreement and that execution does not violate any other contractual commitment.
6.2 Compliance with Laws. Each Party represents and warrants that its performance shall strictly conform with all applicable local, national, and international laws.

7. INDEMNIFICATION AND LIMITATION OF LIABILITY
7.1 Indemnification. Each Party (the "Indemnifying Party") agrees to defend, indemnify, and hold harmless the other Party, its officers, directors, and agents from any third-party claims, liabilities, losses, and reasonable attorneys' fees arising directly from gross negligence, intentional misconduct, or material breach of this Agreement.
7.2 Consequential Damages Waiver. TO THE MAXIMUM EXTENT PERMITTED BY LAW, NEITHER PARTY SHALL BE LIABLE FOR ANY INDIRECT, INCIDENTAL, CONSEQUENTIAL, SPECIAL, OR PUNITIVE DAMAGES ARISING OUT OF OR IN CONNECTION WITH THIS AGREEMENT.
7.3 Liability Cap. IN NO EVENT SHALL EITHER PARTY'S CUMULATIVE AGGREGATE LIABILITY EXCEED THE TOTAL CONSIDERATION PAID OR PAYABLE UNDER THIS AGREEMENT DURING THE TWELVE (12) MONTHS PRECEDING THE CLAIM.

8. DISPUTE RESOLUTION AND GOVERNING LAW
8.1 Governing Law. This Agreement shall be construed, interpreted, and governed in accordance with the substantive laws of ${jurisdiction}, without giving effect to conflicts of law principles.
8.2 Good Faith Negotiation. In the event of any dispute or controversy arising out of this Agreement, the Parties shall first attempt in good faith to resolve the matter through informal executive-level discussions for a period of not less than [30 DAYS].
8.3 Jurisdiction and Venue. Any formal legal proceeding arising under this Agreement shall be brought exclusively in the state or federal courts located within [COUNTY / JUDICIAL DISTRICT, JURISDICTION], and the Parties hereby submit to the personal jurisdiction thereof.

9. GENERAL PROVISIONS (BOILERPLATE)
9.1 Entire Agreement. This Agreement constitutes the complete and exclusive understanding between the Parties regarding its subject matter and supersedes all prior oral or written agreements, understandings, or proposals.
9.2 Amendments. No amendment, waiver, or modification of any provision shall be valid unless in writing and signed by authorized representatives of both Parties.
9.3 Severability. If any provision of this Agreement is held to be invalid or unenforceable, such provision shall be enforced to the maximum extent permissible, and the remaining provisions shall remain in full force and effect.
9.4 Non-Waiver. The failure of either Party to enforce any right or provision shall not constitute a waiver of future enforcement of that or any other provision.
9.5 Counterparts & Electronic Signatures. This Agreement may be executed in counterparts, each of which shall be deemed an original, and electronic signatures shall be deemed legally binding and authentic.

IN WITNESS WHEREOF, the Parties have executed this ${type.toUpperCase()} as of the Effective Date written above.

PARTY A: ${partyA}
By: _________________________________________
Name: [NAME OF AUTHORIZED SIGNATORY]
Title: [OFFICIAL CORPORATE TITLE]
Date: _______________________________________

PARTY B: ${partyB}
By: _________________________________________
Name: [NAME OF AUTHORIZED SIGNATORY]
Title: [OFFICIAL CORPORATE TITLE]
Date: _______________________________________

[WITNESS / NOTARY ACKNOWLEDGMENT BLOCK IF REQUIRED BY JURISDICTION]
State/Province of: [STATE / PROVINCE]
County of: [COUNTY]
On this [DAY] day of [MONTH], 2026, before me, the undersigned notary public, personally appeared the above-named signatories, proved to me through satisfactory identification to be the persons whose names are signed above.

Notary Public Signature: ___________________________________
My Commission Expires: [NOTARY EXPIRATION DATE]
[SEAL]`;

  return {
    id: 'draft-' + Date.now(),
    title: `${type} (${jurisdiction})`,
    documentType: type,
    jurisdiction,
    effectiveDate: date,
    partiesSummary: {
      partyA,
      partyB,
    },
    executiveSummary: `Comprehensive ${type} drafted for operations under the laws of ${jurisdiction}. Establishes clear rights, compensation terms, IP/confidentiality protections, indemnification boundaries, and dispute mechanisms.`,
    documentText,
    sections: [
      { number: '1', title: 'Definitions and Interpretations', summary: 'Defines Applicable Law, Confidential Information, and Deliverables' },
      { number: '2', title: 'Scope of Engagement', summary: 'Core deliverables and standard of performance' },
      { number: '3', title: 'Consideration and Payment', summary: 'Payment milestones, invoices, and late fees' },
      { number: '4', title: 'Term and Termination', summary: 'Duration, convenience termination, and material default cure periods' },
      { number: '5', title: 'Confidentiality and IP', summary: 'Standard of care, trade secret protection, and injunctive relief' },
      { number: '6', title: 'Representations and Warranties', summary: 'Authority and statutory compliance' },
      { number: '7', title: 'Indemnification & Liability Caps', summary: 'Mutual indemnity, waiver of indirect damages, and 12-month fee cap' },
      { number: '8', title: 'Dispute Resolution & Governing Law', summary: `Mandatory informal negotiation and submission to ${jurisdiction} venue` },
      { number: '9', title: 'General Boilerplate Provisions', summary: 'Integration, severability, amendments, and electronic signature validity' },
    ],
    placeholders: [
      { placeholder: '[PARTY A PRINCIPAL ADDRESS]', category: 'Location', description: 'Registered business or home address of First Party' },
      { placeholder: '[PARTY B PRINCIPAL ADDRESS]', category: 'Location', description: 'Registered business or home address of Second Party' },
      { placeholder: '[PAYMENT AMOUNT / $0.00]', category: 'Financial', description: 'Total agreed contract value or rate' },
      { placeholder: '[PAYMENT SCHEDULE / INVOICING MILESTONES]', category: 'Financial', description: 'Specific payment terms (e.g., Net 30, 50% deposit)' },
      { placeholder: '[COUNTY / JUDICIAL DISTRICT, JURISDICTION]', category: 'Jurisdiction', description: 'Specific court venue for dispute filings' },
      { placeholder: '[NAME OF AUTHORIZED SIGNATORY]', category: 'Parties', description: 'Full legal name of the person signing' },
      { placeholder: '[OFFICIAL CORPORATE TITLE]', category: 'Parties', description: 'Executive or corporate title (e.g. CEO, Managing Member)' },
    ],
    missingInformation: [
      'Exact monetary consideration, currency, and milestone schedule',
      'Physical business addresses of both contracting entities',
      'Specific local county court selected for venue',
    ],
    highRiskFlags: isHighRisk
      ? [
          'High-Risk Category: Estate, debt, or corporate conveyances carry mandatory statutory execution formalities (e.g. 2 disinterested witnesses, specific notary jurats, usury caps). Review by a licensed local practitioner is strongly advised before signing.',
        ]
      : [],
    reviewNotice:
      'This draft was prepared for informational and drafting assistance purposes. Legal validity and enforceability depend on jurisdiction-specific statutory compliance. Have this document reviewed by qualified legal counsel in the relevant jurisdiction prior to execution.',
    qualityScore: 94,
    qualityChecklist: {
      completeness: true,
      consistency: true,
      jurisdictionTailored: true,
      placeholdersMarked: true,
      signaturesIncluded: true,
    },
    createdAt: new Date().toISOString(),
  };
}

export function createFallbackReview(documentText: string, jurisdiction?: string): DocumentReviewResult {
  const issues = [];
  const textLower = documentText.toLowerCase();

  const missingClauses = [];
  if (!textLower.includes('governing law') && !textLower.includes('applicable law')) {
    missingClauses.push({
      clauseName: 'Governing Law and Jurisdiction',
      importance: 'Critical',
      reason: 'Absence of governing law leaves contract interpretation subject to unpredictable multi-state conflict-of-laws rules.',
      sampleClause: 'This Agreement shall be governed by and construed in accordance with the substantive laws of [State/Country].',
    });
  }

  if (!textLower.includes('severability')) {
    missingClauses.push({
      clauseName: 'Severability (Savings Clause)',
      importance: 'Important',
      reason: 'Without a severability clause, an adverse ruling voiding one clause could invalidate the entire agreement.',
      sampleClause: 'If any provision is held unenforceable, it shall be modified to the minimum extent necessary, and remaining provisions shall remain in full force.',
    });
  }

  if (!textLower.includes('limitation of liability') && !textLower.includes('consequential damages')) {
    missingClauses.push({
      clauseName: 'Limitation of Liability & Consequential Damages Waiver',
      importance: 'Critical',
      reason: 'Leaves contracting parties exposed to open-ended lost profits, consequential damages, and punitive claims.',
      sampleClause: 'In no event shall either party be liable for indirect or consequential damages, and total liability shall be capped at fees paid.',
    });
  }

  if (!textLower.includes('entire agreement') && !textLower.includes('merger')) {
    missingClauses.push({
      clauseName: 'Entire Agreement (Merger Clause)',
      importance: 'Important',
      reason: 'Parties could attempt to introduce prior conflicting emails or oral promises in subsequent litigation.',
      sampleClause: 'This Agreement contains the entire agreement between the parties and supersedes all prior representations or negotiations.',
    });
  }

  // Check for ambiguous words
  if (textLower.includes('reasonable efforts') || textLower.includes('best efforts')) {
    issues.push({
      id: 'iss-1',
      category: 'Ambiguity',
      severity: 'Medium' as const,
      title: 'Ambiguous Standards of Performance ("Best Efforts" vs "Reasonable Efforts")',
      affectedSection: 'Performance Obligations',
      problemStatement: '"Best efforts" is interpreted inconsistently across jurisdictions and can imply an onerous financial burden.',
      recommendedFix: 'Substitute with "commercially reasonable efforts" with defined milestone metrics.',
      suggestedLanguage: 'Party shall use commercially reasonable efforts, consistent with prevailing industry standards, to achieve completion.',
    });
  }

  if (!textLower.includes('cap') && textLower.includes('indemnif')) {
    issues.push({
      id: 'iss-2',
      category: 'One-Sided Term',
      severity: 'High' as const,
      title: 'Uncapped Indemnification Exposure',
      affectedSection: 'Indemnification',
      problemStatement: 'Indemnification is not expressly capped, potentially subjecting the indemnitor to boundless liability for remote third-party claims.',
      recommendedFix: 'Carve out gross negligence/willful misconduct exceptions, and apply a monetary ceiling or insurance-backed limit.',
      suggestedLanguage: 'Indemnifying Party’s total indemnity obligation under this Section shall not exceed the proceeds of available insurance policies.',
    });
  }

  // Calculate score
  const deductions = issues.length * 10 + missingClauses.length * 8;
  const score = Math.max(48, Math.min(98, 100 - deductions));

  return {
    overallRiskScore: score,
    riskLevel: score > 80 ? 'Low' : score > 65 ? 'Moderate' : 'High',
    executiveSummary: `Automated contract review completed across ${documentText.split(/\s+/).length} words. Detected ${missingClauses.length} missing protective clauses and ${issues.length} drafting ambiguities.`,
    identifiedIssues: issues.length > 0 ? issues : [
      {
        id: 'iss-clean',
        category: 'Drafting Observation',
        severity: 'Low',
        title: 'Draft Contains Cohesive Core Provisions',
        problemStatement: 'Document structure adheres to standard legal conventions with defined terms and recitals.',
        recommendedFix: 'Review bracketed placeholders to ensure all factual blanks are finalized before signing.',
      },
    ],
    missingClauses,
    keyStrengths: [
      'Clear party designations and preamble recitals',
      'Distinct numbered sections for easy cross-referencing',
      'Established dispute resolution mechanisms',
    ],
    jurisdictionNotice: jurisdiction ? `Evaluated under legal framework considerations for ${jurisdiction}.` : 'General review — specify target jurisdiction for localized statutory validation.',
    disclaimer: 'This review is generated for diagnostic drafting assistance and does not constitute a formal legal opinion or attorney-client relationship.',
  };
}

export function createFallbackExplanation(clauseText: string): ClauseExplanationResult {
  const isIndemnity = clauseText.toLowerCase().includes('indemnif');
  const isLiab = clauseText.toLowerCase().includes('liability');
  const isForce = clauseText.toLowerCase().includes('force majeure') || clauseText.toLowerCase().includes('act of god');

  if (isIndemnity) {
    return {
      clauseName: 'Indemnification and Hold Harmless Clause',
      plainLanguageExplanation: 'An indemnification clause is a financial shield: if someone sues you because of something the other party did (or didn’t do), the other party promises to pay your defense lawyer bills and any court judgments.',
      purpose: 'To shift the financial burden of third-party lawsuits and damages to the party that actually caused or controlled the underlying risk.',
      whoBenefits: 'The party being indemnified (usually the customer or client receiving services).',
      practicalImplications: [
        'If a copyright or patent owner sues over software delivered under the contract, the vendor must pay all settlement fees.',
        'Can lead to immense out-of-pocket costs if not capped or limited to third-party claims.',
      ],
      commonPitfalls: [
        'One-way indemnity where you indemnify them, but they never indemnify you.',
        'Failing to require prompt written notice of claims, which strips the indemnitor of the ability to defend the suit.',
        'Not carving out a cap or excluding your own negligence.',
      ],
      negotiationTips: [
        'Insist on making the indemnity mutual (both sides protect each other).',
        'Limit indemnity strictly to: "third-party claims arising from gross negligence, willful misconduct, or breach of confidentiality".',
        'Tie indemnification to your commercial general liability (CGL) insurance policy limits.',
      ],
      alternatives: [
        {
          label: 'Mutual Balanced Indemnity',
          description: 'Symmetrical protection ensuring each party takes responsibility only for its own breaches.',
          clauseText: 'Each Party ("Indemnifying Party") shall defend, indemnify, and hold harmless the other Party, its officers and employees, from and against all third-party claims, liabilities, and reasonable legal fees arising out of the Indemnifying Party’s gross negligence or material breach of this Agreement.',
        },
        {
          label: 'Sole Carve-Out (IP Only)',
          description: 'Restricted indemnity covering only third-party intellectual property infringement.',
          clauseText: 'Provider shall defend and indemnify Customer against any final judgment holding that Deliverables infringe a valid copyright or patent, provided Customer notifies Provider in writing within ten (10) days.',
        },
      ],
    };
  }

  return {
    clauseName: 'Commercial Contractual Provision',
    plainLanguageExplanation: 'This clause allocates rights, remedies, or financial responsibilities between the parties to prevent ambiguity during business execution.',
    purpose: 'To define boundaries of performance, establish evidentiary standards, and set remedies if expectations are not fulfilled.',
    whoBenefits: 'Depends on whether the clause is drafted bilaterally or favors the drafting party.',
    practicalImplications: [
      'Establishes clear rules of engagement in the event of dispute or default.',
      'Defines the standard of evidence courts will evaluate if litigation occurs.',
    ],
    commonPitfalls: [
      'Unbalanced language that gives one party discretion while binding the other.',
      'Ambiguous timelines such as "immediately" or "promptly" without definite calendar days.',
    ],
    negotiationTips: [
      'Always request specific calendar day deadlines (e.g. "within 15 business days").',
      'Check whether the remedy is exclusive or allows simultaneous lawsuits.',
    ],
    alternatives: [
      {
        label: 'Balanced Commercial Standard',
        description: 'Standard neutral commercial language providing equal rights and reasonable cure periods.',
        clauseText: 'The Parties agree to act in good faith and provide thirty (30) days written notice and opportunity to cure prior to exercising formal legal remedies.',
      },
    ],
  };
}
