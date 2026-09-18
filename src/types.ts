export type ConfidenceLevel = 'High' | 'Medium' | 'Low';

export type DecisionCategory = 'shopping' | 'career' | 'academic' | 'other';

export type FactorSentiment = 'positive' | 'neutral' | 'negative';

export interface KeyFactor {
  factor: string;
  value: string;
  sentiment: FactorSentiment;
}

export interface ComparisonOption {
  name: string;
  isWinner: boolean;
  statusBadge: string;
  keyFactors: KeyFactor[];
}

export interface Verdict {
  recommendedOption: string;
  confidence: ConfidenceLevel;
  reasoning: string;
}

export interface ReferencePoint {
  label: string;
  metric: string;
  context: string;
  sourceHint?: string;
}

export interface UncertaintyFlag {
  title: string;
  detail: string;
  severity: 'high' | 'medium' | 'low';
}

export interface WebSource {
  title: string;
  url: string;
}

export interface FollowUpItem {
  adjustment: string;
  timestamp: string;
}

export interface RecheckMeta {
  timestamp: string;
  deltaSummary: string;
  hasMaterialChange: boolean;
}

export interface DecisionRecord {
  id: string;
  question: string;
  constraints: string;
  category: DecisionCategory;
  title: string;
  verdict: Verdict;
  options: ComparisonOption[];
  referencePoints: ReferencePoint[];
  uncertainties: UncertaintyFlag[];
  webSources: WebSource[];
  timestamp: string;
  trackedForAlerts: boolean;
  followUps?: FollowUpItem[];
  lastRecheck?: RecheckMeta;
}

export interface PromptVariant {
  id: 'reasoning' | 'chat' | 'search_grounded';
  targetType: string;
  subtitle: string;
  prompt: string;
  whyNote: string;
}

export interface PromptLabData {
  originalRequest: string;
  variants: PromptVariant[];
}

export interface UserAccount {
  id: string;
  email: string;
  name: string;
  authProvider: 'apple' | 'email';
  token?: string;
  isSynced: boolean;
  lastSyncedAt?: string;
}

export type DynamicTypeSize = 'small' | 'default' | 'large' | 'extra-large';

export type ActiveTab = 'research' | 'history' | 'prompt_lab';
