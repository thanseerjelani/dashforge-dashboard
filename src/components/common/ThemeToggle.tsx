// src/components/common/ThemeToggle.tsx
import { Button } from '@/components/ui/button'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'

export const ThemeToggle = () => {
    const { isDark, toggleTheme } = useTheme()

    return (
        <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full"
            aria-label="Toggle theme"
        >
            {isDark ? (
                <Sun className="h-4 w-4" />
            ) : (
                <Moon className="h-4 w-4" />
            )}
        </Button>
    )
}
