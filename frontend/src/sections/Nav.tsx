import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { Logo } from "../ui/Logo";
import { scrollToId, scrollToTop } from "../lib/useLenis";
import { cn } from "../lib/utils";

const links = [
  { id: "showcase", label: "Showcase" },
  { id: "process", label: "Process" },
  { id: "gallery", label: "Gallery" },
];

export function Nav() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [hovered, setHovered] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 40));

  const go = (id: string) => {
    if (pathname === "/") scrollToId(id);
    else navigate(`/#${id}`);
  };

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4"
    >
      <nav
        className={cn(
          "flex w-full max-w-3xl items-center justify-between gap-2 rounded-full border p-1.5 pl-4 transition-all duration-500",
          scrolled
            ? "border-line bg-paper/75 shadow-[0_8px_30px_-12px_rgb(14_14_12/0.18)] backdrop-blur-xl"
            : "border-transparent bg-transparent"
        )}
      >
        <Link
          to="/"
          onClick={() => pathname === "/" && scrollToTop()}
          aria-label="Imagify home"
          className="shrink-0"
        >
          <Logo />
        </Link>

        <ul
          className="hidden items-center sm:flex"
          onMouseLeave={() => setHovered(null)}
        >
          {links.map((l) => (
            <li key={l.id} className="relative">
              <button
                onClick={() => go(l.id)}
                onMouseEnter={() => setHovered(l.id)}
                className="relative z-10 px-4 py-2 text-[13.5px] text-ink/70 transition-colors hover:text-ink"
              >
                {l.label}
              </button>
              {hovered === l.id && (
                <motion.span
                  layoutId="nav-hover"
                  className="absolute inset-0 rounded-full bg-ink/[0.06]"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
            </li>
          ))}
        </ul>

        {pathname === "/studio" ? (
          <button
            onClick={() => go("gallery")}
            className="group inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-[13.5px] text-paper transition-transform active:scale-95"
          >
            Browse gallery
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-45" />
          </button>
        ) : (
          <Link
            to="/studio"
            className="group inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-[13.5px] text-paper transition-transform active:scale-95"
          >
            Open studio
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-45" />
          </Link>
        )}
      </nav>
    </motion.header>
  );
}
