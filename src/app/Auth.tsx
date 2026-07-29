import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Eye, EyeOff, Mail, Lock, User, ArrowRight, ArrowLeft,
  Check, Loader2, AlertCircle, Info, Zap,
  Music, Activity, MapPin, Coffee, Pen, Cpu, Gamepad2,
  Star, TrendingUp, Mic, Users, Briefcase,
} from "lucide-react";
import {
  signIn, register, signInWithProvider,
  requestPasswordReset, verifyResetToken, resetPassword,
  updateProfile, profileOf, startSession,
  DEMO_ACCOUNT, PROVIDER_LABEL, type Provider, type Account,
} from "./auth-store";
import { loadPreferences, savePreferences } from "./settings-store";

// ─── TYPES ───────────────────────────────────────────────────────────────────

type Screen =
  | "getStarted"
  | "login"
  | "createAccount"
  | "forgotPassword"
  | "resetSent"
  | "resetPassword"
  | "onboarding";

type OnbStep = 1 | 2 | 3;

// ─── RESPONSIVE LAYOUT TOKENS ────────────────────────────────────────────────
// Mobile/tablet (< lg) keeps the verified Figma proportions untouched.
// From `lg` (1024px) up, the auth flow becomes a two-column desktop layout:
// a brand panel on the left and this content column on the right, so screens
// stop stretching edge-to-edge on wide viewports.

/** Screen root: fills the frame on mobile, becomes an auto-height column on desktop. */
const SCREEN = "flex flex-col h-full lg:h-auto";
/** Horizontal gutter — the desktop shell supplies its own padding. */
const GUTTER = "px-6 lg:px-0";
/** Status-bar offset, only meaningful on mobile. */
const TOP_PAD = "pt-14 lg:pt-0";
/** Page heading. */
const H1 = "text-white font-extrabold text-[30px] lg:text-[36px] leading-tight";
/** Sub-heading under an H1. */
const SUB = "text-white/45 text-[15px] lg:text-[16px]";

// ─── LOGO ────────────────────────────────────────────────────────────────────

function Logo({ size = "lg" }: { size?: "sm" | "lg" | "xl" }) {
  const cls = size === "xl" ? "text-3xl xl:text-4xl" : size === "lg" ? "text-3xl" : "text-xl";
  return (
    <span className={`font-extrabold tracking-tight ${cls} text-white`}>
      Connext<span style={{ color: "#00AEEF" }}>ion</span>Z
    </span>
  );
}

// ─── STEP DOTS ───────────────────────────────────────────────────────────────

function StepDots({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <motion.div
          key={i}
          animate={{ width: i === step - 1 ? 28 : 8, opacity: i === step - 1 ? 1 : 0.35 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="h-2 rounded-full"
          style={{ background: "#00AEEF" }}
        />
      ))}
    </div>
  );
}

// ─── INPUT ───────────────────────────────────────────────────────────────────

interface InputProps {
  label?: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: string;
  icon?: React.ReactNode;
  rightEl?: React.ReactNode;
  autoFocus?: boolean;
}

