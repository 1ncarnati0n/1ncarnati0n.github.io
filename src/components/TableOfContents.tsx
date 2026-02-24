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
        <h4 className="toc-title">Contents</h4>
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
        }

        .toc-title {
          color: var(--gray);
          font-family: var(--font-code);
          font-size: 0.68rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: var(--spacing-sm);
        }

        .toc-list {
          list-style: none;
          display: grid;
          gap: 0.15rem;
          margin: 0;
          padding: 0;
        }

        .toc-item a {
          display: block;
          color: color-mix(in srgb, var(--text) 60%, transparent);
          font-family: var(--font-header);
          font-size: 0.73rem;
          line-height: 1.4;
          border-left: 1px solid transparent;
          padding: 0.22rem 0.34rem 0.22rem 0.5rem;
          transition: color var(--transition), border-color var(--transition);
        }

        .toc-item a:hover {
          color: var(--text-heading);
          border-left-color: var(--tertiary);
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
          background: color-mix(in srgb, var(--gray) 25%, transparent);
          border-radius: 999px;
        }
      `}</style>
    </>
  );
}
