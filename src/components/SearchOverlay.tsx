import { useState, useEffect, useRef, useCallback } from "react";

interface SearchItem {
  title: string;
  slug: string;
  description: string;
  tags: string[];
  category: string;
}

export default function SearchOverlay() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchItem[]>([]);
  const [items, setItems] = useState<SearchItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load search index
  useEffect(() => {
    fetch("/search-index.json")
      .then((res) => res.json())
      .then((data: SearchItem[]) => setItems(data))
      .catch(() => {});
  }, []);

  // Keyboard shortcut: Cmd+K / Ctrl+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  // Also listen for the search button
  useEffect(() => {
    const btn = document.getElementById("search-trigger");
    if (btn) {
      const handler = () => setIsOpen(true);
      btn.addEventListener("click", handler);
      return () => btn.removeEventListener("click", handler);
    }
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  const handleSearch = useCallback(
    (q: string) => {
      setQuery(q);
      if (q.length < 2) {
        setResults([]);
        return;
      }
      const lower = q.toLowerCase();
      const matched = items.filter(
        (item) =>
          item.title.toLowerCase().includes(lower) ||
          item.description.toLowerCase().includes(lower) ||
          item.tags.some((t) => t.toLowerCase().includes(lower)) ||
          item.category.toLowerCase().includes(lower),
      );
      setResults(matched.slice(0, 10));
    },
    [items],
  );

  if (!isOpen) return null;

  return (
    <div className="search-overlay" onClick={() => setIsOpen(false)} style={overlayStyle}>
      <div className="search-modal" onClick={(e) => e.stopPropagation()} style={modalStyle}>
        <input
          ref={inputRef}
          type="text"
          placeholder="검색어를 입력하세요... (ESC로 닫기)"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          style={inputStyle}
        />
        {results.length > 0 && (
          <ul style={listStyle}>
            {results.map((item) => (
              <li key={item.slug}>
                <a href={item.slug.startsWith("project") ? `/projects/${item.slug}/` : `/posts/${item.slug}/`} style={resultStyle}>
                  <span style={{ fontSize: "0.75rem", color: "var(--gray)", fontFamily: "var(--font-header)" }}>
                    {item.category}
                  </span>
                  <strong>{item.title}</strong>
                  {item.description && (
                    <span style={{ fontSize: "0.85rem", color: "var(--gray)" }}>
                      {item.description.slice(0, 80)}
                    </span>
                  )}
                </a>
              </li>
            ))}
          </ul>
        )}
        {query.length >= 2 && results.length === 0 && (
          <p style={{ padding: "1rem", color: "var(--gray)", textAlign: "center" }}>
            결과가 없습니다
          </p>
        )}
      </div>
    </div>
  );
}

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  zIndex: 1000,
  background: "rgba(0,0,0,0.5)",
  backdropFilter: "blur(4px)",
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "center",
  paddingTop: "15vh",
};

const modalStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: "560px",
  background: "var(--bg)",
  borderRadius: "12px",
  boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
  overflow: "hidden",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "16px 20px",
  fontSize: "1rem",
  border: "none",
  borderBottom: "1px solid color-mix(in srgb, var(--gray) 20%, transparent)",
  background: "transparent",
  color: "var(--text)",
  fontFamily: "var(--font-body)",
  outline: "none",
};

const listStyle: React.CSSProperties = {
  listStyle: "none",
  padding: 0,
  margin: 0,
  maxHeight: "400px",
  overflowY: "auto",
};

const resultStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "2px",
  padding: "12px 20px",
  textDecoration: "none",
  color: "var(--text)",
  borderBottom: "1px solid color-mix(in srgb, var(--gray) 10%, transparent)",
};
