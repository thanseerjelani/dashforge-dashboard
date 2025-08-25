// src/components/todo/TodoFilters.tsx
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Search, Filter, X } from 'lucide-react'
import { TodoCategory, TodoPriority, TodoFilters as TodoFiltersType } from '@/types/todo'

interface TodoFiltersProps {
    filters: TodoFiltersType
    onFiltersChange: (filters: TodoFiltersType) => void
    onClearFilters: () => void
}

const TodoFilters = ({ filters, onFiltersChange, onClearFilters }: TodoFiltersProps) => {
    const [showAdvanced, setShowAdvanced] = useState(false)

    const categories: { value: TodoCategory; label: string }[] = [
        { value: 'personal', label: 'Personal' },
        { value: 'work', label: 'Work' },
        { value: 'shopping', label: 'Shopping' },
        { value: 'health', label: 'Health' },
        { value: 'other', label: 'Other' },
    ]

    const priorities: { value: TodoPriority; label: string; color: string }[] = [
        { value: 'low', label: 'Low', color: 'bg-green-500' },
        { value: 'medium', label: 'Medium', color: 'bg-yellow-500' },
        { value: 'high', label: 'High', color: 'bg-red-500' },
    ]

    const statusOptions = [
        { value: true, label: 'Completed' },
        { value: false, label: 'Pending' },
    ]

    const activeFiltersCount = Object.values(filters).filter(Boolean).length

    return (
        <Card>
            <CardContent className="p-4">
                <div className="space-y-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            value={filters.search || ''}
                            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
                            placeholder="Search todos..."
                            className="pl-10"
                        />
                    </div>

                    {/* Quick Status Filters */}
                    <div className="flex gap-2">
                        {statusOptions.map((status) => (
                            <Button
                                key={status.label}
                                variant={filters.completed === status.value ? 'default' : 'outline'}
                                size="sm"
                                onClick={() =>
                                    onFiltersChange({
                                        ...filters,
                                        completed: filters.completed === status.value ? undefined : status.value
                                    })
                                }
                            >
                                {status.label}
                            </Button>
                        ))}
                    </div>

                    {/* Advanced Filters Toggle */}
                    <div className="flex items-center justify-between">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowAdvanced(!showAdvanced)}
                            className="flex items-center gap-2"
                        >
                            <Filter className="h-4 w-4" />
                            Advanced Filters
                            {activeFiltersCount > 0 && (
                                <Badge variant="secondary" className="ml-1">
                                    {activeFiltersCount}
                                </Badge>
                            )}
                        </Button>

                        {activeFiltersCount > 0 && (
                            <Button variant="ghost" size="sm" onClick={onClearFilters}>
                                <X className="h-4 w-4 mr-1" />
                                Clear All
                            </Button>
                        )}
                    </div>

                    {/* Advanced Filters */}
                    {showAdvanced && (
                        <div className="space-y-4 pt-4 border-t">
                            {/* Category Filter */}
                            <div>
                                <label className="text-sm font-medium mb-2 block">Category</label>
                                <div className="flex flex-wrap gap-2">
                                    {categories.map((category) => (
                                        <Button
                                            key={category.value}
                                            variant={filters.category === category.value ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() =>
                                                onFiltersChange({
                                                    ...filters,
                                                    category: filters.category === category.value ? undefined : category.value
                                                })
                                            }
                                        >
                                            {category.label}
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            {/* Priority Filter */}
                            <div>
                                <label className="text-sm font-medium mb-2 block">Priority</label>
                                <div className="flex flex-wrap gap-2">
                                    {priorities.map((priority) => (
                                        <Button
                                            key={priority.value}
                                            variant={filters.priority === priority.value ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() =>
                                                onFiltersChange({
                                                    ...filters,
                                                    priority: filters.priority === priority.value ? undefined : priority.value
                                                })
                                            }
                                            className="flex items-center gap-2"
                                        >
                                            <div className={`w-2 h-2 rounded-full ${priority.color}`} />
                                            {priority.label}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

export default TodoFilters
