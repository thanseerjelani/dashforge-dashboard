// src/hooks/useTheme.ts
import { useEffect } from 'react'
import { useThemeStore } from '@/store/themeStore'

export const useTheme = () => {
  const { isDark, toggleTheme, setTheme } = useThemeStore()

  useEffect(() => {
    const root = document.documentElement
    if (isDark) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [isDark])

  return {
    isDark,
    toggleTheme,
    setTheme,
  }
}
