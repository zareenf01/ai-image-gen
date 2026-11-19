import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { showcase } from "../lib/showcase";
import { BlurText } from "../ui/BlurText";
import { Eyebrow } from "../ui/Reveal";

interface Trail {
  id: number;
  x: number;
  y: number;
  src: string;
  r: number;
}

export function CTA() {
  const ref = useRef<HTMLDivElement>(null);
  const [trail, setTrail] = useState<Trail[]>([]);
  const last = useRef({ x: 0, y: 0 });
  const counter = useRef(0);

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (Math.hypot(x - last.current.x, y - last.current.y) < 90) return;
    last.current = { x, y };
    const id = counter.current++;
    const item: Trail = {
      id,
      x,
      y,
      src: showcase[id % showcase.length].src,
      r: (Math.random() - 0.5) * 18,
    };
    setTrail((t) => [...t.slice(-7), item]);
    setTimeout(() => setTrail((t) => t.filter((i) => i.id !== id)), 900);
  };

  return (
    <section className="px-3 md:px-5">
      <div
        ref={ref}
        onPointerMove={onMove}
        className="relative flex min-h-[78svh] flex-col items-center justify-center overflow-hidden rounded-[2rem] bg-paper-2/70 px-6 py-24 text-center"
      >
        <AnimatePresence>
          {trail.map((t) => (
            <motion.img
              key={t.id}
              src={t.src}
              alt=""
              initial={{ opacity: 0, scale: 0.4, rotate: t.r - 10 }}
              animate={{ opacity: 1, scale: 1, rotate: t.r }}
              exit={{ opacity: 0, scale: 0.85, filter: "blur(10px)" }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              style={{ left: t.x, top: t.y }}
              className="pointer-events-none absolute z-0 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-2xl object-cover shadow-[0_30px_60px_-25px_rgb(14_14_12/0.6)] md:h-52 md:w-52"
            />
          ))}
        </AnimatePresence>

        <div className="relative z-10 flex flex-col items-center">
          <Eyebrow>Your turn</Eyebrow>
          <h2 className="mt-6 text-[clamp(2.8rem,9vw,8.5rem)] font-medium leading-[0.9] tracking-[-0.05em]">
            <BlurText text="What will you" inView />
            <br />
            <BlurText
              text="imagine?"
              inView
              delay={0.2}
              className="font-[200] tracking-[-0.03em]"
            />
          </h2>
          <p className="mt-6 max-w-sm text-[15px] text-muted">
            The studio is open. Bring a sentence; leave with an image.
          </p>
          <Link
            to="/studio"
            className="group relative mt-10 inline-flex items-center gap-3 overflow-hidden rounded-full bg-ink py-2 pl-7 pr-2 text-[15px] text-paper transition-transform active:scale-95"
          >
            <span className="absolute inset-0 translate-y-full rounded-full bg-accent transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0" />
            <span className="relative">Start creating</span>
            <span className="relative grid h-10 w-10 place-items-center rounded-full bg-paper text-ink">
              <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:rotate-45" />
            </span>
          </Link>
          <p className="mt-8 hidden font-mono text-[11px] uppercase tracking-[0.16em] text-faint md:block">
            (psst, move your cursor around)
          </p>
        </div>
      </div>
    </section>
  );
}
