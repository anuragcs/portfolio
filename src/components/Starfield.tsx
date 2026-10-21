import { useEffect, useRef } from "react";

/**
 * Interactive starfield with scroll-driven warp streaks and cursor parallax.
 */
export default function Starfield() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let w = 0;
    let h = 0;
    let raf = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const mouse = { x: 0, y: 0 };
    let warp = 1;
    let lastScrollY = window.scrollY;

    type Star = { x: number; y: number; z: number; r: number; tw: number };
    const stars: Star[] = [];

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      stars.length = 0;
      const count = Math.floor((w * h) / 4200);
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          z: Math.random() * 0.9 + 0.1,
          r: Math.random() * 1.3 + 0.2,
          tw: Math.random() * Math.PI * 2,
        });
      }
    };

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = (e.clientX - rect.left - w / 2) / w;
      mouse.y = (e.clientY - rect.top - h / 2) / h;
    };

    const onScroll = () => {
      const dy = Math.abs(window.scrollY - lastScrollY);
      lastScrollY = window.scrollY;
      warp = Math.min(5.5, warp + dy * 0.04);
    };

    let t = 0;
    const draw = () => {
      t += 0.016;
      warp += (1 - warp) * 0.04;

      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        const px = s.x + mouse.x * 40 * s.z;
        const py = s.y + mouse.y * 40 * s.z;
        const a = 0.35 + Math.sin(t * 1.5 + s.tw) * 0.3 + s.z * 0.25;
        const speed = s.z * 0.05 * warp;

        if (warp > 1.8) {
          const len = speed * 12 * warp;
          ctx.strokeStyle = `rgba(220, 230, 255, ${Math.min(0.85, a)})`;
          ctx.lineWidth = s.r * 0.6;
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(px, py + len);
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(px, py, s.r * s.z, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(220, 230, 255, ${Math.min(1, Math.max(0, a))})`;
          ctx.fill();
        }

        s.y += speed;
        if (s.y > h) {
          s.y = 0;
          s.x = Math.random() * w;
        }
      }
      raf = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="fixed inset-0 w-full h-full pointer-events-none"
      aria-hidden
    />
  );
}
