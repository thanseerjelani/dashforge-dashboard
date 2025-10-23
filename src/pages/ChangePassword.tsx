// src/pages/ChangePassword.tsx
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Lock, Eye, EyeOff, ArrowLeft, Shield } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuthStore } from '@/store/authStore'
import { ChangePasswordFormData } from '@/types/auth'
import { toast } from 'sonner'

const ChangePassword = () => {
    const navigate = useNavigate()
    const { changePassword, isLoading } = useAuthStore()
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [formData, setFormData] = useState<ChangePasswordFormData>({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
    })
    const [validationErrors, setValidationErrors] = useState<Partial<ChangePasswordFormData>>({})

    const validateForm = (): boolean => {
        const errors: Partial<ChangePasswordFormData> = {}

        // Current password validation
        if (!formData.currentPassword) {
            errors.currentPassword = 'Current password is required'
        }

        // New password validation
        if (!formData.newPassword) {
            errors.newPassword = 'New password is required'
        } else if (formData.newPassword.length < 8) {
            errors.newPassword = 'Password must be at least 8 characters'
        } else if (formData.newPassword.length > 50) {
            errors.newPassword = 'Password must not exceed 50 characters'
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.newPassword)) {
            errors.newPassword = 'Password must contain uppercase, lowercase, and number'
        }

        // Check if new password is same as current
        if (formData.newPassword && formData.currentPassword && formData.newPassword === formData.currentPassword) {
            errors.newPassword = 'New password must be different from current password'
        }

        // Confirm password validation
        if (!formData.confirmNewPassword) {
            errors.confirmNewPassword = 'Please confirm your new password'
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
            await changePassword(formData)

            toast.success('Password changed successfully! 🎉')

            // Clear form
            setFormData({
                currentPassword: '',
                newPassword: '',
                confirmNewPassword: '',
            })

            // Navigate back to profile after 1 second
            setTimeout(() => {
                navigate('/app/profile')
            }, 1000)
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to change password')
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))

        // Clear validation error for this field
        if (validationErrors[name as keyof ChangePasswordFormData]) {
            setValidationErrors(prev => ({ ...prev, [name]: undefined }))
        }
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Back Button */}
            <Link
                to="/app/profile"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to Profile
            </Link>

            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold flex items-center gap-3">
                    <Shield className="h-8 w-8 text-primary" />
                    Change Password
                </h1>
                <p className="text-muted-foreground mt-1">
                    Update your password to keep your account secure
                </p>
            </div>

            {/* Form Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>
                        Choose a strong password to protect your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Current Password */}
                        <div className="space-y-2">
                            <Label htmlFor="currentPassword">Current Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="currentPassword"
                                    name="currentPassword"
                                    type={showCurrentPassword ? 'text' : 'password'}
                                    placeholder="Enter current password"
                                    value={formData.currentPassword}
                                    onChange={handleChange}
                                    className="pl-10 pr-10"
                                    disabled={isLoading}
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    disabled={isLoading}
                                >
                                    {showCurrentPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                            {validationErrors.currentPassword && (
                                <p className="text-sm text-red-500">{validationErrors.currentPassword}</p>
                            )}
                        </div>

                        <div className="h-px bg-border" />

                        {/* New Password */}
                        <div className="space-y-2">
                            <Label htmlFor="newPassword">New Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="newPassword"
                                    name="newPassword"
                                    type={showNewPassword ? 'text' : 'password'}
                                    placeholder="Enter new password"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    className="pl-10 pr-10"
                                    disabled={isLoading}
                                    autoComplete="new-password"
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
                                    placeholder="Confirm new password"
                                    value={formData.confirmNewPassword}
                                    onChange={handleChange}
                                    className="pl-10 pr-10"
                                    disabled={isLoading}
                                    autoComplete="new-password"
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
                        <div className="flex gap-3 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate('/profile')}
                                disabled={isLoading}
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="flex-1"
                            >
                                {!isLoading && <Shield className="mr-2 h-4 w-4" />}
                                {isLoading ? 'Changing Password...' : 'Change Password'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Security Tips */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Password Security Tips</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                            <span className="inline-block mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                            Use a unique password that you don't use anywhere else
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="inline-block mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                            Include a mix of uppercase, lowercase, numbers, and symbols
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="inline-block mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                            Avoid using personal information or common words
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="inline-block mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                            Consider using a password manager to generate and store passwords
                        </li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    )
}

export default ChangePassword