interface Props {
  title: string;
  slug: string;
  thumbnail?: string | null;
  category?: string | null;
  description?: string;
}

export default function ProjectCard({ title, slug, thumbnail, category, description }: Props) {
  return (
    <>
      <a href={`/projects/${slug}/`} className="project-card" data-category={category ?? undefined}>
        <div className="card-image">
          {thumbnail ? (
            <img src={thumbnail} alt={title} loading="lazy" />
          ) : (
            <div className="card-placeholder">
              <span>{title.charAt(0)}</span>
            </div>
          )}
          {category && <span className="card-category">{category}</span>}
        </div>
        <div className="card-body">
          <h3 className="card-title">{title}</h3>
          {description && <p className="card-desc">{description}</p>}
        </div>
      </a>

      <style>{`
        .project-card {
          display: block;
          border-radius: var(--radius-md);
          overflow: hidden;
          background: var(--bg-secondary);
          box-shadow: var(--shadow-sm);
          transition: transform var(--transition), box-shadow var(--transition);
          text-decoration: none;
          color: var(--text);
        }
        .project-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-md);
          opacity: 1;
        }
        .card-image {
          position: relative;
          aspect-ratio: 4 / 3;
          overflow: hidden;
          background: color-mix(in srgb, var(--gray) 15%, transparent);
        }
        .card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 0;
          transition: transform var(--transition);
        }
        .project-card:hover .card-image img {
          transform: scale(1.05);
        }
        .card-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          font-family: var(--font-header);
          color: var(--gray);
        }
        .card-category {
          position: absolute;
          top: var(--spacing-sm);
          right: var(--spacing-sm);
          background: color-mix(in srgb, var(--bg) 90%, transparent);
          backdrop-filter: blur(4px);
          padding: 2px 8px;
          border-radius: var(--radius-sm);
          font-family: var(--font-header);
          font-size: 0.75rem;
          font-weight: 500;
          color: var(--text);
        }
        .card-body {
          padding: var(--spacing-md);
        }
        .card-title {
          font-size: 0.95rem;
          margin-bottom: var(--spacing-xs);
          line-height: 1.4;
        }
        .card-desc {
          font-size: 0.8rem;
          color: var(--gray);
          line-height: 1.5;
        }
      `}</style>
    </>
  );
}
