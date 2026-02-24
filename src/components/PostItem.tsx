import { formatDate, getPostCategory, deriveTitle } from "@/lib/content-utils";

interface Props {
  title?: string | null;
  slug: string;
  date?: Date | null;
  description?: string;
  tags?: string[];
}

export default function PostItem({
  title,
  slug,
  date,
  description,
  tags = [],
}: Props) {
  const displayTitle = deriveTitle(slug, title);
  const category = getPostCategory(slug);

  return (
    <>
      <a href={`/posts/${slug}/`} className="post-item">
        <div className="post-item-meta">
          <span className="post-item-category">{category}</span>
          {date && <time dateTime={date.toISOString()}>{formatDate(date)}</time>}
        </div>

        <div className="post-item-headline">
          <h3>{displayTitle}</h3>
          <span aria-hidden="true">&rarr;</span>
        </div>

        {description && <p className="post-item-desc">{description}</p>}

        {tags.length > 0 && (
          <div className="post-item-tags">
            {tags.slice(0, 4).map((tag) => (
              <span key={tag}>#{tag}</span>
            ))}
          </div>
        )}
      </a>

      <style>{`
        .post-item {
          display: grid;
          gap: 0.5rem;
          border: 1px solid color-mix(in srgb, var(--line) 90%, transparent);
          border-radius: var(--radius-md);
          background: color-mix(in srgb, var(--surface-raised) 96%, transparent);
          padding: 0.9rem 1rem;
          color: var(--text);
          text-decoration: none;
          transition: transform 0.18s ease, box-shadow var(--transition), border-color var(--transition);
        }

        .post-item:hover {
          color: var(--text);
          transform: translateY(-2px);
          border-color: color-mix(in srgb, var(--accent) 42%, transparent);
          box-shadow: var(--shadow-sm);
        }

        .post-item-meta {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.42rem;
          color: var(--gray);
          font-family: var(--font-code);
          font-size: 0.67rem;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .post-item-category {
          color: var(--text);
          border: 1px solid color-mix(in srgb, var(--line) 88%, transparent);
          border-radius: 999px;
          background: color-mix(in srgb, var(--surface) 94%, transparent);
          padding: 0.15rem 0.48rem;
          font-family: var(--font-header);
          font-size: 0.68rem;
          letter-spacing: 0.02em;
          text-transform: none;
        }

        .post-item-headline {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: var(--spacing-sm);
        }

        .post-item-headline h3 {
          color: var(--text-heading);
          font-size: 1.01rem;
          line-height: 1.38;
          letter-spacing: -0.01em;
        }

        .post-item-headline span {
          color: color-mix(in srgb, var(--accent) 60%, transparent);
          transform: translateY(2px);
          transition: transform var(--transition), color var(--transition);
        }

        .post-item:hover .post-item-headline span {
          color: var(--tertiary);
          transform: translate(2px, 2px);
        }

        .post-item-desc {
          color: color-mix(in srgb, var(--text) 76%, transparent);
          font-size: 0.86rem;
          line-height: 1.6;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .post-item-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.35rem;
        }

        .post-item-tags span {
          color: var(--gray);
          font-family: var(--font-header);
          font-size: 0.74rem;
        }
      `}</style>
    </>
  );
}
