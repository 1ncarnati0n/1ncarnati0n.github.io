interface Props {
  tags: string[];
}

export default function TagList({ tags }: Props) {
  if (tags.length === 0) return null;

  return (
    <>
      <div className="tag-list">
        {tags.map((tag) => (
          <a key={tag} href={`/tags/${tag}/`} className="tag-link">
            #{tag}
          </a>
        ))}
      </div>

      <style>{`
        .tag-list {
          display: flex;
          flex-wrap: wrap;
          gap: var(--spacing-sm);
        }
        .tag-link {
          font-size: 0.8rem;
          font-family: var(--font-header);
          color: var(--gray);
          background: color-mix(in srgb, var(--gray) 10%, transparent);
          padding: 2px 10px;
          border-radius: var(--radius-sm);
          transition: background var(--transition), color var(--transition);
        }
        .tag-link:hover {
          background: color-mix(in srgb, var(--tertiary) 25%, transparent);
          color: var(--text);
          opacity: 1;
        }
      `}</style>
    </>
  );
}
