// src/pages/News.tsx (UPDATE - Replace your existing News.tsx with this)
import { useState } from 'react'
import { X, ExternalLink, Clock, User, Search, RefreshCw, AlertCircle, TrendingUp, Filter, Newspaper } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loading } from '@/components/common/Loading'
import { useTopHeadlines, useNewsSearch } from '@/hooks/useNews'
import { NewsArticle, NewsCategory } from '@/types/news'
import { formatTimeAgo, formatDate, truncateText } from '@/utils/helpers'

const News = () => {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState<NewsCategory | 'all'>('all')
    const [selectedCountry, setSelectedCountry] = useState('us')
    const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null)
    const [isFiltersExpanded, setIsFiltersExpanded] = useState(false)

    // Categories for filtering
    const categories: Array<{ value: NewsCategory | 'all'; label: string }> = [
        { value: 'all', label: 'All' },
        { value: 'general', label: 'General' },
        { value: 'business', label: 'Business' },
        { value: 'technology', label: 'Technology' },
        { value: 'science', label: 'Science' },
        { value: 'health', label: 'Health' },
        { value: 'sports', label: 'Sports' },
        { value: 'entertainment', label: 'Entertainment' },
    ]

    // Countries for filtering
    const countries = [
        { value: 'us', label: '🇺🇸 US' },
        { value: 'gb', label: '🇬🇧 UK' },
        { value: 'ca', label: '🇨🇦 Canada' },
        { value: 'in', label: '🇮🇳 India' },
        { value: 'au', label: '🇦🇺 Australia' },
    ]

    const trendingTopics = [
        'AI Technology',
        'Climate Change',
        'Cryptocurrency',
        'Space Exploration',
        'Healthcare',
        'Electric Vehicles'
    ]

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

    const handleSearch = (query: string) => {
        setSearchQuery(query)
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            // Search is already handled by the query hook
        }
    }

    const clearSearch = () => {
        setSearchQuery('')
    }

    const clearFilters = () => {
        setSelectedCategory('all')
        setSelectedCountry('us')
    }

    const activeFiltersCount = (selectedCategory !== 'all' ? 1 : 0) + (selectedCountry !== 'us' ? 1 : 0)

    const closeModal = () => {
        setSelectedArticle(null)
    }

    const openExternalLink = () => {
        if (selectedArticle) {
            window.open(selectedArticle.url, '_blank', 'noopener,noreferrer')
        }
    }

    // Error State
    if (error) {
        return (
            <div className="space-y-6">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Latest News</h1>
                    <p className="text-muted-foreground">
                        Stay updated with the latest headlines and breaking news
                    </p>
                </div>

                <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4 text-center">
                    <AlertCircle className="h-12 w-12 text-muted-foreground" />
                    <div>
                        <h3 className="text-lg font-semibold">Failed to load news</h3>
                        <p className="text-sm text-muted-foreground">
                            {error.message || 'Something went wrong while fetching news articles.'}
                        </p>
                    </div>
                    <Button onClick={() => refetch()} className="gap-2">
                        <RefreshCw className="h-4 w-4" />
                        Try Again
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Latest News</h1>
                    <p className="text-muted-foreground text-xs md:text-lg">
                        Stay updated with the latest headlines and breaking news
                    </p>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => refetch()}
                    disabled={isLoading}
                    className="gap-2"
                >
                    <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                    Refresh
                </Button>
            </div>

            {/* Search and Filters */}
            <div className="space-y-4">
                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search news articles..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="pl-10 pr-10"
                        disabled={isLoading}
                    />
                    {searchQuery && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={clearSearch}
                            className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
                        >
                            <X className="h-3 w-3" />
                        </Button>
                    )}
                </div>

                {/* Trending Topics (when not searching) */}
                {!searchQuery && (
                    <div>
                        <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
                            <TrendingUp className="h-4 w-4" />
                            <span>Trending Topics</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {trendingTopics.map((topic) => (
                                <Badge
                                    key={topic}
                                    variant="secondary"
                                    className="cursor-pointer transition-colors hover:bg-primary hover:text-primary-foreground"
                                    onClick={() => handleSearch(topic)}
                                >
                                    {topic}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}

                {/* Filters (only show for headlines, not search) */}
                {!searchQuery.trim() && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
                                    className="gap-2"
                                >
                                    <Filter className="h-4 w-4" />
                                    Filters
                                    {activeFiltersCount > 0 && (
                                        <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
                                            {activeFiltersCount}
                                        </Badge>
                                    )}
                                </Button>

                                {activeFiltersCount > 0 && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={clearFilters}
                                        className="gap-1 text-muted-foreground hover:text-foreground"
                                    >
                                        <X className="h-3 w-3" />
                                        Clear
                                    </Button>
                                )}
                            </div>
                        </div>

                        {isFiltersExpanded && (
                            <Card className="p-4 space-y-4">
                                {/* Categories */}
                                <div>
                                    <h4 className="mb-3 text-sm font-medium">Categories</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {categories.map((category) => (
                                            <Button
                                                key={category.value}
                                                variant={selectedCategory === category.value ? 'default' : 'outline'}
                                                size="sm"
                                                onClick={() => setSelectedCategory(category.value)}
                                                className="h-8"
                                            >
                                                {category.label}
                                            </Button>
                                        ))}
                                    </div>
                                </div>

                                {/* Countries */}
                                <div>
                                    <h4 className="mb-3 text-sm font-medium">Country</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {countries.map((country) => (
                                            <Button
                                                key={country.value}
                                                variant={selectedCountry === country.value ? 'default' : 'outline'}
                                                size="sm"
                                                onClick={() => setSelectedCountry(country.value)}
                                                className="h-8"
                                            >
                                                {country.label}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            </Card>
                        )}
                    </div>
                )}
            </div>

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
                <Loading variant="grid" count={6} />
            )}

            {/* News Grid */}
            {articles && articles.length > 0 && (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {articles.map((article, index) => (
                        <Card
                            key={article.id}
                            className="group cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 animate-fade-in"
                            style={{ animationDelay: `${index * 0.1}s` }}
                            onClick={() => setSelectedArticle(article)}
                        >
                            {/* Image */}
                            {article.urlToImage && (
                                <div className="relative overflow-hidden rounded-t-lg">
                                    <img
                                        src={article.urlToImage}
                                        alt={article.title}
                                        className="h-48 w-full object-cover transition-transform duration-200 group-hover:scale-105"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement
                                            target.style.display = 'none'
                                        }}
                                    />
                                    <div className="absolute top-3 left-3">
                                        <Badge variant="secondary" className="bg-white/90 text-slate-900 backdrop-blur-sm">
                                            {article.category}
                                        </Badge>
                                    </div>
                                    <div className="absolute top-3 right-3">
                                        <Button
                                            size="icon"
                                            variant="secondary"
                                            className="h-8 w-8 bg-white/90 backdrop-blur-sm hover:bg-white"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                window.open(article.url, '_blank', 'noopener,noreferrer')
                                            }}
                                        >
                                            <ExternalLink className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            )}

                            <CardHeader className={article.urlToImage ? '' : 'pt-6'}>
                                {!article.urlToImage && (
                                    <div className="flex items-center justify-between mb-2">
                                        <Badge variant="secondary">{article.category}</Badge>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                window.open(article.url, '_blank', 'noopener,noreferrer')
                                            }}
                                        >
                                            <ExternalLink className="h-4 w-4" />
                                        </Button>
                                    </div>
                                )}
                                <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                                    {article.title}
                                </CardTitle>
                                <CardDescription className="line-clamp-3">
                                    {truncateText(article.description, 150)}
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <User className="h-3 w-3" />
                                        {article.author || 'Unknown'}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {formatTimeAgo(article.publishedAt)}
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-primary">{article.source.name}</span>
                                    <Button size="sm" variant="ghost" className="text-primary hover:bg-primary/10">
                                        Read More
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
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

            {/* Article Modal */}
            {selectedArticle && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
                    <Card className="w-full max-w-4xl max-h-[90vh] overflow-auto">
                        <CardHeader className="sticky top-0 bg-card/95 backdrop-blur-sm border-b">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="secondary">{selectedArticle.category}</Badge>
                                        <span className="text-sm text-muted-foreground">
                                            {selectedArticle.source.name}
                                        </span>
                                    </div>
                                    <CardTitle className="text-xl leading-tight">
                                        {selectedArticle.title}
                                    </CardTitle>
                                </div>
                                <Button variant="ghost" size="icon" onClick={closeModal}>
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>
                        </CardHeader>

                        <CardContent className="p-6 space-y-4">
                            {selectedArticle.urlToImage && (
                                <img
                                    src={selectedArticle.urlToImage}
                                    alt={selectedArticle.title}
                                    className="w-full h-64 object-cover rounded-lg"
                                />
                            )}

                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                    <User className="h-4 w-4" />
                                    <span>{selectedArticle.author || 'Unknown Author'}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    <span>{formatDate(selectedArticle.publishedAt)}</span>
                                </div>
                            </div>

                            <div className="prose prose-sm max-w-none dark:prose-invert">
                                <p className="text-lg text-muted-foreground leading-relaxed">
                                    {selectedArticle.description}
                                </p>

                                {selectedArticle.content && selectedArticle.content !== selectedArticle.description && (
                                    <div className="mt-4 space-y-4">
                                        <p>{selectedArticle.content.replace(/\[\+\d+ chars\]$/, '')}</p>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t">
                                <p className="text-sm text-muted-foreground">
                                    Want to read the full article?
                                </p>
                                <Button onClick={openExternalLink} className="gap-2">
                                    <ExternalLink className="h-4 w-4" />
                                    Read Full Article
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    )
}

export default News