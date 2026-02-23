"use client";

import { usePathname } from "next/navigation";
import type { SidebarSection } from "@/lib/sidebar-config";

interface Props {
  sections: SidebarSection[];
  context?: "blog" | "projects";
}

export default function Sidebar({ sections, context = "blog" }: Props) {
  const currentPath = usePathname() ?? "/";

  function isActive(href: string): boolean {
    return currentPath === href || currentPath === href.replace(/\/$/, "");
  }

  function sectionHasActive(section: SidebarSection): boolean {
    return section.items.some((item) => isActive(item.href));
  }

  return (
    <aside className="sidebar" id="sidebar">
      <div className="sidebar-inner">
        {/* Quick Links */}
        <nav className="sidebar-quick-links">
          <a href="/" className="sidebar-quick-link" data-active={currentPath === "/" ? "" : undefined}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            Home
          </a>
          <a href="/posts/" className="sidebar-quick-link" data-active={context === "blog" ? "" : undefined}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
            Blog
          </a>
          <a href="/projects/" className="sidebar-quick-link" data-active={context === "projects" ? "" : undefined}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
            Projects
          </a>
          <a href="/tags/" className="sidebar-quick-link" data-active={currentPath.startsWith("/tags") ? "" : undefined}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
            Tags
          </a>
        </nav>

        <div className="sidebar-divider"></div>

        {/* Sections */}
        <nav className="sidebar-sections">
          {sections.map((section) => (
            <details key={section.label} className="sidebar-group" open={sectionHasActive(section) || undefined}>
              <summary className="sidebar-group-title">
                <svg className="sidebar-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
                <span>{section.label}</span>
                <span className="sidebar-badge">{section.items.length}</span>
              </summary>
              <ul className="sidebar-items">
                {section.items.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className={["sidebar-link", isActive(item.href) ? "active" : ""].filter(Boolean).join(" ")}
                    >
                      {item.title}
                    </a>
                  </li>
                ))}
              </ul>
            </details>
          ))}
        </nav>
      </div>
    </aside>
  );
}
