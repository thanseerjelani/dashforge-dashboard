// src/components/calendar/QuickActions.tsx
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Plus,
    Calendar,
    Clock,
    Briefcase,
    Heart,
    Coffee,
    Zap
} from 'lucide-react'
import { useCalendar } from '@/hooks/useCalendar'
import { EventCategory, CreateEventData } from '@/types/calendar'

interface QuickActionsProps {
    onNewEvent: () => void
}

const QuickActions = ({ onNewEvent }: QuickActionsProps) => {
    const { addEvent } = useCalendar()

    const quickEventTemplates = [
        {
            icon: Briefcase,
            label: 'Work Meeting',
            category: 'work' as EventCategory,
            title: 'Team Meeting',
            duration: 60,
            color: '#3b82f6'
        },
        {
            icon: Heart,
            label: 'Health Check',
            category: 'health' as EventCategory,
            title: 'Health Appointment',
            duration: 30,
            color: '#ef4444'
        },
        {
            icon: Coffee,
            label: 'Social Time',
            category: 'social' as EventCategory,
            title: 'Coffee Break',
            duration: 30,
            color: '#f59e0b'
        },
        {
            icon: Zap,
            label: 'Personal Task',
            category: 'personal' as EventCategory,
            title: 'Personal Time',
            duration: 60,
            color: '#10b981'
        }
    ]

    const handleQuickEvent = (template: typeof quickEventTemplates[0]) => {
        const now = new Date()
        // Round to next hour
        const startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + 1, 0)
        const endTime = new Date(startTime.getTime() + template.duration * 60 * 1000)

        const eventData: CreateEventData = {
            title: template.title,
            startTime,
            endTime,
            category: template.category,
            priority: 'medium',
            color: template.color
        }

        addEvent(eventData)
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Quick Actions
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* New Event Button */}
                <Button
                    onClick={onNewEvent}
                    className="w-full gap-2"
                    size="lg"
                >
                    <Plus className="h-4 w-4" />
                    Create New Event
                </Button>

                {/* Quick Event Templates */}
                <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Quick Templates</p>
                    <div className="grid grid-cols-2 gap-2">
                        {quickEventTemplates.map((template) => (
                            <Button
                                key={template.label}
                                variant="outline"
                                size="sm"
                                className="flex flex-col gap-1 h-auto p-3 text-xs"
                                onClick={() => handleQuickEvent(template)}
                            >
                                <template.icon className="h-4 w-4" style={{ color: template.color }} />
                                <span>{template.label}</span>
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Quick Navigation */}
                <div className="space-y-2 pt-2 border-t">
                    <p className="text-sm font-medium text-muted-foreground">Quick Navigation</p>
                    <div className="grid grid-cols-2 gap-2">
                        <Button variant="ghost" size="sm" className="gap-2 text-xs">
                            <Calendar className="h-4 w-4" />
                            This Week
                        </Button>
                        <Button variant="ghost" size="sm" className="gap-2 text-xs">
                            <Clock className="h-4 w-4" />
                            Next Month
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default QuickActions