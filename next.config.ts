import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  // MDX 파일 확장자 인식
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],

  // 이미지 최적화 Vercel에서 네이티브 지원
  images: {
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
