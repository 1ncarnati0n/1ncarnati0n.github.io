import { Button } from "@/components/ui/Button";

export default function DesignPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20 space-y-20">
      {/* 페이지 제목 */}
      <header>
        <h1>Design System</h1>
        <h2>architecture</h2>
        <h3>technology</h3>
        <p>컴포넌트 테스트 페이지</p>
      </header>

      {/* ─── 네비게이션 버튼 (실제 링크) ─── */}
      <section>
        <p>basic button</p>
        <div className="flex gap-4 items-center flex-wrap">
          <Button href="/blog" size="md">
            Blog
          </Button>
          <Button href="/works" size="md">
            Works
          </Button>
          <Button href="/about" size="md">
            About
          </Button>
        </div>
      </section>

      <section>
        <p>Sizes — outlined</p>
        <div className="flex gap-4 items-center">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </div>
      </section>

      {/* ─── 상태 ─── */}
      <section>
        <p className="text-xs text-neutral-400 uppercase tracking-widest mb-6">
          States
        </p>
        <div className="flex gap-4 items-center flex-wrap">
          <Button>Default</Button>
          <Button disabled>Disabled</Button>
          <Button>Default</Button>
          <Button disabled>Disabled</Button>
        </div>
      </section>

      {/* ─── 실사용 예시 ─── */}
      <section>
        <p className="text-xs text-neutral-400 uppercase tracking-widest mb-6">
          Use cases
        </p>
        <div className="space-y-6">
          {/* 404 패턴 */}
          <div className="p-8 border border-neutral-200 dark:border-neutral-800 rounded-lg text-center">
            <p className="text-5xl font-medium mb-2">404</p>
            <p className="text-neutral-500 text-sm mb-6">
              찾는 페이지가 없습니다.
            </p>
            <Button href="/" size="lg">
              홈으로 돌아가기
            </Button>
          </div>

          {/* 태그 필터 패턴 */}
          <div className="p-8 border border-neutral-200 dark:border-neutral-800 rounded-lg">
            <p className="text-sm text-neutral-500 mb-4">Filter by tag</p>
            <div className="flex gap-2 flex-wrap">
              <Button size="sm">All</Button>
              <Button size="sm">Rust</Button>
              <Button size="sm">Next.js</Button>
              <Button size="sm">Python</Button>
              <Button size="sm">BIM</Button>
              <Button size="sm">Deep Learning</Button>
            </div>
          </div>

          {/* 외부 링크 패턴 */}
          <div className="p-8 border border-neutral-200 dark:border-neutral-800 rounded-lg">
            <p className="text-sm text-neutral-500 mb-4">External links</p>
            <div className="flex gap-4 flex-wrap">
              <Button size="md" href="https://github.com" external>
                GitHub →
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
