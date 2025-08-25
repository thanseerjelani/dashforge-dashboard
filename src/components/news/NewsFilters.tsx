// src/components/news/NewsFilters.tsx
import { useState } from 'react'
import { Filter, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { NewsCategory } from '@/types/news'

interface NewsFiltersProps {
    selectedCategory: NewsCategory | 'all'
    onCategoryChange: (category: NewsCategory | 'all') => void
    selectedCountry: string
    onCountryChange: (country: string) => void
}

const categories: Array<{ value: NewsCategory | 'all'; label: string; color: string }> = [
    { value: 'all', label: 'All News', color: 'default' },
    { value: 'general', label: 'General', color: 'secondary' },
    { value: 'business', label: 'Business', color: 'default' },
    { value: 'technology', label: 'Technology', color: 'default' },
    { value: 'science', label: 'Science', color: 'default' },
    { value: 'health', label: 'Health', color: 'default' },
    { value: 'sports', label: 'Sports', color: 'default' },
    { value: 'entertainment', label: 'Entertainment', color: 'default' },
]

const countries = [
    { value: 'us', label: '🇺🇸 United States' },
    { value: 'gb', label: '🇬🇧 United Kingdom' },
    { value: 'ca', label: '🇨🇦 Canada' },
    { value: 'au', label: '🇦🇺 Australia' },
    { value: 'in', label: '🇮🇳 India' },
    { value: 'de', label: '🇩🇪 Germany' },
    { value: 'fr', label: '🇫🇷 France' },
    { value: 'jp', label: '🇯🇵 Japan' },
]

export const NewsFilters = ({
    selectedCategory,
    onCategoryChange,
    selectedCountry,
    onCountryChange
}: NewsFiltersProps) => {
    const [isExpanded, setIsExpanded] = useState(false)

    const activeFiltersCount = (selectedCategory !== 'all' ? 1 : 0) + (selectedCountry !== 'us' ? 1 : 0)

    const clearFilters = () => {
        onCategoryChange('all')
        onCountryChange('us')
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsExpanded(!isExpanded)}
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

            {isExpanded && (
                <div className="space-y-4 rounded-lg border bg-card p-4">
                    {/* Categories */}
                    <div>
                        <h4 className="mb-3 text-sm font-medium">Categories</h4>
                        <div className="flex flex-wrap gap-2">
                            {categories.map((category) => (
                                <Button
                                    key={category.value}
                                    variant={selectedCategory === category.value ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => onCategoryChange(category.value)}
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
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                            {countries.map((country) => (
                                <Button
                                    key={country.value}
                                    variant={selectedCountry === country.value ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => onCountryChange(country.value)}
                                    className="h-8 justify-start text-xs"
                                >
                                    {country.label}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
