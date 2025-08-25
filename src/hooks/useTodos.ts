// src/hooks/useTodos.ts
import { useTodoStore } from '@/store/todoStore'
import { TodoFilters } from '@/types/todo'

export const useTodos = (filters?: TodoFilters) => {
  const {
    todos,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    setFilters,
    clearFilters,
    getFilteredTodos,
    getTodoStats,
  } = useTodoStore()

  // Apply filters if provided
  const filteredTodos = filters ? 
    todos.filter(todo => {
      if (filters.category && todo.category !== filters.category) return false
      if (filters.priority && todo.priority !== filters.priority) return false
      if (filters.completed !== undefined && todo.completed !== filters.completed) return false
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        return (
          todo.title.toLowerCase().includes(searchLower) ||
          todo.description?.toLowerCase().includes(searchLower) ||
          todo.tags.some(tag => tag.toLowerCase().includes(searchLower))
        )
      }
      return true
    }) : getFilteredTodos()

  return {
    todos: filteredTodos,
    allTodos: todos,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    setFilters,
    clearFilters,
    stats: getTodoStats(),
  }
}
