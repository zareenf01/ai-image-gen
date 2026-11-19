import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { Analytics } from "@vercel/analytics/react";
import Home from "./pages/Home";
import Studio from "./pages/Studio";
import { Nav } from "./sections/Nav";
import { scrollToTop, useLenis } from "./lib/useLenis";

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait" onExitComplete={() => !location.hash && scrollToTop(true)}>
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/studio" element={<Studio />} />
          <Route
            path="/generate"
            element={<Navigate to={{ pathname: "/studio", search: location.search }} replace />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  useLenis();
  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <Analytics />
        <div className="grain" aria-hidden />
        <Nav />
        <AnimatedRoutes />
      </BrowserRouter>
    </MotionConfig>
  );
}
