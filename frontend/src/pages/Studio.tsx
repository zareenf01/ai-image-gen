import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AnimatePresence, motion, useAnimationControls } from "motion/react";
import axios from "axios";
import {
  AlertCircle,
  Check,
  Copy,
  Dices,
  Download,
  Expand,
  RotateCw,
  Sparkles,
  X,
  ArrowBigUp,
  CornerDownLeft,
  Sparkle,
} from "lucide-react";
import { downloadImage, generateImage, slugify } from "../lib/api";
import { examplePrompts, styleChips } from "../lib/showcase";
import { Aurora } from "../ui/Aurora";
import { LogoMark } from "../ui/Logo";
import { cn } from "../lib/utils";

type Phase = "idle" | "loading" | "result" | "error";

interface Creation {
  id: number;
  src: string;
  prompt: string;
  full: string;
  seconds: number;
}

const MAX = 400;
const loadingLines = [
  "Reading your prompt",
  "Seeding the noise",
  "Denoising · first pass",
  "Finding the shapes",
  "Adding light & detail",
  "Final touches",
];

export default function Studio() {
  const [params, setParams] = useSearchParams();
  const [prompt, setPrompt] = useState(() => params.get("prompt") ?? "");
  const [styles, setStyles] = useState<string[]>([]);
  const [phase, setPhase] = useState<Phase>("idle");
  const [error, setError] = useState("");
  const [current, setCurrent] = useState<Creation | null>(null);
  const [history, setHistory] = useState<Creation[]>([]);
  const [elapsed, setElapsed] = useState(0);
  const [copied, setCopied] = useState(false);
  const [zoom, setZoom] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);
  const shake = useAnimationControls();

  useEffect(() => {
    if (phase !== "loading") return;
    const start = performance.now();
    setElapsed(0);
    const t = setInterval(() => setElapsed((performance.now() - start) / 1000), 100);
    return () => clearInterval(t);
  }, [phase]);

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = `${Math.min(el.scrollHeight, 220)}px`;
  }, [prompt]);

  const run = async (override?: string) => {
    const base = (override ?? prompt).trim();
    if (!base) {
      shake.start({ x: [0, -8, 8, -5, 5, 0], transition: { duration: 0.4 } });
      textRef.current?.focus();
      return;
    }
    const extras = styleChips.filter((c) => styles.includes(c.label)).map((c) => c.value);
    const full = [base, ...extras].join(", ");

    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;
    setError("");
    setPhase("loading");
    const started = performance.now();

    try {
      const src = await generateImage(full, ac.signal);
      const item: Creation = {
        id: Date.now(),
        src,
        prompt: base,
        full,
        seconds: (performance.now() - started) / 1000,
      };
      setHistory((h) => [item, ...h]);
      setCurrent(item);
      setPhase("result");
    } catch (err) {
      if (ac.signal.aborted || axios.isCancel(err)) return;
      setError(
        axios.isAxiosError(err) && !err.response
          ? "Couldn't reach the server. It may be waking up, so try again in a few seconds."
          : err instanceof Error && !axios.isAxiosError(err)
            ? err.message
            : "The model couldn't finish this one. Try again or rephrase the prompt."
      );
      setPhase("error");
    }
  };

  const cancel = () => {
    abortRef.current?.abort();
    setPhase(current ? "result" : "idle");
  };

  useEffect(() => {
    const p = params.get("prompt");
    if (!p) return;
    const go = params.get("go") === "1";
    const t = setTimeout(() => {
      if (go) run(p);
      setParams({}, { replace: true });
    }, 30);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => () => abortRef.current?.abort(), []);

  const surprise = () => {
    const pool = examplePrompts.filter((p) => p !== prompt);
    setPrompt(pool[Math.floor(Math.random() * pool.length)]);
    textRef.current?.focus();
  };

  const toggleStyle = (label: string) =>
    setStyles((s) => (s.includes(label) ? s.filter((x) => x !== label) : [...s, label]));

  const copyPrompt = async () => {
    if (!current) return;
    await navigator.clipboard?.writeText(current.full);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const loading = phase === "loading";
  const lineIndex = Math.min(loadingLines.length - 1, Math.floor(elapsed / 2.2));
  const fakeProgress = 1 - Math.exp(-elapsed / 7);

  return (
    <main className="min-h-[100svh] px-3 pb-10 pt-24 md:px-5 md:pt-28">
      <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-[minmax(0,1fr)_420px] lg:gap-5">
        <section className="flex flex-col">
          <div className="relative mx-auto aspect-square w-full max-w-[min(100%,calc(100svh-11.5rem))] lg:mr-0 overflow-hidden rounded-[1.8rem] border border-line bg-white/50">
            <AnimatePresence mode="popLayout">
              {phase === "idle" && (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="dot-grid absolute inset-0 grid place-items-center p-8 text-center"
                >
                  <div className="flex flex-col items-center">
                    <motion.div
                      animate={{ rotate: [0, 90, 180, 270, 360] }}
                      transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                      className="text-ink/15"
                    >
                      <LogoMark className="h-16 w-16" />
                    </motion.div>
                    <p className="mt-6 text-[clamp(1.5rem,2.6vw,2.1rem)] font-medium leading-tight tracking-tight">
                      Your canvas is empty.
                    </p>
                    <p className="mt-2 text-sm text-muted">
                      Describe something, anything, and hit generate.
                    </p>
                    <div className="mt-6 flex max-w-md flex-wrap justify-center gap-2">
                      {examplePrompts.slice(0, 3).map((p) => (
                        <button
                          key={p}
                          onClick={() => setPrompt(p)}
                          className="rounded-full border border-line bg-white/70 px-3 py-1.5 text-xs text-muted transition-colors hover:border-ink/20 hover:text-ink"
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {loading && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-ink"
                >
                  <Aurora />
                  <div className="absolute inset-0 grid place-items-center">
                    <div className="relative grid h-28 w-28 place-items-center">
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          className="absolute inset-0 rounded-full border border-white/25"
                          initial={{ scale: 0.6, opacity: 0 }}
                          animate={{ scale: [0.6, 1.6], opacity: [0, 0.7, 0] }}
                          transition={{ duration: 3, repeat: Infinity, delay: i, ease: "easeOut" }}
                        />
                      ))}
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        className="text-paper"
                      >
                        <LogoMark className="h-9 w-9" />
                      </motion.div>
                    </div>
                    <span className="absolute mt-40 font-mono text-xs text-paper/70">
                      {elapsed.toFixed(1)}s
                    </span>
                  </div>
                  <div className="absolute inset-x-3 bottom-3 rounded-2xl bg-black/65 p-4">
                    <div className="flex items-center justify-between gap-4 text-paper">
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={lineIndex}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          className="text-sm"
                        >
                          {loadingLines[lineIndex]}…
                        </motion.span>
                      </AnimatePresence>
                      <button
                        onClick={cancel}
                        className="font-mono text-[11px] uppercase tracking-wider text-paper/60 hover:text-paper"
                      >
                        Cancel
                      </button>
                    </div>
                    <div className="mt-3 h-[3px] overflow-hidden rounded-full bg-white/10">
                      <motion.div
                        animate={{ scaleX: fakeProgress }}
                        transition={{ ease: "linear", duration: 0.1 }}
                        className="h-full origin-left bg-gradient-to-r from-accent to-accent-2"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {phase === "result" && current && (
                <motion.div
                  key={`result-${current.id}`}
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-ink"
                >
                  <motion.img
                    src={current.src}
                    alt={current.prompt}
                    initial={{ filter: "blur(28px) saturate(0.4)", scale: 1.1 }}
                    animate={{ filter: "blur(0px) saturate(1)", scale: 1, transitionEnd: { filter: "none" } }}
                    transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full w-full object-cover"
                  />
                  <motion.div
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 0 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="pointer-events-none absolute inset-0"
                  >
                    <Aurora sweep={false} className="bg-transparent" />
                  </motion.div>
                  <button
                    onClick={() => setZoom(true)}
                    aria-label="View full size"
                    className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-black/50 text-paper transition-colors hover:bg-black/60"
                  >
                    <Expand className="h-4 w-4" />
                  </button>
                </motion.div>
              )}

              {phase === "error" && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="dot-grid absolute inset-0 grid place-items-center p-8 text-center"
                >
                  <div className="flex max-w-sm flex-col items-center">
                    <span className="grid h-12 w-12 place-items-center rounded-full bg-red-500/10 text-red-600">
                      <AlertCircle className="h-5 w-5" />
                    </span>
                    <p className="mt-5 text-2xl font-medium tracking-tight">Something went wrong.</p>
                    <p className="mt-2 text-sm text-muted">{error}</p>
                    <button
                      onClick={() => run()}
                      className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm text-paper transition-colors hover:bg-accent"
                    >
                      <RotateCw className="h-4 w-4" /> Try again
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {phase === "result" && current && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ delay: 0.5, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="mx-auto mt-3 flex w-full max-w-[min(100%,calc(100svh-11.5rem))] lg:mr-0 flex-wrap items-center justify-between gap-3"
              >
                <p className="min-w-0 flex-1 truncate font-mono text-[11px] text-muted">
                  “{current.prompt}” · {current.seconds.toFixed(1)}s
                </p>
                <div className="flex gap-1.5">
                  <IconButton onClick={copyPrompt} label={copied ? "Copied" : "Copy prompt"}>
                    {copied ? <Check className="h-4 w-4 text-accent" /> : <Copy className="h-4 w-4" />}
                  </IconButton>
                  <IconButton onClick={() => run(current.prompt)} label="Regenerate">
                    <RotateCw className="h-4 w-4" />
                  </IconButton>
                  <button
                    onClick={() => downloadImage(current.src, `imagify-${slugify(current.prompt)}.jpg`)}
                    className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm text-paper transition-colors hover:bg-accent"
                  >
                    <Download className="h-4 w-4" /> Download
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        <aside className="flex flex-col gap-4">
          <motion.form
            animate={shake}
            onSubmit={(e) => {
              e.preventDefault();
              run();
            }}
            className="rounded-[1.8rem] border border-line bg-white/70 p-5 md:p-6"
          >
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-medium tracking-tight">
                Studio<span className="text-accent">.</span>
              </h1>
              <button
                type="button"
                onClick={surprise}
                className="group inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs text-muted transition-colors hover:bg-white hover:text-ink"
              >
                <Dices className="h-3.5 w-3.5 transition-transform duration-500 group-hover:rotate-180" />
                Surprise me
              </button>
            </div>

            <label className="mt-5 block font-mono text-[11px] uppercase tracking-[0.16em] text-faint" htmlFor="prompt">
              Prompt
            </label>
            <div className="mt-2 rounded-2xl border border-line bg-white/80 transition-all focus-within:border-accent/40 focus-within:shadow-[0_0_0_5px_rgb(91_61_245/0.08)]">
              <textarea
                id="prompt"
                ref={textRef}
                value={prompt}
                maxLength={MAX}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    if (!loading) run();
                  }
                }}
                rows={4}
                placeholder="A lighthouse made of glass at the edge of the universe…"
                className="block min-h-[112px] w-full resize-none bg-transparent px-4 pt-3.5 text-[15px] leading-relaxed outline-none placeholder:text-faint"
              />
              <div className="flex items-center justify-between px-4 pb-3 pt-1 font-mono text-[10.5px] text-faint">
                <span className="inline-flex items-center gap-1">
                  <CornerDownLeft className="h-3 w-3" /> generate
                  <span className="mx-1">·</span>
                  <ArrowBigUp className="h-3 w-3" />
                  <CornerDownLeft className="h-3 w-3" /> new line
                </span>
                <span className={cn(prompt.length > MAX * 0.9 && "text-accent")}>
                  {prompt.length}/{MAX}
                </span>
              </div>
            </div>

            <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.16em] text-faint">Style</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {styleChips.map((c) => {
                const on = styles.includes(c.label);
                return (
                  <button
                    key={c.label}
                    type="button"
                    onClick={() => toggleStyle(c.label)}
                    aria-pressed={on}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-xs transition-all duration-300",
                      on
                        ? "border-ink bg-ink text-paper"
                        : "border-line bg-white/60 text-muted hover:border-ink/20 hover:text-ink"
                    )}
                  >
                    {on && <Sparkle className="mr-1 inline h-3 w-3 -translate-y-px fill-current text-accent-2" />}
                    {c.label}
                  </button>
                );
              })}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative mt-6 flex h-13 w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-ink py-3.5 text-[15px] text-paper transition-transform active:scale-[0.98] disabled:cursor-wait"
            >
              <span className="absolute inset-0 -translate-x-full bg-accent transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0 group-disabled:translate-x-0" />
              {loading ? (
                <>
                  <span className="relative h-4 w-4 animate-spin rounded-full border-2 border-paper/30 border-t-paper" />
                  <span className="relative">Generating · {elapsed.toFixed(1)}s</span>
                </>
              ) : (
                <>
                  <Sparkles className="relative h-4 w-4" />
                  <span className="relative">{current ? "Generate another" : "Generate image"}</span>
                </>
              )}
            </button>
            <p className="mt-3 text-center text-[11.5px] text-faint">
              Heads up: generated images are shared in the public gallery.
            </p>
          </motion.form>

          <AnimatePresence>
            {history.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-[1.8rem] border border-line bg-white/70 p-5"
              >
                <div className="flex items-center justify-between">
                  <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-faint">This session</p>
                  <span className="font-mono text-[11px] text-faint">{history.length}</span>
                </div>
                <div className="mt-3 grid grid-cols-4 gap-2">
                  {history.map((h) => (
                    <motion.button
                      key={h.id}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      onClick={() => {
                        setCurrent(h);
                        setPhase("result");
                      }}
                      className={cn(
                        "overflow-hidden rounded-xl ring-2 ring-offset-2 ring-offset-paper transition-all",
                        current?.id === h.id ? "ring-accent" : "ring-transparent hover:ring-line"
                      )}
                      aria-label={h.prompt}
                    >
                      <img src={h.src} alt="" className="aspect-square w-full object-cover" />
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </aside>
      </div>

      <AnimatePresence>
        {zoom && current && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoom(false)}
            className="fixed inset-0 z-[70] grid place-items-center bg-ink/85 p-4"
          >
            <motion.img
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              src={current.src}
              alt={current.prompt}
              className="max-h-[90svh] max-w-full rounded-2xl"
            />
            <button
              aria-label="Close"
              className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-full bg-paper text-ink"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

function IconButton({
  onClick,
  label,
  children,
}: {
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className="grid h-9 w-9 place-items-center rounded-full border border-line bg-white/60 text-ink transition-colors hover:bg-white"
    >
      {children}
    </button>
  );
}
