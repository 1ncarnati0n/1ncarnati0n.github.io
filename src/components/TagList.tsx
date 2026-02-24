interface Props {
  tags: string[];
}

export default function TagList({ tags }: Props) {
  if (tags.length === 0) return null;

  return (
    <>
      <ul className="tag-list" aria-label="태그 목록">
        {tags.map((tag) => (
          <li key={tag}>
            <a href={`/tags/${encodeURIComponent(tag)}/`} className="tag-link">
              <span aria-hidden="true">#</span>
              {tag}
            </a>
          </li>
        ))}
      </ul>

      <style>{`
        .tag-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.44rem;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .tag-link {
          display: inline-flex;
          align-items: center;
          gap: 0.22rem;
          min-height: 28px;
          font-size: 0.74rem;
          font-family: var(--font-header);
          font-weight: 500;
          color: color-mix(in srgb, var(--text) 78%, transparent);
          border: 1px solid color-mix(in srgb, var(--line) 88%, transparent);
          background: color-mix(in srgb, var(--surface-raised) 93%, transparent);
          padding: 0.28rem 0.62rem;
          border-radius: 999px;
          transition: border-color var(--transition), background var(--transition), color var(--transition);
          text-transform: lowercase;
        }

        .tag-link span {
          color: color-mix(in srgb, var(--tertiary) 70%, transparent);
          font-family: var(--font-code);
          font-size: 0.69rem;
        }

        .tag-link:hover {
          color: var(--text-heading);
          border-color: color-mix(in srgb, var(--tertiary) 42%, transparent);
          background: color-mix(in srgb, var(--tertiary) 15%, transparent);
        }
      `}</style>
    </>
  );
}
