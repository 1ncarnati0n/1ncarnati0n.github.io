import Image from "next/image";

interface Props {
  title: string;
  slug: string;
  thumbnail?: string | null;
  category?: string | null;
  description?: string;
}

export default function ProjectCard({
  title,
  slug,
  thumbnail,
  category,
  description,
}: Props) {
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
            <div className="project-placeholder" />
          )}
        </div>

        <div className="project-body">
          {category && <span className="project-category">{category}</span>}
          <h3>{title}</h3>
          {description && <p>{description}</p>}
        </div>
      </a>

      <style>{`
        .project-card {
          display: grid;
          grid-template-rows: auto 1fr;
          border-radius: var(--radius-md);
          border: 1px solid var(--line);
          overflow: hidden;
          color: var(--text);
          text-decoration: none;
          transition: border-color var(--transition);
        }

        .project-card:hover {
          border-color: color-mix(in srgb, var(--accent) 30%, transparent);
          color: var(--text);
        }

        .project-media {
          position: relative;
          aspect-ratio: 5 / 3.6;
          overflow: hidden;
          background: var(--surface);
        }

        .project-media :global(img) {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 0;
          transition: transform 0.4s ease;
        }

        .project-card:hover .project-media img {
          transform: scale(1.03);
        }

        .project-placeholder {
          position: absolute;
          inset: 0;
          background: var(--surface);
        }

        .project-body {
          padding: var(--spacing-md);
          display: grid;
          gap: 0.25rem;
          align-content: start;
        }

        .project-category {
          color: var(--gray);
          font-family: var(--font-code);
          font-size: 0.65rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .project-body h3 {
          font-size: 1.01rem;
          line-height: 1.34;
          letter-spacing: -0.01em;
          color: var(--text-heading);
        }

        .project-body p {
          color: color-mix(in srgb, var(--text) 65%, transparent);
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
