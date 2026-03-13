import { create } from 'zustand'          // Zustand 핵심 함수
import { persist } from 'zustand/middleware' // localStorage 자동 저장

// 타입 정의: theme 값은 'light' 또는 'dark'만 가능
type Theme = 'light' | 'dark'

// 이 store가 가진 것들의 타입
interface ThemeStore {
  theme: Theme                  // 현재 테마 값
  toggleTheme: () => void       // 테마를 전환하는 함수
}

// store 생성
export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: 'light',           // 초기값

      // 현재 light면 dark로, dark면 light로 전환
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === 'light' ? 'dark' : 'light',
        })),
    }),
    { name: 'theme-storage' }   // localStorage에 저장될 키 이름
  )
)