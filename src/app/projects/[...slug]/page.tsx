import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";
import DocLayout from "@/components/DocLayout";
import Breadcrumbs from "@/components/Breadcrumbs";
import TagList from "@/components/TagList";
import { getAllProjects, getProjectBySlug, getSortedProjects } from "@/lib/content";
import { renderMarkdown } from "@/lib/markdown";
import { cleanSlug, formatDate } from "@/lib/content-utils";
import { buildProjectsSidebar } from "@/lib/sidebar-config";

export function generateStaticParams() {
  return getAllProjects().map((project) => ({
    slug: cleanSlug(project.id).split("/"),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const slugStr = slug.join("/");
  const project = getProjectBySlug(slugStr);
  if (!project) return {};

  return {
    title: project.data.title,
    description: project.data.description || undefined,
    openGraph: project.data.thumbnail
      ? { images: [project.data.thumbnail] }
      : undefined,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const slugStr = slug.join("/");
  const project = getProjectBySlug(slugStr);
  if (!project) notFound();

  const { html } = await renderMarkdown(project.body);
  const sections = buildProjectsSidebar(getSortedProjects());
  const projectCode = (cleanSlug(project.id).split("/").pop() ?? "project")
    .slice(0, 3)
    .toUpperCase();

  return (
    <DocLayout sections={sections} sidebarContext="projects">
      <article className="project-page">
        <Breadcrumbs
          items={[
            { label: "Projects", href: "/projects/" },
            { label: project.data.title },
          ]}
        />

        <header className="project-hero">
          <div className="project-copy">
            <p className="project-kicker">{project.data.category ?? "Project"}</p>
            <h1>{project.data.title}</h1>

            {project.data.description && (
              <p className="project-summary">{project.data.description}</p>
            )}

            <dl className="project-facts">
              <div>
                <dt>Code</dt>
                <dd>{projectCode}</dd>
              </div>
              {project.data.date && (
                <div>
                  <dt>Date</dt>
                  <dd>
                    <time dateTime={project.data.date.toISOString()}>
                      {formatDate(project.data.date)}
                    </time>
                  </dd>
                </div>
              )}
              {project.data.location && (
                <div>
                  <dt>Location</dt>
                  <dd>{project.data.location}</dd>
                </div>
              )}
              {project.data.role && (
                <div>
                  <dt>Role</dt>
                  <dd>{project.data.role}</dd>
                </div>
              )}
            </dl>

            <TagList tags={project.data.tags ?? []} />
          </div>

          <div className="project-media">
            {project.data.thumbnail ? (
              <Image
                src={project.data.thumbnail}
                alt={project.data.title}
                fill
                sizes="(max-width: 900px) 100vw, 45vw"
              />
            ) : (
              <div className="project-media-placeholder">
                <span>{projectCode}</span>
              </div>
            )}
          </div>
        </header>

        <div className="project-content-wrap">
          <div
            className="prose project-content"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </article>

      <style>{`
        .project-page {
          max-width: 1040px;
          display: grid;
          gap: var(--spacing-md);
        }

        .project-hero {
          border: 1px solid color-mix(in srgb, var(--line) 90%, transparent);
          background: color-mix(in srgb, var(--surface) 96%, transparent);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-sm);
          overflow: hidden;
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(320px, 0.92fr);
        }

        .project-copy {
          padding: clamp(1rem, 2.4vw, 1.8rem);
          display: grid;
          align-content: start;
          gap: var(--spacing-sm);
        }

        .project-kicker {
          color: var(--gray);
          font-family: var(--font-code);
          font-size: 0.68rem;
          letter-spacing: 0.11em;
          text-transform: uppercase;
        }

        .project-copy h1 {
          font-size: clamp(1.55rem, 3vw, 2.45rem);
          letter-spacing: -0.02em;
          line-height: 1.2;
        }

        .project-summary {
          color: color-mix(in srgb, var(--text) 82%, transparent);
          line-height: 1.65;
        }

        .project-facts {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: var(--spacing-xs);
          margin-bottom: var(--spacing-xs);
        }

        .project-facts div {
          border: 1px solid color-mix(in srgb, var(--line) 88%, transparent);
          border-radius: var(--radius-sm);
          background: color-mix(in srgb, var(--surface-raised) 95%, transparent);
          padding: 0.48rem 0.58rem;
          display: grid;
          gap: 0.08rem;
        }

        .project-facts dt {
          color: var(--gray);
          font-family: var(--font-code);
          font-size: 0.62rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .project-facts dd {
          color: var(--text-heading);
          font-family: var(--font-header);
          font-size: 0.84rem;
          word-break: keep-all;
        }

        .project-media {
          position: relative;
          min-height: 280px;
          border-left: 1px solid color-mix(in srgb, var(--line) 85%, transparent);
          overflow: hidden;
          background: color-mix(in srgb, var(--surface-raised) 92%, transparent);
        }

        .project-media :global(img) {
          object-fit: cover;
        }

        .project-media::after {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: linear-gradient(
            155deg,
            color-mix(in srgb, var(--accent) 8%, transparent) 8%,
            transparent 44%,
            color-mix(in srgb, var(--tertiary) 14%, transparent) 100%
          );
        }

        .project-media-placeholder {
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

        .project-media-placeholder span {
          font-family: var(--font-code);
          color: color-mix(in srgb, var(--accent) 72%, transparent);
          letter-spacing: 0.08em;
          font-size: 0.95rem;
        }

        .project-content-wrap {
          border: 1px solid color-mix(in srgb, var(--line) 90%, transparent);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-sm);
          background: color-mix(in srgb, var(--surface-raised) 95%, transparent);
          padding: clamp(1rem, 2.5vw, 1.9rem);
        }

        .project-content {
          max-width: 100%;
        }

        .project-content :global(img) {
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-md);
        }

        @media (max-width: 980px) {
          .project-hero {
            grid-template-columns: 1fr;
          }

          .project-media {
            border-left: 0;
            border-top: 1px solid color-mix(in srgb, var(--line) 85%, transparent);
            min-height: 240px;
          }
        }

        @media (max-width: 700px) {
          .project-facts {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </DocLayout>
  );
}
