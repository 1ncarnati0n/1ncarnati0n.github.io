const metrics = [
  { label: "Projects", value: "20+" },
  { label: "Posts", value: "50+" },
  { label: "Focus", value: "A + C" },
];

const focusItems = [
  "Architectural visualization",
  "Web platform engineering",
  "Structured technical writing",
];

export default function Hero() {
  return (
    <section className="hero container">
      <div className="hero-grid">
        <div className="hero-copy">
          <p className="hero-kicker">Architect Grid</p>
          <h1 className="hero-title">Space, Structure, and Systems.</h1>
          <p className="hero-desc">
            건축 설계 경험과 소프트웨어 개발 기록을 하나의 구조로 정리합니다.
            프로젝트는 설계 의도를, 포스트는 구현 과정을 보여줍니다.
          </p>

          <div className="hero-actions">
            <a href="/projects/" className="btn btn-primary">
              대표 프로젝트 보기
            </a>
            <a href="/posts/" className="btn btn-secondary">
              기술 아카이브 탐색
            </a>
          </div>

          <div className="hero-metrics" role="list" aria-label="핵심 지표">
            {metrics.map((metric) => (
              <div key={metric.label} className="hero-metric" role="listitem">
                <span className="hero-metric-label">{metric.label}</span>
                <strong className="hero-metric-value">{metric.value}</strong>
              </div>
            ))}
          </div>
        </div>

        <aside className="hero-panel" aria-label="현재 집중 주제">
          <p className="hero-panel-title">Current Focus</p>
          <ul className="hero-panel-list">
            {focusItems.map((item, index) => (
              <li key={item}>
                <span>{`0${index + 1}`}</span>
                <p>{item}</p>
              </li>
            ))}
          </ul>
          <p className="hero-panel-note">Updated with each project and study cycle.</p>
        </aside>
      </div>

      <style>{`
        .hero {
          padding-top: var(--spacing-2xl);
          padding-bottom: var(--spacing-xl);
        }

        .hero-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.35fr) minmax(280px, 0.9fr);
          gap: var(--spacing-xl);
          align-items: stretch;
        }

        .hero-copy {
          border: 1px solid color-mix(in srgb, var(--line) 92%, transparent);
          background: linear-gradient(
            165deg,
            color-mix(in srgb, var(--surface) 96%, transparent),
            color-mix(in srgb, var(--surface-raised) 92%, transparent)
          );
          border-radius: var(--radius-lg);
          padding: clamp(1.2rem, 2.7vw, 2.1rem);
          box-shadow: var(--shadow-sm);
          position: relative;
          overflow: hidden;
          animation: heroRise 0.5s ease both;
        }

        .hero-copy::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: linear-gradient(
            100deg,
            transparent 0%,
            color-mix(in srgb, var(--tertiary) 14%, transparent) 30%,
            transparent 64%
          );
          transform: translateX(-100%);
          animation: heroSweep 1.8s 0.2s ease-out forwards;
        }

        .hero-kicker {
          display: inline-flex;
          align-items: center;
          gap: var(--spacing-xs);
          font-family: var(--font-code);
          font-size: 0.68rem;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: var(--gray);
          margin-bottom: var(--spacing-sm);
        }

        .hero-kicker::before {
          content: "";
          width: 1.2rem;
          height: 1px;
          background: color-mix(in srgb, var(--accent) 55%, transparent);
        }

        .hero-title {
          font-size: clamp(2rem, 5vw, 3.5rem);
          letter-spacing: -0.03em;
          max-width: 11ch;
          margin-bottom: var(--spacing-md);
        }

        .hero-desc {
          max-width: 52ch;
          color: color-mix(in srgb, var(--text) 86%, transparent);
          margin-bottom: var(--spacing-lg);
        }

        .hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: var(--spacing-sm);
          margin-bottom: var(--spacing-lg);
        }

        .hero-metrics {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: var(--spacing-sm);
        }

        .hero-metric {
          border: 1px solid color-mix(in srgb, var(--line) 90%, transparent);
          background: color-mix(in srgb, var(--surface-raised) 92%, transparent);
          border-radius: var(--radius-sm);
          padding: 0.65rem 0.75rem;
          display: grid;
          gap: 0.08rem;
        }

        .hero-metric-label {
          color: var(--gray);
          font-family: var(--font-code);
          font-size: 0.66rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .hero-metric-value {
          color: var(--text-heading);
          font-family: var(--font-header);
          font-size: 1.02rem;
          font-weight: 600;
        }

        .hero-panel {
          border: 1px solid color-mix(in srgb, var(--line) 90%, transparent);
          border-radius: var(--radius-lg);
          background: color-mix(in srgb, var(--surface) 95%, transparent);
          box-shadow: var(--shadow-sm);
          padding: clamp(1.05rem, 2vw, 1.4rem);
          display: grid;
          align-content: start;
          gap: var(--spacing-md);
          animation: heroRise 0.58s 0.1s ease both;
        }

        .hero-panel-title {
          font-family: var(--font-code);
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--gray);
        }

        .hero-panel-list {
          list-style: none;
          display: grid;
          gap: var(--spacing-sm);
        }

        .hero-panel-list li {
          display: grid;
          grid-template-columns: auto 1fr;
          align-items: baseline;
          gap: var(--spacing-sm);
          padding-bottom: var(--spacing-sm);
          border-bottom: 1px solid color-mix(in srgb, var(--line) 76%, transparent);
        }

        .hero-panel-list li:last-child {
          border-bottom: 0;
          padding-bottom: 0;
        }

        .hero-panel-list span {
          font-family: var(--font-code);
          font-size: 0.68rem;
          color: var(--tertiary);
          letter-spacing: 0.07em;
        }

        .hero-panel-list p {
          color: var(--text);
          font-size: 0.92rem;
          line-height: 1.5;
        }

        .hero-panel-note {
          color: var(--gray);
          font-size: 0.78rem;
        }

        @keyframes heroSweep {
          100% { transform: translateX(100%); }
        }

        @keyframes heroRise {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 1024px) {
          .hero-grid {
            grid-template-columns: 1fr;
          }

          .hero-metrics {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        @media (max-width: 700px) {
          .hero {
            padding-top: var(--spacing-xl);
          }

          .hero-metrics {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
