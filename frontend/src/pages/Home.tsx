import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Hero } from "../sections/Hero";
import { Process } from "../sections/Process";
import { Features } from "../sections/Features";
import { Gallery } from "../sections/Gallery";
import { CTA } from "../sections/CTA";
import { Footer } from "../sections/Footer";
import { scrollToId } from "../lib/useLenis";

export default function Home() {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    const t = setTimeout(() => scrollToId(hash.slice(1)), 350);
    return () => clearTimeout(t);
  }, [hash]);

  return (
    <main>
      <Hero />
      <Process />
      <Features />
      <Gallery />
      <CTA />
      <Footer />
    </main>
  );
}
