"use client";

import { useState } from "react";

interface Props {
  categories: string[];
}

export default function ProjectFilter({ categories }: Props) {
  const [active, setActive] = useState("all");

  const handleFilter = (cat: string) => {
    setActive(cat);
    const grid = document.getElementById("project-grid");
    if (!grid) return;

    const items = grid.querySelectorAll<HTMLDivElement>("[data-category]");
    items.forEach((item) => {
      if (cat === "all" || item.dataset.category === cat) {
        item.style.display = "";
      } else {
        item.style.display = "none";
      }
    });
  };

  return (
    <nav className="filter-nav" style={{
      display: "flex",
      flexWrap: "wrap",
      gap: "0.5rem",
      marginBottom: "1.5rem",
    }}>
      <button
        onClick={() => handleFilter("all")}
        className={active === "all" ? "active" : ""}
        style={btnStyle(active === "all")}
      >
        전체
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => handleFilter(cat)}
          className={active === cat ? "active" : ""}
          style={btnStyle(active === cat)}
        >
          {cat}
        </button>
      ))}
    </nav>
  );
}

function btnStyle(isActive: boolean): React.CSSProperties {
  return {
    fontFamily: "var(--font-header)",
    fontSize: "0.85rem",
    padding: "4px 14px",
    borderRadius: "4px",
    border: "1px solid transparent",
    cursor: "pointer",
    background: isActive
      ? "color-mix(in srgb, var(--tertiary) 25%, transparent)"
      : "transparent",
    color: isActive ? "var(--text)" : "var(--gray)",
    transition: "all 0.3s ease",
  };
}
