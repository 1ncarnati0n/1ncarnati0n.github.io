import type { Heading } from "@/lib/types";

interface Props {
  headings: Heading[];
}

export default function TableOfContents({ headings }: Props) {
  const filteredHeadings = headings.filter((heading) => heading.depth >= 2 && heading.depth <= 4);
  if (filteredHeadings.length === 0) return null;

  return (
    <>
      <nav className="toc-sidebar" aria-label="목차">
        <div className="toc-head">
          <h4 className="toc-title">Contents</h4>
          <span className="toc-count">{filteredHeadings.length}</span>
        </div>
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
          top: calc(var(--header-height) + 10px);
          max-height: calc(100vh - var(--header-height) - 20px);
          overflow-y: auto;
          border: 1px solid color-mix(in srgb, var(--line) 88%, transparent);
          border-radius: var(--radius-lg);
          background: linear-gradient(
            180deg,
            color-mix(in srgb, var(--surface) 96%, transparent),
            color-mix(in srgb, var(--surface-raised) 97%, transparent)
          );
          box-shadow: var(--shadow-sm);
          padding: var(--spacing-sm) var(--spacing-xs) var(--spacing-sm) var(--spacing-sm);
        }

        .toc-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--spacing-xs);
          margin-bottom: var(--spacing-sm);
          padding-right: var(--spacing-sm);
        }

        .toc-title {
          color: var(--gray);
          font-family: var(--font-code);
          font-size: 0.68rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .toc-count {
          color: var(--gray);
          font-family: var(--font-code);
          font-size: 0.62rem;
          border: 1px solid color-mix(in srgb, var(--line) 84%, transparent);
          border-radius: 999px;
          background: color-mix(in srgb, var(--surface-raised) 92%, transparent);
          padding: 0.12rem 0.42rem;
        }

        .toc-list {
          list-style: none;
          display: grid;
          gap: 0.15rem;
          padding-right: var(--spacing-xs);
          margin: 0;
        }

        .toc-item a {
          display: block;
          color: color-mix(in srgb, var(--text) 73%, transparent);
          font-family: var(--font-header);
          font-size: 0.73rem;
          line-height: 1.4;
          border-left: 2px solid transparent;
          border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
          padding: 0.22rem 0.34rem 0.22rem 0.5rem;
          transition: color var(--transition), border-color var(--transition), background var(--transition);
        }

        .toc-item a:hover {
          color: var(--text-heading);
          border-left-color: var(--tertiary);
          background: color-mix(in srgb, var(--tertiary) 13%, transparent);
        }

        .toc-item.depth-3 {
          padding-left: var(--spacing-sm);
        }

        .toc-item.depth-4 {
          padding-left: calc(var(--spacing-sm) + 0.5rem);
        }

        .toc-sidebar::-webkit-scrollbar {
          width: 6px;
        }

        .toc-sidebar::-webkit-scrollbar-track {
          background: transparent;
        }

        .toc-sidebar::-webkit-scrollbar-thumb {
          background: color-mix(in srgb, var(--gray) 28%, transparent);
          border-radius: 999px;
        }
      `}</style>
    </>
  );
}
