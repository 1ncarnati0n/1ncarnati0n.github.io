import { Button } from "@/components/ui/Button"

export default function NotFound() {
  return (
    <div className="flex-wrap items-center justify-center">
      <div className="flex-wrap text-center border border-b-black rounded-lg p-10 min-h-lg max-w-lg mx-auto mt-30 ">
        <h1 className="font-sans text-6xl font-bold">404</h1>
        <p>
          찾는 페이지가 없습니다.
        </p>
        <Button href="/" size="lg">
          홈으로 돌아가기
        </Button>
      </div>
    </div>
  )
}