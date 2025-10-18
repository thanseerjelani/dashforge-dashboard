// src/components/profile/EditProfileModal.tsx
import { useState, useEffect } from 'react'
import { X, User, Mail, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuthStore } from '@/store/authStore'
import { UpdateProfileFormData } from '@/types/auth'
import { toast } from 'sonner'

interface EditProfileModalProps {
    isOpen: boolean
    onClose: () => void
}

export const EditProfileModal = ({ isOpen, onClose }: EditProfileModalProps) => {
    const { user, updateProfile, isLoading } = useAuthStore()
    const [formData, setFormData] = useState<UpdateProfileFormData>({
        name: '',
        email: '',
    })
    const [validationErrors, setValidationErrors] = useState<Partial<UpdateProfileFormData>>({})

    // Initialize form with current user data
    useEffect(() => {
        if (user && isOpen) {
            setFormData({
                name: user.name,
                email: user.email,
            })
            setValidationErrors({})
        }
    }, [user, isOpen])

    const validateForm = (): boolean => {
        const errors: Partial<UpdateProfileFormData> = {}

        // Name validation
        if (!formData.name.trim()) {
            errors.name = 'Name is required'
        } else if (formData.name.trim().length < 2) {
            errors.name = 'Name must be at least 2 characters'
        } else if (formData.name.trim().length > 50) {
            errors.name = 'Name must not exceed 50 characters'
        }

        // Email validation
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

        // Check if anything changed
        if (formData.name === user?.name && formData.email === user?.email) {
            toast.info('No changes detected')
            return
        }

        try {
            const result = await updateProfile(formData)

            if (result.emailChanged) {
                toast.success('✨ Email updated! You\'re still logged in with new credentials.')
            } else {
                toast.success('Profile updated successfully!')
            }

            onClose()
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update profile')
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))

        // Clear validation error for this field
        if (validationErrors[name as keyof UpdateProfileFormData]) {
            setValidationErrors(prev => ({ ...prev, [name]: undefined }))
        }
    }

    const handleClose = () => {
        if (!isLoading) {
            onClose()
        }
    }

    if (!isOpen) return null

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
                onClick={handleClose}
            />

            {/* Modal */}
            <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg">
                <div className="bg-background rounded-lg shadow-xl border">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b">
                        <div>
                            <h2 className="text-2xl font-bold">Edit Profile</h2>
                            <p className="text-sm text-muted-foreground mt-1">
                                Update your account information
                            </p>
                        </div>
                        <button
                            onClick={handleClose}
                            disabled={isLoading}
                            className="rounded-full p-2 hover:bg-muted transition-colors disabled:opacity-50"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* Name Field */}
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="pl-10"
                                    disabled={isLoading}
                                />
                            </div>
                            {validationErrors.name && (
                                <p className="text-sm text-red-500">{validationErrors.name}</p>
                            )}
                        </div>

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
                                />
                            </div>
                            {validationErrors.email && (
                                <p className="text-sm text-red-500">{validationErrors.email}</p>
                            )}
                            {formData.email !== user?.email && (
                                <p className="text-sm text-blue-600 dark:text-blue-400 flex items-center gap-2">
                                    <span className="inline-block h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-400" />
                                    Changing email will generate new security tokens automatically
                                </p>
                            )}
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleClose}
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
                                {!isLoading && <Save className="mr-2 h-4 w-4" />}
                                {isLoading ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}