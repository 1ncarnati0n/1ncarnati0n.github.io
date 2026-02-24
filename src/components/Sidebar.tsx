"use client";

import { usePathname } from "next/navigation";
import type { SidebarSection } from "@/lib/sidebar-config";

interface Props {
  sections: SidebarSection[];
  context?: "blog" | "projects";
}

function normalize(path: string): string {
  return path.endsWith("/") ? path : `${path}/`;
}

export default function Sidebar({ sections }: Props) {
  const currentPath = usePathname() ?? "/";

  const isActive = (href: string): boolean => {
    const current = normalize(currentPath);
    const target = normalize(href);
    return current === target || (target !== "/" && current.startsWith(target));
  };

  const sectionHasActive = (section: SidebarSection): boolean => {
    return section.items.some((item) => isActive(item.href));
  };

  return (
    <aside className="sidebar" id="sidebar">
      <div className="sidebar-inner">
        <nav className="sidebar-sections" aria-label="문서 목차">
          {sections.length === 0 && (
            <p className="sidebar-empty">아직 표시할 문서가 없습니다.</p>
          )}

          {sections.map((section) => (
            <details key={section.label} className="sidebar-group" open={sectionHasActive(section) || undefined}>
              <summary className="sidebar-group-title">
                <svg className="sidebar-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
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
