import React, { useState } from 'react';
import { ClauseExplanationResult } from '../types/legal';
import { LEGAL_GLOSSARY, GlossaryEntry } from '../data/legalGlossary';
import { apiExplainClause } from '../utils/api';
import {
  BookOpen,
  Search,
  Sparkles,
  HelpCircle,
  ShieldCheck,
  AlertTriangle,
  Lightbulb,
  Copy,
  Check,
  Loader2,
  FileText,
  Scale,
} from 'lucide-react';
import { copyToClipboard } from '../utils/exporter';

export const ModeExplain: React.FC = () => {
  const [query, setQuery] = useState('');
  const [context, setContext] = useState('Commercial Agreement');
  const [isExplaining, setIsExplaining] = useState(false);
  const [explanation, setExplanation] = useState<ClauseExplanationResult | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleSelectGlossary = (entry: GlossaryEntry) => {
    setQuery(entry.exampleText || entry.query);
    triggerExplain(entry.exampleText || entry.query, entry.category);
  };

  const triggerExplain = async (textToExplain: string, ctx?: string) => {
    if (!textToExplain.trim()) return;
    setIsExplaining(true);
    setExplanation(null);
    try {
      const res = await apiExplainClause({
        clauseText: textToExplain.trim(),
        context: ctx || context,
      });
      setExplanation(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsExplaining(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerExplain(query);
  };

  const handleCopyClause = async (text: string, id: string) => {
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
        <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-amber-400" />
          Mode C — Plain-Language Legal Concept & Clause Explainer
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Demystify legalese, discover who truly carries the risk, and learn battle-tested negotiation strategies.
        </p>
      </div>

      {/* Quick Topic Chips from Legal Glossary */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4">
        <span className="text-xs font-semibold text-slate-300 block mb-2.5">
          Explore Common Contract Clauses & Terms:
        </span>
        <div className="flex flex-wrap gap-2 text-xs">
          {LEGAL_GLOSSARY.map((entry, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectGlossary(entry)}
              className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-amber-500/40 hover:text-amber-300 text-slate-400 transition"
            >
              {entry.term}
            </button>
          ))}
        </div>
      </div>

      {/* Query Form */}
      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-amber-400" />
              Paste Clause or Ask a Question:
            </label>
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Paste any confusing clause from your agreement, or ask: 'What does consequential damages waiver mean in a SaaS contract?'"
              rows={4}
              required
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-amber-400 leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Agreement Context:
            </label>
            <select
              value={context}
              onChange={(e) => setContext(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400 mb-4"
            >
              <option value="Commercial Agreement">Commercial Services / SOW</option>
              <option value="Employment & HR">Employment / Independent Contractor</option>
              <option value="Real Estate & Tenancy">Residential / Commercial Lease</option>
              <option value="SaaS & Cloud Terms">SaaS & Technology Vendor</option>
              <option value="Intellectual Property">IP Assignment & Licensing</option>
              <option value="Corporate / Partnership">Partnership & M&A</option>
            </select>

            <button
              type="submit"
              disabled={isExplaining || !query.trim()}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 disabled:opacity-50 text-slate-950 font-bold px-4 py-2.5 rounded-lg text-xs transition shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              {isExplaining ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Translating Legalese...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Explain in Plain English</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Explanation Results */}
      {explanation && (
        <div className="space-y-6">
          {/* Main Plain-English Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
              <span className="px-2.5 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold">
                Clause Analysis
              </span>
              <h3 className="text-base font-bold text-slate-100">{explanation.clauseName}</h3>
            </div>

            {/* Plain English Translation */}
            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
              <span className="text-xs font-semibold text-amber-300 uppercase tracking-wider block mb-1">
                In Plain English:
              </span>
              <p className="text-sm text-slate-200 leading-relaxed font-sans">
                {explanation.plainLanguageExplanation}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-3.5 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-xs font-semibold text-slate-300 block mb-1">
                  Primary Legal Purpose:
                </span>
                <p className="text-xs text-slate-400 leading-relaxed">{explanation.purpose}</p>
              </div>

              {explanation.whoBenefits && (
                <div className="p-3.5 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="text-xs font-semibold text-slate-300 block mb-1">
                    Risk Allocation & Who Benefits:
                  </span>
                  <p className="text-xs text-slate-400 leading-relaxed">{explanation.whoBenefits}</p>
                </div>
              )}
            </div>

            {/* Practical Real-World Scenarios */}
            {explanation.practicalImplications && explanation.practicalImplications.length > 0 && (
              <div className="pt-2">
                <span className="text-xs font-semibold text-slate-200 block mb-2 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Practical Real-World Implications:
                </span>
                <div className="space-y-1.5">
                  {explanation.practicalImplications.map((imp, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2"
                    >
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>{imp}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Hidden Pitfalls */}
            {explanation.commonPitfalls && explanation.commonPitfalls.length > 0 && (
              <div className="pt-2">
                <span className="text-xs font-semibold text-rose-300 block mb-2 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  Hidden Traps & Red Flags to Watch Out For:
                </span>
                <div className="space-y-1.5">
                  {explanation.commonPitfalls.map((pit, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-rose-950/20 border border-rose-900/30 text-xs text-rose-200/90 flex items-start gap-2"
                    >
                      <span className="text-rose-400 font-bold">•</span>
                      <span>{pit}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Negotiation Tips */}
            {explanation.negotiationTips && explanation.negotiationTips.length > 0 && (
              <div className="pt-2">
                <span className="text-xs font-semibold text-amber-300 block mb-2 flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                  Tactical Negotiation Recommendations:
                </span>
                <div className="space-y-1.5">
                  {explanation.negotiationTips.map((tip, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-900/30 text-xs text-amber-200/90 flex items-start gap-2"
                    >
                      <span className="text-amber-400 font-bold">•</span>
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Balanced Alternative Wording Options */}
          {explanation.alternatives && explanation.alternatives.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-3">
              <span className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-400" />
                Balanced Alternative Drafting Options:
              </span>
              <p className="text-xs text-slate-400">
                Use these pre-tested sample provisions to replace one-sided or ambiguous contract language:
              </p>

              <div className="space-y-3 pt-1">
                {explanation.alternatives.map((alt, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-indigo-300">{alt.label}</span>
                      <button
                        onClick={() => handleCopyClause(alt.clauseText, `alt-${idx}`)}
                        className="text-[11px] flex items-center gap-1 text-slate-400 hover:text-amber-300"
                      >
                        {copiedId === `alt-${idx}` ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                        {copiedId === `alt-${idx}` ? 'Copied' : 'Copy Sample'}
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-400">{alt.description}</p>
                    <p className="text-xs font-serif-legal text-slate-200 bg-slate-900/90 p-3 rounded border border-slate-800 leading-relaxed">
                      {alt.clauseText}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
