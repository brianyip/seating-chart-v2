'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useState, type FormEvent, type ChangeEvent } from 'react'
import { authClient } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    
    if (password !== confirmPassword) {
      setMessage("Passwords don't match!")
      return
    }

    if (password.length < 8) {
      setMessage("Password should be at least 8 characters long.")
      return
    }

    setIsLoading(true)
    setMessage(null)

    try {
      await authClient.signUp.email({
        email,
        password,
        name: email.split("@")[0], // Use email prefix as default name
      }, {
        onSuccess: () => {
          setMessage("Account created successfully! Please check your email for a verification link before signing in.")
          // Don't auto-redirect, let user see the verification message
        },
        onError: (ctx) => {
          console.error('Signup error:', ctx.error)
          let errorMessage = "Could not create account. Please try again."
          
          if (ctx.error.message?.includes("User already exists")) {
            errorMessage = "This email is already registered. Please try logging in."
          } else if (ctx.error.message?.includes("Invalid email")) {
            errorMessage = "Invalid email address provided."
          } else if (ctx.error.message?.includes("Password")) {
            errorMessage = "Password should be at least 8 characters long."
          } else if (ctx.error.message?.includes("rate limit")) {
            errorMessage = "Too many signup attempts. Please try again later."
          }
          
          setMessage(errorMessage)
        }
      })
    } catch (error: any) {
      console.error('Unexpected signup error:', error)
      setMessage("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-sky-100 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-xl">
        <h1 className="mb-6 text-center text-3xl font-bold text-slate-800">
          Create Your Account
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="email-signup" className="text-slate-700">
              Email Address
            </Label>
            <Input
              id="email-signup"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              className="mt-1"
              placeholder="you@example.com"
              disabled={isLoading || (message?.startsWith('Account created successfully!') ?? false)}
            />
          </div>
          <div>
            <Label htmlFor="password-signup" className="text-slate-700">
              Password
            </Label>
            <Input
              id="password-signup"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              className="mt-1"
              placeholder="••••••••"
              disabled={isLoading || (message?.startsWith('Account created successfully!') ?? false)}
            />
          </div>
          <div>
            <Label htmlFor="confirm-password-signup" className="text-slate-700">
              Confirm Password
            </Label>
            <Input
              id="confirm-password-signup"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
              className="mt-1"
              placeholder="••••••••"
              disabled={isLoading || (message?.startsWith('Account created successfully!') ?? false)}
            />
          </div>

          {message && (
            <div className={`text-sm ${message.startsWith('Account created successfully!') ? 'text-green-600' : 'text-red-600'}`}>
              <p>{message}</p>
              {message.startsWith('Account created successfully!') && (
                <p className="mt-2 text-xs text-green-600/80">
                  Check your spam folder if you don't see the email within a few minutes.
                </p>
              )}
            </div>
          )}

          <div>
            <Button
              type="submit"
              className="w-full bg-sky-600 hover:bg-sky-700"
              disabled={isLoading || (message?.startsWith('Account created successfully!') ?? false)}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </div>
        </form>
        {!message?.startsWith('Account created successfully!') && (
          <p className="mt-8 text-center text-sm text-slate-600">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-medium text-sky-600 hover:text-sky-500"
            >
              Sign In
            </Link>
          </p>
        )}
      </div>
    </main>
  )
} 