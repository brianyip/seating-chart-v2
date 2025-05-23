"use client"

import { Button } from "@/components/ui/button";
import { SignInDialog } from "@/components/auth/sign-in-dialog";
import { SignUpDialog } from "@/components/auth/sign-up-dialog";
import { SessionTimeoutDialog } from "@/components/auth/session-timeout-dialog";
import { LogoutConfirmationDialog } from "@/components/auth/logout-confirmation-dialog";
import { useSessionManager } from "@/lib/session-manager";
import { useState, useCallback, useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LogOut, Settings, User } from "lucide-react";

export function Navbar() {
  const [signInOpen, setSignInOpen] = useState(false);
  const [signUpOpen, setSignUpOpen] = useState(false);
  const [showTimeoutDialog, setShowTimeoutDialog] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  // Memoize session manager options to prevent re-initialization
  const sessionManagerOptions = useMemo(() => ({
    onSessionWarning: () => {
      setShowTimeoutDialog(true);
    },
    onSessionExpired: () => {
      setShowTimeoutDialog(false);
    }
  }), []);

  const { 
    session, 
    isPending, 
    sessionState, 
    extendSession, 
    forceLogout 
  } = useSessionManager(sessionManagerOptions);

  const switchToSignUp = useCallback(() => {
    setSignInOpen(false);
    // Small delay to ensure the first dialog closes before opening the second
    setTimeout(() => setSignUpOpen(true), 100);
  }, []);

  const switchToSignIn = useCallback(() => {
    setSignUpOpen(false);
    // Small delay to ensure the first dialog closes before opening the second
    setTimeout(() => setSignInOpen(true), 100);
  }, []);

  const handleExtendSession = useCallback(async () => {
    const success = await extendSession();
    if (success) {
      setShowTimeoutDialog(false);
    }
    return success;
  }, [extendSession]);

  const handleLogout = useCallback(() => {
    setShowTimeoutDialog(false);
    forceLogout();
  }, [forceLogout]);

  const handleManualLogout = useCallback(() => {
    setShowLogoutDialog(true);
  }, []);

  const handleConfirmLogout = useCallback(() => {
    setShowLogoutDialog(false);
    forceLogout();
  }, [forceLogout]);

  const getUserInitials = useCallback((name: string | null | undefined) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map(part => part.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }, []);

  return (
    <>
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">Seating Chart Planner</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {isPending ? (
                <div className="h-4 w-16 bg-gray-200 animate-pulse rounded"></div>
              ) : session ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={session.user.image || undefined} alt={session.user.name || "User"} />
                        <AvatarFallback>{getUserInitials(session.user.name)}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        {session.user.name && (
                          <p className="font-medium">{session.user.name}</p>
                        )}
                        {session.user.email && (
                          <p className="w-[200px] truncate text-sm text-muted-foreground">
                            {session.user.email}
                          </p>
                        )}
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={(event) => event.preventDefault()}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={(event) => event.preventDefault()}>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={handleManualLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center space-x-2">
                  <SignInDialog onSwitchToSignUp={switchToSignUp} open={signInOpen} onOpenChange={setSignInOpen}>
                    <Button variant="ghost">Sign In</Button>
                  </SignInDialog>
                  <SignUpDialog onSwitchToSignIn={switchToSignIn} open={signUpOpen} onOpenChange={setSignUpOpen}>
                    <Button>Sign Up</Button>
                  </SignUpDialog>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Session Timeout Dialog */}
      <SessionTimeoutDialog
        open={showTimeoutDialog}
        onExtendSession={handleExtendSession}
        onLogout={handleLogout}
        timeUntilExpiry={sessionState.timeUntilExpiry}
      />

      {/* Logout Confirmation Dialog */}
      <LogoutConfirmationDialog
        open={showLogoutDialog}
        onOpenChange={setShowLogoutDialog}
        onConfirmLogout={handleConfirmLogout}
        userName={session?.user.name || undefined}
      />
    </>
  );
} 