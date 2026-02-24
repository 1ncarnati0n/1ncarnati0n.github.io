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
          {options.map((option) => {
            const isActive = active === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handleFilter(option.value)}
                data-active={isActive ? "true" : undefined}
                aria-pressed={isActive}
              >
                {option.label}
                <em>{option.count}</em>
              </button>
            );
          })}
        </div>
      </nav>

      <style>{`
        .project-filter {
          margin-bottom: var(--spacing-md);
        }

        .project-filter-list {
          display: flex;
          flex-wrap: wrap;
          gap: var(--spacing-md);
        }

        .project-filter-list button {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          border: none;
          background: transparent;
          color: var(--gray);
          font-family: var(--font-header);
          font-size: 0.84rem;
          padding: 0;
          cursor: pointer;
          transition: color var(--transition);
        }

        .project-filter-list button:hover {
          color: var(--text-heading);
        }

        .project-filter-list button[data-active="true"] {
          color: var(--text-heading);
          font-weight: 600;
          text-decoration: underline;
          text-decoration-color: var(--tertiary);
          text-underline-offset: 0.3em;
        }

        .project-filter-list button em {
          font-style: normal;
          font-family: var(--font-code);
          font-size: 0.65rem;
          color: var(--gray);
        }
      `}</style>
    </>
  );
}
