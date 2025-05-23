"use client"

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Better Auth handles verification automatically when the user visits the verification URL
    // The URL format is: /api/auth/verify-email?token=...&callbackURL=...
    // Since the user is on this page, it means they were redirected here after successful verification
    // or there was an error in the verification process
    
    const token = searchParams.get('token');
    const error = searchParams.get('error');
    
    if (error) {
      setStatus('error');
      setMessage('Email verification failed. The link may be expired or invalid.');
    } else if (token) {
      // If there's a token but no error, verification was likely successful
      setStatus('success');
      setMessage('Email verified successfully! You can now sign in to your account.');
      
      // Redirect to homepage after a short delay
      setTimeout(() => {
        router.push('/');
      }, 3000);
    } else {
      // No token and no error - user probably navigated here directly
      setStatus('error');
      setMessage('Invalid verification link. Please check your email for the correct verification link.');
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Email Verification
          </h1>
          
          {status === 'loading' && (
            <div className="space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600">Verifying your email...</p>
            </div>
          )}
          
          {status === 'success' && (
            <div className="space-y-4">
              <div className="text-green-600 text-5xl mb-4">✓</div>
              <p className="text-green-600 font-medium">{message}</p>
              <p className="text-sm text-gray-500">
                Redirecting you to the homepage in a few seconds...
              </p>
            </div>
          )}
          
          {status === 'error' && (
            <div className="space-y-4">
              <div className="text-red-600 text-5xl mb-4">✗</div>
              <p className="text-red-600 font-medium">{message}</p>
              <div className="space-y-2">
                <Link href="/">
                  <Button className="w-full">
                    Return to Homepage
                  </Button>
                </Link>
                <p className="text-sm text-gray-500">
                  Need help? Contact support if you continue to have issues.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 