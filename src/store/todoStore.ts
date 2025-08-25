// src/store/todoStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Todo, TodoCategory, TodoPriority, TodoFilters, TodoStats } from '@/types/todo'
import { generateId } from '@/utils/helpers'

interface TodoState {
  todos: Todo[]
  filters: TodoFilters
  addTodo: (todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateTodo: (id: string, updates: Partial<Todo>) => void
  deleteTodo: (id: string) => void
  toggleTodo: (id: string) => void
  setFilters: (filters: Partial<TodoFilters>) => void
  clearFilters: () => void
  getFilteredTodos: () => Todo[]
  getTodoStats: () => TodoStats
}

export const useTodoStore = create<TodoState>()(
  persist(
    (set, get) => ({
      todos: [],
      filters: {},
      
      addTodo: (todoData) => {
        const newTodo: Todo = {
          ...todoData,
          id: generateId(),
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        set((state) => ({ todos: [...state.todos, newTodo] }))
      },

      updateTodo: (id, updates) => {
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, ...updates, updatedAt: new Date() } : todo
          ),
        }))
      },

      deleteTodo: (id) => {
        set((state) => ({
          todos: state.todos.filter((todo) => todo.id !== id),
        }))
      },

      toggleTodo: (id) => {
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, completed: !todo.completed, updatedAt: new Date() } : todo
          ),
        }))
      },

      setFilters: (newFilters) => {
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
        }))
      },

      clearFilters: () => {
        set({ filters: {} })
      },

      getFilteredTodos: () => {
        const { todos, filters } = get()
        return todos.filter((todo) => {
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
        })
      },

      getTodoStats: () => {
        const todos = get().todos
        const total = todos.length
        const completed = todos.filter(t => t.completed).length
        const pending = total - completed
        const now = new Date()
        const overdue = todos.filter(t => 
          !t.completed && t.dueDate && new Date(t.dueDate) < now
        ).length

        const byCategory: Record<TodoCategory, number> = {
          personal: 0,
          work: 0,
          shopping: 0,
          health: 0,
          other: 0,
        }

        const byPriority: Record<TodoPriority, number> = {
          low: 0,
          medium: 0,
          high: 0,
        }

        todos.forEach(todo => {
          byCategory[todo.category]++
          byPriority[todo.priority]++
        })

        return {
          total,
          completed,
          pending,
          overdue,
          byCategory,
          byPriority,
        }
      },
    }),
    {
      name: 'todo-storage',
    }
  )
)
