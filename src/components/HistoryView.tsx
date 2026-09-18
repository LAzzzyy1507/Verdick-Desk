import React, { useState } from 'react';
import { DecisionRecord, DecisionCategory } from '../types';
import { apiService } from '../services/api';
import { storageService } from '../services/storage';
import {
  Search,
  RotateCcw,
  Trash2,
  ExternalLink,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Tag,
  Loader2,
} from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';

interface HistoryViewProps {
  decisions: DecisionRecord[];
  onSelectDecision: (decision: DecisionRecord) => void;
  onUpdateDecision: (decision: DecisionRecord) => void;
  onDeleteDecision: (id: string) => void;
  isOffline: boolean;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  decisions,
  onSelectDecision,
  onUpdateDecision,
  onDeleteDecision,
  isOffline,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [recheckingId, setRecheckingId] = useState<string | null>(null);
  const [recheckDelta, setRecheckDelta] = useState<{ id: string; delta: string } | null>(null);

  const categories: { id: string; label: string }[] = [
    { id: 'all', label: 'All Vault' },
    { id: 'shopping', label: 'Shopping' },
    { id: 'career', label: 'Career' },
    { id: 'academic', label: 'Academic' },
    { id: 'other', label: 'Other' },
  ];

  const filteredDecisions = decisions.filter((d) => {
    const matchesCat = selectedCategory === 'all' || d.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      d.title.toLowerCase().includes(q) ||
      d.question.toLowerCase().includes(q) ||
      d.verdict.recommendedOption.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  const handleRecheck = async (e: React.MouseEvent, decision: DecisionRecord) => {
    e.stopPropagation();
    if (isOffline) {
      alert('Cannot re-check decision while offline. Reconnect to search live web data.');
      return;
    }
    triggerHaptic('medium');
    setRecheckingId(decision.id);
    setRecheckDelta(null);

    try {
      const { decision: updated, delta } = await apiService.recheckDecision(decision);
      storageService.saveDecision(updated);
      onUpdateDecision(updated);
      setRecheckDelta({ id: decision.id, delta });
      triggerHaptic('success');
    } catch (err: any) {
      alert(err.message || 'Failed to re-check decision.');
      triggerHaptic('warning');
    } finally {
      setRecheckingId(null);
    }
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Delete this decision brief from your vault?')) {
      triggerHaptic('medium');
      onDeleteDecision(id);
    }
  };

  return (
    <div className="space-y-5 pb-24">
      {/* Header and Search Controls */}
      <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#151619] p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="font-brief-serif text-xl font-bold text-stone-900 dark:text-stone-100">
              Decision History
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 font-sf-sans">
              Cached locally • {decisions.length} stored briefs
            </p>
          </div>
          {isOffline && (
            <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
              Offline Cache Active
            </span>
          )}
        </div>

        {/* Search Bar */}
        <div className="relative mb-3">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search decisions, questions, or recommendations..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-[#1A1C20] text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-stone-400 dark:focus:ring-stone-600 transition-all"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                triggerHaptic('light');
                setSelectedCategory(cat.id);
              }}
              className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-stone-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Decision List */}
      {filteredDecisions.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-stone-300 dark:border-stone-800 p-8 text-center bg-stone-50/50 dark:bg-stone-900/20">
          <p className="text-sm font-brief-serif text-stone-600 dark:text-stone-400">
            No decisions found matching your filter criteria.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredDecisions.map((decision) => {
            const isRechecking = recheckingId === decision.id;
            const deltaInfo = recheckDelta?.id === decision.id ? recheckDelta.delta : decision.lastRecheck?.deltaSummary;

            return (
              <div
                key={decision.id}
                onClick={() => {
                  triggerHaptic('light');
                  onSelectDecision(decision);
                }}
                className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#151619] p-5 shadow-xs hover:border-stone-300 dark:hover:border-stone-700 cursor-pointer transition-all"
              >
                {/* Header Tag and Date */}
                <div className="flex items-center justify-between gap-2 mb-2 text-xs text-stone-500 dark:text-stone-400">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-semibold">
                      {decision.category}
                    </span>
                    <span className="flex items-center gap-1 text-[11px]">
                      <Calendar className="w-3 h-3" />
                      {new Date(decision.timestamp).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Actions: Delete */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => handleDelete(e, decision.id)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
                      title="Delete decision brief"
                      aria-label="Delete decision"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Title and Question */}
                <h3 className="font-brief-serif text-lg font-bold text-stone-900 dark:text-stone-100 leading-snug mb-1">
                  {decision.title}
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2 mb-3">
                  {decision.question}
                </p>

                {/* Verdict Highlight Snippet */}
                <div className="rounded-xl border border-orange-200/80 dark:border-orange-950/80 bg-orange-50/40 dark:bg-[#1C1613] p-3 mb-3">
                  <div className="flex items-center gap-1.5 text-xs text-orange-950 dark:text-orange-200 font-bold mb-1">
                    <span className="w-2 h-2 rounded-full bg-orange-600 dark:bg-orange-500 inline-block" />
                    <span>Verdict: {decision.verdict.recommendedOption}</span>
                  </div>
                  <p className="text-xs text-stone-700 dark:text-stone-300 line-clamp-2 leading-relaxed">
                    {decision.verdict.reasoning}
                  </p>
                </div>

                {/* Re-check Delta Banner if exists */}
                {deltaInfo && (
                  <div className="mb-3 p-2.5 rounded-lg bg-stone-100 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 text-xs text-stone-700 dark:text-stone-300 flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <div className="leading-tight">
                      <span className="font-semibold">Re-check Delta: </span>
                      <span>{deltaInfo}</span>
                    </div>
                  </div>
                )}

                {/* Bottom Row: Check Again & Open */}
                <div className="flex items-center justify-between pt-2 border-t border-stone-100 dark:border-stone-800/80">
                  <div className="text-[11px] text-stone-500 dark:text-stone-400 font-mono">
                    {decision.options.length} options • {decision.referencePoints.length} benchmarks
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Check Again Button */}
                    <button
                      onClick={(e) => handleRecheck(e, decision)}
                      disabled={isRechecking || isOffline}
                      className="px-2.5 py-1 rounded-lg border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-40 cursor-pointer"
                    >
                      {isRechecking ? (
                        <>
                          <Loader2 className="w-3 h-3 animate-spin" />
                          <span>Checking...</span>
                        </>
                      ) : (
                        <>
                          <RotateCcw className="w-3 h-3" />
                          <span>Check Again</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        triggerHaptic('light');
                        onSelectDecision(decision);
                      }}
                      className="text-xs font-semibold text-stone-900 dark:text-stone-100 flex items-center gap-1 hover:underline cursor-pointer"
                      aria-label={`View brief for ${decision.title}`}
                    >
                      <span>View Brief</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
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
