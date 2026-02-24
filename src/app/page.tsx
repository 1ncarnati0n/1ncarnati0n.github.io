import Hero from "@/components/Hero";
import ProjectCard from "@/components/ProjectCard";
import PostItem from "@/components/PostItem";
import { getSortedPublishedPosts, getSortedProjects } from "@/lib/content";
import { cleanSlug } from "@/lib/content-utils";

const focusCards = [
  {
    href: "/posts/#web",
    title: "Web Systems",
    description: "실무 중심의 프론트엔드 구조와 렌더링 전략 기록",
  },
  {
    href: "/projects/",
    title: "Built Projects",
    description: "설계 의도부터 결과물까지 프로젝트 중심으로 정리",
  },
  {
    href: "/posts/#tools",
    title: "Workflow",
    description: "개발/설계 생산성을 높이는 운영 루틴과 도구셋",
  },
  {
    href: "/posts/#ml",
    title: "ML Notes",
    description: "모델링 기초부터 적용 과정까지 압축된 학습 로그",
  },
];

export default function HomePage() {
  const projects = getSortedProjects().slice(0, 6);
  const recentPosts = getSortedPublishedPosts().slice(0, 5);

  return (
    <main className="home-page">
      <Hero />

      <section className="focus-deck container">
        <p className="section-kicker">Focus Deck</p>
        <div className="focus-grid">
          {focusCards.map((card, index) => (
            <a key={card.title} href={card.href} className="focus-card">
              <span className="focus-index">{`0${index + 1}`}</span>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="section container">
        <div className="section-head">
          <div>
            <p className="section-kicker">Selected Works</p>
            <h2>Recent Projects</h2>
          </div>
          <a href="/projects/" className="section-link">
            All Projects &rarr;
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
          <div>
            <p className="section-kicker">Archive</p>
            <h2>Recent Posts</h2>
          </div>
          <a href="/posts/" className="section-link">
            All Posts &rarr;
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
          align-items: flex-end;
          justify-content: space-between;
          gap: var(--spacing-md);
          border-bottom: 1px solid color-mix(in srgb, var(--line) 90%, transparent);
          padding-bottom: var(--spacing-sm);
        }

        .section-kicker {
          color: var(--gray);
          font-family: var(--font-code);
          font-size: 0.7rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin-bottom: 0.24rem;
        }

        .section-head h2 {
          font-size: clamp(1.3rem, 2.4vw, 1.9rem);
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

        .focus-deck {
          display: grid;
          gap: var(--spacing-sm);
        }

        .focus-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: var(--spacing-sm);
        }

        .focus-card {
          display: grid;
          gap: 0.45rem;
          border: 1px solid color-mix(in srgb, var(--line) 90%, transparent);
          border-radius: var(--radius-md);
          background: color-mix(in srgb, var(--surface-raised) 95%, transparent);
          padding: 0.9rem;
          color: var(--text);
          text-decoration: none;
          transition: transform 0.2s ease, border-color var(--transition), box-shadow var(--transition);
          animation: riseIn 0.45s ease both;
        }

        .focus-card:nth-child(2) { animation-delay: 0.04s; }
        .focus-card:nth-child(3) { animation-delay: 0.08s; }
        .focus-card:nth-child(4) { animation-delay: 0.12s; }

        .focus-card:hover {
          transform: translateY(-2px);
          border-color: color-mix(in srgb, var(--accent) 42%, transparent);
          box-shadow: var(--shadow-sm);
          color: var(--text);
        }

        .focus-index {
          color: var(--tertiary);
          font-family: var(--font-code);
          font-size: 0.67rem;
          letter-spacing: 0.08em;
        }

        .focus-card h3 {
          font-size: 0.96rem;
          letter-spacing: -0.01em;
        }

        .focus-card p {
          color: color-mix(in srgb, var(--text) 75%, transparent);
          font-size: 0.82rem;
          line-height: 1.55;
        }

        .project-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: var(--spacing-md);
        }

        @keyframes riseIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 1080px) {
          .focus-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .project-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 700px) {
          .home-page {
            gap: var(--spacing-lg);
          }

          .section-head {
            align-items: center;
          }

          .section-link {
            font-size: 0.79rem;
          }

          .focus-grid,
          .project-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}
