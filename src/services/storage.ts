import { DecisionRecord, UserAccount, DynamicTypeSize } from '../types';

const STORAGE_KEY = 'verdict_desk_history_v1';
const ACCOUNT_KEY = 'verdict_desk_account_v1';
const DYNAMIC_TYPE_KEY = 'verdict_desk_dynamic_type_v1';
const OFFLINE_MODE_KEY = 'verdict_desk_offline_override';

export const SEED_DECISIONS: DecisionRecord[] = [
  {
    id: 'vd_seed_1',
    title: 'M3 MacBook Air 16GB vs M3 Pro 14" (Student / Dev)',
    question: 'Should I buy the 15-inch M3 MacBook Air with 16GB RAM or spend extra for the 14-inch M3 Pro MacBook Pro for computer science coursework and web development?',
    constraints: 'Budget under $1,800. Needs to last 4 years. Portable for walking across campus daily.',
    category: 'shopping',
    verdict: {
      recommendedOption: '15" M3 MacBook Air (16GB RAM / 512GB SSD)',
      confidence: 'High',
      reasoning: 'At $1,499 street price (often $1,349 with student discount) versus $1,999 for the base M3 Pro, the Air delivers identical single-core compilation speed and superior silent battery endurance (up to 18 hours). The $500–$650 savings are far better retained for cloud compute credits, monitors, and textbooks.',
    },
    options: [
      {
        name: '15" M3 MacBook Air (16GB / 512GB)',
        isWinner: true,
        statusBadge: 'Decisive Winner: Best Cost/Portability Ratio',
        keyFactors: [
          { factor: 'Academic Portability', value: '3.3 lbs fanless, zero thermal throttling in typical compile bursts', sentiment: 'positive' },
          { factor: 'Effective Price', value: '$1,399-$1,499 with education discount', sentiment: 'positive' },
          { factor: 'Sustained Heavy Render Work', value: 'No fan, throttles by ~12% after 15m of continuous 100% multi-core load', sentiment: 'neutral' },
        ],
      },
      {
        name: '14" M3 Pro MacBook Pro (18GB / 512GB)',
        isWinner: false,
        statusBadge: 'Overkill Overhead for CS Undergraduate Needs',
        keyFactors: [
          { factor: 'Display & Ports', value: '120Hz ProMotion mini-LED, HDMI & SD card slot built-in', sentiment: 'positive' },
          { factor: 'Weight & Bulk', value: '3.5 lbs noticeably thicker chassis in backpack daily', sentiment: 'negative' },
          { factor: 'Price Premium', value: '$1,999 base retail — $500+ delta without tangible coursework speedup', sentiment: 'negative' },
        ],
      },
    ],
    referencePoints: [
      {
        label: 'Undergrad RAM Footprint',
        metric: '11.8 GB',
        context: 'Average peak unified memory when running VS Code, Docker runtime, Node server, and 20 browser tabs.',
        sourceHint: 'Developer Benchmarks & StackOverflow Survey',
      },
      {
        label: 'MacBook Air Resale Retention',
        metric: '64% at 36 Months',
        context: 'Apple silicon laptops hold resale liquidity far better than Windows x86 ultrabooks.',
        sourceHint: 'Swappa & eBay Completed Sales Index',
      },
      {
        label: 'Active Cooling Benefit in Coursework',
        metric: '< 4% compile delta',
        context: 'CS student lab projects compile in under 45 seconds where active fans never spin up.',
        sourceHint: 'AnandTech / Tom\'s Hardware Silicon Analysis',
      },
    ],
    uncertainties: [
      {
        title: 'Impending M4 Refresh Timeline',
        detail: 'Apple product cycles suggest base M4 MacBook Air updates in early-to-mid cycles; however, current M3 performance remains more than sufficient for entire 4-year curriculum.',
        severity: 'low',
      },
      {
        title: 'External Dual Display Clamshell Limitation',
        detail: 'M3 Air can drive two external monitors only with laptop lid closed; verify your dorm desk setup.',
        severity: 'medium',
      },
    ],
    webSources: [
      { title: 'Apple Education Store Pricing & Terms', url: 'https://apple.com/us-edu/shop' },
      { title: 'NotebookCheck M3 vs M3 Pro Thermal Profiling', url: 'https://notebookcheck.net' },
      { title: 'CS Curriculum Hardware Requirements 2026', url: 'https://github.com' },
    ],
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
    trackedForAlerts: true,
  },
  {
    id: 'vd_seed_2',
    title: 'Consulting Staff in Chicago vs Senior PM in NYC',
    question: 'Accept a $155,000 Staff Consultant offer in Chicago (firm covers all travel expenses, hybrid 2 days in office) or a $180,000 Senior Product Manager offer at a mid-stage tech company in Manhattan?',
    constraints: 'Goal: Maximize net post-tax savings while maintaining a sustainable 45-hour work week. No current dependents.',
    category: 'career',
    verdict: {
      recommendedOption: 'Staff Consultant in Chicago ($155,000 base)',
      confidence: 'High',
      reasoning: 'When factoring in NYC\'s combined state and 3.876% city income tax plus Manhattan median rent ($4,250/mo vs Chicago\'s $2,150/mo), the Chicago role yields approximately $1,580 more net discretionary savings per month. Furthermore, the firm\'s strict client travel expensing absorbs weekday meals, widening the true financial advantage.',
    },
    options: [
      {
        name: 'Staff Consultant (Chicago, $155k + expensed travel)',
        isWinner: true,
        statusBadge: 'Decisive Winner: Superior Net Savings & Capital Accumulation',
        keyFactors: [
          { factor: 'Net Discretionary Savings', value: '~$4,400/mo after taxes, 1BR rent ($2,150), and living costs', sentiment: 'positive' },
          { factor: 'Local Tax Overhead', value: 'Zero municipal city income tax in Illinois (flat 4.95% state)', sentiment: 'positive' },
          { factor: 'Travel Frequency', value: 'Client travel 2-3 days every other week (all meals expensed)', sentiment: 'neutral' },
        ],
      },
      {
        name: 'Senior PM (NYC Manhattan, $180k)',
        isWinner: false,
        statusBadge: 'Nominal Pay Bump Erased by Triple Tax and Manhattan Rent',
        keyFactors: [
          { factor: 'Net Discretionary Savings', value: '~$2,820/mo after federal, NY state, NYC resident tax, and $4,250 rent', sentiment: 'negative' },
          { factor: 'Effective Municipal Surcharge', value: '3.876% NYC resident tax is non-deductible', sentiment: 'negative' },
          { factor: 'Career Velocity Upside', value: 'Higher concentration of Tier-1 tech networking in Midtown / Flatiron', sentiment: 'positive' },
        ],
      },
    ],
    referencePoints: [
      {
        label: 'Manhattan vs Chicago Rent Index',
        metric: '+98% Differential',
        context: 'Median 1-bedroom apartment in Manhattan is $4,250 vs $2,150 in Chicago River North / West Loop.',
        sourceHint: 'Zillow Observed Rent Index (ZORI)',
      },
      {
        label: 'NYC Resident Municipal Income Tax',
        metric: '3.876% Marginal',
        context: 'Applied on all taxable income above $50,000 for residents living in NYC five boroughs.',
        sourceHint: 'NYC Department of Finance Tax Schedules',
      },
      {
        label: 'Consulting Expense Subsidy Value',
        metric: '~$9,000 / year tax-free',
        context: 'Expensed per-diems, rideshare, and client dinners while on assignment save personal grocery and transport budget.',
        sourceHint: 'Bureau of Labor Statistics Consumer Expenditure',
      },
    ],
    uncertainties: [
      {
        title: 'NYC Tech Equity Illiquidity',
        detail: 'The Manhattan tech company offers $35k in unvested ISO options, but zero secondary market liquidity is presently available.',
        severity: 'high',
      },
      {
        title: 'Consulting Bench Time Volatility',
        detail: 'Firm performance bonus multiplier hinges on maintaining 82% billable utilization across client fiscal cycles.',
        severity: 'medium',
      },
    ],
    webSources: [
      { title: 'SmartAsset New York City Paycheck Calculator', url: 'https://smartasset.com' },
      { title: 'Urban Institute Cost of Living Parity Index', url: 'https://urban.org' },
    ],
    timestamp: new Date(Date.now() - 86400000 * 5).toISOString(),
    trackedForAlerts: false,
  },
  {
    id: 'vd_seed_3',
    title: 'In-State UCLA CS vs Carnegie Mellon SCS ($200k Gap)',
    question: 'Choose between UCLA Computer Science (In-state tuition ~$14,500/yr) and Carnegie Mellon School of Computer Science ($65,000/yr tuition). Family can contribute $30k total.',
    constraints: 'Student must finance remainder through federal and private student loans. Wants to join high-growth AI startup or big tech post-graduation.',
    category: 'academic',
    verdict: {
      recommendedOption: 'UCLA Computer Science (In-State Residency)',
      confidence: 'High',
      reasoning: 'Financing a $200,000 direct tuition and living delta for CMU results in ~$2,100 monthly loan payments over a 10-year repayment schedule. Top 20% UCLA CS graduates achieve parity placement with CMU at major tech employers and startups without career-limiting debt pressure.',
    },
    options: [
      {
        name: 'UCLA Computer Science (In-State)',
        isWinner: true,
        statusBadge: 'Decisive Winner: Maximizes Post-Grad Career Freedom',
        keyFactors: [
          { factor: 'Total 4-Year Debt Burden', value: '< $25,000 total borrowing after family contribution and internships', sentiment: 'positive' },
          { factor: 'Silicon Valley Recruiting Pipeline', value: 'High priority core school for Apple, Google, Meta, and LA tech scene', sentiment: 'positive' },
          { factor: 'Class Size & Course Registration', value: 'Large lecture classes; impacted upper-division electives require planning', sentiment: 'neutral' },
        ],
      },
      {
        name: 'Carnegie Mellon School of Computer Science',
        isWinner: false,
        statusBadge: 'Unjustifiable Debt Amortization for Undergraduate Degree',
        keyFactors: [
          { factor: 'Total 4-Year Debt Burden', value: '~$195,000 in student loans ($2,100/mo payments for 120 months)', sentiment: 'negative' },
          { factor: 'Curriculum Prestige', value: 'World #1 rated CS faculty and unmatched systems / compiler depth', sentiment: 'positive' },
          { factor: 'Startup Flexibility Post-Grad', value: 'Severe loan servicing forces graduate into highest cash-salary roles only', sentiment: 'negative' },
        ],
      },
    ],
    referencePoints: [
      {
        label: '10-Year Loan Repayment Cost',
        metric: '$252,000 Total Outflow',
        context: 'Borrowing $190,000 at 6.8% blended interest rate requires $2,186 monthly for 120 continuous months.',
        sourceHint: 'Federal Student Aid Loan Simulator',
      },
      {
        label: 'Median CS Starting Base Compensation',
        metric: '$134k (UCLA) vs $152k (CMU)',
        context: 'The $18,000 starting gross salary difference takes 14.8 years to mathematically offset the loan principal and interest.',
        sourceHint: 'Collegescorecard.ed.gov & Levels.fyi University Reports',
      },
      {
        label: 'Tech Recruiter Core Campus Roster',
        metric: '94% Employer Overlap',
        context: 'Every Tier-1 technology firm and top VC-backed accelerator holds dedicated on-campus recruiting days at UCLA.',
        sourceHint: 'Handshake National University Hiring Index',
      },
    ],
    uncertainties: [
      {
        title: 'Private Departmental Scholarship Appeals',
        detail: 'CMU SCS occasionally offers endowed merit grant adjustments upon formal counter-offer review; user should submit an appeal before final commitment.',
        severity: 'medium',
      },
    ],
    webSources: [
      { title: 'College Scorecard Department of Education 2026', url: 'https://collegescorecard.ed.gov' },
      { title: 'UCLA Engineering Placement & Career Center Report', url: 'https://career.ucla.edu' },
    ],
    timestamp: new Date(Date.now() - 86400000 * 9).toISOString(),
    trackedForAlerts: true,
  },
];

