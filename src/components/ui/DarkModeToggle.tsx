import { useEffect } from "react";
import { useThemeStore } from "@/store/useThemeStore";

export function DarkModeToggle() {
  // Zustand store에서 현재 테마와 토글 함수를 꺼내옴
  const theme = useThemeStore((s) => s.theme)
  const toggleTheme = useThemeStore((s) => s.toggleTheme)

  // theme이 바뀔 때마다 실행됨
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])  // ← [theme]: theme이 바뀔 때만 실행하라는 의미

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
      aria-label={`${theme === 'light' ? '다크' : '라이트'} 모드로 전환`}
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  )
}
