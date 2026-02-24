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
              #{tag}
            </a>
          </li>
        ))}
      </ul>

      <style>{`
        .tag-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .tag-link {
          color: var(--gray);
          font-family: var(--font-header);
          font-size: 0.78rem;
          font-weight: 400;
          text-decoration: none;
          text-transform: lowercase;
          transition: color var(--transition);
        }

        .tag-link:hover {
          color: var(--tertiary);
        }
      `}</style>
    </>
  );
}