export const storageService = {
  getDecisions(): DecisionRecord[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_DECISIONS));
        return SEED_DECISIONS;
      }
      return JSON.parse(raw);
    } catch (e) {
      console.error('Error reading localStorage decisions:', e);
      return SEED_DECISIONS;
    }
  },

  saveDecision(decision: DecisionRecord): DecisionRecord[] {
    try {
      const list = this.getDecisions();
      const existingIdx = list.findIndex(d => d.id === decision.id);
      let updated: DecisionRecord[];
      if (existingIdx >= 0) {
        updated = [...list];
        updated[existingIdx] = decision;
      } else {
        updated = [decision, ...list];
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      this.syncWithCloudIfLoggedIn(updated);
      return updated;
    } catch (e) {
      console.error('Error saving decision:', e);
      return [];
    }
  },

  deleteDecision(id: string): DecisionRecord[] {
    try {
      const list = this.getDecisions().filter(d => d.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      this.syncWithCloudIfLoggedIn(list);
      return list;
    } catch (e) {
      console.error('Error deleting decision:', e);
      return [];
    }
  },

  toggleTracking(id: string): DecisionRecord | null {
    try {
      const list = this.getDecisions();
      const item = list.find(d => d.id === id);
      if (!item) return null;
      item.trackedForAlerts = !item.trackedForAlerts;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      this.syncWithCloudIfLoggedIn(list);
      return item;
    } catch (e) {
      console.error('Error toggling tracking:', e);
      return null;
    }
  },

  // Account and Cloud Sync
  getAccount(): UserAccount | null {
    try {
      const raw = localStorage.getItem(ACCOUNT_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  },

  saveAccount(account: UserAccount | null): void {
    if (!account) {
      localStorage.removeItem(ACCOUNT_KEY);
    } else {
      localStorage.setItem(ACCOUNT_KEY, JSON.stringify(account));
    }
  },

  async syncWithCloudIfLoggedIn(decisions?: DecisionRecord[]): Promise<boolean> {
    const account = this.getAccount();
    if (!account) return false;

    const dataToSync = decisions || this.getDecisions();
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (account.token) {
        headers['Authorization'] = `Bearer ${account.token}`;
      }

      const res = await fetch(`/api/sync/${encodeURIComponent(account.id)}`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ decisions: dataToSync }),
      });

      if (res.ok) {
        account.isSynced = true;
        account.lastSyncedAt = new Date().toISOString();
        this.saveAccount(account);
        return true;
      } else if (res.status === 401 || res.status === 403) {
        // Session expired or invalid
        console.warn('Sync rejected: session invalid or unauthorized.');
        account.isSynced = false;
        this.saveAccount(account);
      }
    } catch (err) {
      console.warn('Cloud sync offline or server unreachable', err);
    }
    return false;
  },

  async pullFromCloud(): Promise<DecisionRecord[] | null> {
    const account = this.getAccount();
    if (!account) return null;
    try {
      const headers: Record<string, string> = {};
      if (account.token) {
        headers['Authorization'] = `Bearer ${account.token}`;
      }

      const res = await fetch(`/api/sync/${encodeURIComponent(account.id)}`, {
        headers,
      });

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.decisions) && data.decisions.length > 0) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data.decisions));
          account.isSynced = true;
          account.lastSyncedAt = data.syncedAt || new Date().toISOString();
          this.saveAccount(account);
          return data.decisions;
        }
      } else if (res.status === 401 || res.status === 403) {
        console.warn('Pull rejected: session invalid or unauthorized.');
        account.isSynced = false;
        this.saveAccount(account);
      }
    } catch (e) {
      console.warn('Could not pull from cloud:', e);
    }
    return null;
  },

  async logoutAccount(): Promise<void> {
    const account = this.getAccount();
    if (account?.token) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${account.token}`,
          },
        });
      } catch (err) {
        console.warn('Failed to notify server of logout:', err);
      }
    }
    this.saveAccount(null);
  },

  // Dynamic Type scale
  getDynamicType(): DynamicTypeSize {
    try {
      const val = localStorage.getItem(DYNAMIC_TYPE_KEY) as DynamicTypeSize;
      return val || 'default';
    } catch {
      return 'default';
    }
  },

  setDynamicType(size: DynamicTypeSize): void {
    try {
      localStorage.setItem(DYNAMIC_TYPE_KEY, size);
      document.documentElement.setAttribute('data-dynamic-type', size);
    } catch {}
  },

  // Offline Simulation Mode
  isOfflineOverride(): boolean {
    return localStorage.getItem(OFFLINE_MODE_KEY) === 'true';
  },

  setOfflineOverride(isOffline: boolean): void {
    localStorage.setItem(OFFLINE_MODE_KEY, isOffline ? 'true' : 'false');
  }
};
