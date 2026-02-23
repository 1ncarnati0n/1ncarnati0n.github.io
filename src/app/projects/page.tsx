import type { Metadata } from "next";
import DocLayout from "@/components/DocLayout";
import ProjectCard from "@/components/ProjectCard";
import ProjectFilter from "@/components/ProjectFilter";
import { getAllProjects } from "@/lib/content";
import { sortProjects, getProjectCategories, cleanSlug } from "@/lib/content-utils";
import { buildProjectsSidebar } from "@/lib/sidebar-config";

export const metadata: Metadata = {
  title: "Projects",
  description: "건축 프로젝트 포트폴리오",
};

export default function ProjectsPage() {
  const allProjects = getAllProjects();
  const projects = sortProjects(allProjects);
  const categories = getProjectCategories(allProjects);
  const sections = buildProjectsSidebar(projects);

  return (
    <DocLayout sections={sections} sidebarContext="projects">
      <div className="projects-page">
        <h1 className="page-title">Projects</h1>
        <p className="page-desc">건축 설계 및 시각화 프로젝트</p>

        <ProjectFilter categories={categories} />

        <div className="project-grid" id="project-grid">
          {projects.map((project) => (
            <div key={project.id} data-category={project.data.category}>
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
        .projects-page { max-width: 100%; }
        .page-title { font-size: 2rem; margin-bottom: var(--spacing-xs); }
        .page-desc { color: var(--gray); margin-bottom: var(--spacing-xl); }
        .project-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--spacing-lg); }
        @media (max-width: 900px) { .project-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 600px) { .project-grid { grid-template-columns: 1fr; } }
      `}</style>
    </DocLayout>
  );
}
