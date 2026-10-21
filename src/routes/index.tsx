import { createFileRoute } from "@tanstack/react-router";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import GargantuaField from "@/components/GargantuaField";
import MissionHUD from "@/components/MissionHUD";
import Nav from "@/components/Nav";
import {
  EducationSection,
  ProjectsSection,
  Reveal,
  WorkSection,
} from "@/components/PortfolioSections";
import SectionRail from "@/components/SectionRail";
import Starfield from "@/components/Starfield";
import Tesseract from "@/components/Tesseract";
import { heroStats, socialLinks } from "@/lib/portfolio-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Anurag Gupta — Software Developer" },
      { name: "description", content: "Anurag Gupta — SDE at Ninjacart. Spring Boot, React, scalable systems. A portfolio inspired by the cosmos." },
    ],
  }),
  component: Index,
});

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(80, "Too long"),
  email: z.string().trim().email("Invalid email").max(160, "Too long"),
  message: z.string().trim().min(5, "Tell me a bit more").max(1000, "Keep it under 1000 chars"),
});
type FieldErrors = Partial<Record<"name" | "email" | "message", string>>;
type Point = { x: number; y: number };

function isInfinityGesture(points: Point[]) {
  if (points.length < 40) return false;

  let minX = Number.POSITIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;

  for (const p of points) {
    minX = Math.min(minX, p.x);
    minY = Math.min(minY, p.y);
    maxX = Math.max(maxX, p.x);
    maxY = Math.max(maxY, p.y);
  }

  const width = maxX - minX;
  const height = maxY - minY;
  if (width < 100 || height < 45) return false;

  const ratio = width / Math.max(height, 1);
  if (ratio < 1.4 || ratio > 4.2) return false;

  const centerX = minX + width / 2;
  const centerY = minY + height / 2;

  let crossings = 0;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const crossed =
      (prev.x <= centerX && curr.x > centerX) || (prev.x >= centerX && curr.x < centerX);
    if (crossed && Math.abs(curr.y - centerY) < height * 0.4) crossings++;
  }

  const leftCount = points.filter((p) => p.x < centerX - width * 0.18).length;
  const rightCount = points.filter((p) => p.x > centerX + width * 0.18).length;
  const topCount = points.filter((p) => p.y < centerY - height * 0.18).length;
  const bottomCount = points.filter((p) => p.y > centerY + height * 0.18).length;

  return crossings >= 2 && leftCount > 8 && rightCount > 8 && topCount > 6 && bottomCount > 6;
}

