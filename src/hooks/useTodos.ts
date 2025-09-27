// src/hooks/useTodos.ts
import { useState, useEffect } from 'react'
import { todoApiService } from '@/services/todoApi'
import { Todo, TodoFilters, TodoStats } from '@/types/todo'

export const useTodos = (filters?: TodoFilters) => {
  const [todos, setTodos] = useState<Todo[]>([])
  const [stats, setStats] = useState<TodoStats>({
    total: 0,
    completed: 0,
    pending: 0,
    overdue: 0,
    byCategory: { personal: 0, work: 0, shopping: 0, health: 0, other: 0 },
    byPriority: { low: 0, medium: 0, high: 0 }
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTodos = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await todoApiService.getAllTodos(filters)
      setTodos(response.data.data)
    } catch (err) {
      setError('Failed to fetch todos')
      console.error('Error fetching todos:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await todoApiService.getTodoStats()
      setStats(response.data.data)
    } catch (err) {
      console.error('Error fetching stats:', err)
    }
  }

  useEffect(() => {
    fetchTodos()
    fetchStats()
  }, [filters])

  const addTodo = async (todoData: any) => {
    try {
      setLoading(true)
      await todoApiService.createTodo({
        title: todoData.title,
        description: todoData.description,
        priority: todoData.priority.toUpperCase(),
        category: todoData.category.toUpperCase(),
        dueDate: todoData.dueDate?.toISOString().split('T')[0],
        tags: todoData.tags
      })
      await fetchTodos()
      await fetchStats()
    } catch (err) {
      setError('Failed to create todo')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateTodo = async (id: string, updates: any) => {
    try {
      setLoading(true)
      await todoApiService.updateTodo(id, {
        ...updates,
        priority: updates.priority?.toUpperCase(),
        category: updates.category?.toUpperCase(),
        dueDate: updates.dueDate?.toISOString?.()?.split('T')[0] || updates.dueDate
      })
      await fetchTodos()
      await fetchStats()
    } catch (err) {
      setError('Failed to update todo')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteTodo = async (id: string) => {
    try {
      setLoading(true)
      await todoApiService.deleteTodo(id)
      await fetchTodos()
      await fetchStats()
    } catch (err) {
      setError('Failed to delete todo')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const toggleTodo = async (id: string) => {
    try {
      await todoApiService.toggleTodo(id)
      await fetchTodos()
      await fetchStats()
    } catch (err) {
      setError('Failed to toggle todo')
      throw err
    }
  }

  return {
    todos,
    stats,
    loading,
    error,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    refetch: () => {
      fetchTodos()
      fetchStats()
    }
  }
}