export default async function Home() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <section className="mb-20">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          1ncarnati0n
        </h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl">
          AI Engineering, Computational Design, BIM, 건설산업 AX, DX 대한 Tech Blog 입니다.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-bold mb-2">Blog</h2>
          <p className="text-neutral-600 dark:text-neutral-400">Tech Posts</p>
        </div>
        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-bold mb-2">Works</h2>
          <p className="text-neutral-600 dark:text-neutral-400">Architectural Dsign</p>
        </div>
      </section>
    </div>
  )
}