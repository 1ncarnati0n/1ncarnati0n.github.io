import { formatDate, getPostCategory, deriveTitle } from "@/lib/content-utils";

interface Props {
  title?: string | null;
  slug: string;
  date?: Date | null;
  description?: string;
  tags?: string[];
}

export default function PostItem({ title, slug, date, description, tags = [] }: Props) {
  const displayTitle = deriveTitle(slug, title);
  const category = getPostCategory(slug);

  return (
    <>
      <a href={`/posts/${slug}/`} className="post-item">
        <div className="post-meta">
          <span className="post-category">{category}</span>
          {date && <time dateTime={date.toISOString()}>{formatDate(date)}</time>}
        </div>
        <h3 className="post-title">{displayTitle}</h3>
        {description && <p className="post-desc">{description}</p>}
        {tags.length > 0 && (
          <div className="post-tags">
            {tags.slice(0, 3).map((tag) => (
              <span key={tag} className="tag">#{tag}</span>
            ))}
          </div>
        )}
      </a>

      <style>{`
        .post-item {
          display: block;
          padding: var(--spacing-md) 0;
          border-bottom: 1px solid color-mix(in srgb, var(--gray) 15%, transparent);
          text-decoration: none;
          color: var(--text);
          transition: padding-left var(--transition);
        }
        .post-item:hover {
          padding-left: var(--spacing-sm);
          opacity: 1;
        }
        .post-meta {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          font-size: 0.8rem;
          color: var(--gray);
          margin-bottom: var(--spacing-xs);
          font-family: var(--font-header);
        }
        .post-category {
          background: color-mix(in srgb, var(--tertiary) 20%, transparent);
          padding: 1px 8px;
          border-radius: var(--radius-sm);
          font-size: 0.75rem;
          text-transform: capitalize;
        }
        .post-title {
          font-size: 1.1rem;
          margin-bottom: var(--spacing-xs);
          color: var(--text-heading);
        }
        .post-desc {
          font-size: 0.85rem;
          color: var(--gray);
          line-height: 1.5;
        }
        .post-tags {
          display: flex;
          gap: var(--spacing-sm);
          margin-top: var(--spacing-xs);
        }
        .tag {
          font-size: 0.75rem;
          color: var(--tertiary);
          font-family: var(--font-header);
        }
      `}</style>
    </>
  );
}
