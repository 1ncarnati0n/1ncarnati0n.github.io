import Hero from "@/components/Hero";
import ProjectCard from "@/components/ProjectCard";
import PostItem from "@/components/PostItem";
import { getPublishedPosts, getAllProjects } from "@/lib/content";
import { sortPostsByDate, sortProjects, cleanSlug } from "@/lib/content-utils";

export default function HomePage() {
  const allProjects = getAllProjects();
  const allPosts = getPublishedPosts();

  const projects = sortProjects(allProjects).slice(0, 6);
  const recentPosts = sortPostsByDate(allPosts).slice(0, 5);

  return (
    <main>
      <Hero />

      {/* Feature Cards */}
      <section className="features container">
        <div className="feature-grid">
          <a href="/posts/#csharp" className="feature-card">
            <div className="feature-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
            </div>
            <h3>C# / .NET</h3>
            <p>C# 프로그래밍과 .NET 개발 노트</p>
          </a>
          <a href="/posts/#web" className="feature-card">
            <div className="feature-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            </div>
            <h3>Web Dev</h3>
            <p>프론트엔드와 웹 기술 탐구</p>
          </a>
          <a href="/projects/" className="feature-card">
            <div className="feature-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            </div>
            <h3>Projects</h3>
            <p>건축 설계 및 시각화 프로젝트</p>
          </a>
          <a href="/posts/#ml" className="feature-card">
            <div className="feature-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
            </div>
            <h3>ML / Data</h3>
            <p>머신러닝과 데이터 사이언스</p>
          </a>
        </div>
      </section>

      {/* Recent Projects */}
      <section className="section container">
        <div className="section-header">
          <h2>Projects</h2>
          <a href="/projects/" className="view-all">View All &rarr;</a>
        </div>
        <div className="project-grid">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              title={project.data.title}
              slug={cleanSlug(project.id)}
              thumbnail={project.data.thumbnail}
              category={project.data.category}
              description={project.data.description}
            />
          ))}
        </div>
      </section>

      {/* Recent Posts */}
      <section className="section container">
        <div className="section-header">
          <h2>Recent Posts</h2>
          <a href="/posts/" className="view-all">View All &rarr;</a>
        </div>
        <div className="post-list">
          {recentPosts.map((post) => (
            <PostItem
              key={post.id}
              title={post.data.title}
              slug={cleanSlug(post.id)}
              date={post.data.date}
              description={post.data.description}
              tags={post.data.tags}
            />
          ))}
        </div>
      </section>

      <style>{`
        .features { margin-bottom: var(--spacing-2xl); }
        .feature-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--spacing-md); }
        .feature-card {
          display: flex; flex-direction: column; gap: var(--spacing-sm);
          padding: var(--spacing-lg); border-radius: var(--radius-lg);
          border: 1px solid color-mix(in srgb, var(--gray) 15%, transparent);
          text-decoration: none; color: var(--text); font-weight: normal;
          transition: border-color var(--transition), box-shadow var(--transition), transform 0.15s ease;
        }
        .feature-card:hover {
          border-color: var(--tertiary); box-shadow: var(--shadow-md);
          transform: translateY(-2px); text-decoration: none; color: var(--text);
        }
        .feature-icon {
          width: 48px; height: 48px; display: flex; align-items: center; justify-content: center;
          border-radius: var(--radius-md);
          background: color-mix(in srgb, var(--tertiary) 12%, transparent);
          color: var(--text-heading);
        }
        .feature-card h3 { font-size: 1rem; font-weight: 600; }
        .feature-card p { font-size: 0.85rem; color: var(--gray); line-height: 1.4; }
        .section { margin-bottom: var(--spacing-2xl); }
        .section-header {
          display: flex; align-items: baseline; justify-content: space-between;
          margin-bottom: var(--spacing-lg);
        }
        .section-header h2 { font-size: 1.5rem; }
        .view-all { font-size: 0.85rem; font-family: var(--font-header); color: var(--gray); }
        .view-all:hover { color: var(--text); opacity: 1; }
        .project-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--spacing-lg); }
        @media (max-width: 1024px) {
          .feature-grid { grid-template-columns: repeat(2, 1fr); }
          .project-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 600px) {
          .feature-grid { grid-template-columns: 1fr; }
          .project-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </main>
  );
}
