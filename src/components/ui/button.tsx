// src/components/ui/button.tsx
import { forwardRef } from 'react'
import { cn } from '@/utils/cn'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
    size?: 'default' | 'sm' | 'lg' | 'icon'
    loading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'default', size = 'default', loading, disabled, children, ...props }, ref) => {
        return (
            <button
                className={cn(
                    // Base styles
                    'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
                    // Variants
                    {
                        'bg-primary text-primary-foreground shadow hover:bg-primary/90': variant === 'default',
                        'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90': variant === 'destructive',
                        'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground': variant === 'outline',
                        'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80': variant === 'secondary',
                        'hover:bg-accent hover:text-accent-foreground': variant === 'ghost',
                        'text-primary underline-offset-4 hover:underline': variant === 'link',
                    },
                    // Sizes
                    {
                        'h-9 px-4 py-2': size === 'default',
                        'h-8 rounded-md px-3 text-xs': size === 'sm',
                        'h-10 rounded-md px-8': size === 'lg',
                        'h-9 w-9': size === 'icon',
                    },
                    className
                )}
                disabled={disabled || loading}
                ref={ref}
                {...props}
            >
                {loading && (
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                )}
                {children}
            </button>
        )
    }
)

Button.displayName = 'Button'

export { Button }
