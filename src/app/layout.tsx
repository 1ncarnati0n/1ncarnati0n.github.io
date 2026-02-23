import type { Metadata } from "next";
import "@/styles/global.css";
import "@/styles/sidebar.css";
import "@/styles/prose.css";
import "@/styles/callouts.css";
import "@/styles/code.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CodeBlockSetup from "@/components/CodeBlockSetup";

export const metadata: Metadata = {
  metadataBase: new URL("https://1ncarnati0n.github.io"),
  title: {
    default: "1ncarnati0n",
    template: "%s — 1ncarnati0n",
  },
  description: "Architecture Portfolio & Tech Blog",
  openGraph: {
    title: "1ncarnati0n",
    description: "Architecture Portfolio & Tech Blog",
    type: "website",
    url: "https://1ncarnati0n.github.io",
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;900&family=Noto+Serif+KR:wght@400;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        {/* KaTeX CSS */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css"
          crossOrigin="anonymous"
        />
        {/* Dark mode initialization (prevent flash) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var s=localStorage.getItem("theme");var p=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";document.documentElement.setAttribute("data-theme",s||p);})();`,
          }}
        />
      </head>
      <body>
        <Header />
        {children}
        <Footer />
        <CodeBlockSetup />
      </body>
    </html>
  );
}
