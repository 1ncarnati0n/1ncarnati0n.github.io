export default function Hero() {
  return (
    <section className="hero container">
      <p className="hero-kicker">Light Archive</p>
      <h1 className="hero-title">Space, Structure, and Systems.</h1>
      <p className="hero-desc">
        건축 설계와 소프트웨어 개발의 기록.
      </p>

      <div className="hero-links">
        <a href="/projects/">Projects</a>
        <span aria-hidden="true">/</span>
        <a href="/posts/">Archive</a>
      </div>

      <style>{`
        .hero {
          padding-top: var(--space-8);
          padding-bottom: var(--space-6);
          max-width: 720px;
        }

        .hero-kicker {
          font-family: var(--font-header);
          font-size: 0.68rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: var(--gray);
          margin-bottom: var(--spacing-xs);
          font-weight: 400;
        }

        .hero-title {
          font-size: clamp(1.8rem, 4.5vw, 2.8rem);
          letter-spacing: -0.02em;
          line-height: 1.15;
          font-weight: 400;
          margin-bottom: var(--spacing-sm);
        }

        .hero-desc {
          color: var(--gray);
          font-size: 0.92rem;
          line-height: 1.6;
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
          font-size: 0.78rem;
          font-weight: 400;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .hero-links a:hover {
          color: var(--tertiary);
        }

        .hero-links span {
          color: var(--gray);
          font-size: 0.72rem;
        }

        @media (max-width: 700px) {
          .hero {
            padding-top: var(--space-6);
            padding-bottom: var(--space-5);
          }
        }
      `}</style>
    </section>
  );
}
