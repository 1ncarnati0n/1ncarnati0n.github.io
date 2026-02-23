export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-inner">
        <h1 className="hero-title">1ncarnati0n</h1>
        <p className="hero-tagline">Architecture &middot; Code &middot; Digital Garden</p>
        <p className="hero-desc">
          건축과 기술의 교차점을 탐구하는 포트폴리오 &amp; 기술 블로그
        </p>
        <div className="hero-actions">
          <a href="/posts/" className="btn btn-primary">Blog 둘러보기</a>
          <a href="/projects/" className="btn btn-secondary">Projects 보기</a>
        </div>
      </div>

      <style>{`
        .hero {
          padding: var(--spacing-3xl) var(--spacing-lg);
          text-align: center;
          display: flex;
          justify-content: center;
        }
        .hero-inner {
          max-width: 680px;
        }
        .hero-title {
          font-size: clamp(2.8rem, 7vw, 4.5rem);
          font-weight: 900;
          letter-spacing: -0.04em;
          margin-bottom: var(--spacing-sm);
          background: linear-gradient(135deg, var(--text-heading) 0%, var(--tertiary) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hero-tagline {
          font-family: var(--font-header);
          font-size: clamp(1rem, 2.5vw, 1.2rem);
          color: var(--gray);
          font-weight: 400;
          margin-bottom: var(--spacing-md);
          letter-spacing: 0.05em;
        }
        .hero-desc {
          font-size: clamp(0.95rem, 2vw, 1.1rem);
          color: var(--text);
          line-height: 1.6;
          margin-bottom: var(--spacing-xl);
          opacity: 0.8;
        }
        .hero-actions {
          display: flex;
          gap: var(--spacing-md);
          justify-content: center;
          flex-wrap: wrap;
        }
      `}</style>
    </section>
  );
}
