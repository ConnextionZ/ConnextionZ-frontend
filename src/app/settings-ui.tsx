// ─── SETTINGS UI KIT ─────────────────────────────────────────────────────────
//
// The pieces every Settings sub-page is built from. They exist so the twelve
// destination screens stay declarative and share one set of light/dark tokens —
// the settings surfaces are the only place in the app where both themes are
// fully exercised, so the tokens live in one place rather than per screen.

import { useMemo, type ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Check, ChevronRight, Loader2, AlertCircle } from "lucide-react";

export const ACCENT = "#00AEEF";

// ─── TOKENS ──────────────────────────────────────────────────────────────────

export interface Tokens {
  bg: string;
  heading: string;
  body: string;
  sub: string;
  sectionLbl: string;
  groupBg: string;
  groupBorder: string;
  divider: string;
  chevron: string;
  cardBg: string;
  cardBorder: string;
  fieldBg: string;
  fieldBorder: string;
  backBtnBg: string;
  chipBg: string;
  chipBorder: string;
  switchOff: string;
}

export function useTokens(isDark: boolean): Tokens {
  return useMemo<Tokens>(() => ({
    bg: isDark
      ? "linear-gradient(160deg,#00091e 0%,#000d28 100%)"
      : "linear-gradient(160deg,#f2f5fb 0%,#eaf1fc 100%)",
    heading: isDark ? "#fff" : "#0a0e1a",
    body: isDark ? "rgba(255,255,255,0.88)" : "#0a0e1a",
    sub: isDark ? "rgba(255,255,255,0.4)" : "rgba(10,14,26,0.45)",
    sectionLbl: isDark ? "rgba(255,255,255,0.35)" : "rgba(10,14,26,0.4)",
    groupBg: isDark ? "rgba(0,30,80,0.4)" : "#ffffff",
    groupBorder: isDark ? "1px solid rgba(0,174,239,0.15)" : "1px solid rgba(0,0,0,0.08)",
    divider: isDark ? "rgba(0,174,239,0.1)" : "rgba(0,0,0,0.06)",
    chevron: isDark ? "rgba(255,255,255,0.25)" : "rgba(10,14,26,0.25)",
    cardBg: isDark ? "rgba(0,40,100,0.35)" : "rgba(0,130,240,0.07)",
    cardBorder: isDark ? "1px solid rgba(0,174,239,0.18)" : "1px solid rgba(0,174,239,0.15)",
    fieldBg: isDark ? "rgba(0,80,160,0.12)" : "rgba(0,80,160,0.05)",
    fieldBorder: isDark ? "1px solid rgba(0,174,239,0.18)" : "1px solid rgba(0,0,0,0.1)",
    backBtnBg: isDark ? "rgba(0,60,130,0.35)" : "rgba(0,130,240,0.08)",
    chipBg: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
    chipBorder: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.08)",
    switchOff: isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)",
  }), [isDark]);
}

// ─── PAGE SHELL ──────────────────────────────────────────────────────────────

/**
 * A settings destination. Slides in over the Settings list from the right —
 * the same `x: "100%" → 0` spring the app already uses for screen changes — and
 * always carries a back affordance, so no page is a dead end.
 */
export function SubPage({
  title, subtitle, onBack, t, children, footer,
}: {
  title: string;
  subtitle?: string;
  onBack: () => void;
  t: Tokens;
  children: ReactNode;
  /** Pinned below the scroll area — used for save bars and primary actions. */
  footer?: ReactNode;
}) {
  return (
    <motion.div
      initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 34, stiffness: 300 }}
      className="absolute inset-0 z-30 flex flex-col"
      style={{ background: t.bg }}
    >
      <div className="flex items-start gap-3 px-5 pt-14 pb-4 flex-shrink-0"
        style={{ borderBottom: `1px solid ${t.divider}` }}>
        <button onClick={onBack} aria-label="Back"
          className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-opacity active:opacity-70"
          style={{ background: t.backBtnBg, border: t.cardBorder }}>
          <ArrowLeft className="w-4 h-4" style={{ color: t.heading }} />
        </button>
        <div className="min-w-0 flex-1 pt-0.5">
          <h1 className="font-extrabold text-[22px] leading-tight truncate" style={{ color: t.heading }}>{title}</h1>
          {subtitle && <p className="text-[13px] mt-0.5 leading-snug" style={{ color: t.sub }}>{subtitle}</p>}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pt-5 pb-10">{children}</div>

      {footer && (
        <div className="flex-shrink-0 px-5 pt-4 pb-8" style={{ borderTop: `1px solid ${t.divider}` }}>
          {footer}
        </div>
      )}
    </motion.div>
  );
}

