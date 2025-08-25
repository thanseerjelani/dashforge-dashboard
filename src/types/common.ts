// src/types/common.ts - Your existing file (no changes needed)

export interface ApiResponse<T> {
  data: T
  message?: string
  status: number
}

// Change ApiError from interface to class so it can be instantiated
export class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message)
    this.name = 'ApiError'
  }
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error'

export interface BaseEntity {
  id: string
  createdAt: Date
  updatedAt: Date
}

// Additional utility types for the Todo system (complementing your existing types)
export interface FilterOptions {
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  limit?: number
  offset?: number
}

export type Theme = 'light' | 'dark' | 'system'

// Generic CRUD operations interface
export interface CRUDOperations<T, CreateT = Omit<T, 'id' | 'createdAt' | 'updatedAt'>, UpdateT = Partial<T>> {
  create: (data: CreateT) => Promise<T>
  read: (id: string) => Promise<T>
  update: (id: string, data: UpdateT) => Promise<T>
  delete: (id: string) => Promise<void>
  list: (filters?: FilterOptions) => Promise<T[]>
}

// Utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> =
  Pick<T, Exclude<keyof T, Keys>> 
  & {
      [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>
  }[Keys]