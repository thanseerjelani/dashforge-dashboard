// src/components/todo/TodoForm.tsx
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CalendarDays, X, Plus } from 'lucide-react'
import { Todo, TodoPriority, TodoCategory } from '@/types/todo'
import { Calendar } from '@/components/ui/calendar'

interface TodoFormProps {
    todo?: Todo
    onSubmit: (todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) => void
    onCancel: () => void
    isEditing?: boolean
}

const TodoForm = ({ todo, onSubmit, onCancel, isEditing = false }: TodoFormProps) => {
    const [title, setTitle] = useState(todo?.title || '')
    const [description, setDescription] = useState(todo?.description || '')
    const [priority, setPriority] = useState<TodoPriority>(todo?.priority || 'medium')
    const [category, setCategory] = useState<TodoCategory>(todo?.category || 'personal')
    const [dueDate, setDueDate] = useState(
        todo?.dueDate ? new Date(todo.dueDate).toISOString().split('T')[0] : ''
    )
    const [tagInput, setTagInput] = useState('')
    const [tags, setTags] = useState<string[]>(todo?.tags || [])
    const [showCalendar, setShowCalendar] = useState(false)

    const priorities: { value: TodoPriority; label: string; color: string }[] = [
        { value: 'low', label: 'Low', color: 'bg-green-500' },
        { value: 'medium', label: 'Medium', color: 'bg-yellow-500' },
        { value: 'high', label: 'High', color: 'bg-red-500' },
    ]

    const categories: { value: TodoCategory; label: string }[] = [
        { value: 'personal', label: 'Personal' },
        { value: 'work', label: 'Work' },
        { value: 'shopping', label: 'Shopping' },
        { value: 'health', label: 'Health' },
        { value: 'other', label: 'Other' },
    ]

    const handleAddTag = () => {
        if (tagInput.trim() && !tags.includes(tagInput.trim())) {
            setTags([...tags, tagInput.trim().toLowerCase()])
            setTagInput('')
        }
    }

    const handleRemoveTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!title.trim()) return

        onSubmit({
            title: title.trim(),
            description: description.trim() || undefined,
            completed: todo?.completed || false,
            priority,
            category,
            dueDate: dueDate ? new Date(dueDate) : undefined,
            tags,
        })
    }

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    {isEditing ? 'Edit Task' : 'Create New Task'}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Title */}
                    <div>
                        <label className="text-sm font-medium mb-2 block">Title *</label>
                        <Input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter task title..."
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="text-sm font-medium mb-2 block">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter task description..."
                            rows={3}
                            className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>

                    {/* Priority and Category */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium mb-2 block">Priority</label>
                            <div className="flex gap-2">
                                {priorities.map((p) => (
                                    <button
                                        key={p.value}
                                        type="button"
                                        onClick={() => setPriority(p.value)}
                                        className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${priority === p.value
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-secondary hover:bg-secondary/80'
                                            }`}
                                    >
                                        <div className={`w-2 h-2 rounded-full ${p.color}`} />
                                        {p.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-2 block">Category</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value as TodoCategory)}
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            >
                                {categories.map((c) => (
                                    <option key={c.value} value={c.value}>
                                        {c.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Due Date with Calendar Widget */}
                    <div>
                        <label className="text-sm font-medium mb-2 block">Due Date</label>
                        <div className="relative">
                            <Input
                                type="text"
                                value={dueDate ? new Date(dueDate).toLocaleDateString() : ''}
                                placeholder="Select due date..."
                                readOnly
                                onClick={() => setShowCalendar(!showCalendar)}
                                className="cursor-pointer"
                            />
                            <CalendarDays className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />

                            {showCalendar && (
                                <div className="absolute top-full left-0 mt-2 z-50">
                                    <Calendar
                                        selected={dueDate ? new Date(dueDate) : undefined}
                                        onSelect={(date) => {
                                            setDueDate(date.toISOString().split('T')[0])
                                            setShowCalendar(false)
                                        }}
                                        onClose={() => setShowCalendar(false)}
                                        minDate={new Date()} // Prevent selecting past dates
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Tags */}
                    <div>
                        <label className="text-sm font-medium mb-2 block">Tags</label>
                        <div className="flex gap-2 mb-2">
                            <Input
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                placeholder="Add a tag..."
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                            />
                            <Button type="button" size="sm" onClick={handleAddTag}>
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                                    {tag}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveTag(tag)}
                                        className="ml-1 hover:text-destructive"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </Badge>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-4">
                        <Button type="submit" className="flex-1">
                            {isEditing ? 'Update Task' : 'Create Task'}
                        </Button>
                        <Button type="button" variant="outline" onClick={onCancel}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}

export default TodoForm
