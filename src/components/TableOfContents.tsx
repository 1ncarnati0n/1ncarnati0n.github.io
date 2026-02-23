import type { Heading } from "@/lib/types";

interface Props {
  headings: Heading[];
}

export default function TableOfContents({ headings }: Props) {
  const filteredHeadings = headings.filter((h) => h.depth >= 2 && h.depth <= 4);

  if (filteredHeadings.length === 0) return null;

  return (
    <>
      <nav className="toc-sidebar" aria-label="목차">
        <h4 className="toc-title">목차</h4>
        <ul className="toc-list">
          {filteredHeadings.map((heading) => (
            <li key={heading.slug} className={`toc-item depth-${heading.depth}`}>
              <a href={`#${heading.slug}`}>{heading.text}</a>
            </li>
          ))}
        </ul>
      </nav>

      <style>{`
        .toc-sidebar {
          position: sticky;
          top: 80px;
          max-height: calc(100vh - 100px);
          overflow-y: auto;
          padding-right: var(--spacing-md);
        }
        .toc-title {
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--gray);
          margin-bottom: var(--spacing-sm);
          font-family: var(--font-header);
        }
        .toc-list {
          list-style: none;
          padding: 0;
        }
        .toc-item {
          margin-bottom: 4px;
        }
        .toc-item a {
          display: block;
          font-size: 0.8rem;
          color: var(--gray);
          padding: 2px 0;
          line-height: 1.4;
          text-decoration: none;
          border-left: 2px solid transparent;
          padding-left: var(--spacing-sm);
          transition: color var(--transition), border-color var(--transition);
        }
        .toc-item a:hover {
          color: var(--text);
          border-left-color: var(--tertiary);
          opacity: 1;
        }
        .toc-item.depth-3 {
          padding-left: var(--spacing-md);
        }
        .toc-item.depth-4 {
          padding-left: var(--spacing-xl);
        }
      `}</style>
    </>
  );
}
