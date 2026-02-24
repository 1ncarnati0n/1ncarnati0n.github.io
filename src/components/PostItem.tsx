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
          {date && <time dateTime={date.toISOString()}>{formatDate(date)}</time>}
        </div>

        <h3 className="post-item-title">{displayTitle}</h3>

        {description && <p className="post-item-desc">{description}</p>}
      </a>

      <style>{`
        .post-item {
          display: grid;
          gap: 0.35rem;
          padding: 0.9rem 0;
          border-bottom: 1px solid var(--line);
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
          gap: 0.42rem;
          color: var(--gray);
          font-family: var(--font-code);
          font-size: 0.67rem;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .post-item-category {
          color: var(--gray);
          font-family: var(--font-header);
          font-size: 0.72rem;
          letter-spacing: 0.02em;
          text-transform: capitalize;
        }

        .post-item-title {
          color: var(--text-heading);
          font-size: 1.01rem;
          line-height: 1.38;
          letter-spacing: -0.01em;
          transition: color var(--transition);
        }

        .post-item-desc {
          color: color-mix(in srgb, var(--text) 65%, transparent);
          font-size: 0.86rem;
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
