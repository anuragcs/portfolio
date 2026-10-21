import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import {
  Award,
  Code2,
  Database,
  Layout,
  Network,
  Server,
  Zap,
} from "lucide-react";
import { useState } from "react";
import {
  education,
  experience,
  projects,
  skills,
} from "@/lib/portfolio-data";

const skillIcons = {
  server: Server,
  code: Code2,
  layout: Layout,
  database: Database,
  zap: Zap,
  network: Network,
} as const;

export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function GlowCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const background = useMotionTemplate`radial-gradient(280px circle at ${x}px ${y}px, oklch(0.7 0.19 50 / 18%), transparent 65%)`;

  return (
    <motion.div
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - rect.left);
        y.set(e.clientY - rect.top);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 380, damping: 28 }}
      className={`group relative rounded-2xl border border-border bg-card/40 backdrop-blur overflow-hidden ${className}`}
    >
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background }}
      />
      <div className="relative">{children}</div>
    </motion.div>
  );
}

export function EducationSection() {
  return (
    <section id="education" className="relative max-w-6xl mx-auto px-6 py-8">
      <Reveal>
        <p className="font-display text-xs uppercase tracking-[0.3em] text-primary mb-3">
          ◇ Coordinates · Education
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold mb-8">
          Where I <span className="text-gradient">learned</span> to build.
        </h2>
      </Reveal>
      <motion.div
        className="grid md:grid-cols-3 gap-4"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-40px" }}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.12 } },
        }}
      >
        {education.map((e, i) => (
          <motion.div
            key={e.degree + e.period}
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 },
            }}
          >
            <GlowCard className="p-6 h-full hover:border-primary/60 transition-colors">
              <p className="text-xs uppercase tracking-wider text-muted-foreground font-display">
                {e.period}
              </p>
              <h3 className="text-lg font-semibold mt-2">{e.degree}</h3>
              <p className="text-sm text-muted-foreground mt-1">{e.school}</p>
              <p className="text-sm text-muted-foreground">{e.place}</p>
              <motion.p
                className="mt-4 text-2xl font-display font-bold text-gradient"
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.1, type: "spring" }}
              >
                {e.score}
              </motion.p>
            </GlowCard>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

export function WorkSection() {
  const [openId, setOpenId] = useState<string>(experience[0].id);

  return (
    <section id="work" className="relative max-w-6xl mx-auto px-6 py-24">
      <Reveal>
        <p className="font-display text-xs uppercase tracking-[0.3em] text-primary mb-3">
          ◇ Dimension II · Work
        </p>
        <h2 className="text-4xl sm:text-5xl font-bold mb-12">
          A <span className="text-gradient">timeline</span> across orbits.
        </h2>
      </Reveal>
      <div className="relative pl-8 border-l border-border space-y-4">
        {experience.map((j, i) => {
          const open = openId === j.id;
          return (
            <Reveal key={j.id} delay={i * 0.08}>
              <motion.button
                type="button"
                onClick={() => setOpenId(open ? "" : j.id)}
                className="relative w-full text-left rounded-xl border border-border/80 bg-card/30 backdrop-blur p-5 hover:border-primary/50 transition-colors"
                whileTap={{ scale: 0.995 }}
              >
                <motion.div
                  className="absolute -left-[37px] top-6 w-3 h-3 rounded-full bg-primary"
                  animate={open ? { scale: [1, 1.35, 1], opacity: [1, 0.7, 1] } : {}}
                  transition={{ duration: 2, repeat: open ? Infinity : 0 }}
                  style={{ boxShadow: open ? "0 0 16px oklch(0.7 0.19 50 / 70%)" : undefined }}
                />
                <p className="text-xs uppercase tracking-wider text-muted-foreground font-display">
                  {j.time}
                </p>
                <h3 className="text-xl sm:text-2xl font-bold mt-1">
                  {j.role} · <span className="text-gradient">{j.org}</span>
                </h3>
                <motion.div
                  initial={false}
                  animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <ul className="mt-4 space-y-2 text-muted-foreground text-sm sm:text-base">
                    {j.points.map((p) => (
                      <motion.li
                        key={p}
                        initial={{ opacity: 0, x: -8 }}
                        animate={open ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.35 }}
                      >
                        — {p}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
                <p className="mt-3 text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-display">
                  {open ? "▲ Collapse" : "▼ Expand transmission"}
                </p>
              </motion.button>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

export function ProjectsSection() {
  return (
    <section id="projects" className="relative max-w-6xl mx-auto px-6 py-24">
      <Reveal>
        <p className="font-display text-xs uppercase tracking-[0.3em] text-primary mb-3">
          ◇ Dimension III · Projects
        </p>
        <h2 className="text-4xl sm:text-5xl font-bold mb-12">
          Things I&apos;ve <span className="text-gradient">launched</span>.
        </h2>
      </Reveal>
      <div className="grid md:grid-cols-2 gap-6">
        {projects.map((p, i) => (
          <Reveal key={p.id} delay={i * 0.1}>
            <GlowCard className="p-8 h-full hover:border-primary/60">
              <p className="text-xs uppercase tracking-[0.25em] text-primary font-display mb-2">
                {p.tagline}
              </p>
              <h3 className="text-2xl font-bold mb-3 group-hover:text-gradient transition">
                {p.name}
              </h3>
              <p className="text-muted-foreground mb-5">{p.desc}</p>
              <ul className="space-y-2 mb-6">
                {p.highlights.map((h, hi) => (
                  <motion.li
                    key={h}
                    className="text-sm text-foreground/85 pl-3 border-l-2 border-primary/40"
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15 + hi * 0.08 }}
                  >
                    {h}
                  </motion.li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-2">
                {p.stack.map((s) => (
                  <span
                    key={s}
                    className="text-xs px-3 py-1 rounded-full border border-border text-muted-foreground group-hover:border-primary/40 transition"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </GlowCard>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.15}>
        <div className="mt-16">
          <p className="font-display text-xs uppercase tracking-[0.3em] text-muted-foreground mb-6 text-center">
            ◦ Instruments
          </p>
          <motion.div
            className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.06 } },
            }}
          >
            {skills.map((t) => {
              const Icon = skillIcons[t.icon];
              return (
                <motion.div
                  key={t.name}
                  variants={{
                    hidden: { opacity: 0, y: 12, scale: 0.92 },
                    show: { opacity: 1, y: 0, scale: 1 },
                  }}
                  whileHover={{
                    scale: 1.06,
                    boxShadow: "0 0 24px -6px oklch(0.7 0.19 50 / 55%)",
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-border bg-card/50 backdrop-blur cursor-default"
                >
                  <Icon className="w-4 h-4 text-primary" aria-hidden />
                  <span className="text-sm">{t.name}</span>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </Reveal>

      
    </section>
  );
}
