// src/components/todo/TodoItem.tsx
import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    CheckCircle2,
    Circle,
    Star,
    Edit,
    Trash2,
    Calendar
} from 'lucide-react'
import { Todo } from '@/types/todo'
import TodoForm from './TodoForm'

interface TodoItemProps {
    todo: Todo
    onToggle: (id: string) => void
    onUpdate: (id: string, updates: Partial<Todo>) => void
    onDelete: (id: string) => void
}

const TodoItem = ({ todo, onToggle, onUpdate, onDelete }: TodoItemProps) => {
    const [isEditing, setIsEditing] = useState(false)

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'text-red-500'
            case 'medium': return 'text-yellow-500'
            case 'low': return 'text-green-500'
            default: return 'text-gray-500'
        }
    }

    const formatDueDate = (date?: Date) => {
        if (!date) return null

        const today = new Date()
        const dueDate = new Date(date)
        const diffTime = dueDate.getTime() - today.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        if (diffDays === 0) return { text: 'Due today', color: 'text-orange-500' }
        if (diffDays === 1) return { text: 'Due tomorrow', color: 'text-yellow-500' }
        if (diffDays < 0) return { text: `Overdue by ${Math.abs(diffDays)} days`, color: 'text-red-500' }
        return { text: `Due in ${diffDays} days`, color: 'text-muted-foreground' }
    }

    const handleUpdate = (updatedTodo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) => {
        onUpdate(todo.id, updatedTodo)
        setIsEditing(false)
    }

    if (isEditing) {
        return (
            <TodoForm
                todo={todo}
                onSubmit={handleUpdate}
                onCancel={() => setIsEditing(false)}
                isEditing={true}
            />
        )
    }

    const dueDateInfo = formatDueDate(todo.dueDate)

    return (
        <Card className="transition-all hover:shadow-md">
            <CardContent className="p-4">
                <div className="flex items-start gap-3">
                    {/* Checkbox */}
                    <button
                        onClick={() => onToggle(todo.id)}
                        className="mt-1 hover:scale-110 transition-transform"
                    >
                        {todo.completed ? (
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : (
                            <Circle className="h-5 w-5 text-muted-foreground hover:text-primary" />
                        )}
                    </button>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                            <h3 className={`font-medium leading-tight ${todo.completed
                                ? 'line-through text-muted-foreground'
                                : 'text-foreground'
                                }`}>
                                {todo.title}
                            </h3>

                            <div className="flex items-center gap-2 ml-2">
                                <Star
                                    className={`${getPriorityColor(todo.priority)} h-4 w-4`}
                                    fill="currentColor"
                                />
                                <Badge variant="outline" className="text-xs">
                                    {todo.category}
                                </Badge>
                            </div>
                        </div>

                        {todo.description && (
                            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                                {todo.description}
                            </p>
                        )}

                        <div className="flex items-center justify-between">
                            {/* Tags */}
                            <div className="flex flex-wrap gap-1">
                                {todo.tags.map((tag) => (
                                    <Badge key={tag} variant="secondary" className="text-xs">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>

                            {/* Due Date */}
                            {dueDateInfo && (
                                <div className={`flex items-center gap-1 text-xs ${dueDateInfo.color}`}>
                                    <Calendar className="h-3 w-3" />
                                    {dueDateInfo.text}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsEditing(true)}
                            className="h-8 w-8"
                        >
                            <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onDelete(todo.id)}
                            className="h-8 w-8 hover:text-destructive"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default TodoItem
