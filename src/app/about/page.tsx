import type { Metadata } from "next";

// 이 페이지 고유의 메타데이터. layout.tsx의 template과 합쳐져서
// 브라우저 탭에 "About | 1ncarnati0n"으로 표시됨
export const metadata: Metadata = {
  title: "About",
  description: "프로필, 기술 스택, 이력 소개",
};

export default function AboutPage() {
  return (
    <div className="px-9 flex-wrap">
      <h1 className="text-2xl font-bold mb-8">About</h1>
      <p className="text-neutral-500">프로필과 이력이 여기에 표시됩니다.</p>
    </div>
  );
}
