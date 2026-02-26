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
}: Props) {
  const displayTitle = deriveTitle(slug, title);
  const category = getPostCategory(slug);

  return (
    <>
      <a href={`/posts/${slug}/`} className="post-item">
        <div className="post-item-meta">
          <span className="post-item-category">{category}</span>
          {date && (
            <>
              <span className="post-item-dot" aria-hidden="true">&middot;</span>
              <time dateTime={date.toISOString()}>{formatDate(date)}</time>
            </>
          )}
        </div>

        <h3 className="post-item-title">{displayTitle}</h3>

        {description && <p className="post-item-desc">{description}</p>}
      </a>

      <style>{`
        .post-item {
          display: grid;
          gap: 0.3rem;
          padding: 0.85rem 0;
          border-bottom: 1px dotted var(--line);
          color: var(--text);
          text-decoration: none;
          transition: color var(--transition);
        }

        .post-item:first-child {
          padding-top: 0;
        }

        .post-item:last-child {
          border-bottom: none;
        }

        .post-item:hover .post-item-title {
          color: var(--tertiary);
        }

        .post-item-meta {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.35rem;
          color: var(--gray);
          font-family: var(--font-header);
          font-size: 0.68rem;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .post-item-dot {
          font-size: 0.55rem;
        }

        .post-item-category {
          color: var(--gray);
        }

        .post-item-title {
          color: var(--text-heading);
          font-size: 1.01rem;
          line-height: 1.38;
          letter-spacing: -0.01em;
          font-weight: 400;
          transition: color var(--transition);
        }

        .post-item-desc {
          color: color-mix(in srgb, var(--text) 55%, transparent);
          font-size: 0.84rem;
          line-height: 1.6;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </>
  );
}
