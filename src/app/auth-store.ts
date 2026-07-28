// ─── ACCOUNT STORE ───────────────────────────────────────────────────────────
//
// ⚠️  PROTOTYPE CREDENTIAL STUB — THIS IS NOT AUTHENTICATION.
//
// This module exists so the UI behaves correctly: wrong passwords are rejected,
// reset links expire, provider accounts are linked. It is NOT a security
// boundary. Everything runs in the browser, so the account list (passwords and
// reset tokens included) is readable in devtools and every check here can be
// bypassed by editing client state.
//
// ── Replacing this with a real backend ──────────────────────────────────────
// Keep the exported function signatures and the UI needs no changes.
//
//   signIn()             → POST /auth/login          (server verifies argon2/bcrypt hash)
//   register()           → POST /auth/register
//   signInWithProvider() → OAuth, see PROVIDER NOTES below
//   requestPasswordReset() → POST /auth/forgot       (server emails a signed, single-use link)
//   resetPassword()      → POST /auth/reset          (server validates token + expiry)
//
// ── PROVIDER NOTES ──────────────────────────────────────────────────────────
// `signInWithProvider` is the seam for real OAuth. What each provider needs:
//
//   Google — Google Identity Services. Create an OAuth 2.0 Client ID in Google
//     Cloud Console, add your origin to Authorized JavaScript origins, load
//     https://accounts.google.com/gsi/client, and call google.accounts.id
//     .initialize({ client_id, callback }). The callback receives a JWT
//     credential which the SERVER must verify against Google's JWKS before a
//     session is issued. Never trust it client-side.
//
//   Apple — Sign in with Apple. Requires a paid Apple Developer account, a
//     Services ID, a registered return URL and a .p8 private key. AppleID.auth
//     .signIn() can return an id_token in the browser, but the token exchange
//     is signed with your private key and MUST happen server-side. There is no
//     legitimate client-only Apple flow.
//
// Until those exist, `signInWithProvider` records a provider-linked account
// locally so the rest of the app can be built and tested against it.

export type Provider = "google" | "apple";

export interface Account {
  firstName: string;
  lastName: string;
  email: string;
  /** Absent for accounts created via a provider that never set one. */
  password?: string;
  /** Providers linked to this account, in addition to any password. */
  providers: Provider[];
}

export type Result<T> = { ok: true; value: T } | { ok: false; error: string };

interface ResetToken {
  token: string;
  email: string;
  expiresAt: number;
  usedAt?: number;
}

const ACCOUNTS_KEY = "connextionz.accounts";
const RESETS_KEY = "connextionz.resets";

/** Matches the "expires in 15 minutes" copy shown on the Reset Sent screen. */
export const RESET_TTL_MS = 15 * 60 * 1000;

export const PROVIDER_LABEL: Record<Provider, string> = { google: "Google", apple: "Apple" };

/** Seed account so the prototype is usable without registering first. */
export const DEMO_ACCOUNT: Account = {
  firstName: "Maya",
  lastName: "Chen",
  email: "demo@connextionz.app",
  password: "collab2026",
  providers: [],
};

const normalize = (email: string) => email.trim().toLowerCase();
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* Non-fatal: storage disabled means the session just will not persist. */
  }
}

function loadAccounts(): Account[] {
  const list = read<Account[]>(ACCOUNTS_KEY, []);
  if (!Array.isArray(list)) return [DEMO_ACCOUNT];
  // Normalise older records and guarantee the demo account always exists.
  const accounts = list
    .filter((a): a is Account => !!a && typeof a.email === "string")
    .map((a) => ({ ...a, providers: Array.isArray(a.providers) ? a.providers : [] }));
  return accounts.some((a) => normalize(a.email) === DEMO_ACCOUNT.email)
    ? accounts
    : [DEMO_ACCOUNT, ...accounts];
}

const saveAccounts = (a: Account[]) => write(ACCOUNTS_KEY, a);
const loadResets = () => read<ResetToken[]>(RESETS_KEY, []).filter((t) => !!t && !!t.token);
const saveResets = (t: ResetToken[]) => write(RESETS_KEY, t);

const findAccount = (accounts: Account[], email: string) =>
  accounts.find((a) => normalize(a.email) === normalize(email));

