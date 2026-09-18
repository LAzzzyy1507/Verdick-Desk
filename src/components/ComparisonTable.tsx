import React from 'react';
import { ComparisonOption } from '../types';
import { Award, Check, Minus, X } from 'lucide-react';

interface ComparisonTableProps {
  options: ComparisonOption[];
}

export const ComparisonTable: React.FC<ComparisonTableProps> = ({ options }) => {
  if (!options || options.length === 0) return null;

  const renderSentimentIcon = (sentiment: 'positive' | 'neutral' | 'negative') => {
    switch (sentiment) {
      case 'positive':
        return (
          <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300">
            <Check className="w-2.5 h-2.5 stroke-[3]" />
          </span>
        );
      case 'negative':
        return (
          <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300">
            <X className="w-2.5 h-2.5 stroke-[3]" />
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
            <Minus className="w-2.5 h-2.5 stroke-[2]" />
          </span>
        );
    }
  };

  return (
    <section
      aria-label="Critical Factors Comparison"
      className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#151619] p-5 shadow-xs overflow-hidden transition-colors"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-stone-500 dark:text-stone-400 font-semibold block">
            Comparative Matrix
          </span>
          <h4 className="font-brief-serif text-lg font-bold text-stone-900 dark:text-stone-100">
            Stripped Down to Essential Factors
          </h4>
        </div>
        <span className="text-xs text-stone-600 dark:text-stone-400 font-medium">
          {options.length} Candidate Options
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {options.map((opt, idx) => {
          return (
            <div
              key={idx}
              className={`rounded-xl p-4 transition-all flex flex-col justify-between ${
                opt.isWinner
                  ? 'border-2 border-orange-600 dark:border-orange-500 bg-orange-50/20 dark:bg-orange-950/10 shadow-xs'
                  : 'border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/30'
              }`}
            >
              <div>
                {/* Header with Winner Badge if applicable */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h5 className="font-brief-serif text-base font-bold text-stone-900 dark:text-stone-100 leading-tight">
                    {opt.name}
                  </h5>
                  {opt.isWinner ? (
                    <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-600 dark:bg-orange-500 text-white text-[11px] font-bold tracking-tight shadow-xs">
                      <Award className="w-3 h-3" />
                      Pick
                    </span>
                  ) : (
                    <span className="shrink-0 text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-stone-200/80 dark:bg-stone-800 text-stone-600 dark:text-stone-400 font-medium">
                      Alternative
                    </span>
                  )}
                </div>

                {/* Status Evaluation Tag */}
                <p className="text-xs font-medium text-stone-600 dark:text-stone-400 mb-3.5 italic">
                  "{opt.statusBadge}"
                </p>

                {/* Key Deciding Factors */}
                <div className="space-y-2 pt-2 border-t border-stone-200/60 dark:border-stone-800/60">
                  {opt.keyFactors.map((factor, fIdx) => (
                    <div
                      key={fIdx}
                      className="text-xs flex items-start gap-2 text-stone-700 dark:text-stone-300"
                    >
                      <div className="mt-0.5 shrink-0">
                        {renderSentimentIcon(factor.sentiment)}
                      </div>
                      <div className="leading-snug">
                        <span className="font-semibold text-stone-900 dark:text-stone-100">
                          {factor.factor}:{' '}
                        </span>
                        <span>{factor.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
