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

  return (
    <DocLayout sections={sections} sidebarContext="projects">
      <article className="project-page">
        <Breadcrumbs
          items={[
            { label: "Projects", href: "/projects/" },
            { label: project.data.title },
          ]}
        />

        <header className="project-header">
          <p className="project-kicker">{project.data.category ?? "Project"}</p>
          <h1>{project.data.title}</h1>

          {project.data.description && (
            <p className="project-summary">{project.data.description}</p>
          )}

          <dl className="project-facts">
            {project.data.date && (
              <>
                <dt>Date</dt>
                <dd>
                  <time dateTime={project.data.date.toISOString()}>
                    {formatDate(project.data.date)}
                  </time>
                </dd>
              </>
            )}
            {project.data.location && (
              <>
                <dt>Location</dt>
                <dd>{project.data.location}</dd>
              </>
            )}
            {project.data.role && (
              <>
                <dt>Role</dt>
                <dd>{project.data.role}</dd>
              </>
            )}
          </dl>

          <TagList tags={project.data.tags ?? []} />
        </header>

        {project.data.thumbnail && (
          <div className="project-image">
            <Image
              src={project.data.thumbnail}
              alt={project.data.title}
              width={960}
              height={540}
              style={{ width: "100%", height: "auto" }}
            />
          </div>
        )}

        <div className="project-content-wrap">
          <div
            className="prose project-content"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </article>

      <style>{`
        .project-page {
          max-width: 860px;
          display: grid;
          gap: var(--spacing-lg);
        }

        .project-header {
          display: grid;
          gap: var(--spacing-sm);
          padding-bottom: var(--spacing-md);
          border-bottom: 1px solid var(--line);
        }

        .project-kicker {
          color: var(--gray);
          font-family: var(--font-code);
          font-size: 0.72rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .project-header h1 {
          font-size: clamp(1.55rem, 3vw, 2.2rem);
          letter-spacing: -0.02em;
          line-height: 1.2;
        }

        .project-summary {
          color: color-mix(in srgb, var(--text) 75%, transparent);
          line-height: 1.65;
        }

        .project-facts {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem 1.5rem;
        }

        .project-facts dt {
          color: var(--gray);
          font-family: var(--font-code);
          font-size: 0.65rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .project-facts dd {
          color: var(--text);
          font-size: 0.88rem;
          margin-bottom: 0.25rem;
        }

        .project-image {
          border-radius: var(--radius-md);
          overflow: hidden;
        }

        .project-image img {
          border-radius: var(--radius-md);
        }

        .project-content-wrap {
          padding-top: var(--spacing-sm);
        }

        .project-content {
          max-width: 100%;
        }
      `}</style>
    </DocLayout>
  );
}
