import React from 'react';
import { Scale, ShieldCheck, AlertCircle, X, ExternalLink } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const DisclaimerModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-slate-100 text-base font-serif-legal">
              LegalEase AI — Legal Information & Responsible AI Policy
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 text-xs p-1 rounded-md hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="text-xs text-slate-300 space-y-3 leading-relaxed max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-300">
            <strong>Not Qualified Legal Counsel:</strong> LegalEase AI operates strictly as an advanced legal document drafting and text synthesis assistant. LegalEase is not a licensed attorney, law firm, court, or government authority, and does not provide formal legal advice or representation.
          </div>

          <p>
            <strong>No Attorney-Client Relationship:</strong> Use of this application, generation of drafts, or review of clauses does not create an attorney-client relationship or any fiduciary obligation.
          </p>

          <p>
            <strong>Jurisdiction Sensitivity:</strong> Statutory requirements, disclosure rules, consumer protection mandates, and execution formalities vary across countries, states, and municipalities. Documents generated are intended as starting drafts and should be reviewed by qualified local counsel prior to signing, filing, or notarization.
          </p>

          <p>
            <strong>High-Risk Matters:</strong> Documents involving significant personal, financial, real estate, or regulatory consequences (such as Last Wills and Testaments, real estate conveyances, mergers & acquisitions, and immigration petitions) require strict adherence to local statutory formalities.
          </p>

          <p>
            <strong>No Guarantee of Enforceability:</strong> LegalEase AI makes no warranty or representation regarding the legal validity, enforceability, or suitability of any generated draft for any specific legal transaction.
          </p>

          <p>
            <strong>Data Privacy:</strong> User inputs are processed securely. Please avoid entering sensitive personal identifiers (such as social security numbers, banking passwords, or confidential medical records).
          </p>
        </div>

        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 transition"
          >
            I Understand & Acknowledge
          </button>
        </div>
      </div>
    </div>
  );
};
