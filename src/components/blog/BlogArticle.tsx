interface BlogArticleProps {
  title: string
  date: Date
  readingTime: number
  tags: string[]
  cssClasses: string[]
  html: string
}

export function BlogArticle({
  title,
  date,
  readingTime,
  tags,
  cssClasses,
  html,
}: BlogArticleProps) {
  const articleClassName = ['prose-custom', ...cssClasses].join(' ').trim()

  return (
    <article className="flex-wrap flex-col items-center max-w-4xl">
      <header className="mb-10">
        <h1 className="font-header mb-3 text-2xl md:text-3xl font-medium">
          {title}
        </h1>

        <div className="gap-3 text-sm">
          <time dateTime={date.toISOString()}>
            {date.toLocaleDateString('ko-KR')}
          </time>
          <span>·</span>
          <span>{readingTime}분 읽기</span>
        </div>

        {tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full px-2 py-0.5 text-xs"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  color: 'var(--color-secondary)',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      <hr className="mb-10" />

      <div
        className={articleClassName}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </article>
  )
}
