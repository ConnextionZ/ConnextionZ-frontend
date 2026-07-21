import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X, Heart, Send, Users, Eye, Mic, MicOff, Video, VideoOff,
  Radio, Zap, Check, ChevronDown, ArrowLeft, Share2,
} from "lucide-react";

// ─── TYPES ───────────────────────────────────────────────────────────────────

interface ChatMsg {
  id: string;
  user: string;
  color: string;
  avatar: string;
  text: string;
  isCollab?: boolean;
  isJoin?: boolean;
}

interface CollabRequest {
  id: string;
  user: string;
  avatar: string;
  type: string;
}

// ─── STATIC DATA ─────────────────────────────────────────────────────────────

const CHATTERS = [
  { user: "beatsby.kai", color: "#00AEEF", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&auto=format" },
  { user: "lofi.luna", color: "#a78bfa", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40&h=40&fit=crop&auto=format" },
  { user: "drop.dani", color: "#f472b6", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&auto=format" },
  { user: "rave.rx", color: "#22c55e", avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=40&h=40&fit=crop&auto=format" },
  { user: "freq.faye", color: "#f59e0b", avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=40&h=40&fit=crop&auto=format" },
  { user: "sxundcloud", color: "#fb923c", avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=40&h=40&fit=crop&auto=format" },
  { user: "prod.gio", color: "#34d399", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&auto=format" },
  { user: "lens.ivy", color: "#60a5fa", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop&auto=format" },
];

const CHAT_POOL = [
  "this is FIRE 🔥", "omg no way 😭", "been waiting for this collab", "W stream as always",
  "the vibe is immaculate rn", "can we get a tutorial?", "LETS GOOO 🚀", "this sound goes crazy",
  "sending collab request rn 👀", "who else is watching from the UK?", "production quality is insane",
  "drop the file please 🙏", "best creator on here no debate", "bro the hook is everything",
  "collab with @nova.dj please", "first time here and I'm already a fan", "how are you so good 😤",
  "clip that 📎", "the algorithm brought me here and I'm staying", "need this on Spotify NOW",
];

const COLLAB_TYPES = ["🎵 Music", "📹 Video", "🎙 Podcast", "💼 Brand Deal", "✨ Custom"];

const LIVE_THUMBS = [
  "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&h=1066&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&h=1066&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=600&h=1066&fit=crop&auto=format",
];

const fmt = (n: number) => n >= 1_000 ? (n / 1_000).toFixed(1) + "K" : String(n);

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function randomChatter() { return CHATTERS[Math.floor(Math.random() * CHATTERS.length)]; }
function randomMsg() { return CHAT_POOL[Math.floor(Math.random() * CHAT_POOL.length)]; }
function uid() { return Math.random().toString(36).slice(2); }

// ─── LIVE BADGE ──────────────────────────────────────────────────────────────

function LiveBadge({ viewers }: { viewers: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ background: "rgba(239,68,68,0.9)", boxShadow: "0 0 12px rgba(239,68,68,0.6)" }}>
        <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.2, repeat: Infinity }} className="w-1.5 h-1.5 rounded-full bg-white" />
        <span className="text-white text-[11px] font-extrabold tracking-wide">LIVE</span>
      </div>
      <div className="flex items-center gap-1 px-2 py-1 rounded-full" style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(8px)" }}>
        <Eye className="w-3 h-3 text-white/70" />
        <span className="text-white text-[11px] font-semibold">{fmt(viewers)}</span>
      </div>
    </div>
  );
}

// ─── FLOATING HEARTS ─────────────────────────────────────────────────────────

function FloatingHearts({ trigger }: { trigger: number }) {
  const [hearts, setHearts] = useState<{ id: string; x: number }[]>([]);
  useEffect(() => {
    if (trigger === 0) return;
    const batch = Array.from({ length: 4 }, () => ({ id: uid(), x: 20 + Math.random() * 60 }));
    setHearts((h) => [...h, ...batch]);
    setTimeout(() => setHearts((h) => h.filter((hh) => !batch.find((b) => b.id === hh.id))), 2000);
  }, [trigger]);

  return (
    <div className="absolute bottom-32 right-4 pointer-events-none" style={{ width: 60 }}>
      <AnimatePresence>
        {hearts.map((h) => (
          <motion.div key={h.id}
            initial={{ y: 0, opacity: 1, scale: 0.6 }}
            animate={{ y: -120, opacity: 0, scale: 1.2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.8, ease: "easeOut" }}
            className="absolute" style={{ left: h.x - 30 }}>
            <Heart className="w-6 h-6 fill-red-500 text-red-500" />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// ─── COLLAB REQUEST BANNER (Creator sees this) ────────────────────────────────

function CollabBanner({ request, onAccept, onDecline }: { request: CollabRequest; onAccept: () => void; onDecline: () => void }) {
  return (
    <motion.div
      initial={{ x: 120, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 120, opacity: 0 }}
      transition={{ type: "spring", damping: 24, stiffness: 300 }}
      className="absolute top-24 right-3 z-30 rounded-2xl p-3 max-w-[200px]"
      style={{ background: "rgba(0,10,30,0.92)", border: "1px solid rgba(0,174,239,0.5)", backdropFilter: "blur(12px)", boxShadow: "0 8px 28px rgba(0,174,239,0.25)" }}
    >
      <div className="flex items-center gap-2 mb-2">
        <div className="w-5 h-5 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0" style={{ background: "linear-gradient(135deg,#00AEEF,#0077cc)" }}>C</div>
        <span className="text-[#00AEEF] text-[11px] font-bold">Collab Request</span>
      </div>
      <div className="flex items-center gap-2 mb-2">
        <img src={request.avatar} alt={request.user} className="w-7 h-7 rounded-full object-cover" />
        <div>
          <p className="text-white text-[12px] font-semibold">@{request.user}</p>
          <p className="text-white/50 text-[10px]">{request.type}</p>
        </div>
      </div>
      <div className="flex gap-1.5">
        <motion.button whileTap={{ scale: 0.94 }} onClick={onAccept}
          className="flex-1 py-1.5 rounded-xl text-[11px] font-bold text-white flex items-center justify-center gap-1"
          style={{ background: "linear-gradient(135deg,#00AEEF,#0077cc)" }}>
          <Check className="w-3 h-3" /> Accept
        </motion.button>
        <motion.button whileTap={{ scale: 0.94 }} onClick={onDecline}
          className="flex-1 py-1.5 rounded-xl text-[11px] font-bold text-white/60 flex items-center justify-center"
          style={{ background: "rgba(255,255,255,0.08)" }}>
          Decline
        </motion.button>
      </div>
    </motion.div>
  );
}

// ─── LIVE CHAT PANEL ─────────────────────────────────────────────────────────

function ChatPanel({
  msgs, onSend, isCreator,
}: { msgs: ChatMsg[]; onSend: (text: string) => void; isCreator?: boolean }) {
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  const submit = () => {
    const t = text.trim();
    if (!t) return;
    onSend(t);
    setText("");
  };

  return (
    <div className="absolute inset-x-0 bottom-0 flex flex-col" style={{ maxHeight: "55%", zIndex: 15 }}>
      {/* Messages — gradient fade at top */}
      <div className="flex-1 overflow-y-auto px-3 space-y-1.5 pb-2" style={{ maskImage: "linear-gradient(to bottom, transparent 0%, black 25%)", scrollbarWidth: "none" }}>
        {msgs.map((m) => (
          <motion.div key={m.id}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className={`flex items-start gap-2 ${m.isJoin ? "opacity-60" : ""}`}
          >
            <img src={m.avatar} alt={m.user} className="w-5 h-5 rounded-full object-cover flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <span className="text-[11px] font-bold mr-1.5" style={{ color: m.color }}>{m.user}</span>
              {m.isCollab && (
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold mr-1.5" style={{ background: "rgba(0,174,239,0.25)", color: "#00AEEF" }}>
                  <span className="font-extrabold">C</span> Collab
                </span>
              )}
              <span className="text-white/85 text-[12px] leading-snug">{m.text}</span>
            </div>
          </motion.div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="flex items-center gap-2 px-3 pb-5 pt-2" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)" }}>
        <div className="flex-1 flex items-center gap-2 rounded-full px-4 py-2.5" style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)" }}>
          <input value={text} onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") submit(); }}
            placeholder={isCreator ? "Say something to your viewers…" : "Say something…"}
            className="flex-1 bg-transparent text-white text-[13px] outline-none placeholder:text-white/35" />
        </div>
        <motion.button whileTap={{ scale: 0.88 }} onClick={submit} style={{ opacity: text.trim() ? 1 : 0.4 }}>
          <Send className="w-5 h-5" style={{ color: "#00AEEF" }} />
        </motion.button>
      </div>
    </div>
  );
}

// ─── VIEWER COLLAB BUTTON (explodes then reappears) ───────────────────────────

const SHARDS = Array.from({ length: 20 }, (_, i) => {
  const angle = (i / 20) * Math.PI * 2 + (i % 3) * 0.25;
  const dist = 52 + (i % 5) * 18;
  return { id: i, tx: Math.cos(angle) * dist, ty: Math.sin(angle) * dist, rotate: (i * 79) % 360, w: 5 + (i % 4) * 3, h: 3 + (i % 3) * 3, delay: i * 0.014, color: ["#00AEEF","#38bdf8","#7dd3fc","#0ea5e9","#fff"][i % 5] };
});

function LiveCollabBtn({ onTap }: { onTap: () => void }) {
  const [phase, setPhase] = useState<"idle"|"exploding"|"gone"|"reappearing">("idle");

  const fire = useCallback(() => {
    if (phase !== "idle") return;
    setPhase("exploding");
    setTimeout(() => onTap(), 150);
    setTimeout(() => setPhase("gone"), 400);
    setTimeout(() => setPhase("reappearing"), 900);
    setTimeout(() => setPhase("idle"), 1400);
  }, [phase, onTap]);

  const exploding = phase === "exploding";
  const gone = phase === "gone";
  const reappearing = phase === "reappearing";
  const showMain = phase === "idle" || exploding;

  return (
    <button onClick={fire} className="flex flex-col items-center gap-1" aria-label="Collab">
      <div className="relative" style={{ width: 48, height: 48 }}>
        {SHARDS.map((s) => (
          <motion.div key={s.id}
            initial={{ x: 0, y: 0, rotate: 0, opacity: 0, scale: 0 }}
            animate={exploding ? { x: s.tx, y: s.ty, rotate: s.rotate, opacity: [0,1,1,0], scale: [0.2,1.3,0.6,0] } : { x: 0, y: 0, rotate: 0, opacity: 0, scale: 0 }}
            transition={{ duration: 0.6, delay: s.delay, ease: [0.1,0.9,0.2,1] }}
            style={{ position:"absolute", top:"50%", left:"50%", width:s.w, height:s.h, marginTop:-s.h/2, marginLeft:-s.w/2, borderRadius:2, backgroundColor:s.color, boxShadow:`0 0 8px 2px ${s.color}80` }} />
        ))}
        <AnimatePresence>
          {exploding && (
            <motion.div key="wave" initial={{ scale: 0.3, opacity: 1 }} animate={{ scale: 4, opacity: 0 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              style={{ position:"absolute", inset:0, borderRadius:"50%", border:"2px solid #00AEEF", boxShadow:"0 0 16px 4px rgba(0,174,239,0.5)" }} />
          )}
        </AnimatePresence>
        <AnimatePresence mode="wait">
          {showMain && (
            <motion.div key="circle"
              initial={false}
              animate={exploding ? { scale:[1,1.4,0], opacity:[1,1,0], filter:["blur(0px)","blur(0px)","blur(8px)"] } : { scale:[1,1.07,1], opacity:1, filter:"blur(0px)" }}
              transition={exploding ? { duration:0.3, ease:"easeIn" } : { duration:2.4, repeat:Infinity, ease:"easeInOut" }}
              className="absolute inset-0 rounded-full flex items-center justify-center"
              style={{ background:"linear-gradient(135deg,#00AEEF,#0077cc)", boxShadow:"0 0 0 2px rgba(0,174,239,0.3), 0 0 20px rgba(0,174,239,0.45)" }}>
              <span className="text-white font-bold text-lg leading-none select-none">C</span>
            </motion.div>
          )}
          {reappearing && (
            <motion.div key="reappear" initial={{ scale:0, opacity:0 }} animate={{ scale:[0,1.3,1], opacity:1 }}
              transition={{ duration:0.5, ease:[0.17,0.89,0.32,1.35] }}
              className="absolute inset-0 rounded-full flex items-center justify-center"
              style={{ background:"linear-gradient(135deg,#00AEEF,#0077cc)", boxShadow:"0 0 0 2px rgba(0,174,239,0.3), 0 0 20px rgba(0,174,239,0.45)" }}>
              <span className="text-white font-bold text-lg leading-none select-none">C</span>
            </motion.div>
          )}
        </AnimatePresence>
        {gone && <div className="absolute inset-0" />}
      </div>
      <span className="text-white/80 text-[10px] font-bold uppercase tracking-wide">Collab</span>
    </button>
  );
}

// ─── COLLAB TYPE PICKER (Viewer requests collab while watching live) ───────────

function CollabTypePicker({ creatorName, onSend, onClose }: { creatorName: string; onSend: (type: string) => void; onClose: () => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const send = () => {
    if (!selected) return;
    setSent(true);
    setTimeout(() => { onSend(selected); onClose(); }, 1200);
  };

  return (
    <motion.div
      initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
      transition={{ type: "spring", damping: 32, stiffness: 300 }}
      className="absolute inset-x-0 bottom-0 z-50 rounded-t-3xl px-5 pt-3 pb-8"
      style={{ background: "linear-gradient(180deg,#00091e,#000d28)", border: "1px solid rgba(0,174,239,0.25)", borderBottom: "none", boxShadow: "0 -20px 60px rgba(0,0,0,0.8)" }}
    >
      <div className="flex justify-center mb-3"><div className="w-9 h-1 rounded-full bg-white/20" /></div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-white font-bold text-[16px]">Collab while live</p>
          <p className="text-[13px]" style={{ color: "#00AEEF" }}>@{creatorName}</p>
        </div>
        <button onClick={onClose} className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.08)" }}>
          <X className="w-3.5 h-3.5 text-white/60" />
        </button>
      </div>
      <div className="grid grid-cols-5 gap-2 mb-5">
        {COLLAB_TYPES.map((t) => {
          const [icon, ...words] = t.split(" ");
          const label = words.join(" ");
          return (
            <button key={t} onClick={() => setSelected(t)}
              className="flex flex-col items-center gap-1.5 py-2.5 rounded-xl"
              style={{ background: selected === t ? "rgba(0,174,239,0.2)" : "rgba(0,40,100,0.4)", border: selected === t ? "1px solid rgba(0,174,239,0.6)" : "1px solid rgba(0,174,239,0.12)" }}>
              <span className="text-xl">{icon}</span>
              <span className="text-white/70 text-[9px] font-semibold leading-tight text-center">{label}</span>
            </button>
          );
        })}
      </div>
      <motion.button whileTap={{ scale: 0.97 }} onClick={send} disabled={!selected || sent}
        className="w-full py-3.5 rounded-full font-bold text-[15px] flex items-center justify-center gap-2"
        style={{ background: selected ? "linear-gradient(135deg,#00AEEF,#0077cc)" : "rgba(255,255,255,0.07)", color: selected ? "#000" : "rgba(255,255,255,0.3)", boxShadow: selected ? "0 6px 20px rgba(0,174,239,0.35)" : "none" }}>
        <AnimatePresence mode="wait">
          {sent
            ? <motion.span key="ok" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2"><Check className="w-4 h-4" /> Request Sent!</motion.span>
            : <motion.span key="go" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2"><Send className="w-4 h-4" /> Send Collab Request</motion.span>
          }
        </AnimatePresence>
      </motion.button>
    </motion.div>
  );
}

// ─── VIEWER LIVE VIEW ─────────────────────────────────────────────────────────

export function ViewerLiveView({
  creator, onClose,
}: { creator: { name: string; avatar: string; title: string }; onClose: () => void }) {
  const [msgs, setMsgs] = useState<ChatMsg[]>([]);
  const [viewers, setViewers] = useState(1240);
  const [liked, setLiked] = useState(false);
  const [heartTrigger, setHeartTrigger] = useState(0);
  const [showCollab, setShowCollab] = useState(false);
  const [collabSent, setCollabSent] = useState(false);
  const thumbIdx = useRef(0);
  const [thumb, setThumb] = useState(LIVE_THUMBS[0]);

  // Simulate incoming chat
  useEffect(() => {
    const seed: ChatMsg[] = Array.from({ length: 6 }, (_, i) => {
      const c = CHATTERS[i];
      return { id: uid(), ...c, text: randomMsg() };
    });
    setMsgs(seed);

    const chatTimer = setInterval(() => {
      const c = randomChatter();
      setMsgs((prev) => [...prev.slice(-30), { id: uid(), ...c, text: randomMsg() }]);
    }, 1800);

    const viewerTimer = setInterval(() => {
      setViewers((v) => v + Math.floor(Math.random() * 8 - 2));
    }, 3000);

    const thumbTimer = setInterval(() => {
      thumbIdx.current = (thumbIdx.current + 1) % LIVE_THUMBS.length;
      setThumb(LIVE_THUMBS[thumbIdx.current]);
    }, 8000);

    return () => { clearInterval(chatTimer); clearInterval(viewerTimer); clearInterval(thumbTimer); };
  }, []);

  const sendMsg = (text: string) => {
    setMsgs((prev) => [...prev.slice(-30), { id: uid(), user: "you", color: "#00AEEF", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop&auto=format", text }]);
  };

  const handleLike = () => {
    setLiked(true);
    setHeartTrigger((t) => t + 1);
  };

  const handleCollab = () => setShowCollab(true);

  const handleCollabSent = (type: string) => {
    setCollabSent(true);
    setMsgs((prev) => [...prev.slice(-30), {
      id: uid(), user: "you", color: "#00AEEF",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop&auto=format",
      text: `sent a collab request (${type.split(" ").slice(1).join(" ")})`,
      isCollab: true,
    }]);
    setTimeout(() => setCollabSent(false), 3000);
  };

  return (
    <div className="absolute inset-0 z-30 bg-black overflow-hidden">
      {/* Live background */}
      <motion.div key={thumb} initial={{ opacity: 0.7 }} animate={{ opacity: 1 }} transition={{ duration: 1.5 }}
        className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${thumb})` }} />
      <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom,rgba(0,0,0,0.45) 0%,transparent 30%,transparent 45%,rgba(0,0,0,0.7) 100%)" }} />

      {/* Top bar */}
      <div className="absolute top-0 inset-x-0 flex items-center justify-between px-4 pt-12 z-20">
        <div className="flex items-center gap-3">
          <img src={creator.avatar} alt={creator.name} className="w-9 h-9 rounded-full object-cover border-2 border-red-500" />
          <div>
            <p className="text-white font-bold text-[14px] leading-none">@{creator.name}</p>
            <p className="text-white/55 text-[11px] mt-0.5 truncate max-w-[140px]">{creator.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <LiveBadge viewers={viewers} />
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(8px)" }}>
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* Right rail */}
      <div className="absolute right-3 z-20 flex flex-col items-center gap-5" style={{ bottom: 140 }}>
        <motion.button whileTap={{ scale: 0.85 }} onClick={handleLike} className="flex flex-col items-center gap-1">
          <motion.div animate={liked ? { scale: [1,1.4,1] } : {}} transition={{ duration: 0.25 }}>
            <Heart className={`w-7 h-7 ${liked ? "fill-red-500 text-red-500" : "text-white"} drop-shadow-lg`} />
          </motion.div>
          <span className="text-white text-[10px] font-semibold">Like</span>
        </motion.button>

        <LiveCollabBtn onTap={handleCollab} />

        <motion.button whileTap={{ scale: 0.85 }} className="flex flex-col items-center gap-1">
          <Share2 className="w-7 h-7 text-white drop-shadow-lg" />
          <span className="text-white text-[10px] font-semibold">Share</span>
        </motion.button>
      </div>

      {/* Floating hearts */}
      <FloatingHearts trigger={heartTrigger} />

      {/* Collab sent confirmation */}
      <AnimatePresence>
        {collabSent && (
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            className="absolute top-28 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 px-4 py-2.5 rounded-full"
            style={{ background: "linear-gradient(135deg,#00AEEF,#0077cc)", boxShadow: "0 4px 20px rgba(0,174,239,0.5)" }}>
            <Check className="w-4 h-4 text-white" />
            <span className="text-white font-bold text-[13px]">Collab request sent!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat */}
      <ChatPanel msgs={msgs} onSend={sendMsg} />

      {/* Collab type picker */}
      <AnimatePresence>
        {showCollab && (
          <>
            <motion.div key="bd" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 z-40" style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
              onClick={() => setShowCollab(false)} />
            <CollabTypePicker key="picker" creatorName={creator.name} onSend={handleCollabSent} onClose={() => setShowCollab(false)} />
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── CREATOR LIVE VIEW ────────────────────────────────────────────────────────

export function CreatorLiveView({ title, onEnd }: { title: string; onEnd: () => void }) {
  const [msgs, setMsgs] = useState<ChatMsg[]>([]);
  const [viewers, setViewers] = useState(0);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [collabRequests, setCollabRequests] = useState<CollabRequest[]>([]);
  const [acceptedCollab, setAcceptedCollab] = useState<string | null>(null);
  const [heartTrigger, setHeartTrigger] = useState(0);
  const [confirmEnd, setConfirmEnd] = useState(false);
  const thumbIdx = useRef(1);
  const [thumb, setThumb] = useState(LIVE_THUMBS[1]);

  useEffect(() => {
    // Ramp up viewers
    const ramp = setInterval(() => setViewers((v) => Math.min(v + Math.floor(Math.random() * 15 + 5), 9999)), 800);

    // Chat stream
    const seedDelay = setTimeout(() => {
      const c = randomChatter();
      setMsgs([{ id: uid(), ...c, text: "just joined 👋", isJoin: true }]);
    }, 600);

    const chatTimer = setInterval(() => {
      const c = randomChatter();
      const isJoin = Math.random() < 0.2;
      setMsgs((prev) => [...prev.slice(-30), { id: uid(), ...c, text: isJoin ? "just joined 👋" : randomMsg(), isJoin }]);
      if (Math.random() < 0.12) setHeartTrigger((t) => t + 1);
    }, 1500);

    // Collab requests from viewers
    const collabTimer = setInterval(() => {
      if (Math.random() < 0.35) {
        const c = randomChatter();
        const type = COLLAB_TYPES[Math.floor(Math.random() * COLLAB_TYPES.length)];
        const req: CollabRequest = { id: uid(), user: c.user, avatar: c.avatar, type };
        setCollabRequests((prev) => [...prev.slice(-1), req]);
      }
    }, 6000);

    const viewerTimer = setInterval(() => setViewers((v) => v + Math.floor(Math.random() * 6 - 1)), 3000);

    const thumbTimer = setInterval(() => {
      thumbIdx.current = (thumbIdx.current + 1) % LIVE_THUMBS.length;
      setThumb(LIVE_THUMBS[thumbIdx.current]);
    }, 8000);

    return () => { clearInterval(ramp); clearTimeout(seedDelay); clearInterval(chatTimer); clearInterval(collabTimer); clearInterval(viewerTimer); clearInterval(thumbTimer); };
  }, []);

  const acceptCollab = (req: CollabRequest) => {
    setAcceptedCollab(req.user);
    setCollabRequests((prev) => prev.filter((r) => r.id !== req.id));
    setMsgs((prev) => [...prev.slice(-30), {
      id: uid(), user: "ConnextionZ", color: "#00AEEF",
      avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=40&h=40&fit=crop&auto=format",
      text: `🚀 @${req.user} joined the collab!`, isCollab: true,
    }]);
    setTimeout(() => setAcceptedCollab(null), 3000);
  };

  const declineCollab = (id: string) => setCollabRequests((prev) => prev.filter((r) => r.id !== id));

  const sendMsg = (text: string) => {
    setMsgs((prev) => [...prev.slice(-30), {
      id: uid(), user: "you (creator)", color: "#f59e0b",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop&auto=format",
      text,
    }]);
  };

  return (
    <div className="absolute inset-0 z-30 bg-black overflow-hidden">
      {/* Camera feed */}
      <motion.div key={thumb} initial={{ opacity: 0.7 }} animate={{ opacity: 1 }} transition={{ duration: 1.5 }}
        className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${thumb})` }} />
      <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom,rgba(0,0,0,0.5) 0%,transparent 30%,transparent 45%,rgba(0,0,0,0.75) 100%)" }} />

      {/* Cam off overlay */}
      <AnimatePresence>
        {!camOn && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center z-10"
            style={{ background: "#0a0a12" }}>
            <div className="flex flex-col items-center gap-3 text-center">
              <VideoOff className="w-12 h-12 text-white/30" />
              <p className="text-white/40 text-[14px]">Camera is off</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top bar */}
      <div className="absolute top-0 inset-x-0 flex items-center justify-between px-4 pt-12 z-20">
        <LiveBadge viewers={viewers} />
        <div className="flex items-center gap-2">
          {/* Mic toggle */}
          <button onClick={() => setMicOn((m) => !m)}
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: micOn ? "rgba(0,0,0,0.45)" : "rgba(239,68,68,0.5)", backdropFilter: "blur(8px)" }}>
            {micOn ? <Mic className="w-4 h-4 text-white" /> : <MicOff className="w-4 h-4 text-white" />}
          </button>
          {/* Cam toggle */}
          <button onClick={() => setCamOn((c) => !c)}
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: camOn ? "rgba(0,0,0,0.45)" : "rgba(239,68,68,0.5)", backdropFilter: "blur(8px)" }}>
            {camOn ? <Video className="w-4 h-4 text-white" /> : <VideoOff className="w-4 h-4 text-white" />}
          </button>
          {/* End live */}
          <button onClick={() => setConfirmEnd(true)}
            className="px-3 py-2 rounded-full text-white font-bold text-[12px]"
            style={{ background: "rgba(239,68,68,0.8)", boxShadow: "0 2px 12px rgba(239,68,68,0.4)" }}>
            End Live
          </button>
        </div>
      </div>

      {/* Live title badge */}
      <div className="absolute left-4 z-20" style={{ top: 112 }}>
        <div className="px-3 py-1.5 rounded-full max-w-[200px]" style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(8px)" }}>
          <p className="text-white text-[12px] font-semibold truncate">{title || "Live Stream"}</p>
        </div>
      </div>

      {/* Collab accepted banner */}
      <AnimatePresence>
        {acceptedCollab && (
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-2 px-6 py-4 rounded-3xl text-center"
            style={{ background: "linear-gradient(135deg,rgba(0,174,239,0.9),rgba(0,100,200,0.9))", boxShadow: "0 8px 32px rgba(0,174,239,0.5)" }}>
            <Zap className="w-8 h-8 text-white" />
            <p className="text-white font-extrabold text-[18px]">Collab Live!</p>
            <p className="text-white/80 text-[13px]">@{acceptedCollab} joined</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Incoming collab requests */}
      <AnimatePresence>
        {collabRequests.map((req) => (
          <CollabBanner key={req.id} request={req} onAccept={() => acceptCollab(req)} onDecline={() => declineCollab(req.id)} />
        ))}
      </AnimatePresence>

      {/* Floating hearts */}
      <FloatingHearts trigger={heartTrigger} />

      {/* Chat */}
      <ChatPanel msgs={msgs} onSend={sendMsg} isCreator />

      {/* End live confirm */}
      <AnimatePresence>
        {confirmEnd && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-end" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}>
            <motion.div initial={{ y: 80 }} animate={{ y: 0 }} exit={{ y: 80 }}
              className="w-full rounded-t-3xl px-6 pt-5 pb-10 space-y-4"
              style={{ background: "linear-gradient(180deg,#00091e,#000d28)", border: "1px solid rgba(0,174,239,0.2)" }}>
              <h2 className="text-white font-extrabold text-[22px] text-center">End your live?</h2>
              <p className="text-white/50 text-[14px] text-center">{fmt(viewers)} viewers will be disconnected</p>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setConfirmEnd(false)}
                  className="flex-1 py-4 rounded-full font-bold text-[15px] text-white/70"
                  style={{ background: "rgba(255,255,255,0.08)" }}>
                  Keep Going
                </button>
                <button onClick={onEnd}
                  className="flex-1 py-4 rounded-full font-bold text-[15px] text-white"
                  style={{ background: "rgba(239,68,68,0.85)", boxShadow: "0 4px 16px rgba(239,68,68,0.4)" }}>
                  End Live
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── GO LIVE SETUP ────────────────────────────────────────────────────────────

export function GoLiveSetup({ onStart, onClose }: { onStart: (title: string) => void; onClose: () => void }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [starting, setStarting] = useState(false);

  const cats = ["🎵 Music", "🎮 Gaming", "📹 Video", "🎙 Podcast", "💬 Q&A", "🎨 Art"];

  const handleStart = async () => {
    setStarting(true);
    await new Promise((r) => setTimeout(r, 1200));
    onStart(title || "Live Stream");
  };

  return (
    <motion.div
      initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
      transition={{ type: "spring", damping: 32, stiffness: 280 }}
      className="absolute inset-0 z-30 flex flex-col overflow-y-auto"
      style={{ background: "linear-gradient(160deg,#00091a,#000d24)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-14 pb-5">
        <button onClick={onClose} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.08)" }}>
          <X className="w-4 h-4 text-white" />
        </button>
        <div className="flex items-center gap-2">
          <Radio className="w-5 h-5" style={{ color: "#ef4444" }} />
          <span className="text-white font-extrabold text-[18px]">Go Live</span>
        </div>
        <div className="w-9" />
      </div>

      {/* Camera preview */}
      <div className="mx-5 mb-5 rounded-3xl overflow-hidden relative" style={{ aspectRatio: "9/16", maxHeight: 280 }}>
        <img src={LIVE_THUMBS[1]} alt="Camera preview" className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.25)" }} />
        {!camOn && (
          <div className="absolute inset-0 flex items-center justify-center" style={{ background: "#0a0a18" }}>
            <VideoOff className="w-10 h-10 text-white/25" />
          </div>
        )}
        {/* Camera controls overlay */}
        <div className="absolute bottom-3 inset-x-3 flex items-center justify-center gap-4">
          <button onClick={() => setMicOn((m) => !m)}
            className="w-11 h-11 rounded-full flex items-center justify-center"
            style={{ background: micOn ? "rgba(255,255,255,0.15)" : "rgba(239,68,68,0.7)", backdropFilter: "blur(8px)" }}>
            {micOn ? <Mic className="w-5 h-5 text-white" /> : <MicOff className="w-5 h-5 text-white" />}
          </button>
          <button onClick={() => setCamOn((c) => !c)}
            className="w-11 h-11 rounded-full flex items-center justify-center"
            style={{ background: camOn ? "rgba(255,255,255,0.15)" : "rgba(239,68,68,0.7)", backdropFilter: "blur(8px)" }}>
            {camOn ? <Video className="w-5 h-5 text-white" /> : <VideoOff className="w-5 h-5 text-white" />}
          </button>
        </div>
      </div>

      <div className="px-5 space-y-5 pb-10">
        {/* Title input */}
        <div>
          <p className="text-white/45 text-[11px] font-bold uppercase tracking-widest mb-2">Stream Title</p>
          <input value={title} onChange={(e) => setTitle(e.target.value)}
            placeholder="What are you going live about?"
            className="w-full rounded-2xl px-4 py-3.5 text-white text-[14px] outline-none placeholder:text-white/25"
            style={{ background: "rgba(0,60,140,0.3)", border: "1px solid rgba(0,174,239,0.25)" }} />
        </div>

        {/* Category */}
        <div>
          <p className="text-white/45 text-[11px] font-bold uppercase tracking-widest mb-2">Category</p>
          <div className="grid grid-cols-3 gap-2">
            {cats.map((c) => (
              <button key={c} onClick={() => setCategory(c)}
                className="py-2.5 rounded-xl text-[12px] font-semibold"
                style={{ background: category === c ? "rgba(0,174,239,0.2)" : "rgba(0,40,100,0.35)", border: category === c ? "1px solid rgba(0,174,239,0.55)" : "1px solid rgba(0,174,239,0.12)", color: category === c ? "#00AEEF" : "rgba(255,255,255,0.55)" }}>
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Collab note */}
        <div className="flex items-start gap-3 p-4 rounded-2xl" style={{ background: "rgba(0,174,239,0.08)", border: "1px solid rgba(0,174,239,0.2)" }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg,#00AEEF,#0077cc)" }}>
            <span className="text-white font-bold text-sm">C</span>
          </div>
          <div>
            <p className="text-white font-semibold text-[13px]">Collab requests enabled</p>
            <p className="text-white/45 text-[12px] mt-0.5">Viewers can send collab requests during your live. Accept or decline in real time.</p>
          </div>
        </div>

        {/* Go Live button */}
        <motion.button whileTap={{ scale: 0.97 }} onClick={handleStart} disabled={starting}
          className="w-full py-4 rounded-full font-extrabold text-[16px] flex items-center justify-center gap-2"
          style={{ background: starting ? "rgba(239,68,68,0.6)" : "linear-gradient(135deg,#ef4444,#dc2626)", color: "#fff", boxShadow: "0 8px 24px rgba(239,68,68,0.4)" }}>
          {starting
            ? <><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}><Radio className="w-5 h-5" /></motion.div> Going Live…</>
            : <><Radio className="w-5 h-5" /> Go Live</>
          }
        </motion.button>
      </div>
    </motion.div>
  );
}

// ─── LIVE ENTRY BANNER (shown in feed) ────────────────────────────────────────

export function LiveBannerStrip({ onCreate, onWatch }: { onCreate: () => void; onWatch: () => void }) {
  const LIVE_CREATORS = [
    { name: "nova.dj", avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=60&h=60&fit=crop&auto=format", viewers: 4821, title: "HYPERSONIC studio session 🔊" },
    { name: "zara.creates", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&h=60&fit=crop&auto=format", viewers: 1240, title: "late night beat making 🎵" },
    { name: "milo.visuals", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&auto=format", viewers: 892, title: "golden hour shoot 📸" },
  ];

  return (
    <div className="absolute top-0 inset-x-0 z-10 pt-24 px-4 pb-2 pointer-events-none">
      <div className="flex gap-2 overflow-x-auto pointer-events-auto" style={{ scrollbarWidth: "none" }}>
        {LIVE_CREATORS.map((c) => (
          <motion.button key={c.name} whileTap={{ scale: 0.95 }} onClick={onWatch}
            className="flex-shrink-0 flex flex-col items-center gap-1.5">
            <div className="relative">
              <img src={c.avatar} alt={c.name} className="w-14 h-14 rounded-full object-cover border-2 border-red-500" />
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded-full text-[8px] font-extrabold text-white" style={{ background: "#ef4444" }}>LIVE</div>
            </div>
            <span className="text-white/70 text-[10px] font-semibold">{c.name}</span>
          </motion.button>
        ))}
        {/* Go live CTA */}
        <motion.button whileTap={{ scale: 0.95 }} onClick={onCreate}
          className="flex-shrink-0 flex flex-col items-center gap-1.5">
          <div className="w-14 h-14 rounded-full flex items-center justify-center border-2 border-dashed" style={{ borderColor: "rgba(239,68,68,0.6)", background: "rgba(239,68,68,0.1)" }}>
            <Radio className="w-6 h-6 text-red-400" />
          </div>
          <span className="text-red-400 text-[10px] font-semibold">Go Live</span>
        </motion.button>
      </div>
    </div>
  );
}
