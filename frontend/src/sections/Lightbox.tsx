import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, Check, Copy, Download, Wand2, X } from "lucide-react";
import { downloadImage, slugify, type GalleryImage } from "../lib/api";
import { getLenis } from "../lib/useLenis";

export function Lightbox({
  images,
  index,
  onClose,
  onIndex,
}: {
  images: GalleryImage[];
  index: number | null;
  onClose: () => void;
  onIndex: (i: number) => void;
}) {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const open = index !== null;
  const img = open ? images[index] : null;

  useEffect(() => {
    if (!open) return;
    getLenis()?.stop();
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onIndex((index! + 1) % images.length);
      if (e.key === "ArrowLeft") onIndex((index! - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      getLenis()?.start();
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, index, images.length, onClose, onIndex]);

  useEffect(() => setCopied(false), [index]);

  const copy = async () => {
    if (!img) return;
    await navigator.clipboard?.writeText(img.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return createPortal(
    <AnimatePresence>
      {img && (
        <motion.div
          key="lightbox"
          className="fixed inset-0 z-[70] flex items-center justify-center p-3 md:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal
          aria-label={img.prompt}
        >
          <motion.div
            className="absolute inset-0 bg-ink/85"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: 30, scale: 0.97, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 20, scale: 0.98, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            className="relative grid max-h-full w-full max-w-5xl gap-0 overflow-hidden rounded-[1.6rem] bg-paper shadow-2xl md:grid-cols-[1.25fr_1fr]"
          >
            <div className="relative bg-ink">
              <AnimatePresence mode="wait">
                <motion.img
                  key={img.id}
                  src={img.src}
                  alt={img.prompt}
                  initial={{ opacity: 0, filter: "blur(16px)", scale: 1.03 }}
                  animate={{ opacity: 1, filter: "blur(0px)", scale: 1, transitionEnd: { filter: "none" } }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="aspect-square max-h-[56svh] w-full object-cover md:max-h-[80svh]"
                />
              </AnimatePresence>
            </div>

            <div className="flex flex-col justify-between gap-6 p-6 md:p-8">
              <div>
                <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
                  <span>
                    {String(index! + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
                  </span>
                  {img.createdAt && (
                    <span>
                      {new Date(img.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  )}
                </div>
                <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.16em] text-faint">Prompt</p>
                <p className="mt-2 text-[clamp(1.4rem,2.4vw,2rem)] font-medium leading-[1.15] tracking-tight">
                  “{img.prompt}”
                </p>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => navigate(`/studio?prompt=${encodeURIComponent(img.prompt)}`)}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-ink py-3 text-sm text-paper transition-colors hover:bg-accent"
                >
                  <Wand2 className="h-4 w-4" /> Remix this prompt
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => downloadImage(img.src, `imagify-${slugify(img.prompt)}.jpg`)}
                    className="flex items-center justify-center gap-2 rounded-full border border-line py-3 text-sm transition-colors hover:bg-white"
                  >
                    <Download className="h-4 w-4" /> Download
                  </button>
                  <button
                    onClick={copy}
                    className="flex items-center justify-center gap-2 rounded-full border border-line py-3 text-sm transition-colors hover:bg-white"
                  >
                    {copied ? <Check className="h-4 w-4 text-accent" /> : <Copy className="h-4 w-4" />}
                    {copied ? "Copied" : "Copy prompt"}
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-paper/90 text-ink backdrop-blur transition-transform hover:rotate-90"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="absolute left-3 top-3 flex gap-1.5">
              <button
                onClick={() => onIndex((index! - 1 + images.length) % images.length)}
                aria-label="Previous image"
                className="grid h-9 w-9 place-items-center rounded-full bg-paper/90 text-ink backdrop-blur transition-transform hover:-translate-x-0.5"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => onIndex((index! + 1) % images.length)}
                aria-label="Next image"
                className="grid h-9 w-9 place-items-center rounded-full bg-paper/90 text-ink backdrop-blur transition-transform hover:translate-x-0.5"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
