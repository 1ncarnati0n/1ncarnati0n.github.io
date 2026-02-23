"use client";

import { useEffect } from "react";

export default function SidebarToggleScript() {
  useEffect(() => {
    const toggle = document.getElementById("sidebar-toggle");
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("sidebar-overlay");

    function openSidebar() {
      if (sidebar) sidebar.classList.add("open");
      if (overlay) overlay.classList.add("visible");
      document.body.style.overflow = "hidden";
    }

    function closeSidebar() {
      if (sidebar) sidebar.classList.remove("open");
      if (overlay) overlay.classList.remove("visible");
      document.body.style.overflow = "";
    }

    function handleToggle() {
      if (sidebar && sidebar.classList.contains("open")) {
        closeSidebar();
      } else {
        openSidebar();
      }
    }

    function handleKeydown(e: KeyboardEvent) {
      if (e.key === "Escape") closeSidebar();
    }

    toggle?.addEventListener("click", handleToggle);
    overlay?.addEventListener("click", closeSidebar);
    document.addEventListener("keydown", handleKeydown);

    return () => {
      toggle?.removeEventListener("click", handleToggle);
      overlay?.removeEventListener("click", closeSidebar);
      document.removeEventListener("keydown", handleKeydown);
    };
  }, []);

  return null;
}
