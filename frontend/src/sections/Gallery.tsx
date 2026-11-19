import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Download, RotateCw, Search, X } from "lucide-react";
import { downloadImage, fetchGallery, slugify, type GalleryImage } from "../lib/api";
import { Eyebrow, Reveal } from "../ui/Reveal";
import { BlurText } from "../ui/BlurText";
import { Lightbox } from "./Lightbox";
import { cn } from "../lib/utils";

const PAGE = 18;

export function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [slow, setSlow] = useState(false);
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState(PAGE);
  const [open, setOpen] = useState<number | null>(null);

  const load = useCallback(() => {
    setStatus("loading");
    setSlow(false);
    const t = setTimeout(() => setSlow(true), 4500);
    fetchGallery()
      .then((imgs) => {
        setImages(imgs);
        setStatus("ready");
      })
      .catch(() => setStatus("error"))
      .finally(() => clearTimeout(t));
  }, []);

  useEffect(load, [load]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? images.filter((i) => i.prompt.toLowerCase().includes(q)) : images;
  }, [images, query]);

  useEffect(() => setVisible(PAGE), [query]);

  const shown = filtered.slice(0, visible);
  const onClose = useCallback(() => setOpen(null), []);

  return (
    <section id="gallery" className="mx-auto max-w-7xl px-4 pb-28 pt-24 md:px-6 md:pb-40 md:pt-28">
      <div className="mb-10 flex flex-col justify-between gap-8 md:mb-14 md:flex-row md:items-end">
        <div>
          <Eyebrow>Community gallery</Eyebrow>
          <h2 className="mt-5 text-[clamp(2.2rem,5vw,4.25rem)] font-medium leading-[0.95] tracking-[-0.04em]">
            <BlurText text="Made with" inView />{" "}
            <span className="font-[200] tracking-[-0.03em]">
              <BlurText text="Imagify" inView delay={0.12} />
              <span className="text-accent">.</span>
            </span>
          </h2>
          <Reveal delay={0.15} className="mt-4 max-w-md text-[15px] leading-relaxed text-muted">
            {status === "ready" ? (
              <>
                <span className="font-mono text-ink">{images.length}</span> images and counting.
                Click any one to see its prompt, download it or remix it.
              </>
            ) : (
              "Every image anyone generates lands here. Click one to see its prompt or remix it."
            )}
          </Reveal>
        </div>

        <Reveal delay={0.2} className="w-full md:w-80">
          <label className="group flex h-12 items-center gap-2.5 rounded-full border border-line bg-white/60 px-4 backdrop-blur transition-all focus-within:border-accent/40 focus-within:bg-white focus-within:shadow-[0_0_0_5px_rgb(91_61_245/0.08)]">
            <Search className="h-4 w-4 text-faint transition-colors group-focus-within:text-accent" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search prompts: cat, sky, tree…"
              className="h-full min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-faint"
            />
            {query && (
              <button onClick={() => setQuery("")} aria-label="Clear search" className="text-faint hover:text-ink">
                <X className="h-4 w-4" />
              </button>
            )}
          </label>
        </Reveal>
      </div>

      {status === "loading" && (
        <>
          <Grid>
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className={cn("skeleton aspect-square rounded-[1.2rem]", i === 0 && "md:col-span-2 md:row-span-2")}
              />
            ))}
          </Grid>
          <AnimatePresence>
            {slow && (
              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 text-center font-mono text-xs text-muted"
              >
                Waking up the server… free hosting naps when idle, this can take ~30s.
              </motion.p>
            )}
          </AnimatePresence>
        </>
      )}

      {status === "error" && (
        <div className="flex flex-col items-center justify-center rounded-[1.6rem] border border-dashed border-line px-6 py-20 text-center">
          <p className="text-2xl font-medium tracking-tight">The gallery is taking a nap.</p>
          <p className="mt-2 text-sm text-muted">We couldn't reach the server. Give it another go.</p>
          <button
            onClick={load}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm text-paper transition-colors hover:bg-accent"
          >
            <RotateCw className="h-4 w-4" /> Try again
          </button>
        </div>
      )}

      {status === "ready" && (
        <>
          {filtered.length === 0 ? (
            <div className="rounded-[1.6rem] border border-dashed border-line py-20 text-center">
              <p className="text-2xl font-medium tracking-tight">Nothing for “{query}” yet.</p>
              <p className="mt-2 text-sm text-muted">Be the first: generate it in the studio.</p>
            </div>
          ) : (
            <Grid>
              {shown.map((img, i) => (
                <Tile
                  key={img.id}
                  img={img}
                  featured={!query && (i % PAGE === 0 || i % PAGE === 10)}
                  onOpen={() => setOpen(i)}
                />
              ))}
            </Grid>
          )}

          {visible < filtered.length && (
            <div className="mt-12 flex justify-center">
              <button
                onClick={() => setVisible((v) => v + PAGE)}
                className="group inline-flex items-center gap-3 rounded-full border border-line bg-white/60 py-2 pl-5 pr-2 text-sm backdrop-blur transition-colors hover:bg-white"
              >
                Load more
                <span className="rounded-full bg-ink px-2.5 py-1 font-mono text-[11px] text-paper transition-colors group-hover:bg-accent">
                  +{Math.min(PAGE, filtered.length - visible)}
                </span>
              </button>
            </div>
          )}
        </>
      )}

      <Lightbox images={shown} index={open} onClose={onClose} onIndex={setOpen} />
    </section>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-flow-dense grid-cols-2 gap-2.5 md:grid-cols-3 md:gap-3 lg:grid-cols-4">
      {children}
    </div>
  );
}

function Tile({
  img,
  featured,
  onOpen,
}: {
  img: GalleryImage;
  featured: boolean;
  onOpen: () => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)", transitionEnd: { filter: "none" } }}
      viewport={{ once: true, margin: "-5% 0px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "group relative overflow-hidden rounded-[1.2rem] bg-paper-2",
        featured && "col-span-2 row-span-2"
      )}
    >
      <button onClick={onOpen} className="block w-full" aria-label={`Open: ${img.prompt}`}>
        <img
          src={img.src}
          alt={img.prompt}
          loading="lazy"
          decoding="async"
          className="aspect-square w-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
        />
      </button>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/0 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex translate-y-3 items-end justify-between gap-3 p-3.5 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 md:p-4">
        <p className={cn("line-clamp-2 text-paper", featured ? "text-lg font-medium leading-snug" : "text-[13px] leading-snug")}>
          {img.prompt}
        </p>
        <button
          onClick={(e) => {
            e.stopPropagation();
            downloadImage(img.src, `imagify-${slugify(img.prompt)}.jpg`);
          }}
          aria-label="Download"
          className="pointer-events-auto grid h-9 w-9 shrink-0 place-items-center rounded-full bg-paper text-ink transition-transform hover:scale-110"
        >
          <Download className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
}
