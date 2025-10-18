// src/pages/VerifyOtp.tsx
import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { ShieldCheck, ArrowLeft, RotateCcw } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuthStore } from '@/store/authStore'
import { toast } from 'sonner'

const VerifyOtp = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { verifyOtp, forgotPassword, isLoading } = useAuthStore()

    const email = location.state?.email
    const initialExpiresIn = location.state?.expiresIn || 600 // 10 minutes default

    const [otp, setOtp] = useState(['', '', '', '', '', ''])
    const [timeLeft, setTimeLeft] = useState(initialExpiresIn)
    const [canResend, setCanResend] = useState(false)
    const inputRefs = useRef<(HTMLInputElement | null)[]>([])

    // Redirect if no email
    useEffect(() => {
        if (!email) {
            toast.error('Please enter your email first')
            navigate('/forgot-password')
        }
    }, [email, navigate])

    // Timer countdown
    useEffect(() => {
        if (timeLeft <= 0) {
            setCanResend(true)
            return
        }

        const timer = setInterval(() => {
            setTimeLeft((prev: number) => prev - 1)
        }, 1000)

        return () => clearInterval(timer)
    }, [timeLeft])

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    const handleChange = (index: number, value: string) => {
        // Only allow numbers
        if (value && !/^\d$/.test(value)) return

        const newOtp = [...otp]
        newOtp[index] = value
        setOtp(newOtp)

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus()
        }
    }

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        // Handle backspace
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus()
        }
    }

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault()
        const pastedData = e.clipboardData.getData('text').slice(0, 6)

        if (!/^\d+$/.test(pastedData)) return

        const newOtp = pastedData.split('')
        setOtp([...newOtp, ...Array(6 - newOtp.length).fill('')])

        // Focus last filled input
        const lastIndex = Math.min(pastedData.length, 5)
        inputRefs.current[lastIndex]?.focus()
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const otpCode = otp.join('')

        if (otpCode.length !== 6) {
            toast.error('Please enter all 6 digits')
            return
        }

        try {
            const isValid = await verifyOtp({ email, otp: otpCode })

            if (isValid) {
                toast.success('OTP verified successfully!')
                navigate('/reset-password', { state: { email, otp: otpCode } })
            } else {
                toast.error('Invalid OTP. Please try again.')
                setOtp(['', '', '', '', '', ''])
                inputRefs.current[0]?.focus()
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Invalid or expired OTP')
            setOtp(['', '', '', '', '', ''])
            inputRefs.current[0]?.focus()
        }
    }

    const handleResend = async () => {
        try {
            const result = await forgotPassword({ email })

            toast.success('New OTP sent to your email!')
            setOtp(['', '', '', '', '', ''])
            setTimeLeft(result.expiresIn)
            setCanResend(false)
            inputRefs.current[0]?.focus()
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to resend OTP')
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-sky-500/5 p-4">
            <div className="w-full max-w-md">
                {/* Back Button */}
                <Link
                    to="/forgot-password"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                </Link>

                {/* Logo/Brand */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-sky-700 mb-4">
                        <ShieldCheck className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold">Verify OTP</h1>
                    <p className="text-muted-foreground mt-2">
                        Enter the 6-digit code sent to
                    </p>
                    <p className="text-primary font-medium">{email}</p>
                </div>

                {/* Form Card */}
                <Card className="shadow-xl border-primary/10">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold">Enter Code</CardTitle>
                        <CardDescription>
                            Check your email for the verification code
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* OTP Input */}
                            <div className="space-y-4">
                                <div className="flex gap-2 justify-center" onPaste={handlePaste}>
                                    {otp.map((digit, index) => (
                                        <Input
                                            key={index}
                                            ref={(el) => {
                                                inputRefs.current[index] = el
                                            }}
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={1}
                                            value={digit}
                                            onChange={(e) => handleChange(index, e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(index, e)}
                                            className="w-12 h-14 text-center text-xl font-bold"
                                            disabled={isLoading}
                                            autoFocus={index === 0}
                                        />
                                    ))}
                                </div>

                                {/* Timer */}
                                <div className="text-center">
                                    {timeLeft > 0 ? (
                                        <p className="text-sm text-muted-foreground">
                                            Code expires in{' '}
                                            <span className="font-medium text-primary">{formatTime(timeLeft)}</span>
                                        </p>
                                    ) : (
                                        <p className="text-sm text-red-600 dark:text-red-400">
                                            Code expired. Please request a new one.
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Verify Button */}
                            <Button
                                type="submit"
                                className="w-full"
                                size="lg"
                                disabled={isLoading || otp.join('').length !== 6}
                            >
                                {!isLoading && <ShieldCheck className="mr-2 h-4 w-4" />}
                                {isLoading ? 'Verifying...' : 'Verify Code'}
                            </Button>

                            {/* Resend Button */}
                            <div className="text-center">
                                {canResend || timeLeft <= 0 ? (
                                    <button
                                        type="button"
                                        onClick={handleResend}
                                        disabled={isLoading}
                                        className="text-sm text-primary hover:underline font-medium inline-flex items-center gap-2 disabled:opacity-50"
                                    >
                                        <RotateCcw className="h-3 w-3" />
                                        Resend OTP
                                    </button>
                                ) : (
                                    <p className="text-sm text-muted-foreground">
                                        Didn't receive the code? Wait {formatTime(timeLeft)} to resend
                                    </p>
                                )}
                            </div>

                            {/* Info Box */}
                            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
                                <p className="text-sm text-blue-600 dark:text-blue-400">
                                    💡 Check your spam folder if you don't see the email
                                </p>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default VerifyOtp