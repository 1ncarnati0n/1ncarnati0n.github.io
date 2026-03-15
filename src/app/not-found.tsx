import { Button } from "@/components/ui/Button"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-neutral-600 dark:text-neutral-400 mb-6">
          찾는 페이지가 없습니다.
        </p>
        <Button href="/" size="lg">
          홈으로 돌아가기
        </Button>
      </div>
    </div>
  )
}