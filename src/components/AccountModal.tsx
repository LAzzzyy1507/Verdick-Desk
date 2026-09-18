import React, { useState } from 'react';
import { UserAccount } from '../types';
import { Apple, Mail, Cloud, Check, RefreshCw, X, LogOut, ShieldCheck } from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  account: UserAccount | null;
  onLogin: (acc: UserAccount) => void;
  onLogout: () => void;
  onSyncNow: () => Promise<void>;
  isSyncing: boolean;
  decisionCount: number;
}

export const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  account,
  onLogin,
  onLogout,
  onSyncNow,
  isSyncing,
  decisionCount,
}) => {
  const [emailInput, setEmailInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [showEmailForm, setShowEmailForm] = useState(false);

  if (!isOpen) return null;

  const handleAppleSignIn = () => {
    triggerHaptic('success');
    const appleAcc: UserAccount = {
      id: 'apple_user_7823',
      email: 'alex.chen@icloud.com',
      name: 'Alex Chen',
      authProvider: 'apple',
      isSynced: true,
      lastSyncedAt: new Date().toISOString(),
    };
    onLogin(appleAcc);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    triggerHaptic('success');
    const userAcc: UserAccount = {
      id: 'usr_' + emailInput.replace(/[^a-zA-Z0-9]/g, '_'),
      email: emailInput.trim(),
      name: nameInput.trim() || emailInput.split('@')[0],
      authProvider: 'email',
      isSynced: true,
      lastSyncedAt: new Date().toISOString(),
    };
    onLogin(userAcc);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in">
      <div
        className="w-full max-w-md rounded-t-3xl sm:rounded-2xl bg-white dark:bg-[#151619] border border-stone-200 dark:border-stone-800 p-6 shadow-2xl pb-safe transition-colors"
        role="dialog"
        aria-modal="true"
        aria-labelledby="account-modal-title"
      >
        <div className="w-10 h-1 bg-stone-300 dark:bg-stone-700 rounded-full mx-auto mb-4 sm:hidden" />

        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-stone-900 dark:bg-stone-100 text-stone-100 dark:text-stone-900">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h3 id="account-modal-title" className="font-brief-serif text-lg font-bold text-stone-900 dark:text-stone-100">
                Cloud Sync & Persistence
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 font-sf-sans">
                Access your decision briefs across devices
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

        {account ? (
          /* Logged In View */
          <div className="space-y-4">
            <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-[#1A1C20] p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {account.authProvider === 'apple' ? (
                    <span className="p-1.5 rounded-lg bg-black text-white dark:bg-white dark:text-black">
                      <Apple className="w-4 h-4" />
                    </span>
                  ) : (
                    <span className="p-1.5 rounded-lg bg-stone-200 dark:bg-stone-700 text-stone-800 dark:text-stone-200">
                      <Mail className="w-4 h-4" />
                    </span>
                  )}
                  <div>
                    <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                      {account.name}
                    </h4>
                    <p className="text-xs text-stone-500 dark:text-stone-400">
                      {account.email}
                    </p>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[11px] font-semibold border border-emerald-300 dark:border-emerald-800">
                  <Check className="w-3 h-3" />
                  Synced
                </span>
              </div>

              <div className="mt-3 pt-3 border-t border-stone-200 dark:border-stone-700 text-xs text-stone-600 dark:text-stone-400 flex items-center justify-between">
                <span>{decisionCount} briefs saved in cloud vault</span>
                <span className="font-mono text-[10px]">
                  {account.lastSyncedAt
                    ? `Last: ${new Date(account.lastSyncedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                    : 'Synced'}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={async () => {
                  triggerHaptic('medium');
                  await onSyncNow();
                }}
                disabled={isSyncing}
                className="flex-1 py-2.5 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-stone-200 text-stone-100 dark:text-stone-900 text-xs font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-60 shadow-xs"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
              </button>

              <button
                onClick={() => {
                  triggerHaptic('light');
                  onLogout();
                }}
                className="py-2.5 px-4 rounded-xl border border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-800 text-rose-600 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        ) : (
          /* Login View */
          <div className="space-y-4">
            <p className="text-xs text-stone-600 dark:text-stone-400 font-sf-sans leading-relaxed">
              Connect your account to synchronize decisions across iPhone, iPad, and desktop without losing local offline caches.
            </p>

            <div className="space-y-2.5">
              {/* Sign in with Apple button */}
              <button
                onClick={handleAppleSignIn}
                className="w-full py-3 px-4 rounded-xl bg-black hover:bg-neutral-900 text-white text-sm font-semibold flex items-center justify-center gap-2.5 shadow-xs transition-colors"
              >
                <Apple className="w-4 h-4 fill-current" />
                <span>Sign in with Apple</span>
              </button>

              {/* Email Login Alternative */}
              {!showEmailForm ? (
                <button
                  onClick={() => setShowEmailForm(true)}
                  className="w-full py-2.5 px-4 rounded-xl border border-stone-300 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800/60 text-stone-800 dark:text-stone-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span>Continue with Work / Personal Email</span>
                </button>
              ) : (
                <form onSubmit={handleEmailSubmit} className="space-y-2 pt-2">
                  <input
                    type="text"
                    placeholder="Your Name (Optional)"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-[#1A1C20] text-stone-900 dark:text-stone-100"
                  />
                  <input
                    type="email"
                    required
                    placeholder="name@company.com"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-[#1A1C20] text-stone-900 dark:text-stone-100"
                  />
                  <button
                    type="submit"
                    className="w-full py-2 rounded-lg bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-900 text-xs font-semibold"
                  >
                    Save & Enable Cloud Sync
                  </button>
                </form>
              )}
            </div>

            <div className="pt-3 border-t border-stone-100 dark:border-stone-800/80 flex items-center gap-2 text-[11px] text-stone-500 dark:text-stone-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Decisions stored in private, isolated vault.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
