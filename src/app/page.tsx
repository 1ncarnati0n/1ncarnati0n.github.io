export default async function Home() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <section className="mb-20">
        
        <h1>hi</h1>
        <p>
          AI Engineering, Computational Design, BIM, 건설산업 AX, DX 대한 Tech Blog 입니다.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
      
        <div className="p-6 border rounded-lg">
          <h2>Blog</h2>
          <p>Tech Posts</p>
        </div>
      
        <div className="p-6 border rounded-lg">
          <h2>Works</h2>
          <p>Architectural Dsign</p>
        </div>
      
      </section>

    </div>
  )
}