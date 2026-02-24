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
          color: color-mix(in srgb, var(--gray) 60%, transparent);
          font-family: var(--font-code);
          font-size: 0.64rem;
        }

        .breadcrumbs a {
          color: color-mix(in srgb, var(--text) 76%, transparent);
          padding: 0.16rem 0.46rem;
          border-radius: 999px;
          border: 1px solid color-mix(in srgb, var(--line) 88%, transparent);
          background: color-mix(in srgb, var(--surface-raised) 93%, transparent);
          text-decoration: none;
          transition: border-color var(--transition), background var(--transition), color var(--transition);
        }

        .breadcrumbs a:hover {
          color: var(--text-heading);
          border-color: color-mix(in srgb, var(--accent) 42%, transparent);
          background: color-mix(in srgb, var(--accent) 12%, transparent);
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

          .breadcrumbs a {
            padding: 0.14rem 0.4rem;
          }
        }
      `}</style>
    </>
  );
}
