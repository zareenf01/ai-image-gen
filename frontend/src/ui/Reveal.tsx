import { motion, type HTMLMotionProps } from "motion/react";

export function Reveal({
  delay = 0,
  y = 24,
  blur = true,
  children,
  ...rest
}: HTMLMotionProps<"div"> & { delay?: number; y?: number; blur?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y, filter: blur ? "blur(8px)" : "blur(0px)" }}
      whileInView={{
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transitionEnd: { filter: "none" },
      }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export function Eyebrow({
  children,
  className = "",
  dark = false,
}: {
  children: React.ReactNode;
  className?: string;
  dark?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] ${
        dark ? "text-paper/60" : "text-muted"
      } ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-accent" />
      {children}
    </span>
  );
}
