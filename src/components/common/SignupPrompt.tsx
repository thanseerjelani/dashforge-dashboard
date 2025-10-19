// src/components/common/SignupPrompt.tsx
import { useNavigate } from 'react-router-dom'
import { Sparkles, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface SignupPromptProps {
    title?: string
    description?: string
    primaryAction?: string
    secondaryAction?: string
}

export const SignupPrompt = ({
    title = "Ready to do more?",
    description = "Create todos, manage events, and organize your entire life in one place.",
    primaryAction = "Get Started Free",
    secondaryAction = "Sign In"
}: SignupPromptProps) => {
    const navigate = useNavigate()

    return (
        <Card className="mt-8 bg-gradient-to-br from-primary/10 via-primary/5 to-sky-500/10 border-primary/20">
            <CardContent className="p-8 text-center space-y-6">
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-sky-700 mb-2">
                    <Sparkles className="w-8 h-8 text-white" />
                </div>

                {/* Content */}
                <div className="space-y-2">
                    <h3 className="text-2xl font-bold">{title}</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                        {description}
                    </p>
                </div>

                {/* Features List */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-4 max-w-2xl mx-auto">
                    <div className="flex items-center gap-2 justify-center text-sm">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                        <span>Unlimited Todos</span>
                    </div>
                    <div className="flex items-center gap-2 justify-center text-sm">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                        <span>Calendar Events</span>
                    </div>
                    <div className="flex items-center gap-2 justify-center text-sm">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                        <span>Personal Profile</span>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                    <Button
                        size="lg"
                        onClick={() => navigate('/register')}
                        className="gap-2 min-w-[180px]"
                    >
                        {primaryAction}
                        <ArrowRight className="h-4 w-4" />
                    </Button>
                    <Button
                        size="lg"
                        variant="outline"
                        onClick={() => navigate('/login')}
                        className="min-w-[180px]"
                    >
                        {secondaryAction}
                    </Button>
                </div>

                {/* Trust Badge */}
                <p className="text-xs text-muted-foreground pt-4 border-t">
                    🔒 Free forever • No credit card required • Join 1000+ users
                </p>
            </CardContent>
        </Card>
    )
}