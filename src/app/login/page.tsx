'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useState, type FormEvent, type ChangeEvent } from 'react'
import { authClient } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    setMessage(null)

    try {
      await authClient.signIn.email({
        email,
        password,
      }, {
        onSuccess: () => {
          router.push('/')
        },
        onError: (ctx) => {
          console.error('Login error:', ctx.error)
          let errorMessage = "Could not authenticate user. Please try again."
          
          if (ctx.error.message?.includes("Invalid email or password")) {
            errorMessage = "Invalid email or password."
          } else if (ctx.error.message?.includes("Email not verified")) {
            errorMessage = "Please verify your email address before logging in."
          } else if (ctx.error.message?.includes("Too many requests")) {
            errorMessage = "Too many login attempts. Please try again later."
          }
          
          setMessage(errorMessage)
        }
      })
    } catch (error: any) {
      console.error('Unexpected login error:', error)
      setMessage("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-sky-100 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-xl">
        <h1 className="mb-6 text-center text-3xl font-bold text-slate-800">
          Welcome Back!
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="email-login" className="text-slate-700">
              Email Address
            </Label>
            <Input
              id="email-login"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              className="mt-1"
              placeholder="you@example.com"
              disabled={isLoading}
            />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="password-login" className="text-slate-700">
                Password
              </Label>
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-sky-600 hover:text-sky-500"
              >
                Forgot your password?
              </Link>
            </div>
            <Input
              id="password-login"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              className="mt-1"
              placeholder="••••••••"
              disabled={isLoading}
            />
          </div>

          {message && (
            <p className={`text-sm ${message.includes("successful") ? 'text-green-600' : 'text-red-600'}`}>
              {message}
            </p>
          )}

          <div>
            <Button
              type="submit"
              className="w-full bg-sky-600 hover:bg-sky-700"
              disabled={isLoading}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </div>
        </form>
        <p className="mt-8 text-center text-sm text-slate-600">
          Don&apos;t have an account?{' '}
          <Link
            href="/signup"
            className="font-medium text-sky-600 hover:text-sky-500"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </main>
  )
} 