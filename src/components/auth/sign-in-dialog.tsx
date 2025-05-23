"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { signIn } from "@/lib/auth-client";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface SignInDialogProps {
  children: React.ReactNode;
  onSwitchToSignUp?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function SignInDialog({ children, onSwitchToSignUp, open, onOpenChange }: SignInDialogProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  
  // Use controlled state if provided, otherwise use internal state
  const dialogOpen = open !== undefined ? open : isOpen;
  const setDialogOpen = onOpenChange || setIsOpen;
  const router = useRouter();

  const handleSignIn = async () => {
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await signIn.email(
        {
          email,
          password
        },
        {
          onSuccess: () => {
            setDialogOpen(false);
            router.refresh();
          },
          onError: (ctx: any) => {
            const errorMessage = ctx.error?.message || "Failed to sign in";
            // Handle email verification error specifically
            if (errorMessage.includes("email") && errorMessage.includes("verif")) {
              setError("Please verify your email address before signing in. Check your inbox for a verification link.");
            } else {
              setError(errorMessage);
            }
          },
        }
      );
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);

    try {
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
            setError(ctx.error?.message || "Failed to sign in with Google");
          },
        }
      );
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="p-0 w-full max-w-md">
        <div className="p-6">
          <DialogTitle className="text-lg md:text-xl mb-2">Sign In</DialogTitle>
          <DialogDescription className="text-xs md:text-sm text-muted-foreground mb-6">
            Enter your email below to login to your account
          </DialogDescription>
          
          <div className="grid gap-4">
            {error && (
              <div className="p-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded">
                {error}
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="signin-email">Email</Label>
              <Input
                id="signin-email"
                type="email"
                placeholder="m@example.com"
                required
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                disabled={loading}
              />
            </div>

            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="signin-password">Password</Label>
                <Link
                  href="/forgot-password"
                  className="ml-auto inline-block text-sm underline"
                  onClick={() => setDialogOpen(false)}
                >
                  Forgot your password?
                </Link>
              </div>

              <Input
                id="signin-password"
                type="password"
                placeholder="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSignIn();
                  }
                }}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
              onClick={handleSignIn}
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                "Login"
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
                onClick={handleGoogleSignIn}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="0.98em" height="1em" viewBox="0 0 256 262">
                  <path fill="#4285F4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"></path>
                  <path fill="#34A853" d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"></path>
                  <path fill="#FBBC05" d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"></path>
                  <path fill="#EB4335" d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"></path>
                </svg>
                Sign in with Google
              </Button>
            </div>

            <div className="text-center text-sm">
              Don't have an account?{" "}
              <button
                type="button"
                className="underline hover:no-underline"
                onClick={() => {
                  setDialogOpen(false);
                  onSwitchToSignUp?.();
                }}
              >
                Sign up
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 