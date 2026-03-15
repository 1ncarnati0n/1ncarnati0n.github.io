import { Button } from "@/components/ui/Button";

export default async function Home() {
  return (
    <div className="flex gap-7 items-center flex-wrap flex-col">
      {/* ─── 네비게이션 버튼 (실제 링크) ─── */}
      <section>
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
          <Button href="/design" size="md">
            design
          </Button>
        </div>
      </section>
    </div>
  );
}
