'use server'

import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { headers } from "next/headers"

export async function login(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return {
      error: "Email and password are required.",
      success: false,
    }
  }

  try {
    const headersList = await headers()
    
    const response = await auth.api.signInEmail({
      body: {
        email,
        password,
      },
      headers: headersList,
    })

    if (!response.user) {
      return {
        error: "Invalid email or password.",
        success: false,
      }
    }

    // Revalidate the path to ensure data is fresh after login
    revalidatePath('/', 'layout')
    
    // Redirect to home page after successful login
    redirect('/')
    
  } catch (error: any) {
    console.error("Login error:", error)
    
    let errorMessage = "Could not authenticate user. Please try again."
    
    if (error.message?.includes("Invalid email or password")) {
      errorMessage = "Invalid email or password."
    } else if (error.message?.includes("Email not verified")) {
      errorMessage = "Please verify your email address before logging in."
    } else if (error.message?.includes("Too many requests")) {
      errorMessage = "Too many login attempts. Please try again later."
    }
    
    return {
      error: errorMessage,
      success: false,
    }
  }
} 