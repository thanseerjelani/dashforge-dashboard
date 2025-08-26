// src/services/newsApi.ts - Production safe version
import { NewsApiResponse, NewsApiErrorResponse, NewsArticle, NewsCategory, RawNewsArticle } from '@/types/news'
import { API_ENDPOINTS } from '@/utils/constants'
import { generateId } from '@/utils/helpers'

// Helper function for safe logging
const debugLog = (...args: any[]) => {
  if (import.meta.env.MODE === 'development') {
    console.log(...args)
  }
}

const debugWarn = (...args: any[]) => {
  if (import.meta.env.MODE === 'development') {
    console.warn(...args)
  }
}

const debugError = (...args: any[]) => {
  if (import.meta.env.MODE === 'development') {
    console.error(...args)
  }
}

class NewsService {
  private apiKey: string

  constructor() {
    // Debug environment variables ONLY in development
    if (import.meta.env.MODE === 'development') {
      console.log('All import.meta.env variables:', import.meta.env)
      console.log('VITE_NEWS_API_KEY value:', import.meta.env.VITE_NEWS_API_KEY)
      console.log('API_ENDPOINTS.news:', API_ENDPOINTS.news)
    }
    
    this.apiKey = import.meta.env.VITE_NEWS_API_KEY || API_ENDPOINTS.news.key || ''
    
    debugLog('NewsService initialized with API key:', this.apiKey ? `PRESENT (${this.apiKey.substring(0, 8)}...)` : 'MISSING')
  }

  async getTopHeadlines(
    category?: NewsCategory,
    country: string = 'us',
    pageSize: number = 20
  ): Promise<NewsArticle[]> {
    // Enhanced validation with detailed error info ONLY in development
    if (!this.apiKey || this.apiKey.trim() === '') {
      if (import.meta.env.MODE === 'development') {
        console.error('NewsAPI Debug Info:')
        console.error('- import.meta.env.VITE_NEWS_API_KEY:', import.meta.env.VITE_NEWS_API_KEY)
        console.error('- API_ENDPOINTS.news.key:', API_ENDPOINTS.news.key)
        console.error('- this.apiKey:', this.apiKey)
      }
      throw new Error('NewsAPI key is missing. Please check your .env file and ensure VITE_NEWS_API_KEY is set.')
    }

    const params = new URLSearchParams({
      country,
      pageSize: pageSize.toString(),
      apiKey: this.apiKey,
    })

    if (category && category !== 'general') {
      params.append('category', category)
    }

    // Use the base URL from constants
    const baseUrl = import.meta.env.VITE_NEWS_API_URL || API_ENDPOINTS.news.base
    const newsApiUrl = `${baseUrl}/top-headlines?${params.toString()}`
    
    debugLog('Final NewsAPI URL (without key):', newsApiUrl.replace(this.apiKey, 'HIDDEN_KEY'))

    // Try direct fetch first, then proxies
    return await this.tryMultipleMethods(newsApiUrl, category || 'general')
  }

  async searchNews(
    query: string,
    sortBy: 'relevancy' | 'popularity' | 'publishedAt' = 'publishedAt',
    pageSize: number = 20
  ): Promise<NewsArticle[]> {
    if (!this.apiKey || this.apiKey.trim() === '') {
      throw new Error('NewsAPI key is missing. Please check your .env file and ensure VITE_NEWS_API_KEY is set.')
    }

    const params = new URLSearchParams({
      q: query,
      sortBy,
      pageSize: pageSize.toString(),
      apiKey: this.apiKey,
    })

    const baseUrl = import.meta.env.VITE_NEWS_API_URL || API_ENDPOINTS.news.base
    const newsApiUrl = `${baseUrl}/everything?${params.toString()}`
    
    debugLog('Search URL (without key):', newsApiUrl.replace(this.apiKey, 'HIDDEN_KEY'))

    return await this.tryMultipleMethods(newsApiUrl, 'general')
  }

  private async tryMultipleMethods(newsApiUrl: string, category: NewsCategory): Promise<NewsArticle[]> {
    const methods = [
      {
        name: 'Direct Fetch (CORS might fail)',
        fetch: async () => {
          debugLog('Trying direct fetch to NewsAPI...')
          
          const response = await fetch(newsApiUrl, {
            headers: {
              'User-Agent': 'NewsApp/1.0'
            }
          })
          
          if (!response.ok) {
            const errorText = await response.text()
            debugError('Direct fetch error response:', errorText)
            throw new Error(`HTTP ${response.status}: ${errorText}`)
          }
          
          return await response.json()
        }
      },
      {
        name: 'AllOrigins Proxy',
        fetch: async () => {
          const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(newsApiUrl)}`
          debugLog('Trying AllOrigins proxy...')
          
          const response = await fetch(proxyUrl)
          if (!response.ok) {
            const errorText = await response.text()
            throw new Error(`Proxy HTTP ${response.status}: ${errorText}`)
          }
          
          const proxyData = await response.json()
          
          if (!proxyData.contents) {
            throw new Error('No contents in proxy response')
          }
          
          return JSON.parse(proxyData.contents)
        }
      },
      {
        name: 'CORS Proxy',
        fetch: async () => {
          const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(newsApiUrl)}`
          debugLog('Trying CORS proxy...')
          
          const response = await fetch(proxyUrl)
          if (!response.ok) throw new Error(`HTTP ${response.status}`)
          
          return await response.json()
        }
      }
    ]

