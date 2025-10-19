// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import { Layout } from '@/components/layout/Layout'
import { PublicLayout } from '@/components/layout/PublicLayout'
import { ProtectedRoute } from '@/components/common/ProtectedRoute'
import Dashboard from '@/pages/Dashboard'
import Weather from '@/pages/Weather'
import News from '@/pages/News'
import Todo from '@/pages/Todo'
import Analytics from '@/pages/Analytics'
import Calendar from '@/pages/Calendar'
import Profile from '@/pages/Profile'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import ForgotPassword from '@/pages/ForgotPassword'
import VerifyOtp from '@/pages/VerifyOtp'
import ResetPassword from '@/pages/ResetPassword'
import ChangePassword from '@/pages/ChangePassword'
import { useTheme } from '@/hooks/useTheme'
import { useEffect } from 'react'

function App() {
  const { isDark } = useTheme()

  useEffect(() => {
    // Apply theme class to document
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDark])

  return (
    <Router>
      <div className="min-h-screen bg-background text-foreground">
        {/* Toast Notifications */}
        <Toaster
          position="top-right"
          expand={false}
          richColors
          closeButton
        />

        <Routes>
          {/* ===== PUBLIC ROUTES (No Authentication Required) ===== */}
          <Route element={<PublicLayout />}>
            <Route index element={<Dashboard />} /> {/* Landing page */}
            <Route path="/weather" element={<Weather />} />
            <Route path="/news" element={<News />} />
          </Route>

          {/* ===== AUTH ROUTES ===== */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* ===== PROTECTED ROUTES (Authentication Required) ===== */}
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/app/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="weather" element={<Weather />} />
            <Route path="news" element={<News />} />
            <Route path="todos" element={<Todo />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="profile" element={<Profile />} />
            <Route path="change-password" element={<ChangePassword />} />
            <Route path="settings" element={<ComingSoon title="Settings" />} />
          </Route>

          {/* ===== FALLBACK ===== */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  )
}

// Coming Soon Component for placeholder pages
const ComingSoon = ({ title }: { title: string }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
      <div className="text-6xl mb-4">🚧</div>
      <h1 className="text-3xl font-bold">{title} Coming Soon</h1>
      <p className="text-muted-foreground max-w-md">
        This feature is currently under development. Check back soon for updates!
      </p>
      <div className="flex items-center gap-2 mt-8">
        <div className="h-2 w-2 bg-primary rounded-full animate-bounce"></div>
        <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
    </div>
  )
}

export default App