"use client";

import { useState } from "react";

const STORAGE_KEY = "triads-theme";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof document === "undefined") return true;
    return document.documentElement.dataset.theme !== "light";
  });

  const toggle = () => {
    const next = isDark ? "light" : "dark";
    setIsDark(!isDark);
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {}
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label="Toggle dark mode"
      onClick={toggle}
      className="relative w-11 h-6 rounded-full shrink-0"
      style={{ border: "1px solid var(--rule)", background: "transparent" }}
    >
      <span
        aria-hidden
        className="absolute top-1/2 left-0.5 w-5 h-5 rounded-full transition-transform duration-[180ms] ease-out"
        style={{
          background: "var(--ink)",
          transform: `translate(${isDark ? "20px" : "0px"}, -50%)`,
        }}
      />
    </button>
  );
}
