import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

export default function MissionHUD() {
  const { scrollYProgress } = useScroll();
  const dilation = useTransform(scrollYProgress, [0, 1], [1, 127]);
  const [dilationLabel, setDilationLabel] = useState("1");
  const [clock, setClock] = useState("00:00:00");

  useMotionValueEvent(dilation, "change", (v) => {
    setDilationLabel(Math.round(v).toString());
  });
  const [coords, setCoords] = useState({ lat: "12.97", lon: "77.59" });

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setClock(now.toTimeString().slice(0, 8));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const lat = (12 + (e.clientY / window.innerHeight) * 2).toFixed(2);
      const lon = (77 + (e.clientX / window.innerWidth) * 2).toFixed(2);
      setCoords({ lat, lon });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-40 hidden sm:block" aria-hidden>
      <div className="absolute top-20 left-6 font-display text-[10px] uppercase tracking-[0.35em] text-muted-foreground/80 space-y-2">
        <p className="text-primary/90 tracking-[0.5em]">Endurance · Mission Log</p>
        <p>Earth UTC · {clock}</p>
        <p>
          Fix · {coords.lat}° N · {coords.lon}° E
        </p>
      </div>

      <div className="absolute top-20 right-6 text-right font-display text-[10px] uppercase tracking-[0.35em] text-muted-foreground/80 space-y-2 max-w-[200px]">
        <p className="text-primary/90">Gravitational field</p>
        <div className="h-1 w-full rounded-full bg-border/60 overflow-hidden mt-1">
          <motion.div
            className="h-full bg-gradient-to-r from-primary/40 via-primary to-accent"
            style={{ scaleX: scrollYProgress, transformOrigin: "left" }}
          />
        </div>
        <p className="normal-case tracking-normal text-[11px] text-muted-foreground">
          Time dilation factor · <span className="text-primary tabular-nums">{dilationLabel}</span>×
        </p>
      </div>

      <div className="absolute bottom-24 left-6 font-display text-[10px] uppercase tracking-[0.4em] text-muted-foreground/70">
        <motion.p
          animate={{ opacity: [0.35, 0.9, 0.35] }}
          transition={{ duration: 3.5, repeat: Infinity }}
        >
          ◇ Move cursor — distort the accretion disk
        </motion.p>
      </div>
    </div>
  );
}
