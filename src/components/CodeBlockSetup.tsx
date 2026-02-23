"use client";

import { useEffect } from "react";

export default function CodeBlockSetup() {
  useEffect(() => {
    function setupCodeBlocks() {
      const figures = document.querySelectorAll(
        "figure[data-rehype-pretty-code-figure]"
      );

      figures.forEach(function (figure) {
        if (figure.querySelector(".copy-btn")) return;

        const pre = figure.querySelector("pre");
        const code = figure.querySelector("pre > code");
        if (!pre || !code) return;

        const btn = document.createElement("button");
        btn.className = "copy-btn";
        btn.setAttribute("aria-label", "Copy code");
        btn.innerHTML =
          '<svg viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';

        btn.addEventListener("click", function () {
          const text = code.textContent || "";
          navigator.clipboard.writeText(text).then(function () {
            btn.classList.add("copied");
            btn.innerHTML =
              '<svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>';
            setTimeout(function () {
              btn.classList.remove("copied");
              btn.innerHTML =
                '<svg viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
            }, 1500);
          });
        });

        figure.appendChild(btn);
      });
    }

    // Initial setup
    setupCodeBlocks();

    // Watch for dynamically added code blocks
    const observer = new MutationObserver(setupCodeBlocks);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return null;
}
