import { DecisionRecord, PromptLabData } from '../types';
import { storageService } from './storage';

export class OfflineException extends Error {
  constructor(message = 'Network connection offline. Live search requires active internet access.') {
    super(message);
    this.name = 'OfflineException';
  }
}

export const apiService = {
  checkNetwork(): boolean {
    if (storageService.isOfflineOverride()) {
      return false;
    }
    return navigator.onLine;
  },

  async researchDecision(params: {
    question: string;
    constraints?: string;
    category?: string;
    followUpContext?: string;
    previousVerdict?: any;
  }): Promise<DecisionRecord> {
    if (!this.checkNetwork()) {
      throw new OfflineException();
    }

    const response = await fetch('/api/verdict/research', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      let errorMessage = 'Failed to execute decision research';
      try {
        const errorData = await response.json();
        if (errorData.error) errorMessage = errorData.error;
      } catch {}
      throw new Error(errorMessage);
    }

    const data = await response.json();
    if (!data.decision) {
      throw new Error('Malformed decision response from analyst engine.');
    }

    return data.decision as DecisionRecord;
  },

  async recheckDecision(decision: DecisionRecord): Promise<{ decision: DecisionRecord; delta: string }> {
    if (!this.checkNetwork()) {
      throw new OfflineException();
    }

    const response = await fetch('/api/verdict/recheck', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ decision }),
    });

    if (!response.ok) {
      let msg = 'Failed to re-check decision';
      try {
        const data = await response.json();
        if (data.error) msg = data.error;
      } catch {}
      throw new Error(msg);
    }

    const data = await response.json();
    return {
      decision: data.decision as DecisionRecord,
      delta: data.delta || 'Re-checked live data.',
    };
  },

  async generatePromptLab(requestText: string): Promise<PromptLabData> {
    if (!this.checkNetwork()) {
      throw new OfflineException();
    }

    const response = await fetch('/api/prompt-lab', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requestText }),
    });

    if (!response.ok) {
      let msg = 'Prompt Lab generation failed';
      try {
        const data = await response.json();
        if (data.error) msg = data.error;
      } catch {}
      throw new Error(msg);
    }

    const data = await response.json();
    return data.lab as PromptLabData;
  },
};
