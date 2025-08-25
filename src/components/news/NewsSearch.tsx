// src/components/news/NewsSearch.tsx
import { useState } from 'react'
import { Search, X, TrendingUp } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface NewsSearchProps {
    onSearch: (query: string) => void
    isSearching: boolean
}

const trendingTopics = [
    'AI Technology',
    'Climate Change',
    'Cryptocurrency',
    'Space Exploration',
    'Healthcare',
    'Electric Vehicles'
]

export const NewsSearch = ({ onSearch, isSearching }: NewsSearchProps) => {
    const [query, setQuery] = useState('')

    const handleSearch = (searchQuery: string) => {
        setQuery(searchQuery)
        onSearch(searchQuery)
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            onSearch(query)
        }
    }

    const clearSearch = () => {
        setQuery('')
        onSearch('')
    }

    return (
        <div className="space-y-4">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    placeholder="Search news articles..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="pl-10 pr-10"
                    disabled={isSearching}
                />
                {query && (
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

            {!query && (
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
        </div>
    )
}
