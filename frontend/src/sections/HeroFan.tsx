import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { showcase, type ShowcaseItem } from "../lib/showcase";
import { useViewportWidth } from "../ui/useViewport";

export function HeroFan({ progress }: { progress: MotionValue<number> }) {
  const vw = useViewportWidth();
  const count = vw < 640 ? 5 : vw < 1024 ? 7 : 9;
  const vh = typeof window === "undefined" ? 900 : window.innerHeight;
  const cardW = Math.round(Math.min(230, Math.max(128, Math.min(vw * 0.15, vh * 0.2))));
  const spacing = cardW * (vw < 640 ? 0.5 : 0.66);
  const items = showcase.slice(0, count);
  const mid = (count - 1) / 2;
  const [hovered, setHovered] = useState<number | null>(null);

  const mx = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 60, damping: 18 });
  const rotate = useTransform(smx, [-1, 1], [-2.5, 2.5]);
  const x = useTransform(smx, [-1, 1], [-22, 22]);

  const spread = useTransform(progress, [0, 1], [1, 1.55]);
  const lift = useTransform(progress, [0, 1], [0, -90]);

  useEffect(() => {
    const on = (e: PointerEvent) => mx.set((e.clientX / window.innerWidth) * 2 - 1);
    window.addEventListener("pointermove", on);
    return () => window.removeEventListener("pointermove", on);
  }, [mx]);

  return (
    <motion.div
      style={{ rotate, x, y: lift, height: cardW * 1.45 }}
      className="relative w-full origin-bottom"
    >
      {items.map((item, i) => (
        <FanCard
          key={item.src}
          item={item}
          offset={i - mid}
          width={cardW}
          spacing={spacing}
          spread={spread}
          isHovered={hovered === i}
          onHover={(h) => setHovered(h ? i : null)}
          zIndex={hovered === i ? 50 : 20 - Math.abs(Math.round(i - mid))}
        />
      ))}
    </motion.div>
  );
}

function FanCard({
  item,
  offset,
  width,
  spacing,
  spread,
  isHovered,
  onHover,
  zIndex,
}: {
  item: ShowcaseItem;
  offset: number;
  width: number;
  spacing: number;
  spread: MotionValue<number>;
  isHovered: boolean;
  onHover: (h: boolean) => void;
  zIndex: number;
}) {
  const navigate = useNavigate();
  const baseX = offset * spacing;
  const baseRot = offset * 6.5;
  const baseY = offset * offset * 7;
  const x = useTransform(spread, (s) => baseX * s);

  return (
    <motion.div
      style={{ x, zIndex, width, marginLeft: -width / 2 }}
      className="absolute bottom-0 left-1/2"
    >
      <motion.button
        type="button"
        onClick={() => navigate(`/studio?prompt=${encodeURIComponent(item.prompt)}`)}
        onHoverStart={() => onHover(true)}
        onHoverEnd={() => onHover(false)}
        onFocus={() => onHover(true)}
        onBlur={() => onHover(false)}
        aria-label={`Remix prompt: ${item.prompt}`}
        initial={{ y: 320, rotate: 0, opacity: 0, scale: 0.85 }}
        animate={
          isHovered
            ? { y: baseY - 40, rotate: 0, opacity: 1, scale: 1.08 }
            : { y: baseY, rotate: baseRot, opacity: 1, scale: 1 }
        }
        transition={{
          type: "spring",
          stiffness: isHovered ? 260 : 120,
          damping: isHovered ? 22 : 18,
          delay: isHovered ? 0 : 0.55 + Math.abs(offset) * 0.07,
        }}
        className="block w-full origin-bottom rounded-[18px] bg-white p-1.5 text-left shadow-[0_30px_60px_-28px_rgb(14_14_12/0.55),0_0_0_1px_rgb(14_14_12/0.05)]"
      >
        <div className="overflow-hidden rounded-[13px] bg-paper-2">
          <img
            src={item.src}
            alt={item.prompt}
            draggable={false}
            className="aspect-square w-full object-cover"
          />
        </div>
        <div className="flex items-center justify-between gap-2 px-1.5 pb-1 pt-2">
          <span className="truncate font-mono text-[10px] text-muted">{item.prompt}</span>
          <motion.span
            animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -4 }}
            className="shrink-0 font-mono text-[10px] text-accent"
          >
            remix →
          </motion.span>
        </div>
      </motion.button>
    </motion.div>
  );
}
