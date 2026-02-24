interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface Props {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: Props) {
  const trail = [{ label: "Home", href: "/" }, ...items];

  return (
    <>
      <nav className="breadcrumbs" aria-label="경로">
        <ol className="breadcrumbs-list">
          {trail.map((item, index) => {
            const isLast = index === trail.length - 1;

            return (
              <li key={`${item.label}-${item.href ?? index}`} className="breadcrumbs-item">
                {item.href && !isLast ? (
                  <a href={item.href}>{item.label}</a>
                ) : (
                  <span className="current" aria-current="page">
                    {item.label}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>

      <style>{`
        .breadcrumbs {
          margin-bottom: var(--spacing-md);
        }

        .breadcrumbs-list {
          list-style: none;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 0.34rem;
          margin: 0;
          padding: 0;
        }

        .breadcrumbs-item {
          display: inline-flex;
          align-items: center;
          gap: 0.34rem;
          color: var(--gray);
          font-family: var(--font-header);
          font-size: 0.76rem;
          letter-spacing: 0.01em;
        }

        .breadcrumbs-item + .breadcrumbs-item::before {
          content: "/";
          color: color-mix(in srgb, var(--gray) 50%, transparent);
          font-family: var(--font-code);
          font-size: 0.64rem;
        }

        .breadcrumbs a {
          color: var(--gray);
          text-decoration: none;
          transition: color var(--transition);
        }

        .breadcrumbs a:hover {
          color: var(--text-heading);
          text-decoration: underline;
          text-underline-offset: 0.2em;
        }

        .current {
          color: var(--text-heading);
          font-weight: 600;
          font-size: 0.8rem;
        }

        @media (max-width: 760px) {
          .breadcrumbs {
            margin-bottom: var(--spacing-sm);
          }
        }
      `}</style>
    </>
  );
}