// ─── GROUPS & ROWS ───────────────────────────────────────────────────────────

export function Group({ label, hint, t, children }: {
  label?: string; hint?: string; t: Tokens; children: ReactNode;
}) {
  return (
    <div className="mb-5">
      {label && (
        <p className="text-[11px] font-bold uppercase tracking-widest mb-2 px-1" style={{ color: t.sectionLbl }}>
          {label}
        </p>
      )}
      <div className="rounded-2xl overflow-hidden" style={{ background: t.groupBg, border: t.groupBorder }}>
        {children}
      </div>
      {hint && <p className="text-[12px] leading-relaxed mt-2 px-1" style={{ color: t.sub }}>{hint}</p>}
    </div>
  );
}

/** Adds the hairline between siblings without a divider on the last row. */
const rowBorder = (t: Tokens, last: boolean) => (last ? "none" : `1px solid ${t.divider}`);

export function Row({
  label, sub, right, onClick, last = false, t, danger = false,
}: {
  label: ReactNode; sub?: string; right?: ReactNode; onClick?: () => void;
  last?: boolean; t: Tokens; danger?: boolean;
}) {
  const content = (
    <>
      <div className="min-w-0 flex-1 pr-3">
        <p className="text-[14px]" style={{ color: danger ? "#f87171" : t.body, fontWeight: danger ? 600 : 400 }}>
          {label}
        </p>
        {sub && <p className="text-[12px] mt-0.5 leading-snug" style={{ color: t.sub }}>{sub}</p>}
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">{right}</div>
    </>
  );

  const style = { borderBottom: rowBorder(t, last) };

  return onClick ? (
    <button onClick={onClick} className="w-full flex items-center px-4 py-4 text-left transition-opacity active:opacity-70" style={style}>
      {content}
    </button>
  ) : (
    <div className="w-full flex items-center px-4 py-4" style={style}>{content}</div>
  );
}

/** A row that opens another screen. */
export function NavRow(props: {
  label: ReactNode; sub?: string; value?: string; onClick: () => void; last?: boolean; t: Tokens; danger?: boolean;
}) {
  const { value, t, ...rest } = props;
  return (
    <Row {...rest} t={t} right={
      <>
        {value && <span className="text-[13px]" style={{ color: t.sub }}>{value}</span>}
        <ChevronRight className="w-4 h-4" style={{ color: props.danger ? "rgba(248,113,113,0.4)" : t.chevron }} />
      </>
    } />
  );
}

// ─── SWITCH ──────────────────────────────────────────────────────────────────

export function Switch({ on, t }: { on: boolean; t: Tokens }) {
  return (
    <div className="w-12 h-6 rounded-full relative transition-colors flex-shrink-0"
      style={{ background: on ? ACCENT : t.switchOff }}>
      <motion.div animate={{ x: on ? 24 : 2 }} transition={{ type: "spring", damping: 20 }}
        className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm" style={{ left: 0 }} />
    </div>
  );
}

export function ToggleRow({
  label, sub, value, onChange, last = false, t,
}: {
  label: string; sub?: string; value: boolean; onChange: (v: boolean) => void; last?: boolean; t: Tokens;
}) {
  return (
    <button onClick={() => onChange(!value)} role="switch" aria-checked={value}
      className="w-full flex items-center px-4 py-4 text-left transition-opacity active:opacity-70"
      style={{ borderBottom: rowBorder(t, last) }}>
      <div className="min-w-0 flex-1 pr-3">
        <p className="text-[14px]" style={{ color: t.body }}>{label}</p>
        {sub && <p className="text-[12px] mt-0.5 leading-snug" style={{ color: t.sub }}>{sub}</p>}
      </div>
      <Switch on={value} t={t} />
    </button>
  );
}

