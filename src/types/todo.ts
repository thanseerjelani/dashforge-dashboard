// src/types/todo.ts

import { BaseEntity } from "./common"

export interface Todo extends BaseEntity {
  title: string
  description?: string
  completed: boolean
  priority: TodoPriority
  category: TodoCategory
  dueDate?: Date
  tags: string[]
}

export type TodoPriority = 'low' | 'medium' | 'high'
export type TodoCategory = 'personal' | 'work' | 'shopping' | 'health' | 'other'

export interface TodoFilters {
  category?: TodoCategory
  priority?: TodoPriority
  completed?: boolean
  search?: string
}

export interface TodoStats {
  total: number
  completed: number
  pending: number
  overdue: number
  byCategory: Record<TodoCategory, number>
  byPriority: Record<TodoPriority, number>
}
