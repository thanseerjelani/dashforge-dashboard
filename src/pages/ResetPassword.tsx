// src/pages/ResetPassword.tsx
import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuthStore } from '@/store/authStore'
import { ResetPasswordFormData } from '@/types/auth'
import { toast } from 'sonner'

const ResetPassword = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { resetPassword, isLoading } = useAuthStore()

    const email = location.state?.email
    const otp = location.state?.otp

    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [formData, setFormData] = useState<ResetPasswordFormData>({
        newPassword: '',
        confirmNewPassword: '',
    })
    const [validationErrors, setValidationErrors] = useState<Partial<ResetPasswordFormData>>({})

    // Redirect if no email or OTP
    useEffect(() => {
        if (!email || !otp) {
            toast.error('Invalid reset session. Please start over.')
            navigate('/forgot-password')
        }
    }, [email, otp, navigate])

    const validateForm = (): boolean => {
        const errors: Partial<ResetPasswordFormData> = {}

        // New password validation
        if (!formData.newPassword) {
            errors.newPassword = 'Password is required'
        } else if (formData.newPassword.length < 8) {
            errors.newPassword = 'Password must be at least 8 characters'
        } else if (formData.newPassword.length > 50) {
            errors.newPassword = 'Password must not exceed 50 characters'
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.newPassword)) {
            errors.newPassword = 'Password must contain uppercase, lowercase, and number'
        }

        // Confirm password validation
        if (!formData.confirmNewPassword) {
            errors.confirmNewPassword = 'Please confirm your password'
        } else if (formData.newPassword !== formData.confirmNewPassword) {
            errors.confirmNewPassword = 'Passwords do not match'
        }

        setValidationErrors(errors)
        return Object.keys(errors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) return

        try {
            await resetPassword({
                email,
                otp,
                newPassword: formData.newPassword,
                confirmNewPassword: formData.confirmNewPassword,
            })

            toast.success('Password reset successful! 🎉')

            // Navigate to login after 1.5 seconds
            setTimeout(() => {
                navigate('/login', {
                    state: {
                        message: 'Password reset successfully. Please login with your new password.'
                    }
                })
            }, 1500)
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to reset password')
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))

        if (validationErrors[name as keyof ResetPasswordFormData]) {
            setValidationErrors(prev => ({ ...prev, [name]: undefined }))
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-sky-500/5 p-4">
            <div className="w-full max-w-md">
                {/* Logo/Brand */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-sky-700 mb-4">
                        <Lock className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold">Create New Password</h1>
                    <p className="text-muted-foreground mt-2">
                        Choose a strong password for your account
                    </p>
                </div>

                {/* Form Card */}
                <Card className="shadow-xl border-primary/10">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
                        <CardDescription>
                            Enter your new password below
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* New Password */}
                            <div className="space-y-2">
                                <Label htmlFor="newPassword">New Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="newPassword"
                                        name="newPassword"
                                        type={showNewPassword ? 'text' : 'password'}
                                        placeholder="Create a strong password"
                                        value={formData.newPassword}
                                        onChange={handleChange}
                                        className="pl-10 pr-10"
                                        disabled={isLoading}
                                        autoFocus
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                        disabled={isLoading}
                                    >
                                        {showNewPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                                {validationErrors.newPassword && (
                                    <p className="text-sm text-red-500">{validationErrors.newPassword}</p>
                                )}
                                <p className="text-xs text-muted-foreground">
                                    Must be at least 8 characters with uppercase, lowercase, and number
                                </p>
                            </div>

                            {/* Confirm New Password */}
                            <div className="space-y-2">
                                <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="confirmNewPassword"
                                        name="confirmNewPassword"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        placeholder="Confirm your password"
                                        value={formData.confirmNewPassword}
                                        onChange={handleChange}
                                        className="pl-10 pr-10"
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                        disabled={isLoading}
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                                {validationErrors.confirmNewPassword && (
                                    <p className="text-sm text-red-500">{validationErrors.confirmNewPassword}</p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                className="w-full"
                                size="lg"
                                disabled={isLoading}
                            >
                                {!isLoading && <CheckCircle2 className="mr-2 h-4 w-4" />}
                                {isLoading ? 'Resetting Password...' : 'Reset Password'}
                            </Button>

                            {/* Info Box */}
                            <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
                                <p className="text-sm text-green-600 dark:text-green-400">
                                    ✅ After resetting, you'll be able to login with your new password
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

export default ResetPassword