"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import DarkModeToggle from "./DarkModeToggle";
import SearchOverlay from "./SearchOverlay";

type NavItem = {
  href: string;
  label: string;
};

const navItems: NavItem[] = [
  { href: "/projects/", label: "Projects" },
  { href: "/posts/", label: "Posts" },
  { href: "/tags/", label: "Tags" },
];

function normalize(path: string): string {
  return path.endsWith("/") ? path : `${path}/`;
}

function isPathActive(currentPath: string, href: string): boolean {
  const current = normalize(currentPath);
  const target = normalize(href);
  return current === target || (target !== "/" && current.startsWith(target));
}

export default function Header() {
  const pathname = usePathname() ?? "/";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const hasSidebar = useMemo(
    () =>
      pathname.startsWith("/posts") ||
      pathname.startsWith("/projects") ||
      pathname.startsWith("/tags"),
    [pathname],
  );

  const closeSidebar = () => {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("sidebar-overlay");
    sidebar?.classList.remove("open");
    overlay?.classList.remove("visible");
    document.body.style.overflow = "";
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    document.body.style.overflow = "";
  };

  const openSidebar = () => {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("sidebar-overlay");
    if (!sidebar || !overlay) return;
    sidebar.classList.add("open");
    overlay.classList.add("visible");
    document.body.style.overflow = "hidden";
  };

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMobileMenu();
        closeSidebar();
      }
    };

    const overlay = document.getElementById("sidebar-overlay");
    const handleOverlayClick = () => closeSidebar();

    document.addEventListener("keydown", handleKeydown);
    overlay?.addEventListener("click", handleOverlayClick);

    return () => {
      document.removeEventListener("keydown", handleKeydown);
      overlay?.removeEventListener("click", handleOverlayClick);
    };
  }, [hasSidebar]);

  useEffect(() => {
    closeSidebar();
    document.body.style.overflow = "";
  }, [pathname]);

  useEffect(() => {
    if (!hasSidebar) {
      document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    }
  }, [mobileMenuOpen, hasSidebar]);

  const navWithActive = useMemo(
    () =>
      navItems.map((item) => ({
        ...item,
        active: isPathActive(pathname, item.href),
      })),
    [pathname],
  );

  const handleMenuToggle = () => {
    if (hasSidebar) {
      const sidebar = document.getElementById("sidebar");
      const isOpen = sidebar?.classList.contains("open");
      if (isOpen) {
        closeSidebar();
      } else {
        openSidebar();
      }
      return;
    }

    setMobileMenuOpen((prev) => !prev);
  };

  return (
    <>
      <header className="site-header">
        <div className="container header-inner">
          <div className="site-brand-wrap">
            <button
              className="sidebar-toggle"
              id="sidebar-toggle"
              aria-label={hasSidebar ? "문서 메뉴 열기" : "주 메뉴 열기"}
              onClick={handleMenuToggle}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>

            <a href="/" className="site-brand" aria-label="홈으로 이동">
              <span className="site-brand-title">1ncarnati0n</span>
            </a>
          </div>

          <nav className="site-nav" aria-label="주요 메뉴">
            {navWithActive.map((item) => (
              <a key={item.href} href={item.href} data-active={item.active ? "true" : undefined}>
                {item.label}
              </a>
            ))}
          </nav>

          <div className="header-actions">
            <button id="search-trigger" aria-label="검색 (Cmd+K)" className="search-btn">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </button>

            <a
              href="https://github.com/1ncarnati0n"
              target="_blank"
              rel="noopener"
              aria-label="GitHub"
              className="icon-btn desktop-only"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>

            <DarkModeToggle className="icon-btn" />
          </div>
        </div>
      </header>

      {!hasSidebar && (
        <>
          <div
            className={["mobile-nav-overlay", mobileMenuOpen ? "visible" : ""].filter(Boolean).join(" ")}
            onClick={closeMobileMenu}
            aria-hidden="true"
          />
          <div className={["mobile-nav-drawer", mobileMenuOpen ? "open" : ""].filter(Boolean).join(" ")}>
            <nav className="mobile-nav-main" aria-label="모바일 메뉴">
              {navWithActive.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  data-active={item.active ? "true" : undefined}
                  onClick={closeMobileMenu}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        </>
      )}

      <SearchOverlay />
    </>
  );
}
