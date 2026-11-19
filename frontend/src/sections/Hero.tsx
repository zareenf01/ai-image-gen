import { useRef } from "react";
import { motion, useScroll } from "motion/react";
import { BlurText } from "../ui/BlurText";
import { PromptBar } from "./PromptBar";
import { HeroFan } from "./HeroFan";
import { scrollToId } from "../lib/useLenis";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  return (
    <section
      ref={ref}
      id="showcase"
      className="relative flex flex-col items-center overflow-x-clip px-4 pb-14 pt-28 md:min-h-[100svh] md:pb-6 md:pt-32"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-30%] h-[900px] w-[1300px] -translate-x-1/2 bg-[radial-gradient(closest-side,rgb(91_61_245/0.14),transparent)]" />
        <div className="dot-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_50%_30%,black_10%,transparent_65%)]" />
      </div>

      <motion.a
        href="#process"
        onClick={(e) => {
          e.preventDefault();
          scrollToId("process");
        }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="mb-7 inline-flex items-center gap-2 rounded-full border border-line bg-white/60 px-3.5 py-1.5 text-xs text-muted backdrop-blur"
      >
        AI image studio · free, no sign-up
      </motion.a>

      <h1 className="text-center text-[clamp(3.1rem,min(15vw,14vh),9.25rem)] font-medium leading-[0.9] tracking-[-0.05em]">
        <BlurText text="Words in." delay={0.25} />
        <br />
        <BlurText
          text="Worlds"
          delay={0.45}
          className="font-[200] tracking-[-0.03em]"
        />
        <BlurText text=" out." delay={0.55} />
      </h1>

      <motion.p
        initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)", transitionEnd: { filter: "none" } }}
        transition={{ duration: 0.9, delay: 0.75, ease: [0.16, 1, 0.3, 1] }}
        className="mt-6 max-w-md text-center text-[15px] leading-relaxed text-muted md:text-[17px]"
      >
        Imagify turns a single sentence into an image. Describe anything and watch it
        resolve from noise in seconds.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="mt-9 flex w-full justify-center"
      >
        <PromptBar />
      </motion.div>

      <div className="w-full pt-14 md:mt-auto md:pt-12">
        <HeroFan progress={scrollYProgress} />
      </div>
    </section>
  );
}
