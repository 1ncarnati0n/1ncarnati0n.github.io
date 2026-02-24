"use client";

import { useState } from "react";

interface Props {
  className?: string;
}

function getInitialTheme(): "light" | "dark" {
  if (typeof document === "undefined") return "light";
  const current = document.documentElement.getAttribute("data-theme");
  return current === "dark" ? "dark" : "light";
}

export default function DarkModeToggle({ className }: Props) {
  const [theme, setTheme] = useState<"light" | "dark">(getInitialTheme);

  const toggle = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  };

  return (
    <button
      className={className}
      onClick={toggle}
      aria-label={theme === "light" ? "다크 모드로 전환" : "라이트 모드로 전환"}
      title={theme === "light" ? "다크 모드" : "라이트 모드"}
    >
      {theme === "light" ? "\u{1F319}" : "\u{2600}\u{FE0F}"}
    </button>
  );
}
