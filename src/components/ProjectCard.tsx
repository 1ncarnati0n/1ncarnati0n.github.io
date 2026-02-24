import Image from "next/image";

interface Props {
  title: string;
  slug: string;
  thumbnail?: string | null;
  category?: string | null;
  description?: string;
}

function getCardCode(slug: string): string {
  const token = slug.split("/").pop() ?? slug;
  return token.slice(0, 3).toUpperCase();
}

export default function ProjectCard({
  title,
  slug,
  thumbnail,
  category,
  description,
}: Props) {
  const cardCode = getCardCode(slug);

  return (
    <>
      <a href={`/projects/${slug}/`} className="project-card" data-category={category ?? undefined}>
        <div className="project-media">
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt={title}
              fill
              sizes="(max-width: 700px) 100vw, (max-width: 1080px) 50vw, 33vw"
            />
          ) : (
            <div className="project-placeholder">
              <span>{cardCode}</span>
            </div>
          )}

          <div className="project-overlay">
            <span className="project-code">{cardCode}</span>
            {category && <span className="project-category">{category}</span>}
          </div>
        </div>

        <div className="project-body">
          <div className="project-headline">
            <h3>{title}</h3>
            <span aria-hidden="true">&rarr;</span>
          </div>
          {description && <p>{description}</p>}
        </div>
      </a>

      <style>{`
        .project-card {
          display: grid;
          grid-template-rows: auto 1fr;
          border-radius: var(--radius-lg);
          border: 1px solid color-mix(in srgb, var(--line) 88%, transparent);
          background: color-mix(in srgb, var(--surface-raised) 96%, transparent);
          box-shadow: var(--shadow-sm);
          overflow: hidden;
          color: var(--text);
          text-decoration: none;
          transition: transform 0.2s ease, box-shadow var(--transition), border-color var(--transition);
        }

        .project-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-md);
          border-color: color-mix(in srgb, var(--accent) 42%, transparent);
          color: var(--text);
        }

        .project-media {
          position: relative;
          aspect-ratio: 5 / 3.6;
          overflow: hidden;
          border-bottom: 1px solid color-mix(in srgb, var(--line) 85%, transparent);
          background: color-mix(in srgb, var(--surface) 96%, transparent);
        }

        .project-media::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            155deg,
            color-mix(in srgb, var(--accent) 8%, transparent) 5%,
            transparent 45%,
            color-mix(in srgb, var(--tertiary) 13%, transparent) 100%
          );
        }

        .project-media :global(img) {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 0;
          transition: transform 0.5s ease;
        }

        .project-card:hover .project-media img {
          transform: scale(1.06);
        }

        .project-placeholder {
          position: absolute;
          inset: 0;
          display: grid;
          place-items: center;
          background:
            linear-gradient(0deg, color-mix(in srgb, var(--line) 50%, transparent) 1px, transparent 1px),
            linear-gradient(90deg, color-mix(in srgb, var(--line) 50%, transparent) 1px, transparent 1px),
            color-mix(in srgb, var(--surface) 95%, transparent);
          background-size: 24px 24px, 24px 24px, auto;
        }

        .project-placeholder span {
          font-family: var(--font-code);
          color: color-mix(in srgb, var(--accent) 76%, transparent);
          letter-spacing: 0.08em;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .project-overlay {
          position: absolute;
          left: var(--spacing-sm);
          right: var(--spacing-sm);
          top: var(--spacing-sm);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--spacing-sm);
          z-index: 1;
        }

        .project-code,
        .project-category {
          background: color-mix(in srgb, var(--surface-raised) 88%, transparent);
          border: 1px solid color-mix(in srgb, var(--line) 88%, transparent);
          border-radius: 999px;
          padding: 0.2rem 0.55rem;
          font-family: var(--font-code);
          font-size: 0.65rem;
          letter-spacing: 0.08em;
          color: var(--text);
          text-transform: uppercase;
          white-space: nowrap;
          backdrop-filter: blur(4px);
        }

        .project-category {
          font-family: var(--font-header);
          font-size: 0.68rem;
          letter-spacing: 0.02em;
          text-transform: none;
        }

        .project-body {
          padding: var(--spacing-md) var(--spacing-md) var(--spacing-lg);
          display: grid;
          gap: var(--spacing-xs);
          align-content: start;
        }

        .project-headline {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: var(--spacing-sm);
        }

        .project-headline h3 {
          font-size: 1.04rem;
          line-height: 1.34;
          letter-spacing: -0.01em;
          color: var(--text-heading);
          transition: color var(--transition);
        }

        .project-headline span {
          color: color-mix(in srgb, var(--accent) 64%, transparent);
          font-size: 1rem;
          transform: translateY(1px);
          transition: transform var(--transition), color var(--transition);
        }

        .project-card:hover .project-headline span {
          transform: translate(2px, 1px);
          color: var(--tertiary);
        }

        .project-body p {
          color: color-mix(in srgb, var(--text) 78%, transparent);
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
