import React, { useState } from 'react';
import { PlaceholderItem } from '../types/legal';
import { Check, Edit3, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  placeholders: PlaceholderItem[];
  documentText: string;
  onApplyReplacements: (replacements: Record<string, string>) => void;
  onClose?: () => void;
}

export const PlaceholderManager: React.FC<Props> = ({
  placeholders,
  onApplyReplacements,
  onClose,
}) => {
  const [values, setValues] = useState<Record<string, string>>({});
  const [appliedCount, setAppliedCount] = useState(0);

  const handleChange = (placeholder: string, val: string) => {
    setValues((prev) => ({ ...prev, [placeholder]: val }));
  };

  const handleApplyAll = () => {
    onApplyReplacements(values);
    const filled = Object.values(values).filter((v) => v && v.trim().length > 0).length;
    setAppliedCount(filled);
  };

  const filledCount = Object.values(values).filter((v) => v && v.trim().length > 0).length;
  const totalCount = placeholders.length;
  const progressPercent = totalCount > 0 ? Math.round((filledCount / totalCount) * 100) : 100;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-2xl flex flex-col h-full max-h-[85vh]">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="font-semibold text-slate-100 text-base">Placeholder Variable Inspector</h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Fill these variables to replace bracketed items throughout the legal text.
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 text-sm px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 transition"
          >
            Close
          </button>
        )}
      </div>

      {/* Progress Bar */}
      <div className="my-4 bg-slate-950/80 p-3 rounded-lg border border-slate-800">
        <div className="flex justify-between items-center text-xs mb-1.5">
          <span className="text-slate-300 font-medium">Completion Status</span>
          <span className="text-amber-400 font-semibold">
            {filledCount} of {totalCount} Defined ({progressPercent}%)
          </span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-amber-500 to-amber-300 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-sm custom-scrollbar">
        {placeholders.length === 0 ? (
          <div className="text-center py-10 text-slate-500">
            <Check className="w-8 h-8 mx-auto text-emerald-400 mb-2 opacity-80" />
            <p className="text-sm font-medium text-slate-300">All placeholders resolved</p>
            <p className="text-xs mt-1">This document contains no remaining bracketed variables.</p>
          </div>
        ) : (
          placeholders.map((item, idx) => {
            const currentVal = values[item.placeholder] || '';
            const isFilled = currentVal.trim().length > 0;

            return (
              <div
                key={idx}
                className={`p-3 rounded-lg border transition ${
                  isFilled
                    ? 'bg-slate-950/60 border-emerald-900/40'
                    : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-semibold">
                    {item.placeholder}
                  </span>
                  {item.category && (
                    <span className="text-[11px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                      {item.category}
                    </span>
                  )}
                </div>
                {item.description && (
                  <p className="text-xs text-slate-400 mb-2">{item.description}</p>
                )}
                <div className="relative">
                  <input
                    type="text"
                    value={currentVal}
                    placeholder={`Enter actual value for ${item.placeholder}...`}
                    onChange={(e) => handleChange(item.placeholder, e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30"
                  />
                  {isFilled && (
                    <Check className="w-3.5 h-3.5 text-emerald-400 absolute right-2.5 top-2.5" />
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Actions */}
      <div className="pt-4 mt-3 border-t border-slate-800 flex items-center justify-between gap-3">
        <button
          onClick={handleApplyAll}
          disabled={filledCount === 0}
          className="flex-1 flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:pointer-events-none text-slate-950 font-semibold px-4 py-2 rounded-lg text-xs transition shadow-lg shadow-amber-500/20"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Update Document ({filledCount} variables)
        </button>
      </div>
    </div>
  );
};
