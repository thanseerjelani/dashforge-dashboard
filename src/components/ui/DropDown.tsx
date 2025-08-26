// src/components/ui/DropDown.tsx

import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'

interface DropDownOption {
    value: string
    label: string
    color?: string
    icon?: React.ReactNode
}

export interface DropDownProps {
    value: string
    onValueChange: (value: string) => void
    options: DropDownOption[]
    placeholder?: string
    label?: string
    className?: string
    disabled?: boolean
    showColorDots?: boolean
}

const DropDown = ({
    value,
    onValueChange,
    options,
    placeholder = "Select option",
    label,
    className = "",
    disabled = false,
    showColorDots = true
}: DropDownProps) => {
    const [showDropdown, setShowDropdown] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    const selectedOption = options.find(option => option.value === value)

    const handleToggle = () => {
        if (!disabled) {
            setShowDropdown(!showDropdown)
        }
    }

    const handleSelect = (optionValue: string) => {
        onValueChange(optionValue)
        setShowDropdown(false)
    }

    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label className="text-sm font-medium mb-2 block text-foreground">
                    {label}
                </label>
            )}

            <div className="relative" ref={dropdownRef}>
                <button
                    type="button"
                    onClick={handleToggle}
                    disabled={disabled}
                    className={`flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground ${disabled
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:bg-accent hover:text-accent-foreground cursor-pointer'
                        }`}
                >
                    <span className="flex items-center gap-2">
                        {showColorDots && selectedOption?.color && (
                            <div className={`w-2 h-2 rounded-full ${selectedOption.color}`} />
                        )}
                        {selectedOption?.icon && (
                            <span className="flex items-center">
                                {selectedOption.icon}
                            </span>
                        )}
                        <span className="truncate">
                            {selectedOption?.label || placeholder}
                        </span>
                    </span>
                    <ChevronDown
                        className={`h-4 w-4 transition-transform flex-shrink-0 ${showDropdown ? 'rotate-180' : ''
                            } ${disabled ? 'opacity-50' : ''}`}
                    />
                </button>

                {showDropdown && !disabled && (
                    <div className="absolute top-full left-0 right-0 z-50 mt-1 rounded-md border border-input bg-sky-50 shadow-lg max-h-60 overflow-auto">
                        <div className="p-1">
                            {options.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => handleSelect(option.value)}
                                    className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-black hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:bg-accent text-popover-foreground transition-colors"
                                >
                                    {showColorDots && option.color && (
                                        <div className={`w-2 h-2 rounded-full ${option.color}`} />
                                    )}
                                    {option.icon && (
                                        <span className="flex items-center">
                                            {option.icon}
                                        </span>
                                    )}
                                    <span className="flex-1 text-left truncate">
                                        {option.label}
                                    </span>
                                    {value === option.value && (
                                        <Check className="ml-auto h-4 w-4 flex-shrink-0" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export { DropDown }