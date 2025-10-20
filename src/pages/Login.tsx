// src/pages/Login.tsx
import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { LoginForm } from '@/components/auth/LoginForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuthStore } from '@/store/authStore'
import { getRedirectPath } from '@/utils/navigationHelpers'

const Login = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { isAuthenticated } = useAuthStore()

    // Get the redirect path from location state or default to /app/dashboard
    const from = getRedirectPath(location)


    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate(from, { replace: true })
        }
    }, [isAuthenticated, navigate, from])

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-sky-500/5 p-4">
            <div className="w-full max-w-md">
                {/* Logo/Brand */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-sky-700 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-white/20" />
                    </div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-sky-700 bg-clip-text text-transparent">
                        DashForge
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Welcome back! Please sign in to continue
                    </p>
                </div>

                {/* Login Card */}
                <Card className="shadow-xl border-primary/10">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
                        <CardDescription>
                            Enter your credentials to access your dashboard
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <LoginForm />
                    </CardContent>
                </Card>

                {/* Footer */}
                <p className="text-center text-sm text-muted-foreground mt-6">
                    By signing in, you agree to our{' '}
                    <a href="#" className="text-primary hover:underline">
                        Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="#" className="text-primary hover:underline">
                        Privacy Policy
                    </a>
                </p>
            </div>
        </div>
    )
}

export default Login