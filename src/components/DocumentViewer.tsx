import React, { useState, useMemo } from 'react';
import { DocumentDraft } from '../types/legal';
import {
  FileText,
  Download,
  Printer,
  Copy,
  Check,
  Edit2,
  Eye,
  Sliders,
  ShieldAlert,
  AlertTriangle,
  Scale,
  Sparkles,
  Layers,
  Wand2,
  FileCheck2,
  ChevronDown,
  Info,
} from 'lucide-react';
import {
  copyToClipboard,
  downloadWordDocument,
  downloadPlainText,
  printLegalDocument,
} from '../utils/exporter';
import { PlaceholderManager } from './PlaceholderManager';
import { replaceMultiplePlaceholders, extractPlaceholders } from '../utils/placeholderExtractor';
import { apiRefineClause } from '../utils/api';

interface Props {
  document: DocumentDraft;
  onUpdateDocument: (updated: DocumentDraft) => void;
  onOpenReview?: (text: string) => void;
}

export const DocumentViewer: React.FC<Props> = ({
  document,
  onUpdateDocument,
  onOpenReview,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(document.documentText);
  const [copied, setCopied] = useState(false);
  const [showPlaceholders, setShowPlaceholders] = useState(false);
  const [paperTheme, setPaperTheme] = useState<'paper' | 'dark'>('paper');
  const [showRefiner, setShowRefiner] = useState(false);
  const [refineSelection, setRefineSelection] = useState('');
  const [refineInstruction, setRefineInstruction] = useState('Make balanced and mutual for both parties');
  const [isRefining, setIsRefining] = useState(false);
  const [refineResult, setRefineResult] = useState<{
    refinedClause: string;
    explanationOfChanges: string;
    legalImpact?: string;
  } | null>(null);
  const [showQualityModal, setShowQualityModal] = useState(false);

  // Sync editedText if doc changes externally
  React.useEffect(() => {
    setEditedText(document.documentText);
  }, [document.documentText]);

  // Detected placeholders
  const currentPlaceholders = useMemo(() => {
    return extractPlaceholders(document.documentText);
  }, [document.documentText]);

  const handleApplyReplacements = (replacements: Record<string, string>) => {
    const updated = replaceMultiplePlaceholders(document.documentText, replacements);
    const newPlaceholders = extractPlaceholders(updated);
    onUpdateDocument({
      ...document,
      documentText: updated,
      placeholders: newPlaceholders,
      lastModified: new Date().toISOString(),
    });
  };

  const handleSaveEdit = () => {
    const newPlaceholders = extractPlaceholders(editedText);
    onUpdateDocument({
      ...document,
      documentText: editedText,
      placeholders: newPlaceholders,
      lastModified: new Date().toISOString(),
    });
    setIsEditing(false);
  };

  const handleCopy = async () => {
    const ok = await copyToClipboard(document.documentText);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadDoc = () => {
    downloadWordDocument(
      `${document.title.replace(/[^a-zA-Z0-9_-]/g, '_')}`,
      document.title,
      document.documentText
    );
  };

  const handlePrint = () => {
    printLegalDocument(document.title, document.documentText, document.reviewNotice);
  };

  const handleRefineSubmit = async () => {
    if (!refineSelection) return;
    setIsRefining(true);
    setRefineResult(null);
    try {
      const res = await apiRefineClause({
        clauseText: refineSelection,
        instruction: refineInstruction,
      });
      setRefineResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsRefining(false);
    }
  };

  const handleAcceptRefinedClause = () => {
    if (!refineResult || !refineSelection) return;
    const updated = document.documentText.replace(refineSelection, refineResult.refinedClause);
    onUpdateDocument({
      ...document,
      documentText: updated,
      lastModified: new Date().toISOString(),
    });
    setShowRefiner(false);
    setRefineResult(null);
    setRefineSelection('');
  };

  // Render text with clickable placeholders
  const renderInteractiveText = (text: string) => {
    const parts = text.split(/(\[[A-Z0-9_\s\/\-\$\.\,\'\:]+\])/g);
    return parts.map((part, index) => {
      if (part.startsWith('[') && part.endsWith(']')) {
        return (
          <span
            key={index}
            onClick={() => setShowPlaceholders(true)}
            title="Click to replace variable across document"
            className="inline-block px-1.5 py-0.5 mx-0.5 bg-amber-500/15 text-amber-700 dark:text-amber-300 font-mono text-[0.88em] font-semibold rounded border border-amber-500/30 cursor-pointer hover:bg-amber-500/25 transition select-all"
          >
            {part}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5" />
                {document.documentType}
              </span>
              <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700 text-xs">
                Jurisdiction: {document.jurisdiction}
              </span>
              <button
                onClick={() => setShowQualityModal(true)}
                className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-medium flex items-center gap-1 hover:bg-emerald-500/20 transition cursor-pointer"
              >
                <FileCheck2 className="w-3.5 h-3.5" />
                Quality Score: {document.qualityScore}/100
              </button>
            </div>
            <h1 className="text-xl lg:text-2xl font-bold text-slate-100 mt-2 font-serif-legal">
              {document.title}
            </h1>
            {document.executiveSummary && (
              <p className="text-sm text-slate-400 mt-1 max-w-4xl leading-relaxed">
                {document.executiveSummary}
              </p>
            )}
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setShowPlaceholders(!showPlaceholders)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition border ${
                currentPlaceholders.length > 0
                  ? 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Placeholders ({currentPlaceholders.length})
            </button>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition border ${
                isEditing
                  ? 'bg-amber-500 text-slate-950 border-amber-500 font-semibold'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              {isEditing ? <Eye className="w-3.5 h-3.5" /> : <Edit2 className="w-3.5 h-3.5" />}
              {isEditing ? 'Preview Mode' : 'Edit Live'}
            </button>

            <button
              onClick={() => setShowRefiner(!showRefiner)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 transition"
              title="Select or paste clause to rewrite with AI"
            >
              <Wand2 className="w-3.5 h-3.5 text-indigo-400" />
              Clause Assistant
            </button>

            {onOpenReview && (
              <button
                onClick={() => onOpenReview(document.documentText)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 transition"
                title="Run legal risk review & redlines on this draft"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                Audit & Redline
              </button>
            )}

            {/* Export options */}
            <div className="h-6 w-px bg-slate-800 mx-1 hidden sm:block" />

            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title="Copy to clipboard"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy'}
            </button>

            <button
              onClick={handleDownloadDoc}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title="Download Word (.doc)"
            >
              <Download className="w-3.5 h-3.5 text-blue-400" />
              Word (.doc)
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title="Print or Save as PDF"
            >
              <Printer className="w-3.5 h-3.5 text-amber-400" />
              Print / PDF
            </button>
          </div>
        </div>

        {/* High-Risk Warning Notice (Master System Prompt Section 10) */}
        {document.highRiskFlags && document.highRiskFlags.length > 0 && (
          <div className="mt-4 p-3.5 bg-rose-950/40 border border-rose-800/60 rounded-lg flex items-start gap-3 text-rose-200">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <span className="font-semibold text-rose-300 uppercase tracking-wider text-[11px] block">
                High-Risk Document Advisory
              </span>
              {document.highRiskFlags.map((flag, idx) => (
                <p key={idx} className="leading-relaxed">
                  {flag}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Important Missing Information (Master System Prompt Section 15) */}
        {document.missingInformation && document.missingInformation.length > 0 && (
          <div className="mt-3 p-3 bg-amber-950/30 border border-amber-800/40 rounded-lg flex items-start gap-2.5 text-amber-200/90 text-xs">
            <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-amber-300">Action Required Before Execution:</span>{' '}
              {document.missingInformation.join(' • ')}
            </div>
          </div>
        )}
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Document Canvas Area */}
        <div className={`transition-all duration-300 ${showPlaceholders ? 'lg:col-span-8' : 'lg:col-span-12'}`}>
          {/* Canvas Styling Toolbar */}
          <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-t border-l border-r border-slate-800 rounded-t-xl text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="font-medium text-slate-300">Paper View:</span>
              <button
                onClick={() => setPaperTheme('paper')}
                className={`px-2 py-0.5 rounded transition ${
                  paperTheme === 'paper' ? 'bg-amber-500/20 text-amber-300 font-medium' : 'hover:text-slate-200'
                }`}
              >
                Executive Parchment
              </button>
              <button
                onClick={() => setPaperTheme('dark')}
                className={`px-2 py-0.5 rounded transition ${
                  paperTheme === 'dark' ? 'bg-amber-500/20 text-amber-300 font-medium' : 'hover:text-slate-200'
                }`}
              >
                Obsidian Dark
              </button>
            </div>
            <div className="flex items-center gap-3">
              <span>{document.documentText.split(/\s+/).length} Words</span>
              <span>{currentPlaceholders.length} Placeholders Remaining</span>
            </div>
          </div>

          {/* Paper Viewport */}
          {isEditing ? (
            <div className="bg-slate-950 border border-slate-800 rounded-b-xl p-6 shadow-2xl">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs text-amber-400 font-medium flex items-center gap-1.5">
                  <Edit2 className="w-3.5 h-3.5" />
                  Live Drafting Editor
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="text-xs px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="text-xs px-3 py-1 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold transition"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
              <textarea
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                rows={32}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-5 font-mono text-xs text-slate-100 leading-relaxed focus:outline-none focus:border-amber-400"
              />
            </div>
          ) : (
            <div
              className={`rounded-b-xl border transition-all duration-200 shadow-2xl p-8 sm:p-14 md:p-16 ${
                paperTheme === 'paper'
                  ? 'bg-amber-50/95 text-slate-900 border-amber-200/60 font-serif-legal selection:bg-amber-200'
                  : 'bg-slate-900/95 text-slate-100 border-slate-800 font-serif-legal selection:bg-amber-500/30'
              }`}
            >
              {/* Formal Document Title */}
              <div className="text-center mb-10 pb-6 border-b-2 border-slate-900/20 dark:border-slate-700">
                <h2 className="text-xl sm:text-2xl font-bold tracking-wider uppercase font-serif-legal">
                  {document.title}
                </h2>
                <div className="text-xs mt-2 text-slate-600 dark:text-slate-400 font-sans tracking-wide">
                  GOVERNING JURISDICTION: <span className="font-semibold">{document.jurisdiction.toUpperCase()}</span>
                </div>
              </div>

              {/* Legal Text with Section Typography */}
              <div className="space-y-6 text-sm sm:text-base leading-relaxed text-justify">
                {document.documentText.split('\n\n').map((paragraph, pIdx) => {
                  const trimmed = paragraph.trim();
                  if (!trimmed) return null;

                  // Heading check (e.g. 1. DEFINITIONS, WHEREAS, RECITALS)
                  const isHeading =
                    /^[0-9]+\.\s+[A-Z\s]{3,}/.test(trimmed) ||
                    trimmed.startsWith('RECITALS') ||
                    trimmed.startsWith('IN WITNESS WHEREOF') ||
                    trimmed.startsWith('PARTY A:') ||
                    trimmed.startsWith('PARTY B:');

                  if (isHeading) {
                    return (
                      <h3
                        key={pIdx}
                        className="text-base sm:text-lg font-bold tracking-wide uppercase pt-4 pb-1 border-b border-slate-300 dark:border-slate-800 text-slate-950 dark:text-amber-100"
                      >
                        {renderInteractiveText(trimmed)}
                      </h3>
                    );
                  }

                  return (
                    <p key={pIdx} className="leading-relaxed">
                      {renderInteractiveText(trimmed)}
                    </p>
                  );
                })}
              </div>

              {/* Review Notice & Legal Disclaimer (Master System Prompt Section 15 & 10) */}
              <div className="mt-14 pt-6 border-t border-slate-400/40 dark:border-slate-800 font-sans text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-start gap-2.5">
                  <Scale className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <p className="italic leading-relaxed">
                    <strong className="not-italic text-slate-700 dark:text-slate-300">
                      LEGAL COUNSEL NOTICE:
                    </strong>{' '}
                    {document.reviewNotice}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Side Drawer: Placeholder Variable Inspector */}
        {showPlaceholders && (
          <div className="lg:col-span-4 sticky top-6">
            <PlaceholderManager
              placeholders={currentPlaceholders}
              documentText={document.documentText}
              onApplyReplacements={handleApplyReplacements}
              onClose={() => setShowPlaceholders(false)}
            />
          </div>
        )}
      </div>

      {/* Clause Refiner Assistant Modal */}
      {showRefiner && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-2xl w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Wand2 className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-semibold text-slate-100">
                  AI Clause Assistant & Redline Refiner
                </h3>
              </div>
              <button
                onClick={() => setShowRefiner(false)}
                className="text-slate-400 hover:text-slate-200 text-xs px-2.5 py-1 rounded bg-slate-800"
              >
                Close
              </button>
            </div>

            <div className="space-y-4 my-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Target Clause or Text to Refine:
                </label>
                <textarea
                  value={refineSelection}
                  onChange={(e) => setRefineSelection(e.target.value)}
                  placeholder="Paste or select any clause from the document that you wish to tighten, balance, or reword..."
                  rows={4}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs text-slate-100 focus:outline-none focus:border-indigo-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Drafting Objective / Instruction:
                </label>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  {[
                    'Make balanced and mutual for both parties',
                    'Cap total financial liability at 12 months fees',
                    'Shorten and simplify in plain English',
                    'Add 30-day cure period before termination',
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => setRefineInstruction(preset)}
                      className={`text-left text-[11px] p-2 rounded border transition ${
                        refineInstruction === preset
                          ? 'bg-indigo-500/20 border-indigo-400 text-indigo-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={refineInstruction}
                  onChange={(e) => setRefineInstruction(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-400"
                />
              </div>

              {refineResult && (
                <div className="p-4 bg-slate-950 border border-indigo-900/60 rounded-lg space-y-3">
                  <div className="flex items-center justify-between text-xs font-semibold text-indigo-300">
                    <span>Proposed Refined Language:</span>
                    <span className="text-emerald-400">Ready to inject</span>
                  </div>
                  <p className="text-xs text-slate-200 font-serif-legal leading-relaxed bg-slate-900/90 p-3 rounded border border-slate-800">
                    {refineResult.refinedClause}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    <strong className="text-slate-300">Changes:</strong> {refineResult.explanationOfChanges}
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
              {refineResult ? (
                <>
                  <button
                    onClick={() => setRefineResult(null)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200"
                  >
                    Try Another Prompt
                  </button>
                  <button
                    onClick={handleAcceptRefinedClause}
                    className="px-4 py-2 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition"
                  >
                    Replace Clause in Document
                  </button>
                </>
              ) : (
                <button
                  onClick={handleRefineSubmit}
                  disabled={!refineSelection || isRefining}
                  className="px-5 py-2 rounded-lg text-xs font-semibold bg-indigo-500 hover:bg-indigo-400 text-white disabled:opacity-50 transition flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {isRefining ? 'Refining Clause...' : 'Generate Refined Clause'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Quality Checklist Modal (Master System Prompt Section 16) */}
      {showQualityModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-emerald-400" />
                <h3 className="font-semibold text-slate-100 text-sm">
                  Internal Quality Verification
                </h3>
              </div>
              <button
                onClick={() => setShowQualityModal(false)}
                className="text-slate-400 hover:text-slate-200 text-xs px-2 py-1 rounded bg-slate-800"
              >
                Close
              </button>
            </div>

            <p className="text-xs text-slate-400 my-3">
              Automated audit verified against LegalEase 6-point Quality Standards (Master System Prompt Section 16).
            </p>

            <div className="space-y-2.5 text-xs">
              {[
                { title: 'Completeness', desc: 'Title, recitals, core covenants, remedies, boilerplate present' },
                { title: 'Consistency', desc: 'Defined terms and party designations consistently capitalized' },
                { title: 'Accuracy', desc: 'No fabricated facts, dates, or citations; explicit placeholders used' },
                { title: 'Structure', desc: 'Hierarchical numbering, distinct subsections, formal signature block' },
                { title: 'Jurisdiction', desc: `Tailored to ${document.jurisdiction} statutory framework` },
                { title: 'Safety & Warnings', desc: 'Statutory disclaimer and high-risk review alerts included' },
              ].map((item, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-200">{item.title}</span>
                    <p className="text-slate-400 text-[11px] mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 pt-3 border-t border-slate-800 flex justify-between items-center">
              <span className="text-xs text-slate-400">Composite Score</span>
              <span className="text-base font-bold text-emerald-400">{document.qualityScore} / 100</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
