// src/types/news.ts
export interface NewsArticle {
  id: string
  title: string
  description: string
  content: string
  url: string
  urlToImage: string
  publishedAt: string
  source: NewsSource
  author: string
  category: NewsCategory
}

export type NewsCategory = 
  | 'business' 
  | 'entertainment' 
  | 'general' 
  | 'health' 
  | 'science' 
  | 'sports' 
  | 'technology'

export interface NewsSource {
  id: string | null
  name: string
}

// Raw NewsAPI Response Types
export interface RawNewsSource {
  id: string | null
  name: string
}

export interface RawNewsArticle {
  source: RawNewsSource
  author: string | null
  title: string
  description: string | null
  url: string
  urlToImage: string | null
  publishedAt: string
  content: string | null
}

// This is the actual NewsAPI response structure
export interface NewsApiResponse {
  status: 'ok' | 'error'
  totalResults: number
  articles: RawNewsArticle[]
}

// Error response type (when status is 'error')
export interface NewsApiErrorResponse {
  status: 'error'
  code: string
  message: string
}