export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer-grid">
          <div>
            <p className="footer-title">1ncarnati0n Studio</p>
            <p className="footer-note">Architecture portfolio and technical archive focused on practical execution.</p>
          </div>

          <nav className="footer-links" aria-label="푸터 링크">
            <a href="/projects/">Projects</a>
            <a href="/posts/">Posts</a>
            <a href="/tags/">Tags</a>
            <a href="https://github.com/1ncarnati0n" target="_blank" rel="noopener">
              GitHub
            </a>
          </nav>

          <div className="footer-meta">
            <p>Seoul / Remote</p>
            <p>&copy; {year} 1ncarnati0n</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
