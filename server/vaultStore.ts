import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export interface StoredUser {
  id: string;
  email: string;
  name: string;
  authProvider: 'email' | 'apple';
  createdAt: string;
}

export interface StoredSession {
  token: string;
  userId: string;
  email: string;
  createdAt: string;
  expiresAt: string;
}

interface VerificationCodeEntry {
  email: string;
  name?: string;
  code: string;
  expiresAt: number;
}

interface VaultDataFile {
  version: number;
  users: Record<string, StoredUser>;
  sessions: Record<string, StoredSession>;
  vaults: Record<string, any[]>;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'vault_store.json');

export class PersistentVaultStore {
  private users: Map<string, StoredUser> = new Map();
  private sessions: Map<string, StoredSession> = new Map();
  private vaults: Map<string, any[]> = new Map();
  private pendingCodes: Map<string, VerificationCodeEntry> = new Map();

  constructor() {
    this.ensureDir();
    this.loadFromDisk();
  }

  private ensureDir() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
    } catch (err) {
      console.error('Failed to create data directory:', err);
    }
  }

  private loadFromDisk() {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        const data: VaultDataFile = JSON.parse(raw);
        if (data.users) {
          for (const [id, u] of Object.entries(data.users)) {
            this.users.set(id, u);
          }
        }
        if (data.sessions) {
          const now = Date.now();
          for (const [token, s] of Object.entries(data.sessions)) {
            // Only keep non-expired sessions
            if (new Date(s.expiresAt).getTime() > now) {
              this.sessions.set(token, s);
            }
          }
        }
        if (data.vaults) {
          for (const [userId, items] of Object.entries(data.vaults)) {
            this.vaults.set(userId, items);
          }
        }
        console.log(
          `[VaultStore] Loaded ${this.users.size} accounts, ${this.sessions.size} active sessions, ${this.vaults.size} vaults from disk.`
        );
      } else {
        // Initialize empty file
        this.saveToDisk();
      }
    } catch (err) {
      console.error('[VaultStore] Error reading disk store, starting with clean state:', err);
    }
  }

  private saveToDisk() {
    try {
      this.ensureDir();
      const payload: VaultDataFile = {
        version: 1,
        users: Object.fromEntries(this.users.entries()),
        sessions: Object.fromEntries(this.sessions.entries()),
        vaults: Object.fromEntries(this.vaults.entries()),
      };

      const tmpFile = `${DATA_FILE}.tmp.${Date.now()}`;
      fs.writeFileSync(tmpFile, JSON.stringify(payload, null, 2), 'utf-8');
      fs.renameSync(tmpFile, DATA_FILE);
    } catch (err) {
      console.error('[VaultStore] Failed to write vault to disk:', err);
    }
  }

  // Generate deterministic unique userId from normalized email
  private getUserId(email: string): string {
    const normalized = email.trim().toLowerCase();
    const hash = crypto.createHash('sha256').update(normalized).digest('hex').substring(0, 12);
    return `usr_${hash}`;
  }

  // Issue 6-digit verification code
  public createVerificationCode(email: string, name?: string): { code: string; expiresAt: number } {
    const normalized = email.trim().toLowerCase();
    // 6-digit numeric OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes expiry

    this.pendingCodes.set(normalized, {
      email: normalized,
      name: name?.trim() || undefined,
      code,
      expiresAt,
    });

    return { code, expiresAt };
  }

  // Verify code and generate authenticated session token
  public verifyCode(
    email: string,
    submittedCode: string,
    name?: string
  ): { success: boolean; token?: string; user?: StoredUser; error?: string } {
    const normalized = email.trim().toLowerCase();
    const pending = this.pendingCodes.get(normalized);

    if (!pending) {
      return { success: false, error: 'No verification code was requested for this email. Please request a new code.' };
    }

    if (Date.now() > pending.expiresAt) {
      this.pendingCodes.delete(normalized);
      return { success: false, error: 'Verification code has expired. Please request a new one.' };
    }

    if (pending.code !== submittedCode.trim()) {
      return { success: false, error: 'Invalid verification code. Please check your code and try again.' };
    }

    // Code is valid! Consume code
    this.pendingCodes.delete(normalized);

    const userId = this.getUserId(normalized);
    let user = this.users.get(userId);

    if (!user) {
      const displayName = name?.trim() || pending.name || normalized.split('@')[0];
      user = {
        id: userId,
        email: normalized,
        name: displayName,
        authProvider: 'email',
        createdAt: new Date().toISOString(),
      };
      this.users.set(userId, user);
    } else if (name && name.trim() && user.name !== name.trim()) {
      user.name = name.trim();
      this.users.set(userId, user);
    }

    // Issue cryptographic 64-char hex session token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days session

    const session: StoredSession = {
      token,
      userId,
      email: normalized,
      createdAt: new Date().toISOString(),
      expiresAt,
    };

    this.sessions.set(token, session);
    this.saveToDisk();

    return { success: true, token, user };
  }

  // Retrieve and validate session
  public getSession(token: string): { valid: boolean; session?: StoredSession; user?: StoredUser } {
    if (!token) return { valid: false };
    const session = this.sessions.get(token);
    if (!session) return { valid: false };

    // Check expiry
    if (new Date(session.expiresAt).getTime() < Date.now()) {
      this.sessions.delete(token);
      this.saveToDisk();
      return { valid: false };
    }

    const user = this.users.get(session.userId);
    return { valid: true, session, user };
  }

  // Revoke session on logout
  public revokeSession(token: string): boolean {
    if (this.sessions.has(token)) {
      this.sessions.delete(token);
      this.saveToDisk();
      return true;
    }
    return false;
  }

  // Vault data isolation per userId
  public getDecisions(userId: string): any[] {
    return this.vaults.get(userId) || [];
  }

  public saveDecisions(userId: string, decisions: any[]): void {
    this.vaults.set(userId, decisions);
    this.saveToDisk();
  }
}

// In-Memory Sliding Window Rate Limiter
export class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private maxRequests: number;
  private windowMs: number;

  constructor(maxRequests: number, windowMinutes: number) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMinutes * 60 * 1000;
  }

  public check(key: string): { allowed: boolean; remaining: number; resetSec: number } {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    let timestamps = this.requests.get(key) || [];
    // Discard timestamps older than window
    timestamps = timestamps.filter((t) => t > windowStart);

    if (timestamps.length >= this.maxRequests) {
      const oldestInWindow = timestamps[0];
      const resetSec = Math.ceil((oldestInWindow + this.windowMs - now) / 1000);
      return { allowed: false, remaining: 0, resetSec: Math.max(1, resetSec) };
    }

    timestamps.push(now);
    this.requests.set(key, timestamps);

    return {
      allowed: true,
      remaining: this.maxRequests - timestamps.length,
      resetSec: Math.ceil(this.windowMs / 1000),
    };
  }
}
