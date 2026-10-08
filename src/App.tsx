import React, { useState, useEffect } from 'react';
import { DocumentDraft, DocumentTemplate } from './types/legal';
import { Navbar, ActiveTab } from './components/Navbar';
import { ModeGenerate } from './components/ModeGenerate';
import { ModeReview } from './components/ModeReview';
import { ModeExplain } from './components/ModeExplain';
import { TemplatesLibrary } from './components/TemplatesLibrary';
import { DocumentViewer } from './components/DocumentViewer';
import { DisclaimerModal } from './components/DisclaimerModal';
import { createFallbackDraft } from './data/fallbackGenerator';
import { DOCUMENT_TEMPLATES } from './data/templates';
import {
  Scale,
  Sparkles,
  ShieldCheck,
  FileText,
  PlusCircle,
  FolderOpen,
  Trash2,
} from 'lucide-react';

const STORAGE_KEY_ACTIVE_DOC = 'legalease_active_document';
const STORAGE_KEY_DOC_HISTORY = 'legalease_document_history';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('generate');
  const [activeDocument, setActiveDocument] = useState<DocumentDraft | null>(null);
  const [documentHistory, setDocumentHistory] = useState<DocumentDraft[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);
  const [disclaimerOpen, setDisclaimerOpen] = useState(false);
  const [reviewInitialText, setReviewInitialText] = useState('');

  // Load from local storage or initialize with sample draft on mount
  useEffect(() => {
    try {
      const savedDoc = localStorage.getItem(STORAGE_KEY_ACTIVE_DOC);
      const savedHistory = localStorage.getItem(STORAGE_KEY_DOC_HISTORY);

      if (savedHistory) {
        setDocumentHistory(JSON.parse(savedHistory));
      }

      if (savedDoc) {
        setActiveDocument(JSON.parse(savedDoc));
      } else {
        // Create initial default sample draft (Mutual NDA under Delaware law)
        const initialSample = createFallbackDraft({
          documentType: 'Non-Disclosure Agreement',
          jurisdiction: 'Delaware, United States',
          partyA: 'Acme Technologies Inc.',
          partyB: 'Vertex Global Ventures LLC',
          effectiveDate: '2026-10-15',
          term: '2 years',
          purpose: 'Evaluation of proprietary artificial intelligence architectures and strategic licensing partnership',
          specialClauses: [
            'Mutual Confidentiality & Non-Disclosure',
            'Injunctive Relief without Bond',
            'Defend Trade Secrets Act Notice',
            'Commercial Arbitration in Wilmington, Delaware',
          ],
        });
        setActiveDocument(initialSample);
        setDocumentHistory([initialSample]);
      }
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, []);

  // Save changes
  const saveDocument = (doc: DocumentDraft) => {
    setActiveDocument(doc);
    try {
      localStorage.setItem(STORAGE_KEY_ACTIVE_DOC, JSON.stringify(doc));
      setDocumentHistory((prev) => {
        const filtered = prev.filter((d) => d.id !== doc.id);
        const updated = [doc, ...filtered].slice(0, 10);
        localStorage.setItem(STORAGE_KEY_DOC_HISTORY, JSON.stringify(updated));
        return updated;
      });
    } catch (e) {
      console.warn('Save failed:', e);
    }
  };

  const handleDocumentGenerated = (newDoc: DocumentDraft) => {
    saveDocument(newDoc);
    setActiveTab('document');
  };

  const handleSelectTemplate = (template: DocumentTemplate) => {
    setSelectedTemplate(template);
    setActiveTab('generate');
  };

  const handleOpenReviewForText = (text: string) => {
    setReviewInitialText(text);
    setActiveTab('review');
  };

  const handleCreateNew = () => {
    setSelectedTemplate(null);
    setActiveTab('generate');
  };

  const handleDeleteHistoryDoc = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = documentHistory.filter((d) => d.id !== id);
    setDocumentHistory(updated);
    try {
      localStorage.setItem(STORAGE_KEY_DOC_HISTORY, JSON.stringify(updated));
    } catch {}
    if (activeDocument?.id === id) {
      if (updated.length > 0) {
        setActiveDocument(updated[0]);
      } else {
        setActiveDocument(null);
        setActiveTab('generate');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
        }}
        hasActiveDocument={Boolean(activeDocument)}
        onOpenDisclaimer={() => setDisclaimerOpen(true)}
      />

      {/* Sub-bar: Document Switcher / Quick Status */}
      <div className="bg-slate-900/60 border-b border-slate-800/80 px-4 sm:px-6 lg:px-8 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs gap-4 flex-wrap">
          <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar py-0.5">
            <span className="text-slate-400 font-medium whitespace-nowrap flex items-center gap-1.5">
              <FolderOpen className="w-3.5 h-3.5 text-amber-400" />
              Recent Drafts:
            </span>
            {documentHistory.slice(0, 4).map((doc) => (
              <div
                key={doc.id}
                onClick={() => {
                  setActiveDocument(doc);
                  setActiveTab('document');
                }}
                className={`px-2.5 py-1 rounded-md cursor-pointer whitespace-nowrap transition flex items-center gap-1.5 border ${
                  activeDocument?.id === doc.id
                    ? 'bg-amber-500/15 border-amber-500/30 text-amber-300 font-medium'
                    : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <span className="truncate max-w-[160px]">{doc.title}</span>
                <button
                  onClick={(e) => handleDeleteHistoryDoc(doc.id, e)}
                  title="Remove from history"
                  className="hover:text-rose-400 opacity-60 hover:opacity-100 transition p-0.5"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={handleCreateNew}
            className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 font-medium transition cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>New Document</span>
          </button>
        </div>
      </div>

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'generate' && (
          <ModeGenerate
            onDocumentGenerated={handleDocumentGenerated}
            initialTemplate={selectedTemplate}
          />
        )}

        {activeTab === 'review' && (
          <ModeReview initialText={reviewInitialText || activeDocument?.documentText || ''} />
        )}

        {activeTab === 'explain' && <ModeExplain />}

        {activeTab === 'templates' && (
          <TemplatesLibrary onSelectTemplate={handleSelectTemplate} />
        )}

        {activeTab === 'document' && activeDocument && (
          <DocumentViewer
            document={activeDocument}
            onUpdateDocument={saveDocument}
            onOpenReview={handleOpenReviewForText}
          />
        )}

        {activeTab === 'document' && !activeDocument && (
          <div className="text-center py-20 bg-slate-900 border border-slate-800 rounded-2xl max-w-lg mx-auto p-8">
            <Scale className="w-12 h-12 text-amber-400 mx-auto mb-3 opacity-80" />
            <h3 className="text-base font-bold text-slate-100 font-serif-legal">
              No Document Currently Selected
            </h3>
            <p className="text-xs text-slate-400 mt-1 mb-5">
              Draft a new agreement using Mode A or choose from our 16 curated templates.
            </p>
            <button
              onClick={() => setActiveTab('generate')}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold px-5 py-2.5 rounded-xl text-xs transition"
            >
              Start Drafting
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-amber-500" />
            <span className="font-semibold text-slate-400 font-serif-legal">LegalEase AI</span>
            <span>— AI-Powered Legal Document Generator & Review Assistant</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setDisclaimerOpen(true)}
              className="hover:text-slate-300 underline underline-offset-2 transition"
            >
              Responsible Legal AI Disclaimer
            </button>
            <span>•</span>
            <span>Master System Prompt Compliant</span>
          </div>
        </div>
      </footer>

      {/* Disclaimer Modal */}
      <DisclaimerModal isOpen={disclaimerOpen} onClose={() => setDisclaimerOpen(false)} />
    </div>
  );
}
