'use server'

import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export async function requestPasswordReset(formData: FormData) {
  const email = formData.get("email") as string

  if (!email) {
    return {
      error: "Email is required.",
      success: false,
    }
  }

  try {
    const requestHeaders = await headers()
    const origin = requestHeaders.get("origin")

    if (!origin) {
      return {
        error: "Could not determine the application origin. Please try again.",
        success: false,
      }
    }

    const redirectTo = `${origin}/reset-password`

    const response = await auth.api.forgetPassword({
      body: {
        email,
        redirectTo,
      },
      headers: requestHeaders,
    })

    // Better Auth forgetPassword typically returns success for security
    // (doesn't reveal whether email exists or not)
    return {
      success: true,
      message: "If an account exists for this email, a password reset link has been sent.",
    }
    
  } catch (error: any) {
    console.error("Password reset request error:", error)
    
    // Handle specific Better Auth errors
    if (error.message?.includes("rate limit") || error.message?.includes("too many")) {
      return {
        error: "Too many password reset requests. Please try again later.",
        success: false,
      }
    }
    
    // For security, return generic success message even on errors
    // unless it's a clear operational error
    return {
      success: true,
      message: "If an account exists for this email, a password reset link has been sent.",
    }
  }
} 