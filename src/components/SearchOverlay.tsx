"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface SearchItem {
  title: string;
  slug: string;
  description: string;
  tags: string[];
  category: string;
}

function getHref(slug: string): string {
  if (slug.startsWith("projects/")) return `/${slug}/`;
  return `/posts/${slug}/`;
}

export default function SearchOverlay() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchItem[]>([]);
  const [items, setItems] = useState<SearchItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const closeOverlay = useCallback(() => {
    setIsOpen(false);
    setQuery("");
    setResults([]);
  }, []);

  useEffect(() => {
    fetch("/search-index.json")
      .then((res) => res.json())
      .then((data: SearchItem[]) => setItems(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        if (isOpen) {
          closeOverlay();
        } else {
          setIsOpen(true);
        }
      }
      if (event.key === "Escape") closeOverlay();
    };

    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, closeOverlay]);

  useEffect(() => {
    const trigger = document.getElementById("search-trigger");
    if (!trigger) return;

    const handleClick = () => setIsOpen(true);
    trigger.addEventListener("click", handleClick);
    return () => trigger.removeEventListener("click", handleClick);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => inputRef.current?.focus(), 40);
    return () => clearTimeout(timer);
  }, [isOpen]);

  const handleSearch = useCallback(
    (value: string) => {
      setQuery(value);
      if (value.length < 2) {
        setResults([]);
        return;
      }

      const keyword = value.toLowerCase();
      const filtered = items.filter(
        (item) =>
          item.title.toLowerCase().includes(keyword) ||
          item.description.toLowerCase().includes(keyword) ||
          item.tags.some((tag) => tag.toLowerCase().includes(keyword)) ||
          item.category.toLowerCase().includes(keyword),
      );

      setResults(filtered.slice(0, 10));
    },
    [items],
  );

  if (!isOpen) return null;

  return (
    <>
      <div className="search-overlay-backdrop" onClick={closeOverlay} aria-hidden="true" />

      <div className="search-overlay-wrap" role="dialog" aria-modal="true" aria-label="검색">
        <section className="search-overlay-modal" onClick={(event) => event.stopPropagation()}>
          <header className="search-overlay-head">
            <p>Search Archive</p>
            <button type="button" onClick={closeOverlay} aria-label="검색 닫기">
              ESC
            </button>
          </header>

          <div className="search-overlay-input">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              placeholder="키워드를 입력하세요 (최소 2글자)"
              value={query}
              onChange={(event) => handleSearch(event.target.value)}
            />
          </div>

          <div className="search-overlay-results">
            {query.length < 2 && (
              <p className="search-state">제목, 설명, 태그, 카테고리로 검색할 수 있습니다.</p>
            )}

            {query.length >= 2 && results.length === 0 && (
              <p className="search-state">검색 결과가 없습니다.</p>
            )}

            {results.length > 0 && (
              <ul className="search-result-list">
                {results.map((item) => (
                  <li key={item.slug}>
                    <a href={getHref(item.slug)} className="search-result-item" onClick={closeOverlay}>
                      <div className="search-result-top">
                        <span>{item.category}</span>
                        <strong>{item.title}</strong>
                      </div>
                      {item.description && <p>{item.description.slice(0, 95)}</p>}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>

      <style>{`
        .search-overlay-backdrop {
          position: fixed;
          inset: 0;
          z-index: 140;
          background: rgba(8, 13, 18, 0.45);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
        }

        .search-overlay-wrap {
          position: fixed;
          inset: 0;
          z-index: 141;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          padding: 10vh var(--spacing-md) 0;
        }

        .search-overlay-modal {
          width: min(680px, 100%);
          border: 1px solid color-mix(in srgb, var(--line) 90%, transparent);
          border-radius: var(--radius-lg);
          background: color-mix(in srgb, var(--surface) 97%, transparent);
          box-shadow: var(--shadow-md);
          overflow: hidden;
        }

        .search-overlay-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--spacing-sm);
          padding: 0.72rem 0.86rem;
          border-bottom: 1px solid color-mix(in srgb, var(--line) 90%, transparent);
          background: color-mix(in srgb, var(--surface-raised) 95%, transparent);
        }

        .search-overlay-head p {
          color: var(--gray);
          font-family: var(--font-code);
          font-size: 0.68rem;
          letter-spacing: 0.11em;
          text-transform: uppercase;
        }

        .search-overlay-head button {
          border: 1px solid color-mix(in srgb, var(--line) 88%, transparent);
          border-radius: var(--radius-sm);
          background: color-mix(in srgb, var(--surface) 94%, transparent);
          color: var(--gray);
          font-family: var(--font-code);
          font-size: 0.65rem;
          letter-spacing: 0.06em;
          padding: 0.2rem 0.45rem;
          cursor: pointer;
        }

        .search-overlay-input {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          padding: 0.82rem 0.9rem;
          border-bottom: 1px solid color-mix(in srgb, var(--line) 90%, transparent);
          color: var(--gray);
        }

        .search-overlay-input input {
          width: 100%;
          border: 0;
          background: transparent;
          color: var(--text);
          font-family: var(--font-body);
          font-size: 0.98rem;
          outline: 0;
        }

        .search-overlay-results {
          max-height: min(52vh, 480px);
          overflow-y: auto;
          padding: 0.25rem;
        }

        .search-state {
          color: var(--gray);
          font-size: 0.84rem;
          padding: 1.1rem 0.9rem;
          text-align: center;
        }

        .search-result-list {
          list-style: none;
          display: grid;
          gap: 4px;
          padding: 0.25rem;
        }

        .search-result-item {
          display: grid;
          gap: 0.25rem;
          border: 1px solid color-mix(in srgb, var(--line) 88%, transparent);
          border-radius: var(--radius-sm);
          background: color-mix(in srgb, var(--surface-raised) 95%, transparent);
          padding: 0.62rem 0.72rem;
          color: var(--text);
          text-decoration: none;
          transition: border-color var(--transition), background var(--transition), transform 0.14s ease;
        }

        .search-result-item:hover {
          color: var(--text);
          border-color: color-mix(in srgb, var(--accent) 42%, transparent);
          background: color-mix(in srgb, var(--accent) 10%, var(--surface-raised));
          transform: translateY(-1px);
        }

        .search-result-top {
          display: flex;
          align-items: center;
          gap: 0.45rem;
        }

        .search-result-top span {
          color: var(--gray);
          font-family: var(--font-code);
          font-size: 0.64rem;
          letter-spacing: 0.09em;
          text-transform: uppercase;
          border: 1px solid color-mix(in srgb, var(--line) 88%, transparent);
          border-radius: 999px;
          padding: 0.16rem 0.45rem;
          background: color-mix(in srgb, var(--surface) 92%, transparent);
          flex-shrink: 0;
        }

        .search-result-top strong {
          color: var(--text-heading);
          font-family: var(--font-header);
          font-size: 0.88rem;
          letter-spacing: -0.01em;
          line-height: 1.34;
        }

        .search-result-item p {
          color: color-mix(in srgb, var(--text) 74%, transparent);
          font-size: 0.8rem;
          line-height: 1.5;
        }
      `}</style>
    </>
  );
}
