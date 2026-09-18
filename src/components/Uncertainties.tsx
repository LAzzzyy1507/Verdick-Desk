import React from 'react';
import { UncertaintyFlag } from '../types';
import { AlertTriangle, HelpCircle } from 'lucide-react';

interface UncertaintiesProps {
  uncertainties: UncertaintyFlag[];
}

export const Uncertainties: React.FC<UncertaintiesProps> = ({ uncertainties }) => {
  if (!uncertainties || uncertainties.length === 0) return null;

  return (
    <section
      aria-label="Uncertainty and Verification Flags"
      className="rounded-2xl border border-amber-300 dark:border-amber-900/60 bg-amber-50/40 dark:bg-amber-950/15 p-5 shadow-xs transition-colors"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="p-1 rounded-md bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300">
            <AlertTriangle className="w-3.5 h-3.5" />
          </span>
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-amber-800 dark:text-amber-400 font-semibold block">
              Grounded Verification Check
            </span>
            <h4 className="font-brief-serif text-lg font-bold text-stone-900 dark:text-stone-100 leading-tight">
              Uncertainty Flags & Unresolved Gaps
            </h4>
          </div>
        </div>
        <span className="text-xs text-amber-800 dark:text-amber-400 font-mono font-medium">
          {uncertainties.length} Flagged
        </span>
      </div>

      <p className="text-xs text-stone-600 dark:text-stone-400 mb-4 font-sf-sans">
        Information not definitively verified in live search (unreleased cycles, regional tax variance, or conflicting rumors). Flagged transparently rather than guessed at.
      </p>

      <div className="space-y-2.5">
        {uncertainties.map((item, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-amber-200/80 dark:border-amber-900/40 bg-white/90 dark:bg-[#181512] p-3.5 flex items-start gap-3 shadow-xs"
          >
            <HelpCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center justify-between gap-2">
                <h5 className="text-xs font-bold text-stone-900 dark:text-stone-100 font-sf-sans">
                  {item.title}
                </h5>
                <span
                  className={`text-[10px] uppercase font-mono px-1.5 py-0.5 rounded font-semibold ${
                    item.severity === 'high'
                      ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300'
                      : item.severity === 'medium'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300'
                      : 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300'
                  }`}
                >
                  {item.severity} impact
                </span>
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-300 mt-1 leading-relaxed">
                {item.detail}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
