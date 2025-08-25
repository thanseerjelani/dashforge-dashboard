import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
    Cloud,
    Newspaper,
    CheckSquare,
    RefreshCw
} from 'lucide-react'
import { cn } from '@/utils/cn'

interface QuickActionsProps {
    refreshing: boolean
    onRefreshAll: () => void
    onNavigate: (path: string) => void
}

const QuickActions: React.FC<QuickActionsProps> = ({
    refreshing,
    onRefreshAll,
    onNavigate
}) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="grid gap-3">
                    <Button
                        variant="ghost"
                        className="flex items-center gap-3 p-3 h-auto text-left justify-start hover:bg-accent"
                        onClick={() => onNavigate('/todos')}
                    >
                        <CheckSquare className="h-4 w-4 text-blue-600" />
                        <div>
                            <p className="text-sm font-medium">Add Task</p>
                            <p className="text-xs text-muted-foreground">Create a new todo item</p>
                        </div>
                    </Button>

                    <Button
                        variant="ghost"
                        className="flex items-center gap-3 p-3 h-auto text-left justify-start hover:bg-accent"
                        onClick={() => onNavigate('/weather')}
                    >
                        <Cloud className="h-4 w-4 text-purple-600" />
                        <div>
                            <p className="text-sm font-medium">Check Weather</p>
                            <p className="text-xs text-muted-foreground">View current conditions</p>
                        </div>
                    </Button>

                    <Button
                        variant="ghost"
                        className="flex items-center gap-3 p-3 h-auto text-left justify-start hover:bg-accent"
                        onClick={() => onNavigate('/news')}
                    >
                        <Newspaper className="h-4 w-4 text-green-600" />
                        <div>
                            <p className="text-sm font-medium">Read News</p>
                            <p className="text-xs text-muted-foreground">Latest headlines</p>
                        </div>
                    </Button>

                    <Button
                        variant="ghost"
                        className="flex items-center gap-3 p-3 h-auto text-left justify-start hover:bg-accent"
                        onClick={onRefreshAll}
                        disabled={refreshing}
                    >
                        <RefreshCw className={cn("h-4 w-4 text-orange-600", refreshing && "animate-spin")} />
                        <div>
                            <p className="text-sm font-medium">Refresh Data</p>
                            <p className="text-xs text-muted-foreground">Update all modules</p>
                        </div>
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

export default QuickActions