/** A single-select option; the whole row is the target, the check marks state. */
export function ChoiceRow({
  label, sub, selected, onSelect, last = false, t,
}: {
  label: string; sub?: string; selected: boolean; onSelect: () => void; last?: boolean; t: Tokens;
}) {
  return (
    <button onClick={onSelect} role="radio" aria-checked={selected}
      className="w-full flex items-center px-4 py-4 text-left transition-opacity active:opacity-70"
      style={{ borderBottom: rowBorder(t, last) }}>
      <div className="min-w-0 flex-1 pr-3">
        <p className="text-[14px]" style={{ color: selected ? ACCENT : t.body, fontWeight: selected ? 700 : 400 }}>{label}</p>
        {sub && <p className="text-[12px] mt-0.5 leading-snug" style={{ color: t.sub }}>{sub}</p>}
      </div>
      <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
        style={{
          background: selected ? ACCENT : "transparent",
          border: selected ? `1px solid ${ACCENT}` : `1.5px solid ${t.chevron}`,
        }}>
        {selected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
      </div>
    </button>
  );
}

// ─── FIELDS ──────────────────────────────────────────────────────────────────

export function Field({
  label, value, onChange, placeholder, hint, error, prefix, maxLength, multiline, rows = 4, type = "text", t,
}: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string;
  hint?: string; error?: string; prefix?: string; maxLength?: number;
  multiline?: boolean; rows?: number; type?: string; t: Tokens;
}) {
  const shared = {
    value,
    maxLength,
    placeholder,
    onChange: (e: { target: { value: string } }) => onChange(e.target.value),
    className: `w-full bg-transparent text-[15px] outline-none ${multiline ? "resize-none" : ""}`,
    style: { color: t.heading },
  };

  return (
    <div className="mb-4">
      <div className="flex items-baseline justify-between mb-1.5 px-1">
        <p className="text-[11px] font-bold uppercase tracking-widest" style={{ color: t.sectionLbl }}>{label}</p>
        {maxLength && <span className="text-[11px]" style={{ color: t.sub }}>{value.length}/{maxLength}</span>}
      </div>
      <div className="rounded-2xl px-4 py-3.5 flex items-start gap-1"
        style={{ background: t.fieldBg, border: error ? "1px solid rgba(239,68,68,0.6)" : t.fieldBorder }}>
        {prefix && <span className="text-[15px] flex-shrink-0" style={{ color: t.sub }}>{prefix}</span>}
        {multiline
          ? <textarea {...shared} rows={rows} />
          : <input {...shared} type={type} />}
      </div>
      {error
        ? <p className="text-red-400 text-[12px] flex items-center gap-1 mt-1.5 px-1"><AlertCircle className="w-3 h-3 flex-shrink-0" /> {error}</p>
        : hint && <p className="text-[12px] mt-1.5 px-1 leading-relaxed" style={{ color: t.sub }}>{hint}</p>}
    </div>
  );
}

// ─── CHIPS ───────────────────────────────────────────────────────────────────

export function Chip({ label, selected, onClick, t }: {
  label: string; selected: boolean; onClick: () => void; t: Tokens;
}) {
  return (
    <button onClick={onClick}
      className="px-3.5 py-2 rounded-full text-[13px] font-semibold transition-colors"
      style={{
        background: selected ? "rgba(0,174,239,0.2)" : t.chipBg,
        border: selected ? `1px solid ${ACCENT}` : t.chipBorder,
        color: selected ? ACCENT : t.sub,
      }}>
      {label}
    </button>
  );
}

// ─── CALLOUT ─────────────────────────────────────────────────────────────────

