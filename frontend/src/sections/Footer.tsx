import { Link } from "react-router-dom";
import { ArrowUp } from "lucide-react";
import { motion } from "motion/react";
import { Logo } from "../ui/Logo";
import { scrollToTop } from "../lib/useLenis";

export function Footer() {
  return (
    <footer className="overflow-hidden px-4 pt-24 md:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-10 border-b border-line pb-10 md:flex-row md:items-end">
          <div className="max-w-xs">
            <Logo />
          </div>
          <div className="grid grid-cols-2 gap-x-14 gap-y-2 text-sm sm:grid-cols-3">
            <Link to="/studio" className="text-muted transition-colors hover:text-ink">Studio</Link>
            <Link to="/#gallery" className="text-muted transition-colors hover:text-ink">Gallery</Link>
            <button
              onClick={() => scrollToTop()}
              className="inline-flex items-center gap-1.5 text-left text-muted transition-colors hover:text-ink"
            >
              <ArrowUp className="h-3.5 w-3.5" /> Back to top
            </button>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-2 py-6 font-mono text-[11px] uppercase tracking-[0.14em] text-faint sm:flex-row">
          <span>Built by Zareen</span>
          <span>Imagify © {new Date().getFullYear()}</span>
        </div>

        <motion.div
          initial={{ y: "40%", opacity: 0 }}
          whileInView={{ y: "0%", opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          aria-hidden
          className="select-none text-center font-medium leading-[0.85] pb-[0.04em] tracking-[-0.07em] text-ink [font-size:clamp(5rem,24vw,22rem)]"
        >
          Imagify<span className="text-accent">.</span>
        </motion.div>
      </div>
    </footer>
  );
}
