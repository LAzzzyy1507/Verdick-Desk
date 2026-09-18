import React from 'react';
import { DynamicTypeSize } from '../types';
import { Type, Check, X } from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';

interface DynamicTypeSliderProps {
  isOpen: boolean;
  onClose: () => void;
  currentSize: DynamicTypeSize;
  onSelectSize: (size: DynamicTypeSize) => void;
}

export const DynamicTypeSlider: React.FC<DynamicTypeSliderProps> = ({
  isOpen,
  onClose,
  currentSize,
  onSelectSize,
}) => {
  if (!isOpen) return null;

  const sizes: { id: DynamicTypeSize; label: string; sample: string }[] = [
    { id: 'small', label: 'Compact (14px)', sample: 'Dense analyst layout' },
    { id: 'default', label: 'Standard (16px)', sample: 'Apple HIG default reading size' },
    { id: 'large', label: 'Large (18px)', sample: 'Enhanced readability for briefings' },
    { id: 'extra-large', label: 'Accessibility (20px)', sample: 'Maximum legibility & high contrast' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in">
      <div
        className="w-full max-w-md rounded-t-3xl sm:rounded-2xl bg-white dark:bg-[#151619] border border-stone-200 dark:border-stone-800 p-6 shadow-2xl pb-safe transition-colors"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dynamic-type-title"
      >
        <div className="w-10 h-1 bg-stone-300 dark:bg-stone-700 rounded-full mx-auto mb-4 sm:hidden" />

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100">
              <Type className="w-5 h-5" />
            </div>
            <div>
              <h3 id="dynamic-type-title" className="font-brief-serif text-lg font-bold text-stone-900 dark:text-stone-100">
                Dynamic Type Scale
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 font-sf-sans">
                Adjust typography scaling for your visual preference
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

        <div className="space-y-2 mb-4">
          {sizes.map((s) => {
            const isSelected = currentSize === s.id;
            return (
              <button
                key={s.id}
                onClick={() => {
                  triggerHaptic('light');
                  onSelectSize(s.id);
                }}
                className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                  isSelected
                    ? 'border-stone-900 dark:border-stone-100 bg-stone-100/70 dark:bg-stone-800/80 shadow-xs'
                    : 'border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800/40'
                }`}
              >
                <div>
                  <div className="text-xs font-bold text-stone-900 dark:text-stone-100">
                    {s.label}
                  </div>
                  <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                    {s.sample}
                  </div>
                </div>
                {isSelected && (
                  <span className="p-1 rounded-full bg-stone-900 dark:bg-stone-100 text-stone-100 dark:text-stone-900">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Live Preview Card */}
        <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-[#1A1C20] p-3 text-center">
          <p className="font-brief-serif text-sm italic text-stone-700 dark:text-stone-300">
            "The analyst brief scales fluidly across all iOS devices."
          </p>
        </div>
      </div>
    </div>
  );
};
