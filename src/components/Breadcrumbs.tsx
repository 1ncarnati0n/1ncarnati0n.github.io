interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface Props {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: Props) {
  return (
    <>
      <nav className="breadcrumbs" aria-label="경로">
        <a href="/">Home</a>
        {items.map((item, i) => (
          <span key={i}>
            <span className="sep">/</span>
            {item.href && i < items.length - 1 ? (
              <a href={item.href}>{item.label}</a>
            ) : (
              <span className="current">{item.label}</span>
            )}
          </span>
        ))}
      </nav>

      <style>{`
        .breadcrumbs {
          font-size: 0.8rem;
          font-family: var(--font-header);
          color: var(--gray);
          margin-bottom: var(--spacing-md);
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: var(--spacing-xs);
        }
        .breadcrumbs a {
          color: var(--gray);
          text-decoration: none;
        }
        .breadcrumbs a:hover {
          color: var(--text);
          opacity: 1;
        }
        .sep {
          opacity: 0.4;
        }
        .current {
          color: var(--text);
        }
      `}</style>
    </>
  );
}
