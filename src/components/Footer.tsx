export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="container">
        <p>
          &copy; {year} <a href="/">1ncarnati0n</a>.
          Built with <a href="https://nextjs.org" target="_blank" rel="noopener">Next.js</a>.
        </p>
        <p>
          <a href="https://github.com/1ncarnati0n" target="_blank" rel="noopener">GitHub</a>
        </p>
      </div>
    </footer>
  );
}
