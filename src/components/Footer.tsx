export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer-inner">
          <p className="footer-left">
            1ncarnati0n &middot; Seoul &middot; {year}
          </p>

          <nav className="footer-links" aria-label="푸터 링크">
            <a href="/projects/">Projects</a>
            <a href="/posts/">Posts</a>
            <a href="/tags/">Tags</a>
            <a href="https://github.com/1ncarnati0n" target="_blank" rel="noopener">
              GitHub
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
