import React from 'react';
import { DecisionRecord } from '../types';
import { Smartphone, Play, Zap, X, RotateCcw, PlusCircle, Check } from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lastDecision?: DecisionRecord;
  onRunLastDecisionAgain: () => void;
  onStartNewDecision: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({
  isOpen,
  onClose,
  lastDecision,
  onRunLastDecisionAgain,
  onStartNewDecision,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in">
      <div
        className="w-full max-w-lg rounded-t-3xl sm:rounded-2xl bg-white dark:bg-[#151619] border border-stone-200 dark:border-stone-800 p-6 shadow-2xl pb-safe max-h-[90vh] overflow-y-auto transition-colors"
        role="dialog"
        aria-modal="true"
        aria-labelledby="shortcuts-modal-title"
      >
        <div className="w-10 h-1 bg-stone-300 dark:bg-stone-700 rounded-full mx-auto mb-4 sm:hidden" />

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 id="shortcuts-modal-title" className="font-brief-serif text-lg font-bold text-stone-900 dark:text-stone-100">
                Siri Shortcuts & Widgets
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 font-sf-sans">
                Native iOS integration & quick actions
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              triggerHaptic('light');
              onClose();
            }}
            className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Siri Shortcuts Section */}
        <div className="space-y-3 mb-6">
          <span className="text-[11px] font-mono uppercase tracking-widest text-stone-500 dark:text-stone-400 font-semibold block">
            Voice Shortcuts
          </span>

          <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-[#1A1C20] p-4 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                <span>"Hey Siri, run last decision again"</span>
              </div>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                {lastDecision ? `Re-evaluates "${lastDecision.title}"` : 'Re-checks latest active brief'}
              </p>
            </div>
            <button
              onClick={() => {
                triggerHaptic('medium');
                onRunLastDecisionAgain();
                onClose();
              }}
              disabled={!lastDecision}
              className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs disabled:opacity-40"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Run Now</span>
            </button>
          </div>

          <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-[#1A1C20] p-4 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                <span>"Hey Siri, start a new decision"</span>
              </div>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                Opens fresh research prompt with clean input fields
              </p>
            </div>
            <button
              onClick={() => {
                triggerHaptic('light');
                onStartNewDecision();
                onClose();
              }}
              className="px-3 py-1.5 rounded-lg bg-stone-900 dark:bg-stone-100 text-stone-100 dark:text-stone-900 text-xs font-semibold flex items-center gap-1.5 shadow-xs"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Start</span>
            </button>
          </div>
        </div>

        {/* iOS Widget Previews */}
        <div className="space-y-3">
          <span className="text-[11px] font-mono uppercase tracking-widest text-stone-500 dark:text-stone-400 font-semibold block">
            iPhone Home & Lock Screen Widgets
          </span>

          {/* Medium Widget Simulation */}
          <div className="rounded-2xl border-2 border-stone-300 dark:border-stone-700 bg-gradient-to-br from-stone-100 to-stone-200 dark:from-[#1E2024] dark:to-[#141518] p-4 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-stone-700 dark:text-stone-300">
                <span className="w-3 h-3 rounded-full bg-orange-600 dark:bg-orange-500 inline-block" />
                <span>Verdict Desk • Latest Brief</span>
              </div>
              <span className="text-[10px] text-stone-500 dark:text-stone-400 font-mono">
                Widget (Medium)
              </span>
            </div>

            {lastDecision ? (
              <div>
                <h5 className="font-brief-serif text-sm font-bold text-stone-900 dark:text-stone-100 truncate">
                  {lastDecision.verdict.recommendedOption}
                </h5>
                <p className="text-[11px] text-stone-600 dark:text-stone-300 line-clamp-2 mt-1 leading-snug">
                  {lastDecision.verdict.reasoning}
                </p>
                <div className="mt-2 flex items-center gap-2 text-[10px] text-stone-500 font-mono">
                  <span>Confidence: {lastDecision.verdict.confidence}</span>
                  <span>•</span>
                  <span>{lastDecision.category}</span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-stone-500 py-3 text-center">
                Run a decision to see widget simulation
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
