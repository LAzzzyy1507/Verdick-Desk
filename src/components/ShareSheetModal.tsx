import React, { useState } from 'react';
import { DecisionRecord } from '../types';
import { Share2, Copy, Check, Download, X } from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';

interface ShareSheetModalProps {
  decision: DecisionRecord;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareSheetModal: React.FC<ShareSheetModalProps> = ({
  decision,
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const generateBriefingText = () => {
    const lines = [
      `=== VERDICT DESK ANALYST BRIEFING ===`,
      `Decision: ${decision.title}`,
      `Date: ${new Date(decision.timestamp).toLocaleDateString()}`,
      decision.constraints ? `Constraints: ${decision.constraints}` : '',
      ``,
      `--- THE VERDICT ---`,
      `Recommendation: ${decision.verdict.recommendedOption}`,
      `Confidence: ${decision.verdict.confidence}`,
      `Executive Rationale: ${decision.verdict.reasoning}`,
      ``,
      `--- COMPARATIVE EVALUATION ---`,
      ...decision.options.map(
        (opt) =>
          `* ${opt.name} [${opt.isWinner ? 'DECISIVE PICK' : 'Alternative'}]: ${opt.statusBadge}\n  ${opt.keyFactors.map((f) => `- ${f.factor}: ${f.value}`).join('\n  ')}`
      ),
      ``,
      `--- REFERENCE BENCHMARKS ---`,
      ...decision.referencePoints.map(
        (ref) => `* ${ref.label}: ${ref.metric} (${ref.context})`
      ),
      ``,
      decision.uncertainties.length > 0 ? `--- UNRESOLVED UNCERTAINTIES ---` : '',
      ...decision.uncertainties.map((u) => `* [${u.severity.toUpperCase()}] ${u.title}: ${u.detail}`),
      ``,
      `Synthesized via Verdict Desk with Live Google Search Grounding.`,
    ];
    return lines.filter(Boolean).join('\n');
  };

  const handleCopy = async () => {
    triggerHaptic('success');
    try {
      await navigator.clipboard.writeText(generateBriefingText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const handleNativeShare = async () => {
    triggerHaptic('light');
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `Verdict Desk: ${decision.title}`,
          text: `Verdict: ${decision.verdict.recommendedOption}\n${decision.verdict.reasoning}`,
          url: window.location.href,
        });
        onClose();
      } catch {}
    } else {
      handleCopy();
    }
  };

  const handleDownload = () => {
    triggerHaptic('light');
    const text = generateBriefingText();
    const blob = new Blob([text], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `verdict-${decision.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in">
      <div
        className="w-full max-w-lg rounded-t-3xl sm:rounded-2xl bg-white dark:bg-[#151619] border border-stone-200 dark:border-stone-800 p-6 shadow-2xl pb-safe transition-colors"
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-sheet-title"
      >
        {/* iOS Handle bar on mobile */}
        <div className="w-10 h-1 bg-stone-300 dark:bg-stone-700 rounded-full mx-auto mb-4 sm:hidden" />

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 id="share-sheet-title" className="font-brief-serif text-lg font-bold text-stone-900 dark:text-stone-100">
                Share Briefing
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 font-sf-sans">
                Export decisive briefing summary
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              triggerHaptic('light');
              onClose();
            }}
            className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 transition-colors"
            aria-label="Close share sheet"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Text Preview Box */}
        <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-[#1A1C20] p-3 text-xs font-mono text-stone-700 dark:text-stone-300 max-h-48 overflow-y-auto mb-5 leading-relaxed select-all">
          <pre className="whitespace-pre-wrap font-mono">{generateBriefingText()}</pre>
        </div>

        {/* Share Action Grid */}
        <div className="grid grid-cols-3 gap-2.5">
          <button
            onClick={handleCopy}
            className="flex flex-col items-center justify-center p-3 rounded-xl border border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800/60 text-stone-800 dark:text-stone-200 transition-all font-medium text-xs gap-1.5"
          >
            {copied ? <Check className="w-5 h-5 text-emerald-600" /> : <Copy className="w-5 h-5" />}
            <span>{copied ? 'Copied' : 'Copy Text'}</span>
          </button>

          <button
            onClick={handleNativeShare}
            className="flex flex-col items-center justify-center p-3 rounded-xl border border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800/60 text-stone-800 dark:text-stone-200 transition-all font-medium text-xs gap-1.5"
          >
            <Share2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>AirDrop / Share</span>
          </button>

          <button
            onClick={handleDownload}
            className="flex flex-col items-center justify-center p-3 rounded-xl border border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800/60 text-stone-800 dark:text-stone-200 transition-all font-medium text-xs gap-1.5"
          >
            <Download className="w-5 h-5 text-stone-700 dark:text-stone-300" />
            <span>Save .md</span>
          </button>
        </div>
      </div>
    </div>
  );
};
