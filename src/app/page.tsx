import { Button } from "@/components/ui/Button";

export default async function Home() {
  return (
    <div className="flex gap-7 items-center flex-wrap flex-col">
      {/* ─── 네비게이션 버튼 (실제 링크) ─── */}
      <section>
        <div className="flex gap-4 items-center flex-wrap">
          <Button href="/blog" size="sm">
            Blog
          </Button>
          <Button href="/works" size="sm">
            Works
          </Button>
          <Button href="/about" size="sm">
            About
          </Button>
          <Button href="/design" size="sm">
            design
          </Button>
        </div>
      </section>
    </div>
  );
}
