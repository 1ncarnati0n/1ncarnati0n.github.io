export default function Hero() {
  return (
    <section className="hero container">
      <p className="hero-kicker">Light Archive</p>
      <h1 className="hero-title">Space, Structure, and Systems.</h1>
      <p className="hero-desc">
        건축 설계 경험과 소프트웨어 개발 기록을 하나의 구조로 정리합니다.
        프로젝트는 설계 의도를, 포스트는 구현 과정을 보여줍니다.
      </p>

      <div className="hero-links">
        <a href="/projects/">Projects</a>
        <span aria-hidden="true">&mdash;</span>
        <a href="/posts/">Archive</a>
      </div>

      <style>{`
        .hero {
          padding-top: var(--spacing-2xl);
          padding-bottom: var(--spacing-xl);
          max-width: 720px;
        }

        .hero-kicker {
          font-family: var(--font-code);
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: var(--gray);
          margin-bottom: var(--spacing-sm);
        }

        .hero-title {
          font-size: clamp(2rem, 5vw, 3.2rem);
          letter-spacing: -0.03em;
          line-height: 1.15;
          margin-bottom: var(--spacing-md);
        }

        .hero-desc {
          color: color-mix(in srgb, var(--text) 75%, transparent);
          max-width: 52ch;
          line-height: 1.7;
          margin-bottom: var(--spacing-lg);
        }

        .hero-links {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
        }

        .hero-links a {
          color: var(--text-heading);
          font-family: var(--font-header);
          font-size: 0.92rem;
          font-weight: 500;
          text-decoration: underline;
          text-decoration-color: var(--tertiary);
          text-underline-offset: 0.25em;
        }

        .hero-links a:hover {
          color: var(--tertiary);
        }

        .hero-links span {
          color: var(--gray);
          font-size: 0.8rem;
        }

        @media (max-width: 700px) {
          .hero {
            padding-top: var(--spacing-xl);
          }
        }
      `}</style>
    </section>
  );
}
