import type { Metadata } from "next";
import DocLayout from "@/components/DocLayout";
import ProjectCard from "@/components/ProjectCard";
import ProjectFilter, { type ProjectFilterOption } from "@/components/ProjectFilter";
import { getAllProjects, getSortedProjects } from "@/lib/content";
import { getProjectCategories, cleanSlug } from "@/lib/content-utils";
import { buildProjectsSidebar } from "@/lib/sidebar-config";

export const metadata: Metadata = {
  title: "Projects",
  description: "건축 프로젝트 포트폴리오",
};

export default function ProjectsPage() {
  const allProjects = getAllProjects();
  const projects = getSortedProjects();
  const categories = getProjectCategories(allProjects);
  const sections = buildProjectsSidebar(projects);

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
    <DocLayout sections={sections} sidebarContext="projects">
      <div className="projects-page">
        <header className="projects-hero">
          <p className="projects-kicker">Portfolio Archive</p>
          <h1>Projects</h1>
          <p className="projects-desc">
            설계, 시각화, 공간 기획 작업을 한 흐름으로 정리했습니다.
            카테고리별로 탐색하면서 각 프로젝트의 의도와 결과를 확인할 수 있습니다.
          </p>

          <div className="projects-meta">
            <div>
              <span>Total</span>
              <strong>{projects.length}</strong>
            </div>
            <div>
              <span>Categories</span>
              <strong>{categoryList.length}</strong>
            </div>
          </div>
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
      </div>

      <style>{`
        .projects-page {
          max-width: 100%;
          display: grid;
          gap: var(--spacing-md);
        }

        .projects-hero {
          border: 1px solid color-mix(in srgb, var(--line) 90%, transparent);
          background: color-mix(in srgb, var(--surface) 96%, transparent);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-sm);
          padding: clamp(1rem, 2.4vw, 1.8rem);
          display: grid;
          gap: var(--spacing-sm);
        }

        .projects-kicker {
          color: var(--gray);
          font-family: var(--font-code);
          font-size: 0.7rem;
          letter-spacing: 0.11em;
          text-transform: uppercase;
        }

        .projects-hero h1 {
          font-size: clamp(1.6rem, 3.4vw, 2.5rem);
          letter-spacing: -0.02em;
        }

        .projects-desc {
          color: color-mix(in srgb, var(--text) 82%, transparent);
          max-width: 66ch;
        }

        .projects-meta {
          display: flex;
          flex-wrap: wrap;
          gap: var(--spacing-sm);
          margin-top: 0.2rem;
        }

        .projects-meta div {
          min-width: 110px;
          border: 1px solid color-mix(in srgb, var(--line) 88%, transparent);
          border-radius: var(--radius-sm);
          background: color-mix(in srgb, var(--surface-raised) 95%, transparent);
          padding: 0.45rem 0.58rem;
          display: grid;
          gap: 0.05rem;
        }

        .projects-meta span {
          color: var(--gray);
          font-family: var(--font-code);
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.09em;
        }

        .projects-meta strong {
          color: var(--text-heading);
          font-family: var(--font-header);
          font-size: 0.95rem;
          font-weight: 600;
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
    </DocLayout>
  );
}
