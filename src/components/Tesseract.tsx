import { motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";

/**
 * Interstellar tesseract divider — infinite bookshelf columns with scroll + pointer depth.
 */
export default function Tesseract({ label }: { label?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const pointerX = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: 60, damping: 18 });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const shiftA = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const shiftB = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const shiftC = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);
  const parallax = useTransform(smoothX, [-1, 1], ["-8%", "8%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.2, 1, 0.2]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.92, 1.08, 0.92]);

  const cols = Array.from({ length: 72 }).map((_, i) => {
    const w = 0.6 + ((i * 37) % 30) / 10;
    const hue = 60 + ((i * 13) % 40);
    const light = 0.45 + ((i * 7) % 40) / 100;
    const op = 0.4 + ((i * 11) % 60) / 100;
    return { w, color: `oklch(${light} 0.12 ${hue} / ${op})`, key: i };
  });

  return (
    <div
      ref={ref}
      className="relative w-full h-[65vh] overflow-hidden my-16 cursor-crosshair"
      aria-hidden
      onPointerMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        pointerX.set(((e.clientX - rect.left) / rect.width) * 2 - 1);
      }}
      onPointerLeave={() => pointerX.set(0)}
    >
      <div
        className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px z-10"
        style={{ background: "linear-gradient(90deg, transparent, oklch(0.85 0.18 70 / 70%), transparent)" }}
      />

      <motion.div
        style={{ x: shiftA, scale, opacity }}
        className="absolute inset-0 flex items-center justify-center gap-[2px] animate-tesseract-drift"
      >
        {cols.map((c) => (
          <motion.div
            key={`a${c.key}`}
            style={{ width: c.w, background: c.color, x: parallax }}
            className="h-full rounded-full"
          />
        ))}
      </motion.div>
      <motion.div
        style={{ x: shiftB, opacity: 0.65 }}
        className="absolute inset-0 flex items-center justify-center gap-[3px] blur-[1px] animate-tesseract-drift-reverse"
      >
        {cols.slice(0, 45).map((c) => (
          <div key={`b${c.key}`} style={{ width: c.w * 1.4, background: c.color }} className="h-[82%] rounded-full" />
        ))}
      </motion.div>
      <motion.div style={{ x: shiftC, opacity: 0.4 }} className="absolute inset-0 flex items-center justify-center gap-[6px] blur-[3px]">
        {cols.slice(0, 28).map((c) => (
          <div key={`c${c.key}`} style={{ width: c.w * 2.2, background: c.color }} className="h-[58%] rounded-full" />
        ))}
      </motion.div>

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, var(--background) 0%, transparent 18%, transparent 82%, var(--background) 100%)",
        }}
      />

      {label && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <motion.span
            style={{ scale }}
            className="font-display text-xs uppercase tracking-[0.45em] text-primary text-glow bg-background/50 backdrop-blur-md px-5 py-2.5 rounded-full border border-primary/20"
          >
            ◇ {label}
          </motion.span>
        </div>
      )}
    </div>
  );
}