export function Callout({ icon, children, tone = "info", t }: {
  icon?: ReactNode; children: ReactNode; tone?: "info" | "warn"; t: Tokens;
}) {
  const warn = tone === "warn";
  return (
    <div className="rounded-2xl px-4 py-3 flex items-start gap-3 mb-5"
      style={{
        background: warn ? "rgba(239,68,68,0.08)" : t.cardBg,
        border: warn ? "1px solid rgba(239,68,68,0.25)" : t.cardBorder,
      }}>
      <div className="flex-shrink-0 mt-0.5" style={{ color: warn ? "#f87171" : ACCENT }}>{icon}</div>
      <div className="text-[12px] leading-relaxed" style={{ color: t.sub }}>{children}</div>
    </div>
  );
}

// ─── ACTION BUTTONS ──────────────────────────────────────────────────────────

export function PrimaryAction({
  children, onClick, disabled, loading, done, doneLabel = "Saved",
}: {
  children: ReactNode; onClick?: () => void;
  disabled?: boolean; loading?: boolean; done?: boolean; doneLabel?: string;
}) {
  const off = disabled || loading;
  return (
    <motion.button
      whileTap={off ? {} : { scale: 0.97 }}
      onClick={onClick}
      disabled={off}
      className="w-full py-4 rounded-full font-bold text-[15px] flex items-center justify-center gap-2"
      style={{
        background: off ? "rgba(120,140,170,0.22)" : `linear-gradient(135deg,${ACCENT},#0077cc)`,
        color: off ? "rgba(140,160,190,0.85)" : "#fff",
        boxShadow: off ? "none" : "0 8px 24px rgba(0,174,239,0.35)",
      }}
    >
      <AnimatePresence mode="wait" initial={false}>
        {loading ? (
          <motion.span key="l" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Loader2 className="w-5 h-5 animate-spin" />
          </motion.span>
        ) : done ? (
          <motion.span key="d" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            className="flex items-center gap-2">
            <Check className="w-5 h-5" /> {doneLabel}
          </motion.span>
        ) : (
          <motion.span key="c" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex items-center gap-2">
            {children}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

export function SecondaryAction({ children, onClick, t, danger }: {
  children: ReactNode; onClick?: () => void; t: Tokens; danger?: boolean;
}) {
  return (
    <motion.button whileTap={{ scale: 0.97 }} onClick={onClick}
      className="w-full py-3.5 rounded-full font-semibold text-[14px]"
      style={{
        background: danger ? "rgba(239,68,68,0.12)" : t.chipBg,
        border: danger ? "1px solid rgba(239,68,68,0.35)" : t.chipBorder,
        color: danger ? "#f87171" : t.sub,
      }}>
      {children}
    </motion.button>
  );
}

// ─── SAVE FEEDBACK ───────────────────────────────────────────────────────────

/**
 * Preference screens write on every tap, so they confirm with a transient
 * "Saved" pill rather than a Save button the user has to remember to press.
 */
export function SavedPill({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 12, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.95 }}
          transition={{ type: "spring", damping: 24, stiffness: 320 }}
          className="absolute left-1/2 -translate-x-1/2 bottom-8 z-40 flex items-center gap-2 px-4 py-2.5 rounded-full pointer-events-none"
          style={{
            background: "rgba(0,174,239,0.95)",
            boxShadow: "0 8px 28px rgba(0,174,239,0.45)",
          }}
        >
          <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
          <span className="text-white text-[13px] font-bold">Preferences saved</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── EMPTY STATE ─────────────────────────────────────────────────────────────

export function EmptyState({ icon, title, body, t }: {
  icon: ReactNode; title: string; body: string; t: Tokens;
}) {
  return (
    <div className="flex flex-col items-center text-center py-14 px-6">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
        style={{ background: "rgba(0,174,239,0.12)", border: "1px solid rgba(0,174,239,0.28)", color: ACCENT }}>
        {icon}
      </div>
      <p className="font-bold text-[16px]" style={{ color: t.heading }}>{title}</p>
      <p className="text-[13px] mt-1.5 leading-relaxed max-w-[260px]" style={{ color: t.sub }}>{body}</p>
    </div>
  );
}
