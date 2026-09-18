import React, { useState } from 'react';
import { PromptLabData, PromptVariant } from '../types';
import { apiService } from '../services/api';
import { Sparkles, Copy, Check, Info, Cpu, MessageSquare, Globe, ArrowRight, Loader2 } from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';

export const PromptLabView: React.FC = () => {
  const [requestText, setRequestText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [labData, setLabData] = useState<PromptLabData | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const presets = [
    'Evaluate whether to trade in my car now or wait 12 months',
    'Pick between health insurance HSA high-deductible vs PPO plan',
    'Choose the best noise-canceling headphones under $350 for flights',
    'Decide if I should enroll in a part-time MBA while working full-time',
  ];

  const handleGenerate = async (queryText?: string) => {
    const text = (queryText || requestText).trim();
    if (!text || isLoading) return;

    triggerHaptic('medium');
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const result = await apiService.generatePromptLab(text);
      setLabData(result);
      triggerHaptic('success');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to craft model-tailored prompt variants.');
      triggerHaptic('warning');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async (variant: PromptVariant) => {
    triggerHaptic('success');
    try {
      await navigator.clipboard.writeText(variant.prompt);
      setCopiedId(variant.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {}
  };

  const getVariantIcon = (id: string) => {
    switch (id) {
      case 'reasoning':
        return <Cpu className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
      case 'chat':
        return <MessageSquare className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case 'search_grounded':
        return <Globe className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-orange-600 dark:text-orange-400" />;
    }
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Header briefing */}
      <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#151619] p-5 shadow-xs">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="p-1.5 rounded-lg bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900">
            <Sparkles className="w-4 h-4" />
          </span>
          <h2 className="font-brief-serif text-xl font-bold text-stone-900 dark:text-stone-100">
            Prompt Lab
          </h2>
        </div>
        <p className="text-xs text-stone-600 dark:text-stone-400 font-sf-sans leading-relaxed">
          Type one plain-language goal. Verdict Desk generates three tailored prompt variants optimized for different LLM provider architectures — with an analyst note on why the phrasing shifts.
        </p>

        {/* Input area */}
        <div className="mt-4 space-y-2.5">
          <div className="relative">
            <textarea
              rows={2}
              value={requestText}
              onChange={(e) => setRequestText(e.target.value)}
              placeholder="e.g. Choose between two job offers with different equity structures and cost of living..."
              disabled={isLoading}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-[#1A1C20] text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-stone-400 dark:focus:ring-stone-600 resize-none transition-all"
            />
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="text-[11px] text-stone-600 dark:text-stone-400 font-mono">
              Outputs 3 architecture-specific variants
            </div>
            <button
              onClick={() => handleGenerate()}
              disabled={!requestText.trim() || isLoading}
              className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-stone-200 text-stone-50 dark:text-stone-900 text-xs font-semibold flex items-center gap-2 transition-all disabled:opacity-40 shadow-xs"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Synthesizing...</span>
                </>
              ) : (
                <>
                  <span>Craft Variants</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>

          {/* Quick Presets */}
          <div className="pt-2 flex flex-wrap gap-1.5">
            {presets.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setRequestText(preset);
                  handleGenerate(preset);
                }}
                disabled={isLoading}
                className="text-[11px] px-2.5 py-1 rounded-full bg-stone-100 hover:bg-stone-200 dark:bg-stone-800/80 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 transition-colors"
              >
                {preset}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error alert */}
      {errorMsg && (
        <div className="rounded-xl border border-rose-300 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 p-4 text-xs text-rose-800 dark:text-rose-300">
          {errorMsg}
        </div>
      )}

      {/* Generated Variants Display */}
      {labData && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-mono uppercase tracking-widest text-stone-500 font-semibold">
              Optimized Prompt Architectures
            </span>
            <span className="text-xs text-stone-500 font-sf-sans italic">
              Targeted for known model conventions
            </span>
          </div>

          {labData.variants.map((variant) => {
            const isCopied = copiedId === variant.id;
            return (
              <div
                key={variant.id}
                className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#151619] p-5 shadow-xs transition-colors"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-stone-100 dark:bg-stone-800">
                      {getVariantIcon(variant.id)}
                    </div>
                    <div>
                      <h4 className="font-brief-serif text-base font-bold text-stone-900 dark:text-stone-100 leading-tight">
                        {variant.targetType}
                      </h4>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400 font-sf-sans">
                        {variant.subtitle}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleCopy(variant)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs ${
                      isCopied
                        ? 'bg-emerald-600 text-white'
                        : 'bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200'
                    }`}
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Prompt</span>
                      </>
                    )}
                  </button>
                </div>

                {/* The Prompt Text */}
                <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-[#1A1C20] p-3.5 text-xs text-stone-800 dark:text-stone-200 font-mono leading-relaxed whitespace-pre-wrap select-all">
                  {variant.prompt}
                </div>

                {/* Educational Insight Note */}
                <div className="mt-3 flex items-start gap-2 text-xs text-stone-600 dark:text-stone-400 bg-stone-100/50 dark:bg-stone-800/40 p-3 rounded-xl border border-stone-200/50 dark:border-stone-800/50">
                  <Info className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-stone-900 dark:text-stone-200">
                      Why this phrasing works:{' '}
                    </span>
                    <span>{variant.whyNote}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
