// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import Dashboard from '@/pages/Dashboard'
import Weather from '@/pages/Weather'
import News from '@/pages/News'
import Todo from '@/pages/Todo'
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
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="weather" element={<Weather />} />
            <Route path="news" element={<News />} />
            <Route path="todos" element={<Todo />} />
            {/* Placeholder routes for future pages */}
            <Route path="analytics" element={<ComingSoon title="Analytics" />} />
            <Route path="calendar" element={<ComingSoon title="Calendar" />} />
            <Route path="settings" element={<ComingSoon title="Settings" />} />
            <Route path="profile" element={<ComingSoon title="Profile" />} />
          </Route>
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