import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "motion/react";
import { ChevronRight, Download } from "lucide-react";
import { Aurora } from "../ui/Aurora";
import { Eyebrow } from "../ui/Reveal";
import { cn } from "../lib/utils";

const PROMPT = "Dragonfly in a new civilization at Andromeda galaxy";

const steps = [
  {
    title: "Describe",
    body: "Write what you see in your head. A sentence is enough; style words help.",
  },
  {
    title: "Diffuse",
    body: "The model starts from pure random noise, seeded by your words.",
  },
  {
    title: "Resolve",
    body: "Step by step, noise is removed until shapes, light and detail appear.",
  },
  {
    title: "Keep it",
    body: "Download the final image in one tap, or remix the prompt and go again.",
  },
];

export function Process() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [active, setActive] = useState(0);
  useMotionValueEvent(p, "change", (v) => setActive(Math.min(3, Math.max(0, Math.floor(v * 4.2)))));

  const typed = useTransform(p, [0.02, 0.2], [0, PROMPT.length], { clamp: true });
  const typedText = useTransform(typed, (n) => PROMPT.slice(0, Math.round(n)));
  const noiseOpacity = useTransform(p, [0.18, 0.32, 0.52, 0.8], [0, 1, 0.85, 0]);
  const imgOpacity = useTransform(p, [0.3, 0.5], [0, 1]);
  const blur = useTransform(p, [0.42, 0.82], [36, 0]);
  const sat = useTransform(p, [0.42, 0.82], [0.3, 1]);
  const filter = useMotionTemplate`blur(${blur}px) saturate(${sat})`;
  const scale = useTransform(p, [0.3, 0.85], [1.25, 1]);
  const stepNum = useTransform(p, [0.25, 0.82], [0, 50], { clamp: true });
  const stepText = useTransform(stepNum, (n) => `step ${String(Math.round(n)).padStart(2, "0")}/50`);
  const bar = useTransform(p, [0, 1], [0, 1]);

  return (
    <section id="process" ref={ref} className="relative mt-16 h-[360vh] md:mt-24">
      <div className="sticky top-0 flex h-[100svh] items-center px-3 py-3 md:px-5 md:py-5">
        <div className="relative flex h-full w-full items-center overflow-clip rounded-[2rem] bg-night text-paper">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-72 -top-72 h-[900px] w-[900px] bg-[radial-gradient(closest-side,rgb(91_61_245/0.32),transparent)]"
          />
          <div className="mx-auto grid w-full max-w-6xl items-center gap-8 px-6 md:grid-cols-[1fr_1.05fr] md:gap-16 md:px-10">
            <div className="order-2 md:order-1">
              <Eyebrow dark>How it works</Eyebrow>
              <h2 className="mt-5 text-[clamp(2.1rem,5vw,4.4rem)] font-medium leading-[0.95] tracking-[-0.04em]">
                After you hit
                <br />
                <span className="font-[200] tracking-[-0.03em] text-accent-2">Generate.</span>
              </h2>

              <ol className="mt-10 hidden space-y-1 md:block">
                {steps.map((s, i) => (
                  <li key={s.title} className="relative flex gap-5 py-3">
                    <span
                      className={cn(
                        "pt-1 font-mono text-xs transition-colors duration-500",
                        i === active ? "text-accent-2" : "text-paper/30"
                      )}
                    >
                      0{i + 1}
                    </span>
                    <div
                      className={cn(
                        "transition-all duration-500",
                        i === active ? "opacity-100" : "opacity-35"
                      )}
                    >
                      <h3 className="text-xl font-medium tracking-tight">{s.title}</h3>
                      <motion.p
                        initial={false}
                        animate={{
                          height: i === active ? "auto" : 0,
                          opacity: i === active ? 1 : 0,
                        }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className="max-w-sm overflow-hidden text-[15px] leading-relaxed text-paper/60"
                      >
                        <span className="block pt-1.5">{s.body}</span>
                      </motion.p>
                    </div>
                  </li>
                ))}
              </ol>

              <div className="mt-6 min-h-[92px] md:hidden">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.div
                    key={active}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4 }}
                  >
                    <p className="font-mono text-xs text-accent-2">
                      0{active + 1} / 04 · {steps[active].title}
                    </p>
                    <p className="mt-2 text-[15px] leading-relaxed text-paper/65">
                      {steps[active].body}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <div className="order-1 mx-auto w-full max-w-[min(520px,52svh)] md:order-2 md:max-w-[520px]">
              <div className="relative aspect-square w-full overflow-hidden rounded-[1.4rem] bg-ink-2 ring-1 ring-white/10">
                <div className="absolute inset-0 [background-image:radial-gradient(rgb(255_255_255/0.08)_1px,transparent_1px)] [background-size:18px_18px]" />
                <motion.img
                  src="/showcase/50.jpg"
                  alt={PROMPT}
                  style={{ opacity: imgOpacity, filter, scale }}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <motion.div style={{ opacity: noiseOpacity }} className="absolute inset-0">
                  <Aurora className="bg-transparent" />
                </motion.div>

                <div className="absolute left-3 right-3 top-3 flex">
                  <div className="max-w-full truncate rounded-full bg-black/65 px-3.5 py-2 font-mono text-[11px] text-paper/90">
                    <ChevronRight className="mr-1 inline h-3 w-3 -translate-y-px text-accent-2" />
                    <motion.span>{typedText}</motion.span>
                    <motion.span
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="ml-0.5 inline-block h-3 w-[1.5px] translate-y-0.5 bg-paper/80"
                    />
                  </div>
                </div>

                <div className="absolute inset-x-3 bottom-3 rounded-xl bg-black/65 p-3">
                  <div className="flex items-center justify-between font-mono text-[10.5px] text-paper/70">
                    <motion.span>{stepText}</motion.span>
                    <span>{steps[active].title.toLowerCase()} · 512×512</span>
                  </div>
                  <div className="mt-2 h-[3px] overflow-hidden rounded-full bg-white/10">
                    <motion.div style={{ scaleX: bar }} className="h-full origin-left bg-accent-2" />
                  </div>
                </div>

                <AnimatePresence>
                  {active === 3 && (
                    <motion.div
                      initial={{ opacity: 0, y: 12, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 12, scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 300, damping: 24 }}
                      className="absolute bottom-[4.6rem] right-3 inline-flex items-center gap-2 rounded-full bg-paper px-3.5 py-2 text-xs font-medium text-ink shadow-xl"
                    >
                      <Download className="h-3.5 w-3.5" /> imagify-dragonfly.jpg
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
