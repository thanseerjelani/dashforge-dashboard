// src/pages/ForgotPassword.tsx
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, ArrowLeft, Send } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuthStore } from '@/store/authStore'
import { ForgotPasswordFormData } from '@/types/auth'
import { toast } from 'sonner'

const ForgotPassword = () => {
    const navigate = useNavigate()
    const { forgotPassword, isLoading } = useAuthStore()
    const [formData, setFormData] = useState<ForgotPasswordFormData>({
        email: '',
    })
    const [validationErrors, setValidationErrors] = useState<Partial<ForgotPasswordFormData>>({})

    const validateForm = (): boolean => {
        const errors: Partial<ForgotPasswordFormData> = {}

        if (!formData.email) {
            errors.email = 'Email is required'
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Please enter a valid email'
        }

        setValidationErrors(errors)
        return Object.keys(errors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) return

        try {
            const result = await forgotPassword(formData)

            toast.success('OTP sent to your email! Check your inbox.')

            // Navigate to OTP verification page with email
            navigate('/verify-otp', {
                state: {
                    email: formData.email,
                    expiresIn: result.expiresIn
                }
            })
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to send OTP')
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))

        if (validationErrors[name as keyof ForgotPasswordFormData]) {
            setValidationErrors(prev => ({ ...prev, [name]: undefined }))
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-sky-500/5 p-4">
            <div className="w-full max-w-md">
                {/* Back to Login */}
                <Link
                    to="/login"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Login
                </Link>

                {/* Logo/Brand */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-sky-700 mb-4">
                        <Mail className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold">Forgot Password?</h1>
                    <p className="text-muted-foreground mt-2">
                        No worries! Enter your email and we'll send you a reset code
                    </p>
                </div>

                {/* Form Card */}
                <Card className="shadow-xl border-primary/10">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
                        <CardDescription>
                            We'll send a 6-digit OTP to your email
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Email Field */}
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="john@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="pl-10"
                                        disabled={isLoading}
                                        autoFocus
                                    />
                                </div>
                                {validationErrors.email && (
                                    <p className="text-sm text-red-500">{validationErrors.email}</p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                className="w-full"
                                size="lg"
                                disabled={isLoading}
                            >
                                {!isLoading && <Send className="mr-2 h-4 w-4" />}
                                {isLoading ? 'Sending OTP...' : 'Send OTP'}
                            </Button>

                            {/* Info Box */}
                            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
                                <p className="text-sm text-blue-600 dark:text-blue-400">
                                    💡 The OTP will be valid for 10 minutes
                                </p>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Footer */}
                <p className="text-center text-sm text-muted-foreground mt-6">
                    Remember your password?{' '}
                    <Link to="/login" className="text-primary hover:underline font-medium">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default ForgotPassword