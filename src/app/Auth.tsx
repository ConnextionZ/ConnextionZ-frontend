import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Eye, EyeOff, Mail, Lock, User, ArrowRight, ArrowLeft,
  Check, Loader2, AlertCircle, X, ChevronRight, Zap,
  Music, Activity, MapPin, Coffee, Pen, Cpu, Gamepad2,
  Star, TrendingUp, Mic, Users, Briefcase, Clock,
} from "lucide-react";

// ─── TYPES ───────────────────────────────────────────────────────────────────

type Screen =
  | "getStarted"
  | "login"
  | "createAccount"
  | "forgotPassword"
  | "resetSent"
  | "onboarding";

type OnbStep = 1 | 2 | 3;

// ─── LOGO ────────────────────────────────────────────────────────────────────

function Logo({ size = "lg" }: { size?: "sm" | "lg" }) {
  const cls = size === "lg" ? "text-3xl" : "text-xl";
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
          className="w-full rounded-2xl text-white text-[15px] outline-none transition-all placeholder:text-white/25"
          style={{
            background: "rgba(0,80,160,0.12)",
            border: error ? "1px solid rgba(239,68,68,0.6)" : "1px solid rgba(0,174,239,0.18)",
            padding: `14px ${rightEl ? "48px" : "16px"} 14px ${icon ? "44px" : "16px"}`,
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
      className={`${full ? "w-full" : ""} py-4 rounded-full font-bold text-[16px] text-black flex items-center justify-center gap-2 transition-opacity`}
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
      className="w-full py-3.5 rounded-full font-semibold text-[15px] text-white/70 flex items-center justify-center gap-2"
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

function SocialBtn({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick?: () => void }) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="flex-1 py-3.5 rounded-2xl font-semibold text-[14px] text-white flex items-center justify-center gap-2"
      style={{ background: "rgba(0,60,130,0.25)", border: "1px solid rgba(0,174,239,0.2)" }}
    >
      {icon} {label}
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

// ─── GET STARTED ─────────────────────────────────────────────────────────────

function GetStarted({ onGetStarted, onLogin }: { onGetStarted: () => void; onLogin: () => void }) {
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
            <span style={{ color: "#00AEEF" }}>collaberate</span>
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
}: { onLogin: () => void; onCreate: () => void; onForgot: () => void; onBack: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});

  const valid = isValidEmail(email) && password.length >= 6;

  const handleLogin = async () => {
    const errs: typeof errors = {};
    if (!isValidEmail(email)) errs.email = "Enter a valid email address";
    if (password.length < 6) errs.password = "Password must be at least 6 characters";
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    setErrors({});
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    onLogin();
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-14 pb-6">
        <button onClick={onBack} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "rgba(0,60,130,0.35)", border: "1px solid rgba(0,174,239,0.15)" }}>
          <ArrowLeft className="w-4 h-4 text-white" />
        </button>
        <Logo size="sm" />
        <div className="w-9" />
      </div>

      <div className="px-6 flex-1 space-y-6 pb-10">
        <div>
          <h1 className="text-white font-extrabold text-[30px] leading-tight">Welcome back 👋</h1>
          <p className="text-white/45 text-[15px] mt-1">Log in to continue creating</p>
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
          <Input label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com"
            icon={<Mail className="w-4 h-4" />} error={errors.email} autoFocus />
          <Input label="Password" type={showPw ? "text" : "password"} value={password} onChange={setPassword}
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
          <SocialBtn icon={<span className="font-bold text-[15px]">G</span>} label="Google" onClick={onLogin} />
          <SocialBtn icon={<span className="font-bold text-[15px]"></span>} label="Apple" onClick={onLogin} />
        </div>

        <div className="text-center pb-4">
          <span className="text-white/40 text-[14px]">Don't have an account? </span>
          <button onClick={onCreate} className="font-bold text-[14px]" style={{ color: "#00AEEF" }}>Create Account</button>
        </div>
      </div>
    </div>
  );
}

// ─── CREATE ACCOUNT ──────────────────────────────────────────────────────────

