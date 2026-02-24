import type { Metadata } from "next";
import ProjectCard from "@/components/ProjectCard";
import ProjectFilter, { type ProjectFilterOption } from "@/components/ProjectFilter";
import { getAllProjects, getSortedProjects } from "@/lib/content";
import { getProjectCategories, cleanSlug } from "@/lib/content-utils";

export const metadata: Metadata = {
  title: "Projects",
  description: "건축 프로젝트 포트폴리오",
};

export default function ProjectsPage() {
  const allProjects = getAllProjects();
  const projects = getSortedProjects();
  const categories = getProjectCategories(allProjects);

  const categoryCounts = new Map<string, number>();
  for (const project of allProjects) {
    const category = project.data.category ?? "Other";
    categoryCounts.set(category, (categoryCounts.get(category) ?? 0) + 1);
  }

  const categoryList = categoryCounts.has("Other")
    ? [...new Set([...categories, "Other"])]
    : categories;

  const filterOptions: ProjectFilterOption[] = [
    { value: "all", label: "All", count: projects.length },
    ...categoryList.map((category) => ({
      value: category,
      label: category,
      count: categoryCounts.get(category) ?? 0,
    })),
  ];

  return (
    <div className="projects-page container">
      <header className="projects-hero">
        <h1>Projects</h1>
        <p className="projects-desc">
          설계, 시각화, 공간 기획 작업을 한 흐름으로 정리했습니다.
        </p>
        <p className="projects-meta">
          {projects.length} projects &middot; {categoryList.length} categories
        </p>
      </header>

      <ProjectFilter options={filterOptions} />

      <div className="project-grid" id="project-grid">
        {projects.map((project) => (
          <div
            key={project.id}
            data-category={project.data.category ?? "Other"}
            className="project-cell"
          >
            <ProjectCard
              title={project.data.title}
              slug={cleanSlug(project.id)}
              thumbnail={project.data.thumbnail}
              category={project.data.category}
              description={project.data.description}
            />
          </div>
        ))}
      </div>

      <style>{`
        .projects-page {
          max-width: var(--max-width);
          margin: 0 auto;
          display: grid;
          gap: var(--spacing-lg);
          padding-top: var(--spacing-xl);
          padding-bottom: var(--spacing-2xl);
        }

        .projects-hero {
          display: grid;
          gap: var(--spacing-xs);
        }

        .projects-hero h1 {
          font-size: clamp(1.6rem, 3.4vw, 2.2rem);
          letter-spacing: -0.02em;
        }

        .projects-desc {
          color: color-mix(in srgb, var(--text) 70%, transparent);
          max-width: 52ch;
        }

        .projects-meta {
          color: var(--gray);
          font-size: 0.84rem;
        }

        .project-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: var(--spacing-md);
        }

        .project-cell[hidden] {
          display: none;
        }

        @media (max-width: 1000px) {
          .project-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 700px) {
          .project-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
