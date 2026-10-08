import React, { useState } from 'react';
import { DocumentTemplate } from '../types/legal';
import { DOCUMENT_TEMPLATES } from '../data/templates';
import {
  BookOpen,
  Search,
  Scale,
  ShieldAlert,
  ArrowRight,
  Filter,
  Sparkles,
  CheckCircle,
} from 'lucide-react';

interface Props {
  onSelectTemplate: (template: DocumentTemplate) => void;
}

export const TemplatesLibrary: React.FC<Props> = ({ onSelectTemplate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = [
    'All',
    'Commercial',
    'Employment',
    'Real Estate',
    'Corporate',
    'Dispute & Notice',
    'Personal & Estate',
  ];

  const filtered = DOCUMENT_TEMPLATES.filter((tpl) => {
    const matchesCat = selectedCategory === 'All' || tpl.category === selectedCategory;
    const matchesSearch =
      tpl.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tpl.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tpl.documentType.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-bold text-slate-100 font-serif-legal">
              Standard Legal Document Templates Library
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            16 professional commercial, corporate, employment, and dispute document frameworks curated according to LegalEase standard drafting protocols.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20 self-start md:self-auto">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Jurisdiction-tailored upon generation</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search templates (e.g. NDA, lease, contractor)..."
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-slate-950 font-semibold'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Template Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((tpl) => (
          <div
            key={tpl.id}
            className="bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-5 flex flex-col justify-between transition-all duration-200 shadow-lg hover:shadow-xl group"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-medium">
                  {tpl.category}
                </span>
                {tpl.isHighRisk && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 font-semibold flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3" />
                    High-Risk
                  </span>
                )}
              </div>

              <h3 className="text-base font-bold text-slate-100 group-hover:text-amber-400 transition font-serif-legal">
                {tpl.title}
              </h3>
              <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                {tpl.description}
              </p>

              {/* Sample Clauses Preview */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-1">
                <span className="text-[11px] font-semibold text-slate-400 block mb-1">
                  Key Clauses Included:
                </span>
                {tpl.keyClauses.slice(0, 3).map((clause, idx) => (
                  <div key={idx} className="text-[11px] text-slate-400 flex items-center gap-1.5">
                    <CheckCircle className="w-3 h-3 text-amber-400/80 shrink-0" />
                    <span className="truncate">{clause}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                Default: {tpl.suggestedJurisdiction.split(',')[0]}
              </span>
              <button
                onClick={() => onSelectTemplate(tpl)}
                className="flex items-center gap-1 text-xs font-semibold text-amber-400 group-hover:text-amber-300 hover:underline cursor-pointer"
              >
                <span>Draft Document</span>
                <ArrowRight className="w-3.5 h-3.5 transition group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