function CreateAccount({ onCreated, onLogin, onBack }: { onCreated: () => void; onLogin: () => void; onBack: () => void }) {
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
    await new Promise((r) => setTimeout(r, 1400));
    setLoading(false);
    onCreated();
  };

  const pwStrength = password.length === 0 ? 0 : password.length < 8 ? 1 : password.length < 12 ? 2 : 3;
  const strengthColor = ["transparent", "#ef4444", "#f59e0b", "#22c55e"][pwStrength];
  const strengthLabel = ["", "Weak", "Good", "Strong"][pwStrength];

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="flex items-center justify-between px-6 pt-14 pb-6">
        <button onClick={onBack} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "rgba(0,60,130,0.35)", border: "1px solid rgba(0,174,239,0.15)" }}>
          <ArrowLeft className="w-4 h-4 text-white" />
        </button>
        <Logo size="sm" />
        <div className="w-9" />
      </div>

      <div className="px-6 flex-1 space-y-5 pb-10">
        <div>
          <h1 className="text-white font-extrabold text-[30px] leading-tight">Create account</h1>
          <p className="text-white/45 text-[15px] mt-1">Join thousands of creators</p>
        </div>

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

function ForgotPassword({ onSent, onBack }: { onSent: () => void; onBack: () => void }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const valid = isValidEmail(email);

  const handleSend = async () => {
    if (!valid) { setError("Enter a valid email address"); return; }
    setLoading(true);
    setError("");
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    onSent();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-6 pt-14 pb-6">
        <button onClick={onBack} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "rgba(0,60,130,0.35)", border: "1px solid rgba(0,174,239,0.15)" }}>
          <ArrowLeft className="w-4 h-4 text-white" />
        </button>
        <Logo size="sm" />
        <div className="w-9" />
      </div>

      <div className="px-6 flex-1 space-y-6">
        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: "rgba(0,174,239,0.15)", border: "1px solid rgba(0,174,239,0.3)" }}>
          <Mail className="w-7 h-7" style={{ color: "#00AEEF" }} />
        </div>

        <div>
          <h1 className="text-white font-extrabold text-[30px] leading-tight">Reset password</h1>
          <p className="text-white/45 text-[15px] mt-2 leading-relaxed">
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

function ResetSent({ onBackToLogin }: { onBackToLogin: () => void }) {
  return (
    <div className="flex flex-col h-full px-6">
      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
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
          <h1 className="text-white font-extrabold text-[30px]">Check your email</h1>
          <p className="text-white/50 text-[15px] leading-relaxed max-w-xs mx-auto">
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

      <div className="pb-10 space-y-3">
        <PrimaryBtn onClick={onBackToLogin}>Back to Log In <ArrowRight className="w-5 h-5" /></PrimaryBtn>
        <div className="text-center">
          <button className="text-white/40 text-[14px]">Didn't receive it? <span style={{ color: "#00AEEF" }} className="font-semibold">Resend</span></button>
        </div>
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

function Onboarding({ onDone }: { onDone: () => void }) {
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

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-12 pb-4">
        <Logo size="sm" />
        <button onClick={onDone} className="text-white/40 text-[14px] font-semibold">Skip</button>
      </div>

      {/* Step dots */}
      <div className="flex flex-col items-center gap-1 mb-5">
        <StepDots step={step} total={3} />
        <span className="text-white/35 text-[12px]">Step {step} of 3</span>
      </div>

      {/* Step content */}
      <div className="flex-1 overflow-y-auto px-6">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.22 }}>
              <h1 className="text-white font-extrabold text-[32px] leading-tight mb-1">What do you create?</h1>
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
              <h1 className="text-white font-extrabold text-[32px] leading-tight mb-1">How do you collab?</h1>
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
              <h1 className="text-white font-extrabold text-[30px] leading-tight mb-1">Set up your presence</h1>
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
      <div className="px-6 pb-10 pt-4 flex items-center gap-4" style={{ borderTop: "1px solid rgba(0,174,239,0.1)" }}>
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
            : <PrimaryBtn onClick={onDone} disabled={!canContinue}>
                Start Exploring <Zap className="w-5 h-5" />
              </PrimaryBtn>
          }
        </div>
      </div>
    </div>
  );
}

