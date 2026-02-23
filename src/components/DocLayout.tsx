import Sidebar from "./Sidebar";
import type { SidebarSection } from "@/lib/sidebar-config";

interface Props {
  sections: SidebarSection[];
  sidebarContext?: "blog" | "projects";
  showRightSidebar?: boolean;
  toc?: React.ReactNode;
  children: React.ReactNode;
}

export default function DocLayout({
  sections,
  sidebarContext = "blog",
  showRightSidebar = false,
  toc,
  children,
}: Props) {
  return (
    <>
      <div className="doc-layout">
        <Sidebar sections={sections} context={sidebarContext} />

        <div className="doc-content">
          {children}
        </div>

        {showRightSidebar && toc && (
          <div className="doc-right-sidebar">
            {toc}
          </div>
        )}
      </div>

      {/* Mobile overlay */}
      <div className="sidebar-overlay" id="sidebar-overlay"></div>
    </>
  );
}
