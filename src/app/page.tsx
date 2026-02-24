import Hero from "@/components/Hero";
import ProjectCard from "@/components/ProjectCard";
import PostItem from "@/components/PostItem";
import { getSortedPublishedPosts, getSortedProjects } from "@/lib/content";
import { cleanSlug } from "@/lib/content-utils";

export default function HomePage() {
  const projects = getSortedProjects().slice(0, 6);
  const recentPosts = getSortedPublishedPosts().slice(0, 5);

  return (
    <main className="home-page">
      <Hero />

      <section className="section container">
        <div className="section-head">
          <h2>Recent Projects</h2>
          <a href="/projects/" className="section-link">
            View all
          </a>
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

      <section className="section container">
        <div className="section-head">
          <h2>Recent Posts</h2>
          <a href="/posts/" className="section-link">
            View all
          </a>
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
        .home-page {
          display: grid;
          gap: var(--spacing-xl);
          padding-bottom: var(--spacing-2xl);
        }

        .section {
          display: grid;
          gap: var(--spacing-lg);
        }

        .section-head {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: var(--spacing-md);
        }

        .section-head h2 {
          font-size: clamp(1.3rem, 2.4vw, 1.7rem);
          letter-spacing: -0.01em;
        }

        .section-link {
          color: var(--gray);
          font-family: var(--font-header);
          font-size: 0.84rem;
          white-space: nowrap;
        }

        .section-link:hover {
          color: var(--text-heading);
        }

        .project-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: var(--spacing-md);
        }

        @media (max-width: 1080px) {
          .project-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 700px) {
          .home-page {
            gap: var(--spacing-lg);
          }

          .project-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}