// ─── DELETE PROFILE (Settings screen component) ───────────────────────────────

export function DeleteProfileModal({ onDeleted, onCancel }: { onDeleted: () => void; onCancel: () => void }) {
  const [confirm, setConfirm] = useState(false);
  const [typed, setTyped] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1400));
    setLoading(false);
    onDeleted();
  };

  if (!confirm) {
    return (
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
        className="absolute inset-x-4 bottom-4 top-4 rounded-3xl z-50 flex flex-col overflow-hidden"
        style={{ background: "linear-gradient(160deg,#00091e,#000d28)", border: "1px solid rgba(0,174,239,0.2)", boxShadow: "0 -20px 60px rgba(0,0,0,0.8)" }}>
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0"><div className="w-9 h-1 rounded-full bg-white/20" /></div>

        <div className="flex-1 overflow-y-auto px-6 pb-8 pt-4 space-y-6">
          {/* Warning icon */}
          <div className="flex flex-col items-center text-center space-y-4 pt-4">
            <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: "rgba(239,68,68,0.12)", border: "2px solid rgba(239,68,68,0.3)" }}>
              <AlertCircle className="w-9 h-9 text-red-400" />
            </div>
            <div>
              <h2 className="text-white font-extrabold text-[24px]">Delete Profile?</h2>
              <p className="text-white/50 text-[14px] mt-2 leading-relaxed">This action is permanent and cannot be undone.</p>
            </div>
          </div>

          {/* What gets deleted */}
          <div className="rounded-2xl p-4 space-y-3" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
            <p className="text-red-400 text-[12px] font-bold uppercase tracking-widest">What will be deleted</p>
            {["Your profile and creator identity", "All collaboration history", "Messages and conversations", "Saved sounds and content", "Collab Score and reviews"].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <X className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                <span className="text-white/65 text-[13px]">{item}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-3 pt-2">
            <motion.button whileTap={{ scale: 0.97 }} onClick={onCancel}
              className="flex-1 py-4 rounded-full font-bold text-[15px] text-white/80"
              style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}>
              Cancel
            </motion.button>
            <motion.button whileTap={{ scale: 0.97 }} onClick={() => setConfirm(true)}
              className="flex-1 py-4 rounded-full font-bold text-[15px] text-white"
              style={{ background: "rgba(239,68,68,0.2)", border: "1px solid rgba(239,68,68,0.4)" }}>
              Continue
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  }

  // Confirmation step
  return (
    <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
      className="absolute inset-x-4 bottom-4 rounded-3xl z-50 overflow-hidden"
      style={{ background: "#16161a", border: "1px solid rgba(239,68,68,0.3)", boxShadow: "0 -20px 60px rgba(0,0,0,0.8)" }}>
      <div className="px-6 pt-6 pb-8 space-y-5">
        <div className="text-center space-y-2">
          <h2 className="text-white font-extrabold text-[22px]">Final confirmation</h2>
          <p className="text-white/45 text-[13px]">Type <span className="font-bold text-red-400">DELETE</span> to confirm</p>
        </div>
        <input value={typed} onChange={(e) => setTyped(e.target.value)} placeholder="Type DELETE here"
          className="w-full rounded-2xl text-white text-[15px] outline-none placeholder:text-white/20 px-4 py-3.5 text-center"
          style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)" }} />
        <div className="flex gap-3">
          <motion.button whileTap={{ scale: 0.97 }} onClick={() => setConfirm(false)}
            className="flex-1 py-3.5 rounded-full font-bold text-[14px] text-white/70"
            style={{ background: "rgba(0,60,130,0.35)", border: "1px solid rgba(0,174,239,0.15)" }}>
            Back
          </motion.button>
          <motion.button whileTap={{ scale: 0.97 }} onClick={handleDelete} disabled={typed !== "DELETE" || loading}
            className="flex-1 py-3.5 rounded-full font-bold text-[14px] text-white flex items-center justify-center gap-2"
            style={{ background: typed === "DELETE" ? "rgba(239,68,68,0.85)" : "rgba(239,68,68,0.15)", opacity: loading ? 0.8 : 1 }}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete Profile"}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── SETTINGS SCREEN ─────────────────────────────────────────────────────────

