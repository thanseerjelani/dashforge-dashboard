// src/pages/Todo.tsx - Updated with full CRUD operations
import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Search, LayoutGrid, List, Filter } from 'lucide-react'

// Import our new components
import TodoItem from '@/components/todo/TodoItem'
import TodoForm from '@/components/todo/TodoForm'
import TodoFilters from '@/components/todo/TodoFilters'
import TodoStats from '@/components/todo/TodoStats'

// Import hooks and types
import { useTodos } from '@/hooks/useTodos'
import { TodoFilters as TodoFiltersType } from '@/types/todo'

const Todo = () => {
    const [showForm, setShowForm] = useState(false)
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [filters, setFilters] = useState<TodoFiltersType>({})
    const [showFilters, setShowFilters] = useState(false)

    // Use our custom hook with filters
    const { todos, addTodo, updateTodo, deleteTodo, toggleTodo, stats } = useTodos(filters)

    const handleAddTodo = (todoData: any) => {
        addTodo(todoData)
        setShowForm(false)
    }

    const handleUpdateTodo = (id: string, updates: any) => {
        updateTodo(id, updates)
    }

    const handleDeleteTodo = (id: string) => {
        if (window.confirm('Are you sure you want to delete this todo?')) {
            deleteTodo(id)
        }
    }

    const handleToggleTodo = (id: string) => {
        toggleTodo(id)
    }

    const clearFilters = () => {
        setFilters({})
    }

    // If showing form, render the form
    if (showForm) {
        return (
            <div className="space-y-6">
                <TodoForm
                    onSubmit={handleAddTodo}
                    onCancel={() => setShowForm(false)}
                />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Todo Management</h1>
                    <p className="text-muted-foreground">
                        Stay organized and manage your tasks efficiently
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <Filter className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                    >
                        {viewMode === 'grid' ? <List className="h-4 w-4" /> : <LayoutGrid className="h-4 w-4" />}
                    </Button>
                    <Button onClick={() => setShowForm(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Task
                    </Button>
                </div>
            </div>

            {/* Stats Section */}
            <TodoStats stats={stats} />

            {/* Filters */}
            {showFilters && (
                <TodoFilters
                    filters={filters}
                    onFiltersChange={setFilters}
                    onClearFilters={clearFilters}
                />
            )}

            {/* Quick Search */}
            <Card>
                <CardContent className="p-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            value={filters.search || ''}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                            placeholder="Quick search todos..."
                            className="pl-10"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Quick Filter Buttons */}
            <div className="flex flex-wrap gap-2">
                <Button
                    variant={!filters.completed ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilters({ ...filters, completed: undefined })}
                >
                    All Tasks
                </Button>
                <Button
                    variant={filters.completed === false ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilters({ ...filters, completed: false })}
                >
                    Pending
                </Button>
                <Button
                    variant={filters.completed === true ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilters({ ...filters, completed: true })}
                >
                    Completed
                </Button>
                <Button
                    variant={filters.priority === 'high' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() =>
                        setFilters({
                            ...filters,
                            priority: filters.priority === 'high' ? undefined : 'high'
                        })
                    }
                >
                    High Priority
                </Button>
            </div>

            {/* Results Info */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                    {todos.length === 0 ? (
                        'No todos found'
                    ) : (
                        `Showing ${todos.length} of ${stats.total} todos`
                    )}
                </p>

                {Object.keys(filters).some(key => filters[key as keyof TodoFiltersType]) && (
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                        Clear all filters
                    </Button>
                )}
            </div>

            {/* Todo List */}
            {todos.length === 0 ? (
                <Card>
                    <CardContent className="p-8 text-center">
                        <div className="space-y-2">
                            <h3 className="text-lg font-medium">No todos found</h3>
                            <p className="text-muted-foreground">
                                {Object.keys(filters).some(key => filters[key as keyof TodoFiltersType])
                                    ? 'Try adjusting your filters or search terms.'
                                    : 'Create your first todo to get started!'
                                }
                            </p>
                            {!Object.keys(filters).some(key => filters[key as keyof TodoFiltersType]) && (
                                <Button onClick={() => setShowForm(true)} className="mt-4">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Create First Todo
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className={
                    viewMode === 'grid'
                        ? 'grid gap-4 md:grid-cols-2 lg:grid-cols-3'
                        : 'space-y-3'
                }>
                    {todos.map((todo, index) => (
                        <div
                            key={todo.id}
                            className="animate-fade-in group"
                            style={{ animationDelay: `${index * 0.05}s` }}
                        >
                            <TodoItem
                                todo={todo}
                                onToggle={handleToggleTodo}
                                onUpdate={handleUpdateTodo}
                                onDelete={handleDeleteTodo}
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* Load More Button (if implementing pagination) */}
            {todos.length > 0 && todos.length % 10 === 0 && (
                <div className="text-center pt-4">
                    <Button variant="outline">
                        Load More Todos
                    </Button>
                </div>
            )}
        </div>
    )
}

export default Todo