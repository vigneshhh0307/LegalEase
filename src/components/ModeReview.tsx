import React, { useState } from 'react';
import { DocumentReviewResult, ReviewIssue } from '../types/legal';
import { apiReviewDocument } from '../utils/api';
import { POPULAR_JURISDICTIONS } from '../data/templates';
import {
  ShieldAlert,
  SearchCheck,
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  Copy,
  Check,
  Loader2,
  FileText,
  MapPin,
  ArrowRight,
  Info,
  Scale,
} from 'lucide-react';
import { copyToClipboard } from '../utils/exporter';

interface Props {
  initialText?: string;
  onOpenGeneratedView?: (text: string) => void;
}

export const ModeReview: React.FC<Props> = ({ initialText = '' }) => {
  const [documentText, setDocumentText] = useState(initialText);
  const [jurisdiction, setJurisdiction] = useState('Delaware, United States');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [reviewResult, setReviewResult] = useState<DocumentReviewResult | null>(null);
  const [copiedSample, setCopiedSample] = useState<string | null>(null);
  const [filterSeverity, setFilterSeverity] = useState<string>('All');

  const sampleContract = `CONSULTING SERVICES AGREEMENT
This Consulting Agreement is entered into on January 1, 2026, by and between Horizon Corp ("Company") and Jane Doe ("Consultant").
1. SERVICES: Consultant shall use best efforts to deliver marketing services as requested.
2. PAYMENT: Company shall pay Consultant $10,000 upon satisfactory completion of services.
3. INDEMNITY: Consultant shall indemnify, defend, and hold harmless Company from any and all claims, damages, liabilities, costs, and expenses arising out of the performance of services.
4. TERMINATION: Company may terminate this Agreement immediately without cause upon written notice.
5. CONFIDENTIALITY: Consultant agrees not to disclose any confidential information of Company for a period of 1 year.`;

  const handleLoadSample = () => {
    setDocumentText(sampleContract);
    setJurisdiction('California, United States');
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!documentText.trim()) return;

    setIsAnalyzing(true);
    setReviewResult(null);

    try {
      const result = await apiReviewDocument({
        documentText: documentText.trim(),
        jurisdiction,
      });
      setReviewResult(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopyClause = async (sample: string, id: string) => {
    const ok = await copyToClipboard(sample);
    if (ok) {
      setCopiedSample(id);
      setTimeout(() => setCopiedSample(null), 2000);
    }
  };

  const filteredIssues = reviewResult?.identifiedIssues.filter((issue) => {
    if (filterSeverity === 'All') return true;
    return issue.severity.toLowerCase() === filterSeverity.toLowerCase();
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
              Mode B — Contract Review & Risk Audit
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Inspect existing agreements for missing clauses, ambiguities, one-sided provisions, and jurisdictional liabilities.
            </p>
          </div>
          <button
            type="button"
            onClick={handleLoadSample}
            className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 transition self-start"
          >
            Load Sample Imbalanced Contract
          </button>
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleAnalyze} className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              Governing Jurisdiction Context:
            </label>
            <select
              value={jurisdiction}
              onChange={(e) => setJurisdiction(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
            >
              {POPULAR_JURISDICTIONS.map((j) => (
                <option key={j.value} value={j.value}>
                  {j.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <span className="text-[11px] text-slate-400 italic">
              Review identifies clauses that violate local public policy (e.g. California non-competes, UK unfair contract terms).
            </span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Contract or Document Text to Audit:
          </label>
          <textarea
            value={documentText}
            onChange={(e) => setDocumentText(e.target.value)}
            placeholder="Paste your legal contract, NDA, lease, SOW, or agreement text here to perform an exhaustive multi-point legal diagnostic..."
            rows={10}
            required
            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-4 font-mono text-xs text-slate-200 focus:outline-none focus:border-rose-400 leading-relaxed"
          />
        </div>

        <div className="flex justify-between items-center pt-2">
          <span className="text-xs text-slate-500">
            {documentText ? `${documentText.split(/\s+/).length} words entered` : 'Ready for input'}
          </span>
          <button
            type="submit"
            disabled={isAnalyzing || !documentText.trim()}
            className="flex items-center gap-2 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-400 hover:to-rose-500 disabled:opacity-50 text-white font-semibold px-6 py-2.5 rounded-xl text-xs transition shadow-lg shadow-rose-500/20 cursor-pointer"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Running Legal Risk Diagnostic...</span>
              </>
            ) : (
              <>
                <SearchCheck className="w-4 h-4" />
                <span>Run Legal Audit & Redline Analysis</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Review Results Display */}
      {reviewResult && (
        <div className="space-y-6">
          {/* Executive Score Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
              <div className="flex items-center gap-5">
                <div
                  className={`w-20 h-20 rounded-2xl flex flex-col items-center justify-center font-bold text-2xl shadow-inner border ${
                    reviewResult.riskLevel === 'Low'
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      : reviewResult.riskLevel === 'Moderate'
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                      : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                  }`}
                >
                  <span>{reviewResult.overallRiskScore}</span>
                  <span className="text-[10px] font-normal uppercase tracking-wider text-slate-400">
                    / 100
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        reviewResult.riskLevel === 'Low'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : reviewResult.riskLevel === 'Moderate'
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-rose-500/20 text-rose-300'
                      }`}
                    >
                      {reviewResult.riskLevel} Risk Profile
                    </span>
                    <span className="text-xs text-slate-400">
                      • {reviewResult.identifiedIssues.length} issues identified
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-100 mt-1">
                    Contract Health & Compliance Assessment
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                    {reviewResult.executiveSummary}
                  </p>
                </div>
              </div>
            </div>

            {/* Key Strengths */}
            {reviewResult.keyStrengths && reviewResult.keyStrengths.length > 0 && (
              <div className="mt-4 pt-2">
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5 mb-2">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Identified Document Strengths:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {reviewResult.keyStrengths.map((str, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300"
                    >
                      {str}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Missing Critical Clauses */}
          {reviewResult.missingClauses && reviewResult.missingClauses.length > 0 && (
            <div className="bg-slate-900 border border-amber-900/40 rounded-xl p-5 shadow-xl space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <h3 className="font-semibold text-slate-100 text-sm">
                  Missing Critical Clauses ({reviewResult.missingClauses.length})
                </h3>
              </div>
              <p className="text-xs text-slate-400">
                These foundational protections were not detected in the submitted contract text:
              </p>

              <div className="space-y-3 pt-1">
                {reviewResult.missingClauses.map((missing, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-amber-300">
                        {missing.clauseName}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium">
                        {missing.importance}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{missing.reason}</p>
                    {missing.sampleClause && (
                      <div className="mt-2 pt-2 border-t border-slate-800/80">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[11px] font-medium text-slate-300">
                            Recommended Model Language:
                          </span>
                          <button
                            onClick={() => handleCopyClause(missing.sampleClause!, `mc-${idx}`)}
                            className="text-[11px] flex items-center gap-1 text-slate-400 hover:text-amber-300"
                          >
                            {copiedSample === `mc-${idx}` ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                            {copiedSample === `mc-${idx}` ? 'Copied' : 'Copy Clause'}
                          </button>
                        </div>
                        <p className="text-xs font-serif-legal text-slate-300 bg-slate-900/90 p-2.5 rounded border border-slate-800">
                          {missing.sampleClause}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Red Flags & Ambiguities */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-rose-400" />
                <h3 className="font-semibold text-slate-100 text-sm">
                  Detected Risks, Ambiguities & Imbalances ({filteredIssues?.length || 0})
                </h3>
              </div>

              {/* Severity Filter */}
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
                {['All', 'High', 'Medium', 'Low'].map((sev) => (
                  <button
                    key={sev}
                    onClick={() => setFilterSeverity(sev)}
                    className={`px-2.5 py-1 rounded transition ${
                      filterSeverity === sev
                        ? 'bg-rose-500/20 text-rose-300 font-semibold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {filteredIssues && filteredIssues.length > 0 ? (
                filteredIssues.map((issue, idx) => (
                  <div
                    key={issue.id || idx}
                    className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3"
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            issue.severity === 'High'
                              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                              : issue.severity === 'Medium'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          }`}
                        >
                          {issue.severity.toUpperCase()} SEVERITY
                        </span>
                        <span className="text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                          {issue.category}
                        </span>
                      </div>
                      {issue.affectedSection && (
                        <span className="text-xs text-slate-500">
                          Section: {issue.affectedSection}
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-semibold text-slate-200">{issue.title}</h4>

                    <div className="text-xs space-y-1.5">
                      <p className="text-rose-300/90 leading-relaxed">
                        <strong className="text-rose-400">Problem:</strong> {issue.problemStatement}
                      </p>
                      <p className="text-slate-300 leading-relaxed">
                        <strong className="text-emerald-400">Recommended Fix:</strong> {issue.recommendedFix}
                      </p>
                    </div>

                    {issue.suggestedLanguage && (
                      <div className="pt-2 border-t border-slate-800/80">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[11px] font-medium text-slate-300">
                            Suggested Replacement Language:
                          </span>
                          <button
                            onClick={() => handleCopyClause(issue.suggestedLanguage!, `lang-${idx}`)}
                            className="text-[11px] flex items-center gap-1 text-slate-400 hover:text-amber-300"
                          >
                            {copiedSample === `lang-${idx}` ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                            {copiedSample === `lang-${idx}` ? 'Copied' : 'Copy Fix'}
                          </button>
                        </div>
                        <p className="text-xs font-serif-legal text-slate-200 bg-slate-900/90 p-2.5 rounded border border-slate-800">
                          {issue.suggestedLanguage}
                        </p>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-slate-500 text-xs">
                  No issues found matching severity filter "{filterSeverity}".
                </div>
              )}
            </div>
          </div>

          {/* Review Disclaimer Notice (Master System Prompt Section 18 Mode B) */}
          <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-slate-400 flex items-start gap-2.5">
            <Scale className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <p className="italic leading-relaxed">
              <strong>LEGAL REVIEW DISCLAIMER:</strong> This review is performed by an automated drafting assistant for diagnostic and issue-spotting assistance. It does not constitute a formal legal opinion, court representation, or qualified attorney counsel under the laws of {jurisdiction}.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