function InfinityAudioControl({
  unlocked,
  playing,
  error,
  onUnlock,
  onToggle,
}: {
  unlocked: boolean;
  playing: boolean;
  error?: string;
  onUnlock: () => Promise<void>;
  onToggle: () => Promise<void>;
}) {
  const [expanded, setExpanded] = useState(false);
  const [drawing, setDrawing] = useState(false);
  const [drawnPoints, setDrawnPoints] = useState<Point[]>([]);
  const [hint, setHint] = useState("Draw an infinity loop to enable audio");
  const sparkles = [
    { x: "10%", y: "78%", dx: -12, dy: -28, d: 0.1 },
    { x: "18%", y: "26%", dx: -10, dy: -24, d: 0.45 },
    { x: "34%", y: "12%", dx: -4, dy: -26, d: 0.85 },
    { x: "58%", y: "8%", dx: 0, dy: -24, d: 1.2 },
    { x: "74%", y: "16%", dx: 8, dy: -26, d: 1.55 },
    { x: "90%", y: "34%", dx: 12, dy: -22, d: 1.9 },
  ];

  const pushPoint = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const point = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    setDrawnPoints((prev) => [...prev, point]);
  };

  const startDrawing = (e: React.PointerEvent<HTMLDivElement>) => {
    if (unlocked) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setDrawing(true);
    setDrawnPoints([]);
    setHint("Keep drawing the ∞ shape");
    pushPoint(e);
  };

  const draw = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!drawing || unlocked) return;
    pushPoint(e);
  };

  const stopDrawing = async () => {
    if (!drawing || unlocked) return;
    setDrawing(false);
    const passed = isInfinityGesture(drawnPoints);
    if (!passed) {
      setHint("Not quite infinity. Try again.");
      return;
    }
    setHint("Infinity detected. Enabling audio...");
    await onUnlock();
  };

  const path = drawnPoints.map((p) => `${p.x},${p.y}`).join(" ");

  if (!unlocked && !expanded) {
    return (
      <div className="fixed right-4 bottom-4 z-50">
        <div className="relative">
        <motion.button
          onClick={() => setExpanded(true)}
          className="px-4 py-2 rounded-full border border-border bg-card/75 backdrop-blur-xl text-sm font-medium hover:border-primary hover:text-primary transition shadow-[0_0_28px_-14px_oklch(0.7_0.19_50/70%)]"
          animate={{
            opacity: [1, 0.7, 1],
            scale: [1, 1.03, 1],
          }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          Want to unlock cosmos
        </motion.button>

        {sparkles.map((s, i) => (
          <motion.span
            key={`${s.x}-${s.y}`}
            className="absolute w-1.5 h-1.5 rounded-full pointer-events-none"
            style={{
              left: s.x,
              top: s.y,
              background: "oklch(0.92 0.16 82)",
              boxShadow: "0 0 10px oklch(0.88 0.18 70 / 90%)",
            }}
            animate={{
              opacity: [0, 1, 0],
              x: [0, s.dx, s.dx * 1.25],
              y: [0, s.dy, s.dy * 1.4],
              scale: [0.2, 1, 0.2],
            }}
            transition={{
              duration: 0.9,
              delay: s.d,
              repeat: Infinity,
              repeatDelay: 2.1,
              ease: "easeOut",
            }}
          />
        ))}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed right-4 bottom-4 z-50 w-[270px] rounded-xl border border-border bg-card/70 backdrop-blur-xl p-3 shadow-[0_0_40px_-18px_oklch(0.7_0.19_50/60%)]">
      <div className="flex items-center gap-2 mb-3">
        <button
          onClick={() => { void (unlocked ? onToggle() : onUnlock()); }}
          className="flex-1 px-3 py-2 rounded-md border border-border text-sm font-medium hover:border-primary hover:text-primary transition"
        >
          {unlocked ? (playing ? "🔊 Cosmic Audio On" : "🔈 Cosmic Audio Off") : "∞ Unlock Cosmic Audio"}
        </button>
        {!unlocked && (
          <button
            onClick={() => setExpanded(false)}
            className="px-2 py-2 rounded-md border border-border text-xs text-muted-foreground hover:text-primary hover:border-primary transition"
            aria-label="Minimize audio control"
          >
            -
          </button>
        )}
      </div>

      {!unlocked && (
        <div
          className="relative h-28 rounded-md border border-border/80 bg-background/60 touch-none select-none"
          onPointerDown={startDrawing}
          onPointerMove={draw}
          onPointerUp={() => { void stopDrawing(); }}
          onPointerCancel={() => { void stopDrawing(); }}
        >
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 260 112" preserveAspectRatio="none">
            <path
              d="M30 56 C52 16, 98 16, 130 56 C162 96, 208 96, 230 56 C208 16, 162 16, 130 56 C98 96, 52 96, 30 56 Z"
              fill="none"
              stroke="oklch(0.75 0.03 250 / 45%)"
              strokeWidth="1.5"
              strokeDasharray="4 5"
            />
            {path && <polyline points={path} fill="none" stroke="oklch(0.85 0.2 70)" strokeWidth="2" strokeLinecap="round" />}
          </svg>
        </div>
      )}

      <p className="mt-2 text-[11px] text-muted-foreground">{error ?? hint}</p>
    </div>
  );
}

function Spaceship({ launching }: { launching: boolean }) {
  const y = useMotionValue(0);
  const rotate = useMotionValue(-8);

  useEffect(() => {
    if (launching) {
      const launchY = animate(y, [0, -90, -920, -920, 0], {
        duration: 5,
        times: [0, 0.2, 0.36, 0.74, 1],
        ease: "easeInOut",
      });
      const launchRotate = animate(rotate, [-8, -20, -26, -26, -8], {
        duration: 5,
        times: [0, 0.2, 0.36, 0.74, 1],
        ease: "easeInOut",
      });
      return () => {
        launchY.stop();
        launchRotate.stop();
      };
    } else {
      y.set(0);
      rotate.set(-8);
    }
  }, [launching, y, rotate]);

  const flameScale = useTransform(y, [0, -800], [1, 3]);
  const flameOpacity = useTransform(y, [0, -200, -800], [0.9, 1, 0]);

  return (
    <motion.div style={{ y, rotate }} className="relative w-44 h-56">
      <svg viewBox="0 0 120 160" className="w-full h-full drop-shadow-[0_0_30px_oklch(0.7_0.19_50/60%)]">
        <defs>
          <linearGradient id="hull" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="oklch(0.95 0.02 90)" />
            <stop offset="60%" stopColor="oklch(0.7 0.03 250)" />
            <stop offset="100%" stopColor="oklch(0.35 0.02 250)" />
          </linearGradient>
          <radialGradient id="window" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="oklch(0.9 0.18 70)" />
            <stop offset="100%" stopColor="oklch(0.45 0.18 50)" />
          </radialGradient>
        </defs>
        <path d="M20 110 L40 90 L40 130 Z" fill="oklch(0.55 0.18 40)" />
        <path d="M100 110 L80 90 L80 130 Z" fill="oklch(0.55 0.18 40)" />
        <path d="M60 10 C30 35 30 90 35 130 L85 130 C90 90 90 35 60 10 Z" fill="url(#hull)" stroke="oklch(0.85 0.05 90 / 60%)" strokeWidth="0.8" />
        <circle cx="60" cy="55" r="14" fill="url(#window)" />
        <circle cx="60" cy="55" r="14" fill="none" stroke="oklch(0.95 0.02 90)" strokeWidth="2" />
        <path d="M45 95 L75 95" stroke="oklch(0.95 0.02 90 / 30%)" strokeWidth="1" />
        <path d="M45 110 L75 110" stroke="oklch(0.95 0.02 90 / 30%)" strokeWidth="1" />
        <rect x="50" y="130" width="20" height="8" fill="oklch(0.25 0.02 250)" />
      </svg>
      <motion.div style={{ scaleY: flameScale, opacity: flameOpacity }} className="absolute left-1/2 -translate-x-1/2 bottom-0 origin-top w-6 h-16">
        <div className="w-full h-full rounded-b-full blur-[2px]" style={{ background: "linear-gradient(to bottom, oklch(0.95 0.18 80), oklch(0.7 0.22 40), transparent)" }} />
        <motion.div animate={{ scaleY: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }} transition={{ duration: 0.25, repeat: Infinity }}
          className="absolute inset-0 rounded-b-full"
          style={{ background: "linear-gradient(to bottom, oklch(1 0.05 90), oklch(0.85 0.2 60), transparent)", filter: "blur(3px)" }} />
      </motion.div>
    </motion.div>
  );
}

function Field({ label, value, onChange, error, placeholder, type = "text", maxLength }: {
  label: string; value: string; onChange: (v: string) => void;
  error?: string; placeholder?: string; type?: string; maxLength?: number;
}) {
  return (
    <div>
      <label className="text-xs uppercase tracking-[0.25em] text-muted-foreground font-display">{label}</label>
      <input
        type={type} value={value} onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder} maxLength={maxLength}
        className="mt-2 w-full bg-background/40 border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition"
      />
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}

function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [launching, setLaunching] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = contactSchema.safeParse(form);
    if (!parsed.success) {
      const fe: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const k = issue.path[0] as keyof FieldErrors;
        if (k && !fe[k]) fe[k] = issue.message;
      }
      setErrors(fe);
      return;
    }
    setErrors({});
    setIsSending(true);
    const { name, email, message } = parsed.data;

    try {
      const response = await fetch("https://formsubmit.co/ajax/anurag9953001342@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          message,
          subject: `Transmission from ${name}`,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send transmission");
      }

      setSent(false);
      setLaunching(true);
      setTimeout(() => {
        setLaunching(false);
        setSent(true);
      }, 5000);
    } catch {
      setErrors({ message: "Transmission failed. Please try again in a moment." });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-[1.3fr_1fr] gap-12 items-center">
      <Reveal>
        <form onSubmit={submit} className="rounded-2xl border border-border bg-card/50 backdrop-blur-xl p-8 space-y-5 shadow-[0_0_60px_-20px_oklch(0.7_0.19_50/40%)]">
          <Field label="Identifier" value={form.name} onChange={(v) => setForm({ ...form, name: v })} error={errors.name} placeholder="Your name" maxLength={80} />
          <Field label="Frequency" value={form.email} onChange={(v) => setForm({ ...form, email: v })} error={errors.email} placeholder="you@orbit.com" type="email" maxLength={160} />
          <div>
            <label className="text-xs uppercase tracking-[0.25em] text-muted-foreground font-display">Payload</label>
            <textarea
              value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Your message…" rows={5} maxLength={1000}
              className="mt-2 w-full bg-background/40 border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition resize-none"
            />
            <div className="flex justify-between mt-1">
              <span className="text-xs text-destructive">{errors.message ?? ""}</span>
              <span className="text-xs text-muted-foreground">{form.message.length}/1000</span>
            </div>
          </div>
          <button type="submit" disabled={isSending}
            className="w-full px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition glow disabled:opacity-60 disabled:cursor-not-allowed">
            {sent ? "✓ Launched" : isSending ? "Launching…" : "Initiate Launch →"}
          </button>
          <div className="flex gap-4 text-xs text-muted-foreground pt-2 border-t border-border">
            <a href={socialLinks.email} className="hover:text-primary transition">Email</a>
            <a href={socialLinks.github} target="_blank" rel="noreferrer" className="hover:text-primary transition">GitHub</a>
            <a href={socialLinks.linkedin} target="_blank" rel="noreferrer" className="hover:text-primary transition">LinkedIn</a>
            <a href={socialLinks.leetcode} target="_blank" rel="noreferrer" className="hover:text-primary transition">LeetCode</a>
          </div>
        </form>
      </Reveal>
      <div className="relative h-[480px] flex items-end justify-center">
        <div className="absolute bottom-0 w-64 h-12 rounded-[100%] bg-primary/20 blur-2xl" />
        <Spaceship launching={launching} />
      </div>
    </div>
  );
}

