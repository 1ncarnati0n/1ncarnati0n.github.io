import { create } from 'zustand'
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
      theme: 'light',

      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === 'light' ? 'dark' : 'light',
        })),

      // 클라이언트 마운트 후 localStorage에서 로드
      initializeTheme: () => {
        if (typeof window !== 'undefined') {
          try {
            const stored = localStorage.getItem('theme-storage')
            if (stored) {
              const { state } = JSON.parse(stored)
              set({ theme: state?.theme || 'light' })
            }
          } catch (e) {
            console.error('Theme initialization failed:', e)
          }
        }
      }
    }),
    { name: 'theme-storage' }
  )
)