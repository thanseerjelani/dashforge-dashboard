// src/components/news/NewsCard.tsx
import { ExternalLink, Clock, User, Eye } from 'lucide-react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { NewsArticle } from '@/types/news'
import { formatTimeAgo, truncateText } from '@/utils/helpers'

interface NewsCardProps {
    article: NewsArticle
    onReadMore: (article: NewsArticle) => void
}

export const NewsCard = ({ article, onReadMore }: NewsCardProps) => {
    const handleExternalLink = (e: React.MouseEvent) => {
        e.stopPropagation()
        window.open(article.url, '_blank', 'noopener,noreferrer')
    }

    return (
        <Card className="group h-full cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
            <div className="relative">
                {article.urlToImage ? (
                    <img
                        src={article.urlToImage}
                        alt={article.title}
                        className="h-48 w-full rounded-t-xl object-cover transition-transform duration-200 group-hover:scale-105"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.style.display = 'none'
                            target.nextElementSibling?.classList.remove('hidden')
                        }}
                    />
                ) : null}
                <div className={`${article.urlToImage ? 'hidden' : 'flex'} h-48 items-center justify-center rounded-t-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900`}>
                    <div className="text-center">
                        <Eye className="mx-auto h-12 w-12 text-slate-400" />
                        <p className="mt-2 text-sm text-slate-500">No image available</p>
                    </div>
                </div>

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
                        onClick={handleExternalLink}
                    >
                        <ExternalLink className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <CardContent className="p-4">
                <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="font-medium text-primary">{article.source.name}</span>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{formatTimeAgo(article.publishedAt)}</span>
                    </div>
                </div>

                <h3 className="mb-2 font-semibold leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                    {article.title}
                </h3>

                <p className="text-sm text-muted-foreground line-clamp-3">
                    {truncateText(article.description, 150)}
                </p>
            </CardContent>

            <CardFooter className="p-4 pt-0 flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <User className="h-3 w-3" />
                    <span>{article.author || 'Unknown'}</span>
                </div>

                <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onReadMore(article)}
                    className="text-primary hover:bg-primary/10"
                >
                    Read More
                </Button>
            </CardFooter>
        </Card>
    )
}
