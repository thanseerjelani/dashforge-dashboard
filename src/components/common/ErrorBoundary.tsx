// src/components/common/ErrorBoundary.tsx
import { Component, ErrorInfo, ReactNode } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface Props {
    children: ReactNode
}

interface State {
    hasError: boolean
    error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    }

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error }
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo)
    }

    private handleReset = () => {
        this.setState({ hasError: false, error: null })
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="flex items-center justify-center min-h-[400px] p-4">
                    <Card className="w-full max-w-md">
                        <CardHeader className="text-center">
                            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                                <AlertTriangle className="h-6 w-6 text-red-600" />
                            </div>
                            <CardTitle>Something went wrong</CardTitle>
                            <CardDescription>
                                We're sorry, but something unexpected happened. Please try refreshing the page.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="text-center space-y-4">
                            {process.env.NODE_ENV === 'development' && this.state.error && (
                                <div className="text-left">
                                    <p className="text-sm text-muted-foreground mb-2">Error details:</p>
                                    <code className="text-xs bg-muted p-2 rounded block overflow-auto">
                                        {this.state.error.message}
                                    </code>
                                </div>
                            )}
                            <Button onClick={this.handleReset} className="w-full">
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Try Again
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            )
        }

        return this.props.children
    }
}