/** Opaque, non-guessable enough for a prototype. A real backend signs these. */
function makeToken(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

// ─── SIGN IN ─────────────────────────────────────────────────────────────────

export async function signIn(email: string, password: string): Promise<Result<Account>> {
  await delay(900);
  const account = findAccount(loadAccounts(), email);

  // An account created purely through a provider has no password to check.
  // Say so explicitly — this is a usability dead end otherwise, and it leaks
  // nothing an attacker could not learn by trying the provider button.
  if (account && !account.password && account.providers.length) {
    const names = account.providers.map((p) => PROVIDER_LABEL[p]).join(" or ");
    return { ok: false, error: `This account uses ${names} sign-in. Continue with ${names} below.` };
  }

  // Identical message for unknown email and wrong password, so the form cannot
  // be used to enumerate which addresses are registered.
  if (!account || account.password !== password) {
    return { ok: false, error: "Incorrect email or password. Please try again." };
  }
  return { ok: true, value: account };
}

export async function register(input: {
  firstName: string; lastName: string; email: string; password: string;
}): Promise<Result<Account>> {
  await delay(1100);
  const accounts = loadAccounts();

  if (findAccount(accounts, input.email)) {
    return { ok: false, error: "An account with this email already exists. Try logging in." };
  }

  const account: Account = { ...input, email: input.email.trim(), providers: [] };
  saveAccounts([...accounts, account]);
  return { ok: true, value: account };
}

// ─── PROVIDER SIGN IN ────────────────────────────────────────────────────────

/**
 * Completes a provider sign-in for an identity the provider has already
 * confirmed. Real OAuth replaces the *caller* (which currently simulates the
 * provider's account chooser) — this linking logic stays as-is.
 *
 * First sign-in creates the account; later ones link the provider to the
 * existing account so a user who registered with a password keeps that access.
 */
export async function signInWithProvider(
  provider: Provider,
  identity: { email: string; firstName: string; lastName: string },
): Promise<Result<Account>> {
  await delay(700);
  const accounts = loadAccounts();
  const existing = findAccount(accounts, identity.email);

  if (existing) {
    if (!existing.providers.includes(provider)) {
      existing.providers = [...existing.providers, provider];
      saveAccounts(accounts);
    }
    return { ok: true, value: existing };
  }

  const account: Account = {
    firstName: identity.firstName,
    lastName: identity.lastName,
    email: identity.email.trim(),
    providers: [provider],
  };
  saveAccounts([...accounts, account]);
  return { ok: true, value: account };
}

// ─── PASSWORD RESET ──────────────────────────────────────────────────────────

/**
 * Always reports success, even for unknown addresses, so the form cannot be
 * used to discover registered emails. `token` comes back only when an account
 * actually exists — a real backend emails it instead of returning it, and the
 * prototype UI surfaces it because no mail is sent.
 */
export async function requestPasswordReset(
  email: string,
): Promise<Result<{ token: string | null }>> {
  await delay(1000);
  const account = findAccount(loadAccounts(), email);
  if (!account) return { ok: true, value: { token: null } };

  const now = Date.now();
  const token: ResetToken = {
    token: makeToken(),
    email: normalize(account.email),
    expiresAt: now + RESET_TTL_MS,
  };

  // Drop this account's earlier tokens so only the newest link works, and
  // discard anything long expired to keep storage from growing forever.
  const kept = loadResets().filter(
    (t) => t.email !== token.email && t.expiresAt > now - RESET_TTL_MS,
  );
  saveResets([...kept, token]);
  return { ok: true, value: { token: token.token } };
}

export function verifyResetToken(token: string): Result<{ email: string }> {
  const entry = loadResets().find((t) => t.token === token.trim());
  if (!entry) return { ok: false, error: "This reset link is not valid. Request a new one." };
  if (entry.usedAt) return { ok: false, error: "This reset link has already been used." };
  if (entry.expiresAt <= Date.now()) return { ok: false, error: "This reset link has expired. Request a new one." };
  return { ok: true, value: { email: entry.email } };
}

export async function resetPassword(token: string, newPassword: string): Promise<Result<Account>> {
  await delay(1000);

  const check = verifyResetToken(token);
  if (!check.ok) return check;

  const accounts = loadAccounts();
  const account = findAccount(accounts, check.value.email);
  if (!account) return { ok: false, error: "That account no longer exists." };

  if (account.password === newPassword) {
    return { ok: false, error: "Choose a password you have not used before." };
  }

  account.password = newPassword;
  saveAccounts(accounts);

  // Single use: burn the token so the same link cannot be replayed.
  const resets = loadResets();
  const entry = resets.find((t) => t.token === token.trim());
  if (entry) { entry.usedAt = Date.now(); saveResets(resets); }

  return { ok: true, value: account };
}
