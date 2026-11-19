import { motion } from "motion/react";
import { cn } from "../lib/utils";

export function BlurText({
  text,
  className,
  wordClassName,
  delay = 0,
  stagger = 0.08,
  inView = false,
}: {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  stagger?: number;
  inView?: boolean;
}) {
  const words = text.split(" ");
  const target = {
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
    transitionEnd: { filter: "none" },
  };
  return (
    <span className={cn("inline", className)} aria-label={text}>
      {words.map((w, i) => (
        <motion.span
          key={`${w}-${i}`}
          aria-hidden
          className={cn("inline-block", wordClassName)}
          initial={{ opacity: 0, filter: "blur(14px)", y: "0.25em" }}
          {...(inView
            ? { whileInView: target, viewport: { once: true, margin: "-10% 0px" } }
            : { animate: target })}
          transition={{
            duration: 0.9,
            delay: delay + i * stagger,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {w}
          {i < words.length - 1 && " "}
        </motion.span>
      ))}
    </span>
  );
}
