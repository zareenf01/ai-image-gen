import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { examplePrompts } from "../lib/showcase";
import { useTypewriter } from "../ui/useTypewriter";
import { cn } from "../lib/utils";

export function PromptBar({ className }: { className?: string }) {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const navigate = useNavigate();
  const { text, full } = useTypewriter(examplePrompts, value.length > 0);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const prompt = value.trim() || full;
    navigate(`/studio?prompt=${encodeURIComponent(prompt)}&go=1`);
  };

  return (
    <form
      onSubmit={submit}
      className={cn(
        "group relative flex w-full max-w-xl items-center gap-2 rounded-full border bg-white/70 p-1.5 pl-5 backdrop-blur-xl transition-all duration-500",
        focused
          ? "border-accent/40 shadow-[0_0_0_6px_rgb(91_61_245/0.08),0_20px_50px_-20px_rgb(91_61_245/0.45)]"
          : "border-line shadow-[0_20px_50px_-24px_rgb(14_14_12/0.35)]",
        className
      )}
    >
      <Sparkles
        className={cn(
          "h-4 w-4 shrink-0 transition-colors duration-300",
          focused ? "text-accent" : "text-faint"
        )}
      />
      <div className="relative min-w-0 flex-1">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          aria-label="Describe an image"
          className="relative z-10 h-10 w-full bg-transparent text-[15px] text-ink outline-none placeholder:text-transparent"
          placeholder="Describe an image"
        />
        {!value && (
          <span className="pointer-events-none absolute inset-0 flex items-center truncate text-[15px] text-faint">
            {text}
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="ml-px inline-block h-4 w-px bg-ink/50"
            />
          </span>
        )}
      </div>
      <button
        type="submit"
        className="group/btn relative inline-flex h-10 shrink-0 items-center gap-2 overflow-hidden rounded-full bg-ink px-4 text-sm text-paper transition-transform active:scale-95 sm:px-5"
      >
        <span className="absolute inset-0 -translate-x-full bg-accent transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/btn:translate-x-0" />
        <span className="relative hidden sm:inline">Generate</span>
        <ArrowRight className="relative h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
      </button>
    </form>
  );
}