    for (const method of methods) {
      try {
        debugLog(`🔄 Trying ${method.name}...`)
        
        const newsData: NewsApiResponse | NewsApiErrorResponse = await method.fetch()
        
        debugLog('Response received:', {
          status: newsData.status,
          hasArticles: 'articles' in newsData,
          articleCount: 'articles' in newsData ? newsData.articles?.length : 0
        })
        
        if (newsData.status === 'error') {
          const errorData = newsData as NewsApiErrorResponse
          debugWarn(`${method.name} API error:`, errorData.message, errorData.code)
          continue
        }

        const successData = newsData as NewsApiResponse
        
        if (!successData.articles || successData.articles.length === 0) {
          debugWarn(`${method.name} returned no articles`)
          continue
        }
        
        debugLog(`✅ ${method.name} successful! Found ${successData.articles.length} articles`)
        
        return this.transformNewsData(successData.articles, category)

      } catch (error) {
        debugWarn(`❌ ${method.name} failed:`, error instanceof Error ? error.message : error)
        continue
      }
    }

    // All methods failed - return mock data with error message
    if (import.meta.env.MODE === 'development') {
      console.error('🚨 All fetch methods failed. Returning mock data.')
      console.error('This might be due to:')
      console.error('1. Invalid API key')
      console.error('2. Rate limiting')
      console.error('3. CORS issues')
      console.error('4. Network connectivity')
    }
    
    return this.getMockNewsData(category)
  }

  private transformNewsData(articles: RawNewsArticle[], category: NewsCategory): NewsArticle[] {
    return articles
      .filter(article => {
        const isValid = article.title && 
                        article.title !== '[Removed]' && 
                        article.description && 
                        article.description !== '[Removed]'
        
        if (!isValid) {
          debugLog('Filtering out invalid article:', article.title)
        }
        
        return isValid
      })
      .map(article => ({
        id: generateId(),
        title: article.title,
        description: article.description || '',
        content: article.content || article.description || '',
        url: article.url,
        urlToImage: article.urlToImage || '',
        publishedAt: article.publishedAt,
        source: {
          id: article.source.id || generateId(),
          name: article.source.name || 'Unknown Source',
        },
        author: article.author || 'Unknown Author',
        category,
      }))
  }

  private getMockNewsData(category: NewsCategory): NewsArticle[] {
    debugLog('🎭 Generating mock news data for category:', category)
    
    const mockArticles = [
      {
        title: '⚠️ News Service Currently Unavailable',
        description: 'Unable to fetch live news data. Please check your API configuration or try again later.',
        url: 'https://newsapi.org',
        category: 'general'
      },
      {
        title: 'Tech Giants Announce Major AI Breakthrough',
        description: 'Leading technology companies have unveiled significant advances in artificial intelligence capabilities.',
        url: 'https://example.com/ai-breakthrough',
        category: 'technology'
      },
      {
        title: 'Global Markets Show Mixed Performance',
        description: 'International stock exchanges display varied results as investors react to recent economic indicators.',
        url: 'https://example.com/market-performance',
        category: 'business'
      },
      {
        title: 'New Climate Research Reveals Important Findings',
        description: 'Scientists publish groundbreaking research on climate patterns and environmental changes.',
        url: 'https://example.com/climate-research',
        category: 'science'
      },
      {
        title: 'Championship Tournament Draws Record Crowds',
        description: 'The annual championship series attracts unprecedented attendance and viewership numbers.',
        url: 'https://example.com/championship',
        category: 'sports'
      },
      {
        title: 'Healthcare Innovation Improves Patient Outcomes',
        description: 'New medical technology shows promising results in clinical trials and patient care.',
        url: 'https://example.com/healthcare-innovation',
        category: 'health'
      }
    ]

    const filteredArticles = mockArticles.filter(article => 
      !category || category === 'general' || article.category === category
    )

    return filteredArticles.slice(0, 10).map(article => ({
      id: generateId(),
      title: article.title,
      description: article.description,
      content: article.description,
      url: article.url,
      urlToImage: `https://via.placeholder.com/400x200?text=${encodeURIComponent(article.title.substring(0, 30))}`,
      publishedAt: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(), // Random time in last 7 days
      source: {
        id: 'demo-news',
        name: 'Demo News Service'
      },
      author: 'Demo Reporter',
      category: category
    }))
  }

  // Method to test API key validity
  async testApiKey(): Promise<boolean> {
    try {
      const testUrl = `${API_ENDPOINTS.news.base}/top-headlines?country=us&pageSize=1&apiKey=${this.apiKey}`
      const response = await fetch(testUrl)
      const data = await response.json()
      
      debugLog('API Key test result:', data)
      return data.status === 'ok'
    } catch (error) {
      debugError('API Key test failed:', error)
      return false
    }
  }
}

export const newsService = new NewsService()