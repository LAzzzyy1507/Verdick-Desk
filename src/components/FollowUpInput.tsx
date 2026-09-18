import React, { useState } from 'react';
import { CornerDownRight, Sparkles, Loader2 } from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';

interface FollowUpInputProps {
  onApplyFollowUp: (adjustmentText: string) => void;
  isLoading: boolean;
  previousFollowUps?: { adjustment: string; timestamp: string }[];
}

export const FollowUpInput: React.FC<FollowUpInputProps> = ({
  onApplyFollowUp,
  isLoading,
  previousFollowUps = [],
}) => {
  const [adjustment, setAdjustment] = useState('');

  const quickFollowUps = [
    'What if I raise the budget by $300?',
    'What if I work remotely 2 days a week?',
    'What if I plan to keep it for 5 years instead of 3?',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustment.trim() || isLoading) return;
    triggerHaptic('medium');
    onApplyFollowUp(adjustment.trim());
    setAdjustment('');
  };

  const handleQuickSelect = (text: string) => {
    setAdjustment(text);
  };

  return (
    <div
      aria-label="Follow-Up Constraint Adjustment"
      className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#151619] p-4 md:p-5 shadow-xs transition-colors"
    >
      <div className="flex items-center gap-2 mb-2">
        <CornerDownRight className="w-4 h-4 text-stone-500 dark:text-stone-400" />
        <h4 className="font-brief-serif text-base font-bold text-stone-900 dark:text-stone-100">
          Follow-Up Adjustment: "What if..."
        </h4>
      </div>
      <p className="text-xs text-stone-600 dark:text-stone-400 mb-3 font-sf-sans">
        Shift a constraint or explore a hypothetical without resetting your decision context.
      </p>

      {/* Previous Follow-Ups History */}
      {previousFollowUps.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-1.5">
          {previousFollowUps.map((item, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800/80 text-[11px] text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-stone-400" />
              "{item.adjustment}"
            </span>
          ))}
        </div>
      )}

      {/* Quick Suggestion Chips */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {quickFollowUps.map((q, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleQuickSelect(q)}
            className="text-[11px] px-2.5 py-1 rounded-full bg-stone-100 hover:bg-stone-200 dark:bg-stone-800/60 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 transition-colors"
          >
            {q}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={adjustment}
          onChange={(e) => setAdjustment(e.target.value)}
          placeholder="e.g. What if I can stretch the budget to $2,200?"
          disabled={isLoading}
          className="flex-1 px-3.5 py-2 text-sm rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-[#1A1C20] text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-stone-400 dark:focus:ring-stone-500 transition-all"
        />
        <button
          type="submit"
          disabled={!adjustment.trim() || isLoading}
          className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-stone-200 text-stone-50 dark:text-stone-900 text-xs font-semibold flex items-center gap-1.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Researching...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" />
              <span>Re-evaluate</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
