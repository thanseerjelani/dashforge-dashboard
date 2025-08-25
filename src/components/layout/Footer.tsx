// src/components/layout/Footer.tsx
export const Footer = () => {
    return (
        <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container px-4 py-6">
                <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                    <div className="flex items-center gap-2">
                        <div className="rounded bg-primary/10 p-1">
                            <div className="h-4 w-4 rounded bg-gradient-to-br from-primary to-sky-700" />
                        </div>
                        <span className="text-sm font-medium">Personal Dashboard</span>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Built with React, TypeScript & Tailwind CSS</span>
                        <span>•</span>
                        <span>© 2025 thanseerjelani</span>
                    </div>

                    <div className="text-sm text-muted-foreground">
                        Version 1.0.0
                    </div>
                </div>
            </div>
        </footer>
    )
}

