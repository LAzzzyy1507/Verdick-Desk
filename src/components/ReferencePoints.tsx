import React from 'react';
import { ReferencePoint } from '../types';
import { Bookmark, Hash } from 'lucide-react';

interface ReferencePointsProps {
  points: ReferencePoint[];
}

export const ReferencePoints: React.FC<ReferencePointsProps> = ({ points }) => {
  if (!points || points.length === 0) return null;

  return (
    <section
      aria-label="Objective Benchmark Facts"
      className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-[#F7F7F6] dark:bg-[#141518] p-5 shadow-xs transition-colors"
    >
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2">
          <span className="p-1 rounded-md bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
            <Bookmark className="w-3.5 h-3.5" />
          </span>
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-stone-500 dark:text-stone-400 font-semibold block">
              Market Benchmarks
            </span>
            <h4 className="font-brief-serif text-lg font-bold text-stone-900 dark:text-stone-100 leading-tight">
              Reference Points to Keep in Mind
            </h4>
          </div>
        </div>
        <span className="text-[11px] text-stone-600 dark:text-stone-400 font-mono">
          Contextual Data
        </span>
      </div>

      <p className="text-xs text-stone-600 dark:text-stone-400 mb-4 font-sf-sans">
        Neutral baseline facts and metrics to anchor your evaluation independent of any single candidate option.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {points.map((pt, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-stone-300/70 dark:border-stone-700/60 bg-white dark:bg-[#1A1C20] p-4 flex flex-col justify-between shadow-xs transition-colors"
          >
            <div>
              <div className="flex items-center gap-1.5 text-stone-600 dark:text-stone-400 text-xs font-medium mb-1">
                <Hash className="w-3 h-3 text-stone-600 dark:text-stone-400" />
                <span>{pt.label}</span>
              </div>
              <div className="font-mono text-xl font-bold tracking-tight text-stone-900 dark:text-stone-100 mt-1">
                {pt.metric}
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-300 mt-2 leading-relaxed">
                {pt.context}
              </p>
            </div>

            {pt.sourceHint && (
              <div className="mt-3 pt-2 border-t border-stone-100 dark:border-stone-800/80 text-[10px] text-stone-500 dark:text-stone-400 font-mono truncate">
                Source: {pt.sourceHint}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
