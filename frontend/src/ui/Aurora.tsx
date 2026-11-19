import { motion } from "motion/react";
import { cn } from "../lib/utils";

const orbs = [
  { color: "rgb(91 61 245 / 0.8)", size: "70%", left: "-15%", top: "-15%", x: ["0%", "30%", "0%"], y: ["0%", "20%", "0%"], d: 9 },
  { color: "rgb(138 116 255 / 0.6)", size: "65%", left: "45%", top: "45%", x: ["0%", "-30%", "0%"], y: ["0%", "-25%", "0%"], d: 11 },
  { color: "rgb(255 170 140 / 0.5)", size: "50%", left: "55%", top: "-5%", x: ["0%", "-20%", "0%"], y: ["0%", "35%", "0%"], d: 13 },
  { color: "rgb(70 140 255 / 0.5)", size: "55%", left: "-5%", top: "55%", x: ["0%", "35%", "0%"], y: ["0%", "-20%", "0%"], d: 10 },
];

export function Aurora({ className, sweep = true }: { className?: string; sweep?: boolean }) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden bg-ink", className)} aria-hidden>
      {orbs.map((o, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: o.size,
            height: o.size,
            left: o.left,
            top: o.top,
            background: `radial-gradient(closest-side, ${o.color}, transparent)`,
          }}
          animate={{ x: o.x, y: o.y, scale: [1, 1.25, 1] }}
          transition={{ duration: o.d, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      <div className="absolute inset-0 [background-image:radial-gradient(rgb(255_255_255/0.07)_1px,transparent_1px)] [background-size:16px_16px]" />

      {sweep && (
        <motion.div
          className="absolute inset-x-0 h-1/3 bg-gradient-to-b from-transparent via-white/[0.07] to-transparent"
          initial={{ y: "-100%" }}
          animate={{ y: "300%" }}
          transition={{ duration: 3.2, repeat: Infinity, ease: [0.65, 0, 0.35, 1], repeatDelay: 0.4 }}
        />
      )}

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_35%,rgb(14_14_12/0.55)_100%)]" />
    </div>
  );
}
