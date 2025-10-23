// src/pages/Profile.tsx
import { useEffect, useState } from 'react'
import { User, Mail, Calendar, LogOut, Smartphone, Edit, Lock } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { todoApiService } from '@/services/todoApi'
import { calendarApiService } from '@/services/calendarApi'
import { TodoStats } from '@/types/todo'
import { CalendarStats } from '@/types/calendar'
import { EditProfileModal } from '@/components/profile/EditProfileModal'

const Profile = () => {
    const { user, logout, logoutAll, getProfile } = useAuth()
    const navigate = useNavigate()
    const [isLoggingOut, setIsLoggingOut] = useState(false)
    const [todoStats, setTodoStats] = useState<TodoStats | null>(null)
    const [eventStats, setEventStats] = useState<CalendarStats | null>(null)
    const [loadingStats, setLoadingStats] = useState(true)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)

    useEffect(() => {
        // Fetch latest profile data
        if (user) {
            getProfile()
            fetchStats()
        }
    }, [])

    const fetchStats = async () => {
        try {
            setLoadingStats(true)
            const [todoResponse, eventResponse] = await Promise.all([
                todoApiService.getTodoStats(),
                calendarApiService.getEventStats()
            ])
            setTodoStats(todoResponse.data.data)
            setEventStats(eventResponse.data.data)
        } catch (error) {
            console.error('Error fetching stats:', error)
        } finally {
            setLoadingStats(false)
        }
    }

    const handleLogout = async () => {
        setIsLoggingOut(true)
        await logout()
        navigate('/')  // Redirect to public dashboard
    }

    const handleLogoutAll = async () => {
        if (confirm('This will log you out from all devices. Continue?')) {
            setIsLoggingOut(true)
            await logoutAll()
            navigate('/')  // Redirect to public dashboard
        }
    }

    // Calculate completion rate
    const getCompletionRate = () => {
        if (!todoStats || todoStats.total === 0) return 0
        return Math.round((todoStats.completed / todoStats.total) * 100)
    }

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading profile...</p>
                </div>
            </div>
        )
    }

    return (
        <>
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold">Profile</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your account information and settings
                    </p>
                </div>

                {/* Profile Card */}
                <Card>
                    <CardHeader>
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-4">
                                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-sky-700 flex items-center justify-center text-white text-2xl font-bold">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <CardTitle className="text-2xl">{user.name}</CardTitle>
                                    <CardDescription className="text-base mt-1">
                                        @{user.username}
                                    </CardDescription>
                                </div>
                            </div>
                            {/* Edit Profile Button */}
                            <Button
                                variant="outline"
                                onClick={() => setIsEditModalOpen(true)}
                            >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Profile
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Account Information */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Account Information</h3>

                            <div className="grid gap-4">
                                {/* Full Name */}
                                <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30">
                                    <User className="h-5 w-5 text-muted-foreground" />
                                    <div className="flex-1">
                                        <p className="text-sm text-muted-foreground">Full Name</p>
                                        <p className="font-medium">{user.name}</p>
                                    </div>
                                </div>

                                {/* Username */}
                                <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30">
                                    <User className="h-5 w-5 text-muted-foreground" />
                                    <div className="flex-1">
                                        <p className="text-sm text-muted-foreground">Username</p>
                                        <p className="font-medium">{user.username}</p>
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30">
                                    <Mail className="h-5 w-5 text-muted-foreground" />
                                    <div className="flex-1">
                                        <p className="text-sm text-muted-foreground">Email Address</p>
                                        <p className="font-medium">{user.email}</p>
                                    </div>
                                </div>

                                {/* Member Since */}
                                <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30">
                                    <Calendar className="h-5 w-5 text-muted-foreground" />
                                    <div className="flex-1">
                                        <p className="text-sm text-muted-foreground">Member Since</p>
                                        <p className="font-medium">
                                            {new Date(user.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Security Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Security & Sessions</CardTitle>
                        <CardDescription>
                            Manage your account security and active sessions
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Change Password */}
                        <div className="flex items-center justify-between p-4 rounded-lg border">
                            <div className="flex items-center gap-3">
                                <Lock className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="font-medium">Change Password</p>
                                    <p className="text-sm text-muted-foreground">
                                        Update your password to keep your account secure
                                    </p>
                                </div>
                            </div>
                            <Button
                                variant="outline"
                                onClick={() => navigate('/app/change-password')}
                            >
                                Change
                            </Button>
                        </div>

                        {/* Logout Current Session */}
                        <div className="flex items-center justify-between p-4 rounded-lg border">
                            <div className="flex items-center gap-3">
                                <LogOut className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="font-medium">Sign Out</p>
                                    <p className="text-sm text-muted-foreground">
                                        Sign out from this device
                                    </p>
                                </div>
                            </div>
                            <Button
                                variant="outline"
                                onClick={handleLogout}
                                disabled={isLoggingOut}
                            >
                                Sign Out
                            </Button>
                        </div>

                        {/* Logout All Sessions */}
                        <div className="flex items-center justify-between p-4 rounded-lg border">
                            <div className="flex items-center gap-3">
                                <Smartphone className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="font-medium">Sign Out All Devices</p>
                                    <p className="text-sm text-muted-foreground">
                                        End all active sessions on all devices
                                    </p>
                                </div>
                            </div>
                            <Button
                                variant="destructive"
                                onClick={handleLogoutAll}
                                disabled={isLoggingOut}
                            >
                                Sign Out All
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Account Stats */}
                <Card>
                    <CardHeader>
                        <CardTitle>Account Statistics</CardTitle>
                        <CardDescription>
                            Your activity overview
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loadingStats ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {/* Total Todos */}
                                <div className="p-4 rounded-lg border bg-muted/30 text-center">
                                    <p className="text-2xl font-bold text-primary">
                                        {todoStats?.total || 0}
                                    </p>
                                    <p className="text-sm text-muted-foreground mt-1">Total Todos</p>
                                </div>

                                {/* Total Events */}
                                <div className="p-4 rounded-lg border bg-muted/30 text-center">
                                    <p className="text-2xl font-bold text-primary">
                                        {eventStats?.totalEvents || 0}
                                    </p>
                                    <p className="text-sm text-muted-foreground mt-1">Events</p>
                                </div>

                                {/* Days Active */}
                                <div className="p-4 rounded-lg border bg-muted/30 text-center">
                                    <p className="text-2xl font-bold text-primary">
                                        {Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))}
                                    </p>
                                    <p className="text-sm text-muted-foreground mt-1">Days Active</p>
                                </div>

                                {/* Completion Rate */}
                                <div className="p-4 rounded-lg border bg-muted/30 text-center">
                                    <p className="text-2xl font-bold text-primary">
                                        {getCompletionRate()}%
                                    </p>
                                    <p className="text-sm text-muted-foreground mt-1">Completion</p>
                                </div>
                            </div>
                        )}

                        {/* Additional Stats Row */}
                        {!loadingStats && (todoStats || eventStats) && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                {/* Completed Todos */}
                                <div className="p-4 rounded-lg border bg-green-50 dark:bg-green-950/30 text-center">
                                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                                        {todoStats?.completed || 0}
                                    </p>
                                    <p className="text-sm text-muted-foreground mt-1">Completed</p>
                                </div>

                                {/* Pending Todos */}
                                <div className="p-4 rounded-lg border bg-yellow-50 dark:bg-yellow-950/30 text-center">
                                    <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                                        {todoStats?.pending || 0}
                                    </p>
                                    <p className="text-sm text-muted-foreground mt-1">Pending</p>
                                </div>

                                {/* Upcoming Events */}
                                <div className="p-4 rounded-lg border bg-blue-50 dark:bg-blue-950/30 text-center">
                                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                        {eventStats?.upcomingEvents || 0}
                                    </p>
                                    <p className="text-sm text-muted-foreground mt-1">Upcoming</p>
                                </div>

                                {/* Overdue Items */}
                                <div className="p-4 rounded-lg border bg-red-50 dark:bg-red-950/30 text-center">
                                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                                        {(todoStats?.overdue || 0) + (eventStats?.overdueEvents || 0)}
                                    </p>
                                    <p className="text-sm text-muted-foreground mt-1">Overdue</p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Edit Profile Modal */}
            <EditProfileModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
            />
        </>
    )
}

export default Profile