function Index() {
  const scrollTo = (id: string) => () => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  const audioRef = useRef<HTMLAudioElement>(null);
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audioHint, setAudioHint] = useState<string>();

  const unlockAudio = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      audio.volume = 0.35;
      audio.loop = true;
      await audio.play();
      setAudioUnlocked(true);
      setAudioPlaying(true);
      setAudioHint("Background sound enabled.");
    } catch {
      setAudioHint("Browser blocked audio. Try tapping the unlock button once.");
    }
  };

  const toggleAudio = async () => {
    const audio = audioRef.current;
    if (!audio || !audioUnlocked) return;

    if (audioPlaying) {
      audio.pause();
      setAudioPlaying(false);
      setAudioHint("Audio paused.");
      return;
    }

    try {
      await audio.play();
      setAudioPlaying(true);
      setAudioHint("Audio resumed.");
    } catch {
      setAudioHint("Could not resume audio. Tap again.");
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      <audio ref={audioRef} src="/interstellar.mp3" preload="auto" />
      <Starfield />
      <div className="absolute inset-0 bg-grid pointer-events-none opacity-25" />
      <div className="fixed inset-0 film-grain pointer-events-none opacity-30 z-[1]" aria-hidden />
      <Nav />
      <MissionHUD />
      <SectionRail />

      {/* HOME */}
      <section id="home" className="relative min-h-[100dvh] overflow-hidden">
        <GargantuaField className="z-0 opacity-95" />
        <div className="absolute inset-0 z-[1] pointer-events-none bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute inset-0 z-[1] pointer-events-none vignette" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 min-h-[100dvh] flex flex-col justify-end pb-16 pt-28 pointer-events-none">
        <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }} className="max-w-2xl pointer-events-auto">
          <p className="font-display text-xs uppercase tracking-[0.35em] text-primary mb-5">◇ Endurance · Docking Bay · Bengaluru</p>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] mb-5">
            Software<br />
            <span className="text-gradient text-glow">Developer.</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-lg mb-4 italic border-l-2 border-primary/40 pl-4">
            &ldquo;We used to look up at the sky and wonder at our place in the stars.&rdquo;
          </p>
          <p className="text-base text-muted-foreground max-w-lg mb-6">
            SDE at <span className="text-foreground font-medium">Ninjacart</span> — Spring Boot, React, Redis, payments, and systems built to survive deep gravity.
          </p>
          <motion.div
            className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {[
              { label: "Email", href: socialLinks.email },
              { label: "LinkedIn", href: socialLinks.linkedin, external: true },
              { label: "GitHub", href: socialLinks.github, external: true },
              { label: "LeetCode", href: socialLinks.leetcode, external: true },
            ].map((link) => (
              <motion.a
                key={link.label}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noreferrer" : undefined}
                whileHover={{ y: -2, color: "oklch(0.82 0.16 75)" }}
                className="px-3 py-1.5 rounded-full border border-border/80 bg-card/30 backdrop-blur hover:border-primary/50 transition"
              >
                {link.label}
              </motion.a>
            ))}
          </motion.div>
          <div className="flex flex-wrap gap-3">
            <motion.button
              onClick={scrollTo("projects")}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:opacity-90 transition glow"
            >
              Initiate Launch →
            </motion.button>
            <motion.button
              onClick={scrollTo("contact")}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 rounded-full border border-primary/30 text-foreground bg-background/30 backdrop-blur hover:bg-secondary/80 transition"
            >
              Open Comms
            </motion.button>
          </div>
          <div className="mt-12 grid grid-cols-3 gap-6 max-w-md">
            {heroStats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + i * 0.12, type: "spring", stiffness: 120 }}
              >
                <div className="text-2xl font-display font-bold text-gradient">{s.value}</div>
                <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          animate={{ y: [0, 10, 0], opacity: [0.35, 1, 0.35] }}
          transition={{ duration: 2.8, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs text-muted-foreground font-display tracking-[0.35em] uppercase pointer-events-none"
        >
          Scroll — enter tesseract
        </motion.div>
        </div>
      </section>

      <Tesseract label="Entering the Tesseract" />

      {/* ABOUT */}
      <section id="about" className="relative max-w-6xl mx-auto px-6 py-24 z-10">
        <Reveal>
          <p className="font-display text-xs uppercase tracking-[0.3em] text-primary mb-3">◇ Dimension I · About</p>
          <h2 className="text-4xl sm:text-5xl font-bold mb-10">
            Engineer. <span className="text-gradient">Builder.</span> Learner.
          </h2>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-10">
          <Reveal delay={0.1}>
            <div className="space-y-5 text-lg text-muted-foreground leading-relaxed">
              <p>I'm a software developer based in Bengaluru, currently building backend & full-stack systems at <span className="text-foreground font-medium">Ninjacart</span>.</p>
              <p>I love working at the seams — API orchestration, payment workflows, caching layers, and the occasional React screen shipped to production.</p>
              <p>Outside of work, I tinker with cybersecurity (DRDO, 2024) and immersive web experiences.</p>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="md:col-span-2 grid sm:grid-cols-2 gap-4">
              {[
                { label: "Education", title: "B.Tech, IT · BPIT", sub: "Delhi · 8.67 CGPA · 2021–2025" },
                { label: "Location", title: "Bengaluru, India", sub: "+91 9650124336 · Open to collaboration" },
                { label: "Honors", title: "VIHAAN Hackathon", sub: "IEEE DTU · April 2023" },
                { label: "Currently", title: "SDE @ Ninjacart", sub: "Reports · Payments · GST · React" },
              ].map((c) => (
                <motion.div
                  key={c.label}
                  whileHover={{ y: -3, borderColor: "oklch(0.82 0.16 75 / 45%)" }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="rounded-xl border border-border bg-card/40 backdrop-blur p-6 transition-colors"
                >
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2 font-display">{c.label}</p>
                  <p className="font-medium text-foreground">{c.title}</p>
                  <p className="text-sm text-muted-foreground mt-1">{c.sub}</p>
                </motion.div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <EducationSection />

      <Tesseract label="Through Time" />

      <WorkSection />

      <Tesseract label="Other Worlds" />

      <ProjectsSection />

      <Tesseract label="Open Comms" />

      {/* CONTACT */}
      <section id="contact" className="relative max-w-6xl mx-auto px-6 py-24">
        <Reveal>
          <p className="font-display text-xs uppercase tracking-[0.3em] text-primary mb-3">◇ Dimension IV · Contact</p>
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Send a <span className="text-gradient text-glow">transmission</span>.
          </h2>
          <p className="text-muted-foreground mb-12 max-w-xl">
            Drop a message and your spaceship launches into the void carrying it to my inbox.
          </p>
        </Reveal>
        <ContactSection />
      </section>

      <footer className="relative border-t border-border py-8 text-center text-sm text-muted-foreground">
        © 2026 Anurag Gupta · Built with React · Inspired by Interstellar
      </footer>

      <InfinityAudioControl
        unlocked={audioUnlocked}
        playing={audioPlaying}
        error={audioHint}
        onUnlock={unlockAudio}
        onToggle={toggleAudio}
      />
    </div>
  );
}
