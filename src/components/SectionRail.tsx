import { motion } from "framer-motion";

const sections = [
  { id: "home", label: "01 · Dock" },
  { id: "about", label: "02 · Brief" },
  { id: "work", label: "03 · Orbit" },
  { id: "projects", label: "04 · Launch" },
  { id: "contact", label: "05 · Comms" },
] as const;

export default function SectionRail() {
  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", `#${id}`);
  };

  return (
    <nav
      className="fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col gap-3"
      aria-label="Section navigation"
    >
      {sections.map((s) => (
        <motion.a
          key={s.id}
          href={`#${s.id}`}
          onClick={go(s.id)}
          className="group flex items-center gap-3 justify-end"
          whileHover={{ x: -4 }}
        >
          <span className="opacity-0 group-hover:opacity-100 transition-opacity font-display text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            {s.label}
          </span>
          <span className="w-2 h-2 rounded-full border border-primary/50 bg-background group-hover:bg-primary group-hover:shadow-[0_0_12px_oklch(0.7_0.19_50/80%)] transition-all" />
        </motion.a>
      ))}
    </nav>
  );
}
