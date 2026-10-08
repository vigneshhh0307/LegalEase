import React, { useState } from 'react';
import { DocumentDraft, DocumentTemplate } from '../types/legal';
import { DOCUMENT_TEMPLATES, POPULAR_JURISDICTIONS } from '../data/templates';
import { apiGenerateDocument } from '../utils/api';
import {
  Wand2,
  Scale,
  Sparkles,
  MapPin,
  Users,
  Calendar,
  DollarSign,
  ShieldAlert,
  Sliders,
  CheckCircle2,
  FileText,
  AlertTriangle,
  Send,
  Loader2,
  ChevronRight,
  BookOpen,
} from 'lucide-react';

interface Props {
  onDocumentGenerated: (doc: DocumentDraft) => void;
  initialTemplate?: DocumentTemplate | null;
}

export const ModeGenerate: React.FC<Props> = ({
  onDocumentGenerated,
  initialTemplate,
}) => {
  const [draftMode, setDraftMode] = useState<'wizard' | 'prompt'>('wizard');
  const [selectedType, setSelectedType] = useState<string>(
    initialTemplate?.documentType || 'Non-Disclosure Agreement'
  );
  const [selectedJurisdiction, setSelectedJurisdiction] = useState<string>(
    initialTemplate?.suggestedJurisdiction || 'Delaware, United States'
  );
  const [customJurisdiction, setCustomJurisdiction] = useState('');
  const [isCustomJurisdiction, setIsCustomJurisdiction] = useState(false);

  // Parties & Terms
  const [partyA, setPartyA] = useState(initialTemplate?.defaultParties.partyAExample || '');
  const [partyB, setPartyB] = useState(initialTemplate?.defaultParties.partyBExample || '');
  const [effectiveDate, setEffectiveDate] = useState('2026-10-15');
  const [term, setTerm] = useState('2 years');
  const [purpose, setPurpose] = useState(
    'Confidential review and evaluation of proprietary technologies and prospective strategic partnership'
  );
  const [paymentTerms, setPaymentTerms] = useState('');

  // Protective Clauses
  const [selectedClauses, setSelectedClauses] = useState<string[]>([
    'Mutual Confidentiality & Non-Disclosure',
    'Injunctive Relief without Bond',
    'Severability & Entire Agreement',
    'Binding Commercial Arbitration',
  ]);

  const [formalityLevel, setFormalityLevel] = useState<string>('Standard Commercial Agreement');
  const [additionalNotes, setAdditionalNotes] = useState('');

  // Freeform Prompt Mode
  const [freeformPrompt, setFreeformPrompt] = useState('');

  // Loading state & step indicators
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');

  // Check if current type is high-risk
  const isCurrentHighRisk = ['will', 'estate', 'rental', 'lease', 'partnership', 'loan', 'power of attorney'].some(
    (kw) => selectedType.toLowerCase().includes(kw)
  );

  const handleTemplateSelect = (template: DocumentTemplate) => {
    setSelectedType(template.documentType);
    setSelectedJurisdiction(template.suggestedJurisdiction);
    setPartyA(template.defaultParties.partyAExample);
    setPartyB(template.defaultParties.partyBExample);
    setFreeformPrompt(template.samplePrompt);
    setSelectedClauses(template.keyClauses.slice(0, 4));
  };

  const toggleClause = (clause: string) => {
    setSelectedClauses((prev) =>
      prev.includes(clause) ? prev.filter((c) => c !== clause) : [...prev, clause]
    );
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    const jurisdiction = isCustomJurisdiction && customJurisdiction.trim()
      ? customJurisdiction.trim()
      : selectedJurisdiction;

    const steps = [
      'Determining applicable legal framework...',
      `Tailoring covenants for ${jurisdiction}...`,
      'Drafting numbered clauses & definitions...',
      'Verifying placeholder variables and risk warnings...',
    ];

    let stepIdx = 0;
    setGenerationStep(steps[0]);
    const interval = setInterval(() => {
      stepIdx = (stepIdx + 1) % steps.length;
      setGenerationStep(steps[stepIdx]);
    }, 1200);

    try {
      const draft = await apiGenerateDocument({
        documentType: selectedType,
        jurisdiction,
        partyA: partyA.trim() || '[PARTY A FULL LEGAL NAME]',
        partyB: partyB.trim() || '[PARTY B FULL LEGAL NAME]',
        effectiveDate: effectiveDate || '[EFFECTIVE DATE]',
        term: term || '[TERM / DURATION]',
        purpose: purpose.trim() || '[PURPOSE AND SCOPE]',
        specialClauses: selectedClauses,
        formalityLevel,
        additionalNotes: additionalNotes.trim(),
        freeformPrompt: draftMode === 'prompt' ? freeformPrompt.trim() : undefined,
      });

      clearInterval(interval);
      onDocumentGenerated(draft);
    } catch (err) {
      console.error(err);
      clearInterval(interval);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Drafting Mode Selector Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-amber-400" />
            Mode A — AI Legal Document Generator
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Transform plain-language requirements into structured, jurisdiction-aware legal drafts.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            type="button"
            onClick={() => setDraftMode('wizard')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
              draftMode === 'wizard'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Guided Wizard
          </button>
          <button
            type="button"
            onClick={() => setDraftMode('prompt')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
              draftMode === 'prompt'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Natural Language Prompt
          </button>
        </div>
      </div>

      {/* Quick Template Presets Bar */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            Quick Presets from LegalEase Template Library:
          </span>
          <span className="text-[11px] text-slate-500">16 standard templates available</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar text-xs">
          {DOCUMENT_TEMPLATES.slice(0, 7).map((tpl) => (
            <button
              key={tpl.id}
              type="button"
              onClick={() => handleTemplateSelect(tpl)}
              className={`shrink-0 px-3 py-1.5 rounded-lg border text-left transition flex items-center gap-1.5 ${
                selectedType === tpl.documentType
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 font-medium'
                  : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <span>{tpl.title.split('(')[0]}</span>
              {tpl.isHighRisk && (
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400" title="High-Risk Category" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* High-Risk Pre-Warning */}
      {isCurrentHighRisk && (
        <div className="p-3.5 bg-amber-950/20 border border-amber-800/40 rounded-xl flex items-start gap-3 text-xs text-amber-300/90">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-amber-200">High-Risk Document Advisory:</strong>{' '}
            {selectedType}s carry significant legal, financial, or personal consequences. LegalEase will provide a formal draft with statutory notices, but qualified attorney review prior to signing or recording is strongly advised.
          </div>
        </div>
      )}

      {/* Generation Form */}
      <form onSubmit={handleGenerate} className="space-y-6">
        {draftMode === 'prompt' ? (
          /* Natural Language Prompt Mode */
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-1">
                Describe the Document You Need:
              </label>
              <p className="text-xs text-slate-400 mb-2">
                Specify document type, parties, jurisdiction, key terms, duration, and any special protective clauses.
              </p>
              <textarea
                value={freeformPrompt}
                onChange={(e) => setFreeformPrompt(e.target.value)}
                placeholder="Example: Draft a 2-year Independent Contractor Agreement for a Senior Frontend Engineer in New York, $120/hour, bi-weekly invoicing, complete IP assignment to client, mutual 15-day termination, and confidential treatment of source code."
                rows={6}
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/20 leading-relaxed"
              />
            </div>

            {/* Jurisdiction prompt in prompt mode as well */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  Intended Governing Jurisdiction:
                </label>
                <select
                  value={selectedJurisdiction}
                  onChange={(e) => setSelectedJurisdiction(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
                >
                  {POPULAR_JURISDICTIONS.map((j) => (
                    <option key={j.value} value={j.value}>
                      {j.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Drafting Formality & Tone:
                </label>
                <select
                  value={formalityLevel}
                  onChange={(e) => setFormalityLevel(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
                >
                  <option value="Standard Commercial Agreement">Standard Commercial Agreement</option>
                  <option value="High Formality / Executive Corporate">High Formality / Executive Corporate</option>
                  <option value="Plain English / Startup Friendly">Plain English / Startup Friendly</option>
                </select>
              </div>
            </div>
          </div>
        ) : (
          /* Guided Wizard Mode */
          <div className="space-y-6">
            {/* Step 1: Document & Jurisdiction */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                <span className="w-6 h-6 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center text-xs font-bold">
                  1
                </span>
                <h3 className="font-semibold text-slate-100 text-sm">
                  Document Type & Governing Jurisdiction
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Scale className="w-3.5 h-3.5 text-amber-400" />
                    Document Category / Type:
                  </label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
                  >
                    {DOCUMENT_TEMPLATES.map((t) => (
                      <option key={t.id} value={t.documentType}>
                        {t.title}
                      </option>
                    ))}
                    <option value="Custom Legal Contract">Other / Custom Contract</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    Which country and state/province will this be used in?
                  </label>
                  {!isCustomJurisdiction ? (
                    <div className="flex gap-2">
                      <select
                        value={selectedJurisdiction}
                        onChange={(e) => setSelectedJurisdiction(e.target.value)}
                        className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
                      >
                        {POPULAR_JURISDICTIONS.map((j) => (
                          <option key={j.value} value={j.value}>
                            {j.label}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => setIsCustomJurisdiction(true)}
                        className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700"
                      >
                        Other
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. Florida, United States or Dublin, Ireland"
                        value={customJurisdiction}
                        onChange={(e) => setCustomJurisdiction(e.target.value)}
                        className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
                      />
                      <button
                        type="button"
                        onClick={() => setIsCustomJurisdiction(false)}
                        className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700"
                      >
                        Presets
                      </button>
                    </div>
                  )}
                  <p className="text-[11px] text-slate-500 mt-1">
                    Documents are jurisdiction-sensitive. LegalEase will adapt statutory terms accordingly.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2: Parties Involved */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                <span className="w-6 h-6 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center text-xs font-bold">
                  2
                </span>
                <h3 className="font-semibold text-slate-100 text-sm">
                  Contracting Parties Information
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-blue-400" />
                    First Party (Disclosing / Employer / Landlord / Client):
                  </label>
                  <input
                    type="text"
                    value={partyA}
                    onChange={(e) => setPartyA(e.target.value)}
                    placeholder="e.g. Nexus Innovations Inc. [Leave blank for placeholder]"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    If unknown, LegalEase creates a clearly marked placeholder like [PARTY A FULL LEGAL NAME].
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-indigo-400" />
                    Second Party (Receiving / Employee / Tenant / Contractor):
                  </label>
                  <input
                    type="text"
                    value={partyB}
                    onChange={(e) => setPartyB(e.target.value)}
                    placeholder="e.g. Elena Rostova [Leave blank for placeholder]"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Never silently invent names or facts. Placeholders will be highlighted for filling.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3: Key Terms, Purpose & Duration */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                <span className="w-6 h-6 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center text-xs font-bold">
                  3
                </span>
                <h3 className="font-semibold text-slate-100 text-sm">
                  Core Purpose, Scope & Timeline
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    Effective Date:
                  </label>
                  <input
                    type="date"
                    value={effectiveDate}
                    onChange={(e) => setEffectiveDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                    Term / Duration:
                  </label>
                  <input
                    type="text"
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                    placeholder="e.g. 1 Year, 24 Months, or Until Project Completion"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Stated Purpose & Scope of Agreement:
                </label>
                <textarea
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  rows={2}
                  placeholder="Summarize the commercial or legal transaction being executed..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                  Consideration / Payment Terms (Optional):
                </label>
                <input
                  type="text"
                  value={paymentTerms}
                  onChange={(e) => setPaymentTerms(e.target.value)}
                  placeholder="e.g. $5,000 monthly retainer due on the 1st of each month, or $150/hr net 30 [Leave blank for placeholder]"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Step 4: Protective Clauses & Special Instructions */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                <span className="w-6 h-6 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center text-xs font-bold">
                  4
                </span>
                <h3 className="font-semibold text-slate-100 text-sm">
                  Clause Intelligence & Special Protections
                </h3>
              </div>

              <div className="space-y-2">
                <span className="text-xs text-slate-400 block mb-2">
                  Select key protective provisions to embed in the agreement:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    'Mutual Confidentiality & Non-Disclosure',
                    'Work Made For Hire & IP Assignment',
                    'Non-Solicitation of Employees & Clients',
                    'Liquidated Damages for Breach',
                    'Force Majeure (Acts of God & Emergencies)',
                    'Mutual Limitation of Liability Cap',
                    'Binding Commercial Arbitration (AAA / JAMS)',
                    'Prevailing Party Attorneys’ Fees',
                  ].map((clause, idx) => {
                    const isChecked = selectedClauses.includes(clause);
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => toggleClause(clause)}
                        className={`p-2.5 rounded-lg border text-left text-xs transition flex items-center justify-between ${
                          isChecked
                            ? 'bg-amber-500/15 border-amber-500/40 text-amber-200'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <span>{clause}</span>
                        <CheckCircle2
                          className={`w-4 h-4 shrink-0 ml-2 ${
                            isChecked ? 'text-amber-400' : 'text-slate-700'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Additional Instructions or Custom Provisions (Optional):
                </label>
                <input
                  type="text"
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  placeholder="e.g. Include 10-day cure period for default, require electronic signature acknowledgment..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isGenerating}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 disabled:opacity-50 text-slate-950 font-bold px-8 py-3.5 rounded-xl text-sm transition shadow-xl shadow-amber-500/20 cursor-pointer"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                <span>{generationStep || 'Generating Draft...'}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>Generate Professional Legal Draft</span>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
