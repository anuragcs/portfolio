import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const sections = [
  { id: "about", label: "About" },
  { id: "work", label: "Work" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
] as const;

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 48);
      let current = "home";
      for (const s of [{ id: "home" as const }, ...sections]) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= 140) current = s.id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", `#${id}`);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "backdrop-blur-xl bg-background/75 border-b border-border/80 py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between gap-4">
        <a
          href="#home"
          onClick={goTo("home")}
          className="font-display text-base sm:text-lg font-semibold tracking-tight text-foreground hover:text-primary transition-colors shrink-0"
        >
          Anurag Gupta
        </a>

        <nav className="hidden md:flex items-center gap-1 text-sm">
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              onClick={goTo(s.id)}
              className={`relative px-3 py-1.5 rounded-full transition-colors ${
                active === s.id ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {active === s.id && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-full border border-primary/30 bg-primary/10"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10">{s.label}</span>
            </a>
          ))}
        </nav>

        <button
          type="button"
          className="md:hidden px-3 py-1.5 rounded-full border border-border text-xs font-display uppercase tracking-wider"
          onClick={() => setMenuOpen((o) => !o)}
          aria-expanded={menuOpen}
          aria-label="Toggle menu"
        >
          {menuOpen ? "Close" : "Menu"}
        </button>
      </div>

      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden border-t border-border/60 bg-background/95 backdrop-blur-xl"
        >
          <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col gap-2">
            {[{ id: "home", label: "Home" }, ...sections].map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                onClick={goTo(s.id)}
                className="py-2 text-sm text-muted-foreground hover:text-primary"
              >
                {s.label}
              </a>
            ))}
          </div>
        </motion.div>
      )}
    </header>
  );
}
