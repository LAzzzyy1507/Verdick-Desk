import React from 'react';
import { UserAccount, DynamicTypeSize } from '../types';
import { Cloud, CloudOff, Moon, Sun, Type, Apple, Smartphone } from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';

interface HeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  account: UserAccount | null;
  onOpenAccount: () => void;
  onOpenDynamicType: () => void;
  onOpenShortcuts: () => void;
  isOffline: boolean;
  onToggleOffline: () => void;
  dynamicType: DynamicTypeSize;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  onToggleDarkMode,
  account,
  onOpenAccount,
  onOpenDynamicType,
  onOpenShortcuts,
  isOffline,
  onToggleOffline,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full bg-[#FBFBFA]/90 dark:bg-[#121316]/90 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 transition-colors">
      {/* iOS Status Bar Simulation */}
      <div className="pt-safe px-5 py-1.5 flex items-center justify-between text-[11px] font-medium text-stone-500 dark:text-stone-400 tracking-tight">
        <span>9:41</span>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              triggerHaptic('medium');
              onToggleOffline();
            }}
            className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-mono tracking-wider transition-colors flex items-center gap-1 ${
              isOffline
                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 font-semibold'
                : 'text-stone-400 hover:text-stone-600 dark:hover:text-stone-300'
            }`}
            title="Click to toggle simulated offline mode"
            aria-label="Toggle offline mode"
          >
            {isOffline ? <CloudOff className="w-2.5 h-2.5" /> : <Cloud className="w-2.5 h-2.5" />}
            {isOffline ? 'Offline Mode' : 'Online'}
          </button>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
          <span>5G</span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="px-5 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-stone-900 dark:bg-stone-100 text-stone-100 dark:text-stone-900 flex items-center justify-center font-bold font-brief-serif text-lg shadow-xs">
            V
          </div>
          <div>
            <h1 className="font-brief-serif text-xl font-bold tracking-tight text-stone-900 dark:text-stone-100 leading-none">
              Verdict Desk
            </h1>
            <p className="text-[11px] text-stone-500 dark:text-stone-400 font-sf-sans mt-0.5">
              Decision Research Assistant
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1">
          {/* Shortcuts & Widgets Preview */}
          <button
            id="header-shortcuts-btn"
            onClick={() => {
              triggerHaptic('light');
              onOpenShortcuts();
            }}
            aria-label="Siri Shortcuts & Widgets"
            className="p-2 rounded-full text-stone-600 dark:text-stone-300 hover:bg-stone-200/60 dark:hover:bg-stone-800/60 transition-colors"
            title="Siri Shortcuts & Widgets"
          >
            <Smartphone className="w-4 h-4" />
          </button>

          {/* Dynamic Type Accessibility */}
          <button
            id="header-dynamic-type-btn"
            onClick={() => {
              triggerHaptic('light');
              onOpenDynamicType();
            }}
            aria-label="Adjust Dynamic Type size"
            className="p-2 rounded-full text-stone-600 dark:text-stone-300 hover:bg-stone-200/60 dark:hover:bg-stone-800/60 transition-colors"
            title="Dynamic Type"
          >
            <Type className="w-4 h-4" />
          </button>

          {/* Dark / Light Mode Toggle */}
          <button
            id="header-theme-btn"
            onClick={() => {
              triggerHaptic('light');
              onToggleDarkMode();
            }}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            className="p-2 rounded-full text-stone-600 dark:text-stone-300 hover:bg-stone-200/60 dark:hover:bg-stone-800/60 transition-colors"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Cloud Account Sync */}
          <button
            id="header-account-btn"
            onClick={() => {
              triggerHaptic('light');
              onOpenAccount();
            }}
            aria-label="Account and Cloud Sync"
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
              account
                ? 'bg-stone-100 dark:bg-stone-800 border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200'
                : 'bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-900 border-transparent hover:opacity-90'
            }`}
          >
            {account?.authProvider === 'apple' ? (
              <Apple className="w-3.5 h-3.5" />
            ) : (
              <Cloud className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline">
              {account ? account.name.split(' ')[0] : 'Sync'}
            </span>
            {account?.isSynced && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
