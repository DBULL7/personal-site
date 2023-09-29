import { useState, useEffect } from 'react'

const useIsDarkMode = (): boolean => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return (
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
      )
    }
    return false
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

      const handleDarkModeChange = (event: MediaQueryListEvent) => {
        setIsDarkMode(event.matches)
      }

      // Add listener on mount
      mediaQuery.addEventListener('change', handleDarkModeChange)

      // Cleanup listener on unmount
      return () => {
        mediaQuery.removeEventListener('change', handleDarkModeChange)
      }
    }
  }, [])

  return isDarkMode
}

export default useIsDarkMode
