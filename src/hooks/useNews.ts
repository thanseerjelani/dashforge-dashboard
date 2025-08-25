// src/hooks/useNews.ts
import { useQuery } from '@tanstack/react-query'
import { newsService } from '@/services/newsApi'
import { NewsArticle, NewsCategory } from '@/types/news'

export const useTopHeadlines = (
  category?: NewsCategory,
  country = 'us',
  pageSize = 20
) => {
  return useQuery<NewsArticle[], Error>({
    queryKey: ['news', 'headlines', category, country, pageSize],
    queryFn: () => newsService.getTopHeadlines(category, country, pageSize),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    retry: 3,
  })
}

export const useNewsSearch = (
  query: string,
  sortBy: 'relevancy' | 'popularity' | 'publishedAt' = 'publishedAt',
  pageSize = 20,
  enabled = true
) => {
  return useQuery<NewsArticle[], Error>({
    queryKey: ['news', 'search', query, sortBy, pageSize],
    queryFn: () => newsService.searchNews(query, sortBy, pageSize),
    enabled: enabled && !!query.trim(),
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    retry: 3,
  })
}
