'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useState, type FormEvent, type ChangeEvent } from 'react'
import { requestPasswordReset } from './actions' // Uncommented and will be used

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    setMessage(null)

    const formData = new FormData(event.currentTarget)
    const result = await requestPasswordReset(formData)

    if (result?.error) {
      setMessage(result.error)
    } else if (result?.success) {
      setMessage(result.message || 'If an account exists for this email, a password reset link has been sent.')
      setEmail('') // Clear email field on success
    }
    
    // Removed placeholder logic
    // await new Promise(resolve => setTimeout(resolve, 1000))
    // setMessage('Password reset functionality not yet fully implemented. Action needed.')
    // console.log("Password reset request for:", email)

    setIsLoading(false)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-sky-100 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-xl">
        <h1 className="mb-2 text-center text-3xl font-bold text-slate-800">
          Forgot Your Password?
        </h1>
        <p className="mb-6 text-center text-sm text-slate-600">
          No worries! Enter your email address below and we&apos;ll send you a link to reset your password.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="email-forgot-password" className="text-slate-700">
              Email Address
            </Label>
            <Input
              id="email-forgot-password"
              name="email" // Ensure name attribute is present for FormData
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              className="mt-1"
              placeholder="you@example.com"
              disabled={isLoading || (message?.includes('reset link has been sent') ?? false) || (message?.includes('Too many password reset requests') ?? false)}
            />
          </div>

          {message && (
            <p className={`text-sm ${message.includes('reset link has been sent') ? 'text-green-600' : 'text-red-600'}`}>
              {message}
            </p>
          )}

          <div>
            <Button
              type="submit"
              className="w-full bg-sky-600 hover:bg-sky-700"
              disabled={isLoading || (message?.includes('reset link has been sent') ?? false) || (message?.includes('Too many password reset requests') ?? false)}
            >
              {isLoading ? 'Sending Link...' : 'Send Reset Link'}
            </Button>
          </div>
        </form>
        <p className="mt-8 text-center text-sm text-slate-600">
          Remembered your password?{' '}
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