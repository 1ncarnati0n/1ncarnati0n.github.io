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
        <p className="project-filter-title">Filter by category</p>
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
                <span>{option.label}</span>
                <em>{option.count}</em>
              </button>
            );
          })}
        </div>
      </nav>

      <style>{`
        .project-filter {
          display: grid;
          gap: var(--spacing-sm);
          margin-bottom: var(--spacing-lg);
        }

        .project-filter-title {
          font-family: var(--font-code);
          font-size: 0.68rem;
          color: var(--gray);
          letter-spacing: 0.11em;
          text-transform: uppercase;
        }

        .project-filter-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.52rem;
        }

        .project-filter-list button {
          display: inline-flex;
          align-items: center;
          gap: 0.46rem;
          border: 1px solid color-mix(in srgb, var(--line) 88%, transparent);
          border-radius: 999px;
          background: color-mix(in srgb, var(--surface-raised) 95%, transparent);
          color: var(--text);
          font-family: var(--font-header);
          font-size: 0.8rem;
          padding: 0.34rem 0.72rem;
          cursor: pointer;
          transition: border-color var(--transition), background var(--transition), color var(--transition), transform 0.15s ease;
        }

        .project-filter-list button:hover {
          border-color: color-mix(in srgb, var(--accent) 42%, transparent);
          transform: translateY(-1px);
        }

        .project-filter-list button[data-active="true"] {
          color: var(--text-heading);
          border-color: color-mix(in srgb, var(--tertiary) 48%, transparent);
          background: color-mix(in srgb, var(--tertiary) 16%, transparent);
        }

        .project-filter-list button em {
          font-style: normal;
          font-family: var(--font-code);
          font-size: 0.65rem;
          color: var(--gray);
          border-left: 1px solid color-mix(in srgb, var(--line) 84%, transparent);
          padding-left: 0.42rem;
        }

        .project-filter-list button[data-active="true"] em {
          color: color-mix(in srgb, var(--text) 80%, transparent);
        }
      `}</style>
    </>
  );
}
