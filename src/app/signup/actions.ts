'use server'

import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export async function signup(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return {
      error: "Email and password are required.",
      success: false,
    }
  }

  // Basic password validation
  if (password.length < 8) {
    return {
      error: "Password should be at least 8 characters long.",
      success: false,
    }
  }

  try {
    const headersList = await headers()
    
    const response = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name: email.split("@")[0], // Use email prefix as default name
      },
      headers: headersList,
    })

    if (!response.user) {
      return {
        error: "Failed to create account. Please try again.",
        success: false,
      }
    }

    return {
      success: true,
      message: "Account created successfully! You can now sign in.",
    }
    
  } catch (error: any) {
    console.error("Signup error:", error)
    
    let errorMessage = "Could not create account. Please try again."
    
    if (error.message?.includes("User already exists")) {
      errorMessage = "This email is already registered. Please try logging in."
    } else if (error.message?.includes("Invalid email")) {
      errorMessage = "Invalid email address provided."
    } else if (error.message?.includes("Password")) {
      errorMessage = "Password should be at least 8 characters long."
    } else if (error.message?.includes("rate limit")) {
      errorMessage = "Too many signup attempts. Please try again later."
    }
    
    return {
      error: errorMessage,
      success: false,
    }
  }
} 