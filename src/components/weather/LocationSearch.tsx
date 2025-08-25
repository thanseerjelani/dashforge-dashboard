// src/components/weather/LocationSearch.tsx
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Search, MapPin, Loader2 } from 'lucide-react'

interface LocationSearchProps {
    onLocationChange: (location: string) => void
    onUseCurrentLocation: () => void
    currentLocation: string
    isLoadingLocation?: boolean
}

const LocationSearch = ({
    onLocationChange,
    onUseCurrentLocation,
    currentLocation,
    isLoadingLocation = false
}: LocationSearchProps) => {
    const [searchInput, setSearchInput] = useState('')

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (searchInput.trim()) {
            onLocationChange(searchInput.trim())
            setSearchInput('')
        }
    }

    const popularCities = [
        'Bangalore',
        'Delhi',
        'Mumbai',
        'Chennai',
        'Kolkata',
        'Pune',
        'Hyderabad',
        'Ahmedabad'
    ]

    return (
        <Card>
            <CardContent className="p-4 space-y-4">
                {/* Search Form */}
                <form onSubmit={handleSearch} className="flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Search for a city..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <Button type="submit" disabled={!searchInput.trim()}>
                        Search
                    </Button>
                </form>

                {/* Current Location Button */}
                <Button
                    variant="outline"
                    className="w-full"
                    onClick={onUseCurrentLocation}
                    disabled={isLoadingLocation}
                >
                    {isLoadingLocation ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                        <MapPin className="h-4 w-4 mr-2" />
                    )}
                    Use Current Location
                </Button>

                {/* Popular Cities */}
                <div>
                    <h4 className="text-sm font-medium mb-3">Popular Indian Cities</h4>
                    <div className="grid grid-cols-2 gap-2">
                        {popularCities.map((city) => (
                            <Button
                                key={city}
                                variant="ghost"
                                size="sm"
                                className={`justify-start h-8 ${currentLocation.toLowerCase().includes(city.toLowerCase())
                                    ? 'bg-primary/10 text-primary'
                                    : ''
                                    }`}
                                onClick={() => onLocationChange(city)}
                            >
                                {city}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Current Selection */}
                {currentLocation && (
                    <div className="pt-2 border-t">
                        <p className="text-sm text-muted-foreground">
                            Currently showing: <span className="font-medium">{currentLocation}</span>
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default LocationSearch