export function SettingsScreen({
  onLogout, onDeleteProfile, isDark = true, onToggleTheme,
}: {
  onLogout: () => void; onDeleteProfile: () => void;
  isDark?: boolean; onToggleTheme?: () => void;
}) {
  const bg = isDark
    ? "linear-gradient(160deg,#00091e 0%,#000d28 100%)"
    : "linear-gradient(160deg,#f2f5fb 0%,#eaf1fc 100%)";
  const heading = isDark ? "#fff" : "#0a0e1a";
  const cardBg = isDark ? "rgba(0,40,100,0.35)" : "rgba(0,130,240,0.07)";
  const cardBorder = isDark ? "1px solid rgba(0,174,239,0.18)" : "1px solid rgba(0,174,239,0.15)";
  const sectionLbl = isDark ? "rgba(255,255,255,0.35)" : "rgba(10,14,26,0.4)";
  const groupBg = isDark ? "rgba(0,30,80,0.4)" : "#ffffff";
  const groupBorder = isDark ? "1px solid rgba(0,174,239,0.15)" : "1px solid rgba(0,0,0,0.08)";
  const rowText = isDark ? "#fff" : "#0a0e1a";
  const rowDivider = isDark ? "rgba(0,174,239,0.1)" : "rgba(0,0,0,0.06)";
  const chevronColor = isDark ? "rgba(255,255,255,0.25)" : "rgba(10,14,26,0.25)";
  const subText = isDark ? "rgba(255,255,255,0.4)" : "rgba(10,14,26,0.4)";
  const versionColor = isDark ? "rgba(255,255,255,0.2)" : "rgba(10,14,26,0.25)";

  return (
    <div className="absolute inset-0 z-20 overflow-y-auto" style={{ background: bg }}>
      <div className="px-5 pt-14 pb-10">
        <h1 className="font-extrabold text-[26px] mb-6" style={{ color: heading }}>Settings</h1>

        {/* Profile card */}
        <div className="flex items-center gap-4 p-4 rounded-2xl mb-6" style={{ background: cardBg, border: cardBorder }}>
          <div className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold" style={{ background: "linear-gradient(135deg,#00AEEF,#0077cc)" }}>Y</div>
          <div>
            <p className="font-bold text-[16px]" style={{ color: heading }}>you.creates</p>
            <p className="text-[13px]" style={{ color: subText }}>you@example.com</p>
          </div>
        </div>

        {/* Appearance toggle */}
        <div className="mb-5">
          <p className="text-[11px] font-bold uppercase tracking-widest mb-2 px-1" style={{ color: sectionLbl }}>Appearance</p>
          <div className="rounded-2xl overflow-hidden" style={{ background: groupBg, border: groupBorder }}>
            <button onClick={onToggleTheme} className="w-full flex items-center justify-between px-4 py-4 text-left">
              <div className="flex items-center gap-3">
                <span className="text-lg">{isDark ? "🌙" : "☀️"}</span>
                <span className="text-[14px]" style={{ color: rowText }}>{isDark ? "Dark Mode" : "Light Mode"}</span>
              </div>
              <div className="w-12 h-6 rounded-full relative transition-colors flex-shrink-0"
                style={{ background: isDark ? "#00AEEF" : "rgba(0,0,0,0.15)" }}>
                <motion.div animate={{ x: isDark ? 24 : 2 }} transition={{ type: "spring", damping: 20 }}
                  className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm" style={{ left: 0 }} />
              </div>
            </button>
          </div>
        </div>

        {/* Sections */}
        {[
          { title: "Account", items: ["Edit Profile", "Change Password", "Notification Preferences", "Privacy Settings"] },
          { title: "Creator", items: ["Collab Preferences", "Response Time", "Portfolio", "Analytics"] },
          { title: "Support", items: ["Help Center", "Report a Problem", "Terms of Service", "Privacy Policy"] },
        ].map((sec) => (
          <div key={sec.title} className="mb-5">
            <p className="text-[11px] font-bold uppercase tracking-widest mb-2 px-1" style={{ color: sectionLbl }}>{sec.title}</p>
            <div className="rounded-2xl overflow-hidden" style={{ background: groupBg, border: groupBorder }}>
              {sec.items.map((item, i) => (
                <button key={item} className="w-full flex items-center justify-between px-4 py-4 text-left transition-opacity active:opacity-70"
                  style={{ borderBottom: i < sec.items.length - 1 ? `1px solid ${rowDivider}` : "none" }}>
                  <span className="text-[14px]" style={{ color: rowText }}>{item}</span>
                  <ChevronRight className="w-4 h-4" style={{ color: chevronColor }} />
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Logout / Delete */}
        <div className="mb-3">
          <div className="rounded-2xl overflow-hidden" style={{ background: groupBg, border: groupBorder }}>
            <motion.button whileTap={{ scale: 0.98 }} onClick={onLogout}
              className="w-full flex items-center justify-between px-4 py-4"
              style={{ borderBottom: `1px solid ${rowDivider}` }}>
              <span className="text-[14px]" style={{ color: rowText }}>Log Out</span>
              <ChevronRight className="w-4 h-4" style={{ color: chevronColor }} />
            </motion.button>
            <motion.button whileTap={{ scale: 0.98 }} onClick={onDeleteProfile}
              className="w-full flex items-center justify-between px-4 py-4">
              <span className="text-red-400 text-[14px] font-semibold">Delete Profile</span>
              <ChevronRight className="w-4 h-4 text-red-400/40" />
            </motion.button>
          </div>
        </div>

        <p className="text-center text-[12px] mt-6" style={{ color: versionColor }}>ConnextionZ v1.0.0</p>
      </div>
    </div>
  );
}

// ─── AUTH FLOW (ROOT) ─────────────────────────────────────────────────────────

export function AuthFlow({ onAuthenticated }: { onAuthenticated: () => void }) {
  const [screen, setScreen] = useState<Screen>("getStarted");

  const slide = { initial: { opacity: 0, x: 40 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -40 } };
  const slideUp = { initial: { opacity: 0, y: 40 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 20 } };
  const trans = { duration: 0.22 };

  return (
    <div className="h-full w-full overflow-hidden" style={{ background: "linear-gradient(160deg, #00091a 0%, #000d24 40%, #000814 100%)", fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
      <AnimatePresence mode="wait">
        {screen === "getStarted" && (
          <motion.div key="gs" {...slideUp} transition={trans} className="h-full">
            <GetStarted onGetStarted={() => setScreen("createAccount")} onLogin={() => setScreen("login")} />
          </motion.div>
        )}
        {screen === "login" && (
          <motion.div key="li" {...slide} transition={trans} className="h-full">
            <Login onLogin={onAuthenticated} onCreate={() => setScreen("createAccount")} onForgot={() => setScreen("forgotPassword")} onBack={() => setScreen("getStarted")} />
          </motion.div>
        )}
        {screen === "createAccount" && (
          <motion.div key="ca" {...slide} transition={trans} className="h-full">
            <CreateAccount onCreated={() => setScreen("onboarding")} onLogin={() => setScreen("login")} onBack={() => setScreen("getStarted")} />
          </motion.div>
        )}
        {screen === "forgotPassword" && (
          <motion.div key="fp" {...slide} transition={trans} className="h-full">
            <ForgotPassword onSent={() => setScreen("resetSent")} onBack={() => setScreen("login")} />
          </motion.div>
        )}
        {screen === "resetSent" && (
          <motion.div key="rs" {...slideUp} transition={trans} className="h-full">
            <ResetSent onBackToLogin={() => setScreen("login")} />
          </motion.div>
        )}
        {screen === "onboarding" && (
          <motion.div key="ob" {...slideUp} transition={trans} className="h-full">
            <Onboarding onDone={onAuthenticated} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
