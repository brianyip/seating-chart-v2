'use server'

import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export async function resetPassword(formData: FormData) {
  const password = formData.get("password") as string
  const token = formData.get("token") as string

  if (!password) {
    return {
      error: "Password is required.",
      success: false,
    }
  }

  if (!token) {
    return {
      error: "Invalid or missing password reset token. Please request a new password reset link.",
      success: false,
    }
  }

  if (password.length < 8) {
    return {
      error: "Password should be at least 8 characters long.",
      success: false,
    }
  }

  try {
    const requestHeaders = await headers()
    
    const response = await auth.api.resetPassword({
      body: {
        newPassword: password,
        token,
      },
      headers: requestHeaders,
    })

    if (!response.status) {
      return {
        error: "Failed to reset password. The reset token may be invalid or expired. Please request a new password reset link.",
        success: false,
      }
    }

    return {
      success: true,
      message: "Password reset successfully! You can now log in with your new password.",
    }
    
  } catch (error: any) {
    console.error("Reset password error:", error)
    
    let errorMessage = "Failed to reset password. Please try again."
    
    if (error.message?.includes("token") && error.message?.includes("invalid")) {
      errorMessage = "Invalid or expired password reset token. Please request a new password reset link."
    } else if (error.message?.includes("token") && error.message?.includes("expired")) {
      errorMessage = "Password reset link has expired. Please request a new password reset link."
    } else if (error.message?.includes("password") && error.message?.includes("weak")) {
      errorMessage = "Password is too weak. Please choose a stronger password."
    } else if (error.message?.includes("same") || error.message?.includes("different")) {
      errorMessage = "New password must be different from your current password."
    }
    
    return {
      error: errorMessage,
      success: false,
    }
  }
} 