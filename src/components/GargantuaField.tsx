import { useEffect, useRef } from "react";

type Particle = {
  angle: number;
  radius: number;
  speed: number;
  size: number;
  hue: number;
};

/**
 * Interactive Gargantua-style black hole — accretion disk, photon ring,
 * and in-falling particles that respond to cursor gravity.
 */
export default function GargantuaField({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointer = useRef({ x: 0.5, y: 0.5, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let w = 0;
    let h = 0;
    let raf = 0;
    let t = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const particles: Particle[] = [];

    const seedParticles = () => {
      particles.length = 0;
      const count = Math.min(420, Math.floor((w * h) / 2800));
      for (let i = 0; i < count; i++) {
        particles.push({
          angle: Math.random() * Math.PI * 2,
          radius: 0.35 + Math.random() * 0.55,
          speed: 0.0015 + Math.random() * 0.004,
          size: Math.random() * 1.8 + 0.4,
          hue: 45 + Math.random() * 35,
        });
      }
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seedParticles();
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.current = {
        x: (e.clientX - rect.left) / w,
        y: (e.clientY - rect.top) / h,
        active: true,
      };
    };
    const onLeave = () => {
      pointer.current.active = false;
    };

    const draw = () => {
      t += 0.016;
      const cx = w * (0.52 + (pointer.current.active ? (pointer.current.x - 0.5) * 0.06 : 0));
      const cy = h * (0.48 + (pointer.current.active ? (pointer.current.y - 0.5) * 0.06 : 0));
      const baseR = Math.min(w, h) * 0.22;
      const pull = pointer.current.active ? 1.35 : 1;

      ctx.fillStyle = "rgba(4, 6, 12, 0.22)";
      ctx.fillRect(0, 0, w, h);

      // Gravitational lens glow
      const lens = ctx.createRadialGradient(cx, cy, baseR * 0.2, cx, cy, baseR * 3.2);
      lens.addColorStop(0, "rgba(255, 180, 80, 0.08)");
      lens.addColorStop(0.35, "rgba(255, 120, 40, 0.04)");
      lens.addColorStop(1, "transparent");
      ctx.fillStyle = lens;
      ctx.fillRect(0, 0, w, h);

      // Accretion disk (tilted ellipse)
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(0.55);
      ctx.scale(1, 0.32);
      for (let ring = 0; ring < 5; ring++) {
        const r = baseR * (1.05 + ring * 0.12);
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.strokeStyle = `oklch(${0.72 - ring * 0.06} 0.16 ${62 + ring * 4} / ${0.35 - ring * 0.05})`;
        ctx.lineWidth = 3 - ring * 0.4;
        ctx.stroke();
      }
      ctx.restore();

      // Spinning hot disk segment
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(t * 0.35);
      ctx.scale(1, 0.28);
      const diskGrad = ctx.createConicGradient(0, 0, 0);
      diskGrad.addColorStop(0, "rgba(255, 220, 140, 0.85)");
      diskGrad.addColorStop(0.2, "rgba(255, 140, 60, 0.5)");
      diskGrad.addColorStop(0.45, "rgba(80, 40, 20, 0.15)");
      diskGrad.addColorStop(0.7, "rgba(255, 180, 90, 0.55)");
      diskGrad.addColorStop(1, "rgba(255, 220, 140, 0.85)");
      ctx.beginPath();
      ctx.arc(0, 0, baseR * 1.15, 0, Math.PI * 2);
      ctx.strokeStyle = diskGrad;
      ctx.lineWidth = baseR * 0.35;
      ctx.globalCompositeOperation = "screen";
      ctx.stroke();
      ctx.restore();

      // Photon ring
      ctx.beginPath();
      ctx.arc(cx, cy, baseR * 0.92, 0, Math.PI * 2);
      ctx.strokeStyle = "oklch(0.92 0.14 80 / 75%)";
      ctx.lineWidth = 2;
      ctx.shadowColor = "oklch(0.85 0.2 70)";
      ctx.shadowBlur = 18;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Event horizon
      const hole = ctx.createRadialGradient(cx, cy, 0, cx, cy, baseR * 0.78);
      hole.addColorStop(0, "#000");
      hole.addColorStop(0.85, "#000");
      hole.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = hole;
      ctx.beginPath();
      ctx.arc(cx, cy, baseR * 0.78, 0, Math.PI * 2);
      ctx.fill();

      // Orbiting particles
      ctx.globalCompositeOperation = "source-over";
      for (const p of particles) {
        const grav = pull * (1.8 - p.radius);
        p.angle += p.speed * grav;
        p.radius -= 0.00035 * grav;
        if (p.radius < 0.08) {
          p.radius = 0.55 + Math.random() * 0.4;
          p.angle = Math.random() * Math.PI * 2;
        }

        const px = cx + Math.cos(p.angle) * p.radius * baseR * 2.8;
        const py = cy + Math.sin(p.angle) * p.radius * baseR * 1.1;
        const alpha = Math.min(1, p.radius * 1.6);
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `oklch(0.88 0.14 ${p.hue} / ${alpha * 0.9})`;
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full touch-none ${className}`}
      aria-hidden
    />
  );
}
