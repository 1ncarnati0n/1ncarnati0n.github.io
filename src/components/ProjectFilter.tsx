"use client";

import { useState } from "react";

export interface ProjectFilterOption {
  value: string;
  label: string;
  count: number;
}

interface Props {
  options: ProjectFilterOption[];
}

export default function ProjectFilter({ options }: Props) {
  const [active, setActive] = useState("all");

  const handleFilter = (value: string) => {
    setActive(value);
    const grid = document.getElementById("project-grid");
    if (!grid) return;

    const cards = grid.querySelectorAll<HTMLElement>("[data-category]");
    cards.forEach((card) => {
      const visible = value === "all" || card.dataset.category === value;
      card.hidden = !visible;
    });
  };

  return (
    <>
      <nav className="project-filter" aria-label="프로젝트 카테고리 필터">
        <div className="project-filter-list">
          {options.map((option, index) => (
            <span key={option.value} className="project-filter-item">
              {index > 0 && <span className="filter-sep" aria-hidden="true">/</span>}
              <button
                type="button"
                onClick={() => handleFilter(option.value)}
                data-active={active === option.value ? "true" : undefined}
                aria-pressed={active === option.value}
              >
                {option.label}
              </button>
            </span>
          ))}
        </div>
      </nav>

      <style>{`
        .project-filter {
          margin-bottom: var(--spacing-sm);
        }

        .project-filter-list {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 0.15rem;
        }

        .project-filter-item {
          display: inline-flex;
          align-items: center;
          gap: 0.15rem;
        }

        .filter-sep {
          color: var(--line);
          font-size: 0.78rem;
          margin: 0 0.35rem;
          user-select: none;
        }

        .project-filter-list button {
          display: inline-flex;
          align-items: center;
          border: none;
          background: transparent;
          color: var(--gray);
          font-family: var(--font-header);
          font-size: 0.75rem;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          padding: 0.25rem 0;
          cursor: pointer;
          transition: color var(--transition);
        }

        .project-filter-list button:hover {
          color: var(--text-heading);
        }

        .project-filter-list button[data-active="true"] {
          color: var(--text-heading);
          font-weight: 600;
        }
      `}</style>
    </>
  );
}
