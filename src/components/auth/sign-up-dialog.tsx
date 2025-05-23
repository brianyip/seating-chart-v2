"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useState } from "react";
import { Loader2, Mail, CheckCircle } from "lucide-react";
import { signUp } from "@/lib/auth-client";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

interface SignUpDialogProps {
  children: React.ReactNode;
  onSwitchToSignIn?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function SignUpDialog({ children, onSwitchToSignIn, open, onOpenChange }: SignUpDialogProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  
  // New state for verification flow
  const [verificationState, setVerificationState] = useState<'form' | 'verification'>('form');
  const [userEmail, setUserEmail] = useState('');
  
  // Use controlled state if provided, otherwise use internal state
  const dialogOpen = open !== undefined ? open : isOpen;
  const setDialogOpen = onOpenChange || setIsOpen;
  const router = useRouter();

  const handleSignUp = async () => {
    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await signUp.email(
        {
          email,
          password,
          name
        },
        {
          onSuccess: async () => {
            // Store the email for the verification state
            setUserEmail(email);
            
            // Transform dialog to verification state
            setVerificationState('verification');
            
            // Better Auth will automatically send verification email with sendOnSignUp: true
            // No need to manually trigger it anymore
          },
          onError: (ctx: any) => {
            setError(ctx.error?.message || "Failed to create account");
          },
        }
      );
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setError(null);
    setLoading(true);

    try {
      // Note: Better Auth social sign-up is handled through signIn.social
      // Social providers typically handle sign-up and sign-in in the same flow
      const { signIn } = await import("@/lib/auth-client");
      await signIn.social(
        {
          provider: "google",
          callbackURL: "/"
        },
        {
          onSuccess: () => {
            setDialogOpen(false);
          },
          onError: (ctx: any) => {
            setError(ctx.error?.message || "Failed to sign up with Google");
          },
        }
      );
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDialogOpenChange = (open: boolean) => {
    if (open) {
      // Opening the dialog - just set it open
      setDialogOpen(true);
    } else {
      // Closing the dialog - reset all states
      setVerificationState('form');
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setError(null);
      setUserEmail('');
      setDialogOpen(false);
    }
  };

  const handleBackToSignIn = () => {
    // Close dialog and reset states
    handleDialogOpenChange(false);
    onSwitchToSignIn?.();
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="p-0 w-full max-w-md">
        {verificationState === 'verification' ? (
          // Verification state content
          <div className="p-6 text-center">
            <div className="mx-auto mb-4 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Mail className="w-6 h-6 text-green-600" />
            </div>
            
            <DialogTitle className="text-lg md:text-xl mb-2">Check Your Email</DialogTitle>
            <DialogDescription className="text-xs md:text-sm text-muted-foreground mb-6">
              We've sent a verification link to your email address
            </DialogDescription>
            
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm font-medium text-blue-900 mb-1">
                  Verification email sent to:
                </p>
                <p className="text-sm text-blue-700 font-mono break-all">
                  {userEmail}
                </p>
              </div>
              
              <div className="space-y-3 text-left">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-gray-600">
                    Click the verification link in your email to activate your account
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-gray-600">
                    Check your spam folder if you don't see the email within a few minutes
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-gray-600">
                    You'll be automatically signed in after verification
                  </p>
                </div>
              </div>

              <div className="pt-4 space-y-3">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleBackToSignIn}
                >
                  Back to Sign In
                </Button>
                
                <p className="text-xs text-gray-500">
                  Didn't receive the email?{" "}
                  <button
                    type="button"
                    className="text-blue-600 hover:text-blue-800 underline"
                    onClick={() => {
                      // Could implement resend functionality here
                      console.log('Resend verification email for:', userEmail);
                    }}
                  >
                    Resend verification email
                  </button>
                </p>
              </div>
            </div>
          </div>
        ) : (
          // Sign-up form state content
          <div className="p-6">
            <DialogTitle className="text-lg md:text-xl mb-2">Create Account</DialogTitle>
            <DialogDescription className="text-xs md:text-sm text-muted-foreground mb-6">
              Enter your information to create a new account
            </DialogDescription>
            
            <div className="grid gap-4">
              {error && (
                <div className="p-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded">
                  {error}
                </div>
              )}

              <div className="grid gap-2">
                <Label htmlFor="signup-name">Full Name</Label>
                <Input
                  id="signup-name"
                  type="text"
                  placeholder="John Doe"
                  required
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  disabled={loading}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  disabled={loading}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="password (8+ characters)"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                <Input
                  id="signup-confirm-password"
                  type="password"
                  placeholder="confirm password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSignUp();
                    }
                  }}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
                onClick={handleSignUp}
              >
                {loading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  "Create Account"
                )}
              </Button>

              <div className={cn(
                "w-full gap-2 flex items-center",
                "justify-between flex-col"
              )}>
                <Button
                  variant="outline"
                  className={cn("w-full gap-2")}
                  disabled={loading}
                  onClick={handleGoogleSignUp}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="0.98em" height="1em" viewBox="0 0 256 262">
                    <path fill="#4285F4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"></path>
                    <path fill="#34A853" d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"></path>
                    <path fill="#FBBC05" d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"></path>
                    <path fill="#EB4335" d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"></path>
                  </svg>
                  Sign up with Google
                </Button>
              </div>

              <div className="text-center text-sm">
                Already have an account?{" "}
                <button
                  type="button"
                  className="underline hover:no-underline"
                  onClick={handleBackToSignIn}
                >
                  Sign in
                </button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
} 