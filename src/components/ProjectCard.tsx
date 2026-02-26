import Image from "next/image";

interface Props {
  title: string;
  slug: string;
  thumbnail?: string | null;
  category?: string | null;
}

export default function ProjectCard({
  title,
  slug,
  thumbnail,
  category,
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
              sizes="(max-width: 700px) 100vw, (max-width: 1080px) 50vw, 50vw"
            />
          ) : (
            <div className="project-placeholder" />
          )}
          <div className="project-overlay" />
        </div>

        <div className="project-body">
          <h3>{title}</h3>
          {category && <span className="project-category">{category}</span>}
        </div>
      </a>

      <style>{`
        .project-card {
          display: grid;
          grid-template-rows: auto auto;
          overflow: hidden;
          color: var(--text);
          text-decoration: none;
        }

        .project-media {
          position: relative;
          aspect-ratio: 3 / 2;
          overflow: hidden;
          background: var(--surface);
        }

        .project-media :global(img) {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 0;
        }

        .project-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0);
          transition: background 0.3s ease;
          pointer-events: none;
        }

        .project-card:hover .project-overlay {
          background: rgba(255, 255, 255, 0.08);
        }

        [data-theme="dark"] .project-card:hover .project-overlay {
          background: rgba(255, 255, 255, 0.05);
        }

        .project-placeholder {
          position: absolute;
          inset: 0;
          background: var(--surface);
        }

        .project-body {
          padding: var(--spacing-sm) 0;
          display: grid;
          gap: 0.15rem;
        }

        .project-body h3 {
          font-size: 0.94rem;
          line-height: 1.34;
          letter-spacing: -0.005em;
          font-weight: 400;
          color: var(--text-heading);
        }

        .project-category {
          color: var(--gray);
          font-family: var(--font-header);
          font-size: 0.68rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
      `}</style>
    </>
  );
}
