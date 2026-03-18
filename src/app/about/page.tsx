import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "프로필, 기술 스택, 이력 소개",
};

export default function AboutPage() {
  return (
    <div className="pagelayout">
      <h1>About</h1>
      <p>프로필과 이력이 여기에 표시됩니다.</p>
    </div>
  );
}
