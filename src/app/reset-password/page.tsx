'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useEffect, useState, type FormEvent, type ChangeEvent } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { resetPassword } from './actions'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [token, setToken] = useState<string | null>(null)
  const [tokenError, setTokenError] = useState<string | null>(null)

  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    // Better Auth uses query parameters for the reset token
    const resetToken = searchParams.get('token')
    const error = searchParams.get('error')
    
    if (error) {
      setTokenError(decodeURIComponent(error))
      return
    }
    
    if (!resetToken) {
      setTokenError("Invalid or missing password reset token. Please request a new password reset link.")
      return
    }
    
    setToken(resetToken)
  }, [searchParams])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    
    if (!token) {
      setMessage("Invalid or missing password reset token. Please request a new password reset link.")
      return
    }
    
    if (password !== confirmPassword) {
      setMessage("Passwords do not match.")
      return
    }
    
    if (password.length < 8) {
      setMessage("Password should be at least 8 characters long.")
      return
    }

    setIsLoading(true)
    setMessage(null)

    const formData = new FormData()
    formData.append('password', password)
    formData.append('token', token)

    const result = await resetPassword(formData)

    if (result?.error) {
      setMessage(result.error)
    } else if (result?.success) {
      setMessage(result.message || 'Password reset successfully! You can now log in with your new password.')
      setPassword('')
      setConfirmPassword('')
      // Redirect to login page after a delay
      setTimeout(() => router.push('/login'), 4000)
    }

    setIsLoading(false)
  }

  if (tokenError) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-red-50 to-pink-100 p-4 text-center">
        <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-xl">
          <svg
            className="mx-auto h-16 w-16 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h1 className="mt-6 mb-2 text-3xl font-bold text-slate-800">
            Password Reset Error
          </h1>
          <p className="mb-6 text-slate-600">
            {tokenError}
          </p>
          <p className="text-slate-600">
            Please try requesting a new password reset link.
          </p>
          <Button asChild className="mt-6 w-full bg-sky-600 hover:bg-sky-700">
            <Link href="/forgot-password">Request New Link</Link>
          </Button>
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-sky-100 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-xl">
        <h1 className="mb-2 text-center text-3xl font-bold text-slate-800">
          Reset Your Password
        </h1>
        <p className="mb-6 text-center text-sm text-slate-600">
          Enter and confirm your new password below.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="password-reset" className="text-slate-700">
              New Password
            </Label>
            <Input
              id="password-reset"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              className="mt-1"
              placeholder="••••••••"
              disabled={isLoading || (message?.includes('Password reset successfully') ?? false)}
            />
          </div>
          <div>
            <Label htmlFor="confirm-password-reset" className="text-slate-700">
              Confirm New Password
            </Label>
            <Input
              id="confirm-password-reset"
              name="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
              className="mt-1"
              placeholder="••••••••"
              disabled={isLoading || (message?.includes('Password reset successfully') ?? false)}
            />
          </div>

          {message && (
            <p className={`text-sm ${message.includes('Password reset successfully') ? 'text-green-600' : 'text-red-600'}`}>
              {message}
            </p>
          )}

          <div>
            <Button
              type="submit"
              className="w-full bg-sky-600 hover:bg-sky-700"
              disabled={isLoading || (message?.includes('Password reset successfully') ?? false)}
            >
              {isLoading ? 'Resetting Password...' : 'Reset Password'}
            </Button>
          </div>
        </form>
        <p className="mt-8 text-center text-sm text-slate-600">
          Remembered your password or don&apos;t need to reset?{' '}
          <Link
            href="/login"
            className="font-medium text-sky-600 hover:text-sky-500"
          >
            Sign In
          </Link>
        </p>
      </div>
    </main>
  )
} 