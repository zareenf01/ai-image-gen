import { motion } from "motion/react";
import { ArrowDown, Globe2, Timer } from "lucide-react";
import { Eyebrow, Reveal } from "../ui/Reveal";
import { BlurText } from "../ui/BlurText";
import { showcase } from "../lib/showcase";
import { cn } from "../lib/utils";

function Card({
  className,
  children,
  delay = 0,
}: {
  className?: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <Reveal
      delay={delay}
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-[1.6rem] border border-line bg-white/55 p-6 transition-colors duration-500 hover:bg-white md:p-7",
        className
      )}
    >
      {children}
    </Reveal>
  );
}

function CardText({ title, body }: { title: string; body: string }) {
  return (
    <div className="relative z-10">
      <h3 className="text-lg font-medium tracking-tight">{title}</h3>
      <p className="mt-1.5 max-w-xs text-[14.5px] leading-relaxed text-muted">{body}</p>
    </div>
  );
}

export function Features() {
  const remix = [showcase[2], showcase[0], showcase[5]];
  return (
    <section id="features" className="mx-auto max-w-6xl px-4 py-28 md:px-6 md:py-40">
      <div className="mb-12 flex flex-col items-start justify-between gap-6 md:mb-16 md:flex-row md:items-end">
        <div>
          <Eyebrow>Why Imagify</Eyebrow>
          <h2 className="mt-5 text-[clamp(2.2rem,5vw,4.25rem)] font-medium leading-[0.95] tracking-[-0.04em]">
            <BlurText text="Small tool." inView />
            <br />
            <BlurText
              text="Big imagination."
              inView
              delay={0.15}
              className="font-[200] tracking-[-0.03em]"
            />
          </h2>
        </div>
        <Reveal delay={0.2} className="max-w-sm text-[15px] leading-relaxed text-muted">
          No account, no credits. Type what you want to see and get an image back.
        </Reveal>
      </div>

      <div className="grid gap-3 md:grid-cols-3 md:grid-rows-[300px_260px]">
        <Card className="min-h-[320px] md:col-span-2">
          <CardText
            title="Remix anything"
            body="Every image in the gallery comes with its prompt. Tap one, tweak it, and make it yours."
          />
          <div className="pointer-events-none absolute -bottom-10 right-4 flex md:right-12">
            {remix.map((item, i) => (
              <div
                key={item.src}
                className={cn(
                  "w-32 rounded-2xl bg-white p-1 shadow-[0_20px_40px_-20px_rgb(14_14_12/0.5)] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] md:w-44",
                  i === 0 && "-rotate-[10deg] translate-x-10 group-hover:-translate-x-2 group-hover:-rotate-[16deg]",
                  i === 1 && "z-10 -translate-y-3 group-hover:-translate-y-8",
                  i === 2 && "rotate-[10deg] -translate-x-10 group-hover:translate-x-2 group-hover:rotate-[16deg]"
                )}
              >
                <img src={item.src} alt="" className="aspect-square w-full rounded-xl object-cover" />
              </div>
            ))}
          </div>
        </Card>

        <Card delay={0.08}>
          <div className="flex items-center justify-between">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-ink text-paper">
              <Timer className="h-4 w-4" />
            </span>
            <span className="font-mono text-[11px] text-muted">avg. a few seconds</span>
          </div>
          <div className="my-6">
            <div className="h-1.5 overflow-hidden rounded-full bg-paper-2">
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: false, margin: "-20%" }}
                transition={{ duration: 2.4, ease: [0.65, 0, 0.35, 1] }}
                className="h-full origin-left rounded-full bg-gradient-to-r from-accent to-accent-2"
              />
            </div>
          </div>
          <CardText title="Results in seconds" body="From prompt to finished image before your coffee cools." />
        </Card>

        <Card delay={0.04}>
          <div className="relative grid h-24 place-items-center overflow-hidden rounded-2xl bg-paper-2/70">
            <ArrowDown className="h-6 w-6 transition-transform duration-500 group-hover:translate-y-8 group-hover:opacity-0" />
            <ArrowDown className="absolute h-6 w-6 -translate-y-8 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100" />
            <span className="absolute bottom-2 font-mono text-[10px] text-muted">imagify-sad-cat.jpg</span>
          </div>
          <CardText title="One-tap download" body="Full-resolution JPG, yours to keep and share." />
        </Card>

        <Card delay={0.1}>
          <div className="flex items-baseline gap-2">
            <span className="text-7xl font-semibold leading-none tracking-[-0.05em]">$0</span>
            <span className="font-mono text-[11px] text-muted">/ forever</span>
          </div>
          <CardText title="Free, no sign-up" body="Open the studio and start typing. That's the whole onboarding." />
        </Card>

        <Card delay={0.16}>
          <div className="flex -space-x-3">
            {showcase.slice(6, 11).map((s) => (
              <img
                key={s.src}
                src={s.src}
                alt=""
                className="h-11 w-11 rounded-full object-cover ring-2 ring-white transition-transform duration-300 group-hover:-translate-y-1"
              />
            ))}
            <span className="grid h-11 w-11 place-items-center rounded-full bg-ink text-paper ring-2 ring-white">
              <Globe2 className="h-4 w-4" />
            </span>
          </div>
          <CardText
            title="A shared gallery"
            body="Every creation joins the public gallery below, so think of it as a shared sketchbook."
          />
        </Card>
      </div>
    </section>
  );
}
