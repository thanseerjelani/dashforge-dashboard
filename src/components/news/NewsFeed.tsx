// src/components/news/NewsFeed.tsx
import { useState } from 'react'
import { AlertCircle, RefreshCw, Newspaper } from 'lucide-react'
import { NewsCard } from './NewsCard'
import { NewsFilters } from './NewsFilters'
import { NewsSearch } from './NewsSearch'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useTopHeadlines, useNewsSearch } from '@/hooks/useNews'
import { NewsArticle, NewsCategory } from '@/types/news'

interface NewsFeedProps {
    onArticleSelect: (article: NewsArticle) => void
}

export const NewsFeed = ({ onArticleSelect }: NewsFeedProps) => {
    const [selectedCategory, setSelectedCategory] = useState<NewsCategory | 'all'>('all')
    const [selectedCountry, setSelectedCountry] = useState('us')
    const [searchQuery, setSearchQuery] = useState('')

    // Use search query if available, otherwise use top headlines
    const headlinesQuery = useTopHeadlines(
        selectedCategory === 'all' ? undefined : selectedCategory,
        selectedCountry,
        20
    )

    const searchQuery_ = useNewsSearch(
        searchQuery,
        'publishedAt',
        20,
        !!searchQuery.trim()
    )

    // Determine which query to use
    const activeQuery = searchQuery.trim() ? searchQuery_ : headlinesQuery
    const { data: articles, isLoading, error, refetch } = activeQuery

    const handleRefresh = () => {
        refetch()
    }

    if (error) {
        return (
            <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4 text-center">
                <AlertCircle className="h-12 w-12 text-muted-foreground" />
                <div>
                    <h3 className="text-lg font-semibold">Failed to load news</h3>
                    <p className="text-sm text-muted-foreground">
                        {error.message || 'Something went wrong while fetching news articles.'}
                    </p>
                </div>
                <Button onClick={handleRefresh} className="gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Try Again
                </Button>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Latest News</h2>
                    <p className="text-muted-foreground">
                        Stay updated with the latest news from around the world
                    </p>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRefresh}
                    disabled={isLoading}
                    className="gap-2"
                >
                    <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                    Refresh
                </Button>
            </div>

            {/* Search */}
            <NewsSearch onSearch={setSearchQuery} isSearching={isLoading} />

            {/* Filters - Only show for headlines, not search */}
            {!searchQuery.trim() && (
                <NewsFilters
                    selectedCategory={selectedCategory}
                    onCategoryChange={setSelectedCategory}
                    selectedCountry={selectedCountry}
                    onCountryChange={setSelectedCountry}
                />
            )}

            {/* Articles Count */}
            {articles && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Newspaper className="h-4 w-4" />
                    <span>
                        {articles.length} article{articles.length !== 1 ? 's' : ''} found
                        {searchQuery.trim() && ` for "${searchQuery}"`}
                    </span>
                </div>
            )}

            {/* Loading State */}
            {isLoading && (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="space-y-4">
                            <Skeleton className="h-48 w-full rounded-xl" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-2/3" />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Articles Grid */}
            {articles && articles.length > 0 && (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {articles.map((article) => (
                        <NewsCard
                            key={article.id}
                            article={article}
                            onReadMore={onArticleSelect}
                        />
                    ))}
                </div>
            )}

            {/* No Results */}
            {articles && articles.length === 0 && !isLoading && (
                <div className="flex min-h-[300px] flex-col items-center justify-center space-y-4 text-center">
                    <Newspaper className="h-12 w-12 text-muted-foreground" />
                    <div>
                        <h3 className="text-lg font-semibold">No articles found</h3>
                        <p className="text-sm text-muted-foreground">
                            {searchQuery.trim()
                                ? `No articles found for "${searchQuery}". Try a different search term.`
                                : 'No articles available for the selected filters. Try changing your filters.'}
                        </p>
                    </div>
                    {searchQuery.trim() && (
                        <Button onClick={() => setSearchQuery('')} variant="outline">
                            Clear Search
                        </Button>
                    )}
                </div>
            )}
        </div>
    )
}
