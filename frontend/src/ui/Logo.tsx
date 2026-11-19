import { cn } from "../lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn("h-5 w-5", className)} aria-hidden>
      <path
        d="M12 2.5c.7 4.6 4.1 8.1 8.7 8.8-4.6.7-8 4.1-8.7 8.7-.7-4.6-4.1-8-8.7-8.7 4.6-.7 8-4.2 8.7-8.8z"
        fill="currentColor"
      />
      <circle cx="19.5" cy="4.5" r="1.8" className="fill-accent" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 font-medium tracking-tight", className)}>
      <LogoMark />
      <span className="text-[17px]">
        Imagify<span className="text-accent">.</span>
      </span>
    </span>
  );
}
