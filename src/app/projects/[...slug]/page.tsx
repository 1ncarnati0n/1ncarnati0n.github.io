import { notFound } from "next/navigation";
import type { Metadata } from "next";
import DocLayout from "@/components/DocLayout";
import Breadcrumbs from "@/components/Breadcrumbs";
import TagList from "@/components/TagList";
import { getAllProjects } from "@/lib/content";
import { renderMarkdown } from "@/lib/markdown";
import { cleanSlug, formatDate, sortProjects } from "@/lib/content-utils";
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
  const project = getAllProjects().find((p) => cleanSlug(p.id) === slugStr);
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
  const project = getAllProjects().find((p) => cleanSlug(p.id) === slugStr);
  if (!project) notFound();

  const { html } = await renderMarkdown(project.body);

  // Build sidebar
  const allProjects = getAllProjects();
  const sortedProjects = sortProjects(allProjects);
  const sections = buildProjectsSidebar(sortedProjects);

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
          <h1>{project.data.title}</h1>
          <div className="project-meta">
            {project.data.category && (
              <span className="meta-category">{project.data.category}</span>
            )}
            {project.data.date && (
              <time dateTime={project.data.date.toISOString()}>
                {formatDate(project.data.date)}
              </time>
            )}
            {project.data.location && <span>{project.data.location}</span>}
          </div>
          {project.data.description && (
            <p className="project-desc">{project.data.description}</p>
          )}
          <TagList tags={project.data.tags ?? []} />
        </header>

        <div
          className="prose project-content"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </article>

      <style>{`
        .project-page { max-width: 900px; }
        .project-header { margin-bottom: var(--spacing-xl); }
        .project-header h1 { font-size: 2rem; margin-bottom: var(--spacing-sm); }
        .project-meta {
          display: flex; align-items: center; gap: var(--spacing-md);
          font-size: 0.85rem; color: var(--gray);
          font-family: var(--font-header); margin-bottom: var(--spacing-md);
        }
        .meta-category {
          background: color-mix(in srgb, var(--tertiary) 20%, transparent);
          padding: 2px 10px; border-radius: var(--radius-sm); font-size: 0.8rem;
        }
        .project-desc { color: var(--gray); font-size: 1rem; margin-bottom: var(--spacing-md); }
        .project-content img { border-radius: var(--radius-md); box-shadow: var(--shadow-md); }
      `}</style>
    </DocLayout>
  );
}
