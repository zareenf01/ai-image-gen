import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { Analytics } from "@vercel/analytics/react";
import "./App.css";
import Home from "./components/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Generate from "./components/Generate";

function App() {
  return (
    <div className="p-3 overscroll-none">
      <Router>
        <Analytics />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/generate" element={<Generate />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
