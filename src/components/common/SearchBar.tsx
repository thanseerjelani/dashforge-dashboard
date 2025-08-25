// src/components/common/SearchBar.tsx
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, X } from 'lucide-react'
import { cn } from '@/utils/cn'

interface SearchBarProps {
    placeholder?: string
    onSearch?: (query: string) => void
    onClear?: () => void
    className?: string
    value?: string
    onChange?: (value: string) => void
}

export const SearchBar = ({
    placeholder = 'Search...',
    onSearch,
    onClear,
    className,
    value: controlledValue,
    onChange
}: SearchBarProps) => {
    const [internalValue, setInternalValue] = useState('')

    const value = controlledValue !== undefined ? controlledValue : internalValue
    const setValue = onChange || setInternalValue

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSearch?.(value)
    }

    const handleClear = () => {
        setValue('')
        onClear?.()
    }

    return (
        <form onSubmit={handleSubmit} className={cn('relative', className)}>
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="pl-10 pr-10"
            />
            {value && (
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={handleClear}
                    className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
                >
                    <X className="h-3 w-3" />
                </Button>
            )}
        </form>
    )
}