function Input({ label, type = "text", value, onChange, placeholder, error, icon, rightEl, autoFocus }: InputProps) {
  return (
    <div className="space-y-1.5">
      {label && <p className="text-white/50 text-[12px] font-semibold uppercase tracking-widest px-1">{label}</p>}
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35 pointer-events-none">
            {icon}
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className={[
            "w-full rounded-2xl text-white text-[15px] lg:text-[16px] outline-none transition-all placeholder:text-white/25",
            "py-3.5 lg:py-4",
            icon ? "pl-11" : "pl-4",
            rightEl ? "pr-12" : "pr-4",
          ].join(" ")}
          style={{
            background: "rgba(0,80,160,0.12)",
            border: error ? "1px solid rgba(239,68,68,0.6)" : "1px solid rgba(0,174,239,0.18)",
          }}
          onFocus={(e) => { e.target.style.border = `1px solid rgba(0,174,239,0.5)`; }}
          onBlur={(e) => { e.target.style.border = error ? "1px solid rgba(239,68,68,0.6)" : "1px solid rgba(0,174,239,0.18)"; }}
        />
        {rightEl && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            {rightEl}
          </div>
        )}
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
            className="text-red-400 text-[12px] flex items-center gap-1 px-1"
          >
            <AlertCircle className="w-3 h-3 flex-shrink-0" /> {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── PRIMARY BUTTON ──────────────────────────────────────────────────────────

function PrimaryBtn({
  children, onClick, disabled, loading, full = true,
}: { children: React.ReactNode; onClick?: () => void; disabled?: boolean; loading?: boolean; full?: boolean }) {
  return (
    <motion.button
      whileTap={disabled || loading ? {} : { scale: 0.97 }}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${full ? "w-full" : ""} py-4 lg:py-[18px] rounded-full font-bold text-[16px] lg:text-[17px] text-black flex items-center justify-center gap-2 transition-opacity`}
      style={{
        background: disabled ? "rgba(255,255,255,0.12)" : "linear-gradient(135deg,#00AEEF,#38bdf8)",
        color: disabled ? "rgba(255,255,255,0.3)" : "#000",
        boxShadow: disabled ? "none" : "0 8px 24px rgba(0,174,239,0.4)",
        opacity: loading ? 0.85 : 1,
      }}
    >
      {loading ? <Loader2 className="w-5 h-5 animate-spin text-white/70" /> : children}
    </motion.button>
  );
}

// ─── GHOST BUTTON ────────────────────────────────────────────────────────────

function GhostBtn({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="w-full py-3.5 lg:py-4 rounded-full font-semibold text-[15px] lg:text-[16px] text-white/70 flex items-center justify-center gap-2"
      style={{ background: "rgba(0,60,130,0.25)", border: "1px solid rgba(0,174,239,0.2)" }}
    >
      {children}
    </motion.button>
  );
}

// ─── CHECKBOX ────────────────────────────────────────────────────────────────

function Checkbox({ checked, onChange, children }: { checked: boolean; onChange: (v: boolean) => void; children: React.ReactNode }) {
  return (
    <button onClick={() => onChange(!checked)} className="flex items-start gap-3 text-left">
      <motion.div
        animate={{ background: checked ? "#00AEEF" : "rgba(0,60,130,0.3)", borderColor: checked ? "#00AEEF" : "rgba(0,174,239,0.3)" }}
        className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 border"
        style={{ border: "1.5px solid rgba(0,174,239,0.3)" }}
      >
        <AnimatePresence>
          {checked && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ type: "spring", damping: 16 }}>
              <Check className="w-3 h-3 text-black" strokeWidth={3} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      <span className="text-white/60 text-[13px] leading-relaxed">{children}</span>
    </button>
  );
}

// ─── SOCIAL BTN ──────────────────────────────────────────────────────────────

function SocialBtn({
  icon, label, onClick, busy, disabled,
}: { icon: React.ReactNode; label: string; onClick?: () => void; busy?: boolean; disabled?: boolean }) {
  return (
    <motion.button
      whileTap={disabled || busy ? {} : { scale: 0.97 }}
      onClick={onClick}
      disabled={disabled || busy}
      aria-label={`Continue with ${label}`}
      className="flex-1 py-3.5 lg:py-4 rounded-2xl font-semibold text-[14px] lg:text-[15px] text-white flex items-center justify-center gap-2 transition-opacity disabled:opacity-50"
      style={{ background: "rgba(0,60,130,0.25)", border: "1px solid rgba(0,174,239,0.2)" }}
    >
      {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : icon} {label}
    </motion.button>
  );
}

// ─── DIVIDER ─────────────────────────────────────────────────────────────────

function Divider() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-px bg-white/10" />
      <span className="text-white/30 text-[12px] font-medium">or</span>
      <div className="flex-1 h-px bg-white/10" />
    </div>
  );
}

// ─── EMAIL VALIDATION ────────────────────────────────────────────────────────

const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

// ─── PROVIDER SIGN-IN SHEET ──────────────────────────────────────────────────
// Stands in for the Google / Apple account chooser popup. Real OAuth replaces
// this component only: it resolves to an identity, and everything downstream
// (`signInWithProvider`, account linking) stays exactly as it is.

interface ProviderIdentity { email: string; firstName: string; lastName: string }

/** The  glyph needs Apple's system font, so it renders as tofu elsewhere. */
function AppleMark({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  );
}

/** Google's four-colour mark, so the button matches their brand guidance. */
function GoogleMark({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path fill="#4285F4" d="M23.5 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.47a5.53 5.53 0 0 1-2.4 3.62v3h3.86c2.26-2.09 3.57-5.17 3.57-8.86z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.96-1.08 7.94-2.91l-3.86-3c-1.08.72-2.45 1.16-4.08 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09A12 12 0 0 0 12 24z" />
      <path fill="#FBBC05" d="M5.27 14.29a7.2 7.2 0 0 1 0-4.58V6.62H1.29a12 12 0 0 0 0 10.76l3.98-3.09z" />
      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.7 0 3.99 2.47 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75z" />
    </svg>
  );
}

const PROVIDER_ACCOUNTS: ProviderIdentity[] = [
  { email: "demo@connextionz.app", firstName: "Maya", lastName: "Chen" },
  { email: "alex.rivera@gmail.com", firstName: "Alex", lastName: "Rivera" },
];

const PROVIDER_MARK: Record<Provider, { node: React.ReactNode; bg: string }> = {
  google: { node: <GoogleMark className="w-5 h-5" />, bg: "#ffffff" },
  apple: { node: <AppleMark className="w-5 h-5" />, bg: "#000000" },
};

function ProviderSheet({
  provider, onPick, onCancel,
}: { provider: Provider; onPick: (id: ProviderIdentity) => void; onCancel: () => void }) {
  const mark = PROVIDER_MARK[provider];
  const label = PROVIDER_LABEL[provider];

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-5"
      style={{ background: "rgba(0,4,14,0.72)", backdropFilter: "blur(6px)" }}
      onClick={onCancel}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ type: "spring", damping: 26, stiffness: 320 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[380px] rounded-3xl overflow-hidden"
        style={{ background: "#12151c", border: "1px solid rgba(255,255,255,0.12)", boxShadow: "0 24px 70px rgba(0,0,0,0.7)" }}
      >
        <div className="px-6 pt-6 pb-5 text-center" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="w-11 h-11 rounded-full mx-auto flex items-center justify-center"
            style={{ background: mark.bg, color: provider === "apple" ? "#fff" : undefined }}>
            {mark.node}
          </div>
          <p className="text-white font-bold text-[16px] mt-3">Sign in with {label}</p>
          <p className="text-white/45 text-[13px] mt-1">to continue to ConnextionZ</p>
        </div>

        <div className="py-2">
          {PROVIDER_ACCOUNTS.map((acct) => (
            <button key={acct.email} onClick={() => onPick(acct)}
              className="w-full flex items-center gap-3 px-6 py-3.5 text-left transition-colors hover:bg-white/5">
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[14px] font-bold flex-shrink-0"
                style={{ background: "linear-gradient(135deg,#00AEEF,#0077cc)" }}>
                {acct.firstName[0]}
              </div>
              <div className="min-w-0">
                <p className="text-white text-[14px] font-semibold truncate">{acct.firstName} {acct.lastName}</p>
                <p className="text-white/40 text-[12px] truncate">{acct.email}</p>
              </div>
            </button>
          ))}
        </div>

        <div className="px-6 pb-5 pt-1 space-y-3">
          <button onClick={onCancel}
            className="w-full py-3 rounded-full text-[14px] font-semibold text-white/70"
            style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}>
            Cancel
          </button>
          <p className="text-[11px] leading-relaxed text-center text-white/30">
            Prototype chooser — no real {label} OAuth is performed.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── DESKTOP BRAND PANEL ─────────────────────────────────────────────────────
// Only rendered from `lg` up. It absorbs the horizontal space that used to be
// dead margin (or stretched form fields), and carries the hero art that the
// mobile Get Started screen shows full-bleed.

const HERO_IMG =
  "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1000&h=1300&fit=crop&auto=format";

const PANEL_COPY: Record<Screen, { title: React.ReactNode; sub: string }> = {
  getStarted: {
    title: <>Where creators<br /><span style={{ color: "#00AEEF" }}>collaborate</span></>,
    sub: "Discover creators, send collab requests, and build your brand — together.",
  },
  login: {
    title: <>Welcome back to<br />the <span style={{ color: "#00AEEF" }}>collab floor</span></>,
    sub: "Your requests, matches and drafts are exactly where you left them.",
  },
  createAccount: {
    title: <>Start collabing<br /><span style={{ color: "#00AEEF" }}>this week</span></>,
    sub: "Set up your creator profile once — then let the right partners find you.",
  },
  forgotPassword: {
    title: <>Locked out?<br /><span style={{ color: "#00AEEF" }}>No problem</span></>,
    sub: "We'll email you a secure link so you can get straight back to creating.",
  },
  resetSent: {
    title: <>Check your inbox<br /><span style={{ color: "#00AEEF" }}>and jump back in</span></>,
    sub: "The reset link lands in seconds and stays valid for 15 minutes.",
  },
  resetPassword: {
    title: <>Pick a password<br /><span style={{ color: "#00AEEF" }}>worth keeping</span></>,
    sub: "Once it's updated the old password stops working everywhere.",
  },
  onboarding: {
    title: <>Let's tune your<br /><span style={{ color: "#00AEEF" }}>collab feed</span></>,
    sub: "A few quick picks and we'll surface the creators worth your time.",
  },
};

const PANEL_FEATURES = [
  { icon: Users, text: "Browse creators by niche, reach and Collab Score" },
  { icon: Zap, text: "Send a collab request in a single tap" },
  { icon: TrendingUp, text: "Track every partnership from one dashboard" },
];

function BrandPanel({ screen }: { screen: Screen }) {
  const copy = PANEL_COPY[screen];
  return (
    <div className="relative hidden lg:flex flex-col justify-between overflow-hidden p-10 xl:p-14">
      {/* Hero art */}
      <img src={HERO_IMG} alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover" />
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(150deg, rgba(0,9,30,0.72) 0%, rgba(0,20,60,0.82) 45%, rgba(0,8,24,0.95) 100%)" }}
      />
      {/* Brand glow */}
      <div
        className="absolute -top-32 -left-24 w-[520px] h-[520px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(0,174,239,0.28) 0%, transparent 70%)" }}
      />

      {/* Top row: logo + social proof */}
      <div className="relative flex items-center justify-between gap-4">
        <Logo size="xl" />
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full flex-shrink-0"
          style={{
            background: "rgba(0,174,239,0.55)",
            border: "1.5px solid rgba(56,189,248,0.9)",
            boxShadow: "0 0 16px rgba(0,174,239,0.7), 0 0 32px rgba(0,174,239,0.3)",
          }}
        >
          <div className="w-2 h-2 rounded-full bg-white animate-pulse" style={{ boxShadow: "0 0 6px #fff" }} />
          <span className="text-white text-[11px] font-extrabold tracking-wide">10K+ Creators</span>
        </div>
      </div>

      {/* Rotating headline */}
      <div className="relative max-w-[520px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={screen}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.28 }}
          >
            <h2 className="text-white font-extrabold text-[44px] xl:text-[54px] leading-[1.08] tracking-tight">
              {copy.title}
            </h2>
            <p className="text-white/60 text-[16px] xl:text-[17px] leading-relaxed mt-4">{copy.sub}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Feature list */}
      <div className="relative space-y-3.5 max-w-[460px]">
        {PANEL_FEATURES.map(({ icon: Icon, text }) => (
          <div key={text} className="flex items-center gap-3.5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(0,174,239,0.15)", border: "1px solid rgba(0,174,239,0.3)" }}
            >
              <Icon className="w-4 h-4" style={{ color: "#00AEEF" }} />
            </div>
            <span className="text-white/60 text-[14px] xl:text-[15px]">{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── GET STARTED ─────────────────────────────────────────────────────────────

function GetStarted({ onGetStarted, onLogin }: { onGetStarted: () => void; onLogin: () => void }) {
  return (
    <>
      {/* Mobile / tablet: full-bleed hero with the CTA docked to the bottom. */}
      <div className="flex flex-col h-full lg:hidden">
        <GetStartedHero onGetStarted={onGetStarted} onLogin={onLogin} />
      </div>

      {/* Desktop: the hero lives in the brand panel, so this column carries the copy + CTA. */}
      <div className="hidden lg:flex flex-col gap-8">
        <div>
          <h1 className="text-white font-extrabold text-[40px] leading-[1.1] tracking-tight">
            Get started
          </h1>
          <p className="text-white/50 text-[16px] leading-relaxed mt-3">
            Join thousands of creators finding their next collaboration on ConnextionZ.
          </p>
        </div>

        <div className="space-y-4">
          <PrimaryBtn onClick={onGetStarted}>
            Create Account <ArrowRight className="w-5 h-5" />
          </PrimaryBtn>
          <GhostBtn onClick={onLogin}>Log In</GhostBtn>
        </div>

        <p className="text-white/30 text-[13px] leading-relaxed">
          By continuing you agree to our{" "}
          <span style={{ color: "#00AEEF" }}>Terms of Service</span> and{" "}
          <span style={{ color: "#00AEEF" }}>Privacy Policy</span>.
        </p>
      </div>
    </>
  );
}

function GetStartedHero({ onGetStarted, onLogin }: { onGetStarted: () => void; onLogin: () => void }) {
  return (
    <div className="flex flex-col h-full">
      {/* Hero */}
      <div className="flex-1 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&h=800&fit=crop&auto=format"
          alt="Creator making content"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,8,30,0.25) 0%, rgba(0,20,60,0.55) 50%, #000d1f 100%)" }} />

        {/* Top logo */}
        <div className="absolute top-14 left-6">
          <Logo />
        </div>

        {/* Badge */}
        <div className="absolute top-14 right-6">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: "rgba(0,174,239,0.55)", border: "1.5px solid rgba(56,189,248,0.9)", boxShadow: "0 0 16px rgba(0,174,239,0.7), 0 0 32px rgba(0,174,239,0.3)" }}>
            <div className="w-2 h-2 rounded-full bg-white animate-pulse" style={{ boxShadow: "0 0 6px #fff" }} />
            <span className="text-white text-[11px] font-extrabold tracking-wide">10K+ Creators</span>
          </div>
        </div>

        {/* Hero copy */}
        <div className="absolute bottom-8 left-6 right-6">
          <h1 className="text-white font-extrabold text-[36px] leading-tight mb-2">
            Where creators<br />
            <span style={{ color: "#00AEEF" }}>collaborate</span>
          </h1>
          <p className="text-white/60 text-[15px] leading-relaxed">
            Discover creators, send collab requests, and build your brand — together.
          </p>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="px-6 pb-10 pt-6 space-y-4" style={{ background: "linear-gradient(180deg, #000d1f 0%, #000a18 100%)" }}>
        <PrimaryBtn onClick={onGetStarted}>
          Get Started <ArrowRight className="w-5 h-5" />
        </PrimaryBtn>
        <div className="text-center">
          <span className="text-white/40 text-[14px]">Already have an account? </span>
          <button onClick={onLogin} className="font-bold text-[14px]" style={{ color: "#00AEEF" }}>Log In</button>
        </div>
      </div>
    </div>
  );
}

// ─── LOGIN ───────────────────────────────────────────────────────────────────

function Login({
  onLogin, onCreate, onForgot, onBack,
}: { onLogin: (account: Account) => void; onCreate: () => void; onForgot: () => void; onBack: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  /** Which provider's chooser is open, and which one is mid-sign-in. */
  const [providerSheet, setProviderSheet] = useState<Provider | null>(null);
  const [providerBusy, setProviderBusy] = useState<Provider | null>(null);

  const valid = isValidEmail(email) && password.length >= 6;

  const handleLogin = async () => {
    const errs: typeof errors = {};
    if (!isValidEmail(email)) errs.email = "Enter a valid email address";
    if (password.length < 6) errs.password = "Password must be at least 6 characters";
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    setErrors({});
    const result = await signIn(email, password);
    setLoading(false);

    // Only authenticate when the credentials actually match.
    if (!result.ok) { setErrors({ general: result.error }); return; }
    onLogin(result.value);
  };

  /** Clear the "incorrect credentials" banner as soon as the user edits either field. */
  const clearGeneral = () => setErrors((e) => (e.general ? { ...e, general: undefined } : e));

  /** Step 2 of provider sign-in: the chooser resolved to an identity. */
  const handleProviderPick = async (identity: ProviderIdentity) => {
    if (!providerSheet) return;
    const provider = providerSheet;
    setProviderSheet(null);
    setProviderBusy(provider);
    setErrors({});
    const result = await signInWithProvider(provider, identity);
    setProviderBusy(null);
    if (!result.ok) { setErrors({ general: result.error }); return; }
    onLogin(result.value);
  };

  return (
    <div className={`${SCREEN} overflow-y-auto lg:overflow-visible`}>
      {/* Header — the logo is redundant next to the desktop brand panel. */}
      <div className={`flex items-center justify-between px-6 ${TOP_PAD} pb-6 lg:pb-8 lg:px-0`}>
        <button onClick={onBack} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "rgba(0,60,130,0.35)", border: "1px solid rgba(0,174,239,0.15)" }}>
          <ArrowLeft className="w-4 h-4 text-white" />
        </button>
        <span className="lg:hidden"><Logo size="sm" /></span>
        <div className="w-9" />
      </div>

      <div className={`${GUTTER} flex-1 space-y-6 pb-10 lg:pb-0`}>
        <div>
          <h1 className={H1}>Welcome back 👋</h1>
          <p className={`${SUB} mt-1`}>Log in to continue creating</p>
        </div>

        {/* Error banner */}
        <AnimatePresence>
          {errors.general && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl"
              style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)" }}>
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span className="text-red-400 text-[13px]">{errors.general}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-4">
          <Input label="Email" type="email" value={email} onChange={(v) => { setEmail(v); clearGeneral(); }} placeholder="you@example.com"
            icon={<Mail className="w-4 h-4" />} error={errors.email} autoFocus />
          <Input label="Password" type={showPw ? "text" : "password"} value={password} onChange={(v) => { setPassword(v); clearGeneral(); }}
            placeholder="••••••••" icon={<Lock className="w-4 h-4" />} error={errors.password}
            rightEl={
              <button onClick={() => setShowPw((p) => !p)} className="text-white/40 hover:text-white/70 transition-colors">
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            } />
        </div>

        {/* Remember + Forgot */}
        <div className="flex items-center justify-between">
          <Checkbox checked={remember} onChange={setRemember}>Remember me</Checkbox>
          <button onClick={onForgot} className="text-[13px] font-semibold" style={{ color: "#00AEEF" }}>Forgot password?</button>
        </div>

        <PrimaryBtn onClick={handleLogin} disabled={!valid} loading={loading}>
          Log In <ArrowRight className="w-5 h-5" />
        </PrimaryBtn>

        <Divider />

        <div className="flex gap-3">
          <SocialBtn icon={<GoogleMark />} label="Google"
            busy={providerBusy === "google"} disabled={!!providerBusy || loading}
            onClick={() => { setErrors({}); setProviderSheet("google"); }} />
          <SocialBtn icon={<AppleMark />} label="Apple"
            busy={providerBusy === "apple"} disabled={!!providerBusy || loading}
            onClick={() => { setErrors({}); setProviderSheet("apple"); }} />
        </div>

        {/* Prototype helper — remove once a real auth backend is wired up. */}
        <div className="rounded-2xl px-4 py-3 flex items-start gap-3"
          style={{ background: "rgba(0,40,100,0.35)", border: "1px dashed rgba(0,174,239,0.3)" }}>
          <Info className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#00AEEF" }} />
          <div className="text-[12px] leading-relaxed">
            <span className="text-white/50">Demo account — </span>
            <span className="text-white/80 font-semibold break-all">{DEMO_ACCOUNT.email}</span>
            <span className="text-white/50"> / </span>
            <span className="text-white/80 font-semibold">{DEMO_ACCOUNT.password}</span>
          </div>
        </div>

        <div className="text-center pb-4">
          <span className="text-white/40 text-[14px]">Don't have an account? </span>
          <button onClick={onCreate} className="font-bold text-[14px]" style={{ color: "#00AEEF" }}>Create Account</button>
        </div>
      </div>

      <AnimatePresence>
        {providerSheet && (
          <ProviderSheet key="provider" provider={providerSheet}
            onPick={handleProviderPick} onCancel={() => setProviderSheet(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── CREATE ACCOUNT ──────────────────────────────────────────────────────────

function CreateAccount({ onCreated, onLogin, onBack }: { onCreated: (account: Account) => void; onLogin: () => void; onBack: () => void }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [terms, setTerms] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const valid = firstName && lastName && isValidEmail(email) && password.length >= 8 && confirmPw === password && terms;

  const handleCreate = async () => {
    const errs: Record<string, string> = {};
    if (!firstName.trim()) errs.firstName = "First name is required";
    if (!lastName.trim()) errs.lastName = "Last name is required";
    if (!isValidEmail(email)) errs.email = "Enter a valid email address";
    if (password.length < 8) errs.password = "Password must be at least 8 characters";
    if (confirmPw !== password) errs.confirmPw = "Passwords do not match";
    if (!terms) errs.terms = "You must accept the terms to continue";
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    setErrors({});
    const result = await register({ firstName, lastName, email, password });
    setLoading(false);

    // Surface duplicate-email rejections instead of silently continuing.
    if (!result.ok) { setErrors({ general: result.error }); return; }
    onCreated(result.value);
  };

  const pwStrength = password.length === 0 ? 0 : password.length < 8 ? 1 : password.length < 12 ? 2 : 3;
  const strengthColor = ["transparent", "#ef4444", "#f59e0b", "#22c55e"][pwStrength];
  const strengthLabel = ["", "Weak", "Good", "Strong"][pwStrength];

  return (
    <div className={`${SCREEN} overflow-y-auto lg:overflow-visible`}>
      <div className={`flex items-center justify-between px-6 ${TOP_PAD} pb-6 lg:pb-8 lg:px-0`}>
        <button onClick={onBack} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "rgba(0,60,130,0.35)", border: "1px solid rgba(0,174,239,0.15)" }}>
          <ArrowLeft className="w-4 h-4 text-white" />
        </button>
        <span className="lg:hidden"><Logo size="sm" /></span>
        <div className="w-9" />
      </div>

      <div className={`${GUTTER} flex-1 space-y-5 pb-10 lg:pb-0`}>
        <div>
          <h1 className={H1}>Create account</h1>
          <p className={`${SUB} mt-1`}>Join thousands of creators</p>
        </div>

        <AnimatePresence>
          {errors.general && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl"
              style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)" }}>
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span className="text-red-400 text-[13px]">{errors.general}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-3">
          <div className="flex-1">
            <Input label="First Name" value={firstName} onChange={setFirstName} placeholder="Maya"
              icon={<User className="w-4 h-4" />} error={errors.firstName} />
          </div>
          <div className="flex-1">
            <Input label="Last Name" value={lastName} onChange={setLastName} placeholder="Chen"
              icon={<User className="w-4 h-4" />} error={errors.lastName} />
          </div>
        </div>

        <Input label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com"
          icon={<Mail className="w-4 h-4" />} error={errors.email} />

        <div className="space-y-2">
          <Input label="Password" type={showPw ? "text" : "password"} value={password} onChange={setPassword}
            placeholder="Min. 8 characters" icon={<Lock className="w-4 h-4" />} error={errors.password}
            rightEl={
              <button onClick={() => setShowPw((p) => !p)} className="text-white/40">
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            } />
          {/* Strength meter */}
          {password.length > 0 && (
            <div className="flex items-center gap-2 px-1">
              <div className="flex gap-1 flex-1">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex-1 h-1 rounded-full transition-all duration-300"
                    style={{ background: i <= pwStrength ? strengthColor : "rgba(255,255,255,0.1)" }} />
                ))}
              </div>
              <span className="text-[11px] font-semibold" style={{ color: strengthColor }}>{strengthLabel}</span>
            </div>
          )}
        </div>

        <Input label="Confirm Password" type={showConfirm ? "text" : "password"} value={confirmPw} onChange={setConfirmPw}
          placeholder="Repeat password" icon={<Lock className="w-4 h-4" />} error={errors.confirmPw}
          rightEl={
            <button onClick={() => setShowConfirm((p) => !p)} className="text-white/40">
              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          } />

        <div className="space-y-3 pt-1">
          <Checkbox checked={terms} onChange={setTerms}>
            I agree to the <span style={{ color: "#00AEEF" }}>Terms of Service</span> and <span style={{ color: "#00AEEF" }}>Privacy Policy</span>
          </Checkbox>
          <Checkbox checked={marketing} onChange={setMarketing}>
            Send me creator tips, collab opportunities, and product updates
          </Checkbox>
          {errors.terms && <p className="text-red-400 text-[12px] flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.terms}</p>}
        </div>

        <PrimaryBtn onClick={handleCreate} disabled={!valid} loading={loading}>
          Create Account <ArrowRight className="w-5 h-5" />
        </PrimaryBtn>

        <div className="text-center pb-4">
          <span className="text-white/40 text-[14px]">Already have an account? </span>
          <button onClick={onLogin} className="font-bold text-[14px]" style={{ color: "#00AEEF" }}>Log In</button>
        </div>
      </div>
    </div>
  );
}

// ─── FORGOT PASSWORD ─────────────────────────────────────────────────────────

function ForgotPassword({
  onSent, onBack,
}: { onSent: (email: string, token: string | null) => void; onBack: () => void }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const valid = isValidEmail(email);

  const handleSend = async () => {
    if (!valid) { setError("Enter a valid email address"); return; }
    setLoading(true);
    setError("");
    const result = await requestPasswordReset(email);
    setLoading(false);
    // Succeeds even for unknown addresses so the form cannot be used to
    // discover which emails are registered — the token is simply null.
    onSent(email, result.ok ? result.value.token : null);
  };

  return (
    <div className={SCREEN}>
      <div className={`flex items-center justify-between px-6 ${TOP_PAD} pb-6 lg:pb-8 lg:px-0`}>
        <button onClick={onBack} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "rgba(0,60,130,0.35)", border: "1px solid rgba(0,174,239,0.15)" }}>
          <ArrowLeft className="w-4 h-4 text-white" />
        </button>
        <span className="lg:hidden"><Logo size="sm" /></span>
        <div className="w-9" />
      </div>

      <div className={`${GUTTER} flex-1 space-y-6`}>
        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: "rgba(0,174,239,0.15)", border: "1px solid rgba(0,174,239,0.3)" }}>
          <Mail className="w-7 h-7" style={{ color: "#00AEEF" }} />
        </div>

        <div>
          <h1 className={H1}>Reset password</h1>
          <p className={`${SUB} mt-2 leading-relaxed`}>
            Enter your email and we'll send you a link to get back into your account.
          </p>
        </div>

        <Input label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com"
          icon={<Mail className="w-4 h-4" />} error={error} autoFocus />

        <PrimaryBtn onClick={handleSend} disabled={!valid} loading={loading}>
          Send Reset Link <ArrowRight className="w-5 h-5" />
        </PrimaryBtn>
      </div>
    </div>
  );
}

// ─── RESET SENT ──────────────────────────────────────────────────────────────

function ResetSent({
  email, token, onOpenLink, onResend, onBackToLogin,
}: {
  email: string; token: string | null;
  onOpenLink: () => void; onResend: (token: string | null) => void; onBackToLogin: () => void;
}) {
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

  const handleResend = async () => {
    setResending(true);
    const result = await requestPasswordReset(email);
    setResending(false);
    if (result.ok) onResend(result.value.token);
    setResent(true);
    setTimeout(() => setResent(false), 2500);
  };

  return (
    <div className={`${SCREEN} ${GUTTER}`}>
      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 lg:pt-2">
        {/* Success ring */}
        <motion.div
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 14, stiffness: 200, delay: 0.1 }}
          className="relative"
        >
          <div className="w-24 h-24 rounded-full flex items-center justify-center" style={{ background: "rgba(0,174,239,0.15)", border: "2px solid rgba(0,174,239,0.4)" }}>
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.35, type: "spring", damping: 14 }}>
              <Check className="w-10 h-10" style={{ color: "#00AEEF" }} strokeWidth={2.5} />
            </motion.div>
          </div>
          {/* Pulse ring */}
          <motion.div animate={{ scale: [1, 1.4], opacity: [0.4, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
            className="absolute inset-0 rounded-full" style={{ border: "2px solid rgba(0,174,239,0.4)" }} />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="space-y-3">
          <h1 className="text-white font-extrabold text-[30px] lg:text-[36px]">Check your email</h1>
          <p className="text-white/50 text-[15px] lg:text-[16px] leading-relaxed max-w-xs mx-auto">
            We've sent a password reset link. It'll expire in 15 minutes.
          </p>
        </motion.div>

        {/* Tips */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
          className="w-full rounded-2xl p-4 space-y-2.5" style={{ background: "rgba(0,40,100,0.35)", border: "1px solid rgba(0,174,239,0.18)" }}>
          {["Check your spam or junk folder", "The link expires in 15 minutes", "Request a new link if needed"].map((tip) => (
            <div key={tip} className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#00AEEF" }} />
              <span className="text-white/55 text-[13px]">{tip}</span>
            </div>
          ))}
        </motion.div>
      </div>

      <div className="pb-10 lg:pb-0 lg:pt-8 space-y-3">
        {/* No mail is actually sent in the prototype, so the link is surfaced
            here. A real backend emails it and this block disappears. */}
        {token ? (
          <div className="rounded-2xl px-4 py-3 space-y-2.5" style={{ background: "rgba(0,40,100,0.35)", border: "1px dashed rgba(0,174,239,0.3)" }}>
            <div className="flex items-start gap-3">
              <Info className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#00AEEF" }} />
              <p className="text-white/50 text-[12px] leading-relaxed">
                Prototype — no email is sent. Continue with your reset link below.
              </p>
            </div>
            <GhostBtn onClick={onOpenLink}>Open reset link</GhostBtn>
          </div>
        ) : (
          <p className="text-white/35 text-[12px] text-center leading-relaxed px-2">
            If an account exists for {email}, a reset link is on its way.
          </p>
        )}

        <PrimaryBtn onClick={onBackToLogin}>Back to Log In <ArrowRight className="w-5 h-5" /></PrimaryBtn>
        <div className="text-center">
          <button onClick={handleResend} disabled={resending} className="text-white/40 text-[14px] disabled:opacity-60">
            {resent ? (
              <span style={{ color: "#00AEEF" }} className="font-semibold">New link sent</span>
            ) : (
              <>Didn't receive it? <span style={{ color: "#00AEEF" }} className="font-semibold">{resending ? "Sending…" : "Resend"}</span></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── SET NEW PASSWORD ────────────────────────────────────────────────────────

function ResetPassword({
  token, onDone, onBack,
}: { token: string; onDone: () => void; onBack: () => void }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState<{ password?: string; confirm?: string; general?: string }>({});

  // Validate the link up front so an expired one is reported before the user
  // bothers typing a new password.
  const check = verifyResetToken(token);
  const linkError = check.ok ? null : check.error;

  const strength = password.length === 0 ? 0 : password.length < 8 ? 1 : password.length < 12 ? 2 : 3;
  const strengthColor = ["transparent", "#ef4444", "#f59e0b", "#22c55e"][strength];
  const strengthLabel = ["", "Weak", "Good", "Strong"][strength];
  const valid = password.length >= 8 && confirm === password;

  const handleReset = async () => {
    const errs: typeof errors = {};
    if (password.length < 8) errs.password = "Password must be at least 8 characters";
    if (confirm !== password) errs.confirm = "Passwords do not match";
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    setErrors({});
    const result = await resetPassword(token, password);
    setLoading(false);
    if (!result.ok) { setErrors({ general: result.error }); return; }
    setDone(true);
  };

  if (done) {
    return (
      <div className={`${SCREEN} ${GUTTER}`}>
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 lg:pt-2">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", damping: 14, stiffness: 200 }}
            className="w-24 h-24 rounded-full flex items-center justify-center"
            style={{ background: "rgba(34,197,94,0.15)", border: "2px solid rgba(34,197,94,0.4)" }}>
            <Check className="w-10 h-10 text-green-400" strokeWidth={2.5} />
          </motion.div>
          <div className="space-y-3">
            <h1 className="text-white font-extrabold text-[30px] lg:text-[36px]">Password updated</h1>
            <p className="text-white/50 text-[15px] lg:text-[16px] leading-relaxed max-w-xs mx-auto">
              Your old password no longer works. Log in with the new one.
            </p>
          </div>
        </div>
        <div className="pb-10 lg:pb-0 lg:pt-8">
          <PrimaryBtn onClick={onDone}>Back to Log In <ArrowRight className="w-5 h-5" /></PrimaryBtn>
        </div>
      </div>
    );
  }

  return (
    <div className={`${SCREEN} overflow-y-auto lg:overflow-visible`}>
      <div className={`flex items-center justify-between px-6 ${TOP_PAD} pb-6 lg:pb-8 lg:px-0`}>
        <button onClick={onBack} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "rgba(0,60,130,0.35)", border: "1px solid rgba(0,174,239,0.15)" }}>
          <ArrowLeft className="w-4 h-4 text-white" />
        </button>
        <span className="lg:hidden"><Logo size="sm" /></span>
        <div className="w-9" />
      </div>

      <div className={`${GUTTER} flex-1 space-y-6 pb-10 lg:pb-0`}>
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: "rgba(0,174,239,0.15)", border: "1px solid rgba(0,174,239,0.3)" }}>
          <Lock className="w-7 h-7" style={{ color: "#00AEEF" }} />
        </div>

        <div>
          <h1 className={H1}>Set a new password</h1>
          <p className={`${SUB} mt-2 leading-relaxed`}>
            {check.ok ? `Choose a new password for ${check.value.email}.` : "This link can no longer be used."}
          </p>
        </div>

        {(linkError || errors.general) && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl"
            style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)" }}>
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span className="text-red-400 text-[13px]">{linkError ?? errors.general}</span>
          </div>
        )}

        {linkError ? (
          <GhostBtn onClick={onBack}>Request a new link</GhostBtn>
        ) : (
          <>
            <div className="space-y-2">
              <Input label="New password" type={showPw ? "text" : "password"} value={password}
                onChange={(v) => { setPassword(v); setErrors({}); }}
                placeholder="Min. 8 characters" icon={<Lock className="w-4 h-4" />} error={errors.password}
                rightEl={
                  <button onClick={() => setShowPw((p) => !p)} className="text-white/40">
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                } />
              {password.length > 0 && (
                <div className="flex items-center gap-2 px-1">
                  <div className="flex gap-1 flex-1">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex-1 h-1 rounded-full transition-all duration-300"
                        style={{ background: i <= strength ? strengthColor : "rgba(255,255,255,0.1)" }} />
                    ))}
                  </div>
                  <span className="text-[11px] font-semibold" style={{ color: strengthColor }}>{strengthLabel}</span>
                </div>
              )}
            </div>

            <Input label="Confirm new password" type={showPw ? "text" : "password"} value={confirm}
              onChange={(v) => { setConfirm(v); setErrors({}); }}
              placeholder="Repeat password" icon={<Lock className="w-4 h-4" />} error={errors.confirm} />

            <PrimaryBtn onClick={handleReset} disabled={!valid} loading={loading}>
              Update Password <ArrowRight className="w-5 h-5" />
            </PrimaryBtn>
          </>
        )}
      </div>
    </div>
  );
}

// ─── ONBOARDING ──────────────────────────────────────────────────────────────

const CREATE_CATS = [
  { icon: Music, label: "Music" },
  { icon: Activity, label: "Fitness" },
  { icon: MapPin, label: "Travel" },
  { icon: Coffee, label: "Cooking" },
  { icon: Pen, label: "Art" },
  { icon: Cpu, label: "Tech" },
  { icon: Gamepad2, label: "Gaming" },
  { icon: Star, label: "Fashion" },
  { icon: TrendingUp, label: "Business" },
];

const COLLAB_TYPES_ONB = [
  { label: "Paid Collaboration", sub: "Get compensated for your time & reach", color: "#f59e0b", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.4)", icon: Briefcase },
  { label: "Free / Creative Collab", sub: "Create together purely for the content", color: "#22c55e", bg: "rgba(34,197,94,0.12)", border: "rgba(34,197,94,0.4)", icon: Users },
  { label: "Duet / Remix", sub: "Respond to or remix another creator's post", color: "#a78bfa", bg: "rgba(167,139,250,0.12)", border: "rgba(167,139,250,0.4)", icon: Music },
  { label: "Podcast / Interview", sub: "Feature on shows or host others on yours", color: "#f472b6", bg: "rgba(244,114,182,0.12)", border: "rgba(244,114,182,0.4)", icon: Mic },
  { label: "Brand Deal", sub: "Partner with brands for sponsored content", color: "#00AEEF", bg: "rgba(0,174,239,0.12)", border: "rgba(0,174,239,0.4)", icon: TrendingUp },
];

const AVATAR_COLORS = ["#a78bfa", "#22c55e", "#00AEEF", "#f59e0b", "#f472b6", "#ef4444"];
const RESPONSE_TIMES = ["< 1 hour", "< 4 hours", "< 24 hours"];

/** What onboarding collects. `null` when the user skipped it. */
export interface OnboardingSetup {
  categories: string[];
  collabTypes: string[];
  avatarColor: string;
  creatorName: string;
  openToCollab: boolean;
  responseTime: string;
}

function Onboarding({ onDone }: { onDone: (setup: OnboardingSetup | null) => void }) {
  const [step, setStep] = useState<OnbStep>(1);
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const [selectedCollabs, setSelectedCollabs] = useState<string[]>([]);
  const [avatarColor, setAvatarColor] = useState(AVATAR_COLORS[0]);
  const [creatorName, setCreatorName] = useState("");
  const [openToCollab, setOpenToCollab] = useState(true);
  const [responseTime, setResponseTime] = useState("< 4 hours");

  const toggleCat = (l: string) => setSelectedCats((p) => p.includes(l) ? p.filter((x) => x !== l) : [...p, l]);
  const toggleCollab = (l: string) => setSelectedCollabs((p) => p.includes(l) ? p.filter((x) => x !== l) : [...p, l]);

  const canContinue = step === 1 ? selectedCats.length > 0 : step === 2 ? selectedCollabs.length > 0 : !!creatorName.trim();

  /** Everything picked here seeds the profile and Settings, rather than being discarded. */
  const finish = () => onDone({
    categories: selectedCats,
    collabTypes: selectedCollabs,
    avatarColor,
    creatorName: creatorName.trim(),
    openToCollab,
    responseTime,
  });

  return (
    <div className={SCREEN}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-12 pb-4 lg:px-0 lg:pt-0">
        <span className="lg:hidden"><Logo size="sm" /></span>
        <button onClick={() => onDone(null)} className="text-white/40 text-[14px] font-semibold lg:ml-auto">Skip</button>
      </div>

      {/* Step dots */}
      <div className="flex flex-col items-center gap-1 mb-5">
        <StepDots step={step} total={3} />
        <span className="text-white/35 text-[12px]">Step {step} of 3</span>
      </div>

      {/* Step content */}
      <div className={`flex-1 overflow-y-auto lg:overflow-visible ${GUTTER}`}>
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.22 }}>
              <h1 className="text-white font-extrabold text-[32px] lg:text-[36px] leading-tight mb-1">What do you create?</h1>
              <p className="text-white/45 text-[14px] mb-6">Select all that apply — your feed is personalized around your picks</p>
              <div className="grid grid-cols-3 gap-3 pb-6">
                {CREATE_CATS.map(({ icon: Icon, label }) => {
                  const sel = selectedCats.includes(label);
                  return (
                    <motion.button key={label} whileTap={{ scale: 0.94 }} onClick={() => toggleCat(label)}
                      className="relative flex flex-col items-center gap-3 py-5 rounded-2xl"
                      style={{ background: sel ? "rgba(167,139,250,0.18)" : "rgba(0,40,100,0.35)", border: sel ? "1.5px solid #a78bfa" : "1.5px solid rgba(0,174,239,0.15)" }}>
                      {sel && (
                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "#a78bfa" }}>
                          <Check className="w-3 h-3 text-white" strokeWidth={3} />
                        </div>
                      )}
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: sel ? "rgba(167,139,250,0.2)" : "rgba(0,60,140,0.4)" }}>
                        <Icon className="w-5 h-5" style={{ color: sel ? "#a78bfa" : "rgba(255,255,255,0.45)" }} />
                      </div>
                      <span className="text-[13px] font-semibold" style={{ color: sel ? "#fff" : "rgba(255,255,255,0.6)" }}>{label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.22 }}>
              <h1 className="text-white font-extrabold text-[32px] lg:text-[36px] leading-tight mb-1">How do you collab?</h1>
              <p className="text-white/45 text-[14px] mb-6">Pick the types you're open to — creators will know how to approach you</p>
              <div className="space-y-3 pb-6">
                {COLLAB_TYPES_ONB.map(({ label, sub, color, bg, border, icon: Icon }) => {
                  const sel = selectedCollabs.includes(label);
                  return (
                    <motion.button key={label} whileTap={{ scale: 0.98 }} onClick={() => toggleCollab(label)}
                      className="w-full flex items-center gap-4 p-4 rounded-2xl text-left"
                      style={{ background: sel ? bg : "rgba(0,40,100,0.35)", border: sel ? `1.5px solid ${border}` : "1.5px solid rgba(0,174,239,0.12)" }}>
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: sel ? bg : "rgba(255,255,255,0.07)" }}>
                        <Icon className="w-5 h-5" style={{ color: sel ? color : "rgba(255,255,255,0.4)" }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-bold text-[15px]">{label}</p>
                        <p className="text-white/45 text-[12px] mt-0.5">{sub}</p>
                      </div>
                      {sel && (
                        <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: color }}>
                          <Check className="w-4 h-4 text-white" strokeWidth={2.5} />
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="s3" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.22 }}>
              <h1 className="text-white font-extrabold text-[30px] lg:text-[36px] leading-tight mb-1">Set up your presence</h1>
              <p className="text-white/45 text-[14px] mb-6">This is how other creators will find and recognize you</p>

              {/* Avatar */}
              <div className="flex items-center gap-5 mb-6">
                <div className="w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl font-bold flex-shrink-0"
                  style={{ background: avatarColor }}>
                  {creatorName ? creatorName[0].toUpperCase() : "?"}
                </div>
                <div className="flex-1">
                  <p className="text-white/50 text-[12px] font-semibold uppercase tracking-widest mb-3">Avatar color</p>
                  <div className="flex flex-wrap gap-2">
                    {AVATAR_COLORS.map((c) => (
                      <button key={c} onClick={() => setAvatarColor(c)}
                        className="w-9 h-9 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                        style={{ background: c, border: avatarColor === c ? "2.5px solid white" : "2.5px solid transparent" }}>
                        {avatarColor === c && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4 pb-6">
                <Input label="Your creator name" value={creatorName} onChange={setCreatorName}
                  placeholder="e.g. Maya Chen" icon={<User className="w-4 h-4" />} />

                {/* Open to collabs toggle */}
                <div className="flex items-center gap-4 p-4 rounded-2xl" style={{ background: "rgba(0,40,100,0.35)", border: "1px solid rgba(0,174,239,0.18)" }}>
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(0,174,239,0.15)" }}>
                    <Users className="w-5 h-5" style={{ color: "#00AEEF" }} />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-bold text-[14px]">Open to Collaborations</p>
                    <p className="text-white/40 text-[12px]">Creators can send you collab requests</p>
                  </div>
                  <button onClick={() => setOpenToCollab((p) => !p)}
                    className="w-12 h-6 rounded-full transition-colors relative flex-shrink-0"
                    style={{ background: openToCollab ? "#00AEEF" : "rgba(255,255,255,0.15)" }}>
                    <motion.div animate={{ x: openToCollab ? 24 : 2 }} transition={{ type: "spring", damping: 20 }}
                      className="absolute top-1 w-4 h-4 rounded-full bg-white" style={{ left: 0 }} />
                  </button>
                </div>

                {/* Response time */}
                <div>
                  <p className="text-white/50 text-[12px] font-semibold uppercase tracking-widest mb-3 px-1">Typical response time</p>
                  <div className="flex gap-2">
                    {RESPONSE_TIMES.map((t) => (
                      <button key={t} onClick={() => setResponseTime(t)}
                        className="flex-1 py-2.5 rounded-full text-[13px] font-semibold transition-all"
                        style={{ background: responseTime === t ? "#00AEEF" : "rgba(0,50,120,0.35)", color: responseTime === t ? "#000" : "rgba(255,255,255,0.5)", boxShadow: responseTime === t ? "0 4px 14px rgba(0,174,239,0.35)" : "none" }}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className={`${GUTTER} pb-10 pt-4 lg:pb-0 lg:pt-6 flex items-center gap-4`} style={{ borderTop: "1px solid rgba(0,174,239,0.1)" }}>
        {step > 1 && (
          <button onClick={() => setStep((s) => (s - 1) as OnbStep)}
            className="flex items-center gap-2 text-white/50 font-semibold text-[15px]">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        )}
        <div className="flex-1">
          {step < 3
            ? <PrimaryBtn onClick={() => canContinue && setStep((s) => (s + 1) as OnbStep)} disabled={!canContinue}>
                Continue <ArrowRight className="w-5 h-5" />
              </PrimaryBtn>
            : <PrimaryBtn onClick={finish} disabled={!canContinue}>
                Start Exploring <Zap className="w-5 h-5" />
              </PrimaryBtn>
          }
        </div>
      </div>
    </div>
  );
}

// ─── AUTH FLOW (ROOT) ─────────────────────────────────────────────────────────

export function AuthFlow({ onAuthenticated }: { onAuthenticated: (account: Account) => void }) {
  const [screen, setScreen] = useState<Screen>("getStarted");
  /** Carried between the forgot-password, reset-sent and set-password screens. */
  const [resetEmail, setResetEmail] = useState("");
  const [resetToken, setResetToken] = useState<string | null>(null);
  /** The account being onboarded — onboarding needs somewhere to write its picks. */
  const [pending, setPending] = useState<Account | null>(null);

  /** Opens the session and hands the account to the app. */
  const enter = useCallback((account: Account) => {
    startSession(account.email);
    onAuthenticated(account);
  }, [onAuthenticated]);

  /**
   * Persists what onboarding collected before entering the app, so Settings
   * opens already reflecting the user's picks rather than defaults.
   */
  const completeOnboarding = useCallback(async (setup: OnboardingSetup | null) => {
    const account = pending;
    if (!account) return;
    if (!setup) { enter(account); return; }

    const prefs = loadPreferences(account.email);
    savePreferences(account.email, {
      ...prefs,
      categories: setup.categories,
      responseTime: setup.responseTime,
      collab: { ...prefs.collab, types: setup.collabTypes, openToCollab: setup.openToCollab },
    });

    const result = await updateProfile(account.email, {
      displayName: setup.creatorName || profileOf(account).displayName,
      avatarColor: setup.avatarColor,
    });
    enter(result.ok ? result.value : account);
  }, [pending, enter]);

  const slide = { initial: { opacity: 0, x: 40 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -40 } };
  const slideUp = { initial: { opacity: 0, y: 40 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 20 } };
  const trans = { duration: 0.22 };

  // < lg: a single full-bleed column (unchanged mobile/tablet behaviour).
  // ≥ lg: brand panel + content column, so the form keeps a readable measure
  //       while the layout still fills the full desktop width.
  const pane = "h-full lg:h-auto";

  return (
    <div className="h-full w-full overflow-hidden" style={{ background: "linear-gradient(160deg, #00091a 0%, #000d24 40%, #000814 100%)", fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
      <div className="h-full w-full lg:grid lg:grid-cols-2 2xl:grid-cols-[1.2fr_1fr]">
        <BrandPanel screen={screen} />

        <div className="relative h-full overflow-hidden lg:border-l lg:border-[rgba(0,174,239,0.14)]">
          {/* Soft accent so the form column has the same depth as the brand panel. */}
          <div
            className="hidden lg:block absolute -right-40 top-1/2 -translate-y-1/2 w-[560px] h-[560px] rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(0,174,239,0.10) 0%, transparent 70%)" }}
          />
          {/* Scroll container is a plain block: centring lives on the inner wrapper via
              min-h-full, so a form taller than the viewport stays fully reachable. */}
          <div className="relative h-full lg:overflow-y-auto">
            <div className="h-full lg:h-auto lg:min-h-full lg:flex lg:items-center lg:justify-center lg:px-10 xl:px-16 lg:py-14">
              <div className="h-full w-full lg:h-auto lg:max-w-[460px]">
                <AnimatePresence mode="wait">
                  {screen === "getStarted" && (
                    <motion.div key="gs" {...slideUp} transition={trans} className={pane}>
                      <GetStarted onGetStarted={() => setScreen("createAccount")} onLogin={() => setScreen("login")} />
                    </motion.div>
                  )}
                  {screen === "login" && (
                    <motion.div key="li" {...slide} transition={trans} className={pane}>
                      <Login onLogin={enter} onCreate={() => setScreen("createAccount")} onForgot={() => setScreen("forgotPassword")} onBack={() => setScreen("getStarted")} />
                    </motion.div>
                  )}
                  {screen === "createAccount" && (
                    <motion.div key="ca" {...slide} transition={trans} className={pane}>
                      <CreateAccount onCreated={(account) => { setPending(account); setScreen("onboarding"); }}
                        onLogin={() => setScreen("login")} onBack={() => setScreen("getStarted")} />
                    </motion.div>
                  )}
                  {screen === "forgotPassword" && (
                    <motion.div key="fp" {...slide} transition={trans} className={pane}>
                      <ForgotPassword
                        onSent={(email, token) => { setResetEmail(email); setResetToken(token); setScreen("resetSent"); }}
                        onBack={() => setScreen("login")} />
                    </motion.div>
                  )}
                  {screen === "resetSent" && (
                    <motion.div key="rs" {...slideUp} transition={trans} className={pane}>
                      <ResetSent
                        email={resetEmail}
                        token={resetToken}
                        onOpenLink={() => setScreen("resetPassword")}
                        onResend={(token) => setResetToken(token)}
                        onBackToLogin={() => setScreen("login")} />
                    </motion.div>
                  )}
                  {screen === "resetPassword" && (
                    <motion.div key="rp" {...slide} transition={trans} className={pane}>
                      <ResetPassword
                        token={resetToken ?? ""}
                        onDone={() => setScreen("login")}
                        onBack={() => setScreen("forgotPassword")} />
                    </motion.div>
                  )}
                  {screen === "onboarding" && (
                    <motion.div key="ob" {...slideUp} transition={trans} className={pane}>
                      <Onboarding onDone={completeOnboarding} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
