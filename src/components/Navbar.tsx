import React from 'react';
import {
  Scale,
  Wand2,
  ShieldAlert,
  BookOpen,
  LayoutGrid,
  FileText,
  ShieldCheck,
  Info,
} from 'lucide-react';

export type ActiveTab = 'generate' | 'review' | 'explain' | 'templates' | 'document';

interface Props {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  hasActiveDocument: boolean;
  onOpenDisclaimer: () => void;
  documentCount?: number;
}

export const Navbar: React.FC<Props> = ({
  activeTab,
  onTabChange,
  hasActiveDocument,
  onOpenDisclaimer,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Brand */}
          <div
            onClick={() => onTabChange('generate')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition">
              <Scale className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-slate-100 font-serif-legal">
                  LegalEase
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  AI Legal Assistant
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Jurisdiction-Aware Legal Drafting, Review & Analysis
              </p>
            </div>
          </div>

          {/* Navigation Mode Tabs */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => onTabChange('generate')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'generate'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Mode A:</span>
              <span>Generate</span>
            </button>

            <button
              onClick={() => onTabChange('review')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'review'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Mode B:</span>
              <span>Review</span>
            </button>

            <button
              onClick={() => onTabChange('explain')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'explain'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Mode C:</span>
              <span>Explain</span>
            </button>

            <button
              onClick={() => onTabChange('templates')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                activeTab === 'templates'
                  ? 'bg-amber-500 text-slate-950 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Templates</span>
            </button>

            {hasActiveDocument && (
              <button
                onClick={() => onTabChange('document')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition border ${
                  activeTab === 'document'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-amber-400" />
                <span>Active Draft</span>
              </button>
            )}
          </nav>

          {/* Right Action: Disclaimer Link */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenDisclaimer}
              className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-900 hover:bg-slate-800 border border-slate-800 transition cursor-pointer"
              title="View Legal Practice Notice & Non-Attorney Disclaimer"
            >
              <Info className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Legal Notice</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
