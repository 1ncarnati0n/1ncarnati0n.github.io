import { Button } from "@/components/ui/Button";

export default async function Home() {
  return (
    <>
      {/* ─── 네비게이션 버튼 (실제 링크) ─── */}
      <section>
        <div className="flex gap-4 justify-center">
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
      <article className="mt-12 text-center">
        <p>
          AI & Software Engineering, Computational Design
        </p>
      </article>
    </>
  );
}
