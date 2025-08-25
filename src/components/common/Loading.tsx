// src/components/common/Loading.tsx
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { cn } from '@/utils/cn'

interface LoadingProps {
    variant?: 'default' | 'card' | 'list' | 'grid'
    count?: number
    className?: string
}

export const Loading = ({ variant = 'default', count = 3, className }: LoadingProps) => {
    if (variant === 'card') {
        return (
            <div className={cn('space-y-4', className)}>
                {Array.from({ length: count }).map((_, i) => (
                    <Card key={i} className="animate-pulse">
                        <CardHeader>
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-3 w-1/2" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <Skeleton className="h-3 w-full" />
                                <Skeleton className="h-3 w-2/3" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        )
    }

    if (variant === 'list') {
        return (
            <div className={cn('space-y-3', className)}>
                {Array.from({ length: count }).map((_, i) => (
                    <div key={i} className="flex items-center space-x-4 animate-pulse">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2 flex-1">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-3 w-1/2" />
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    if (variant === 'grid') {
        return (
            <div className={cn('grid gap-4 md:grid-cols-2 lg:grid-cols-3', className)}>
                {Array.from({ length: count }).map((_, i) => (
                    <Card key={i} className="animate-pulse">
                        <CardContent className="p-6">
                            <Skeleton className="h-8 w-8 rounded-full mb-4" />
                            <Skeleton className="h-4 w-3/4 mb-2" />
                            <Skeleton className="h-3 w-1/2" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        )
    }

    return (
        <div className={cn('space-y-3', className)}>
            {Array.from({ length: count }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
            ))}
        </div>
    )
}
