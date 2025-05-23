'use client' // Can be a server component too, but client for potential future interactivity

import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ErrorPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-red-50 via-red-100 to-pink-100 p-4 text-center">
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
          Oops! Something went wrong.
        </h1>
        <p className="mb-6 text-slate-600">
          We encountered an unexpected issue. This could be due to an invalid link, a temporary server problem, or an issue with your request.
        </p>
        <div className="space-y-4">
          <Button asChild className="w-full bg-sky-600 hover:bg-sky-700">
            <Link href="/">Go to Homepage</Link>
          </Button>
          <Button variant="outline" asChild className="w-full">
            <Link href="/login">Go to Login Page</Link>
          </Button>
        </div>
        <p className="mt-8 text-xs text-slate-500">
          If you continue to experience issues, please try again later or contact support.
        </p>
      </div>
    </main>
  )
} 