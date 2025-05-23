"use client"

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertTriangle, Clock } from "lucide-react";
import { useEffect, useState } from "react";

interface SessionTimeoutDialogProps {
  open: boolean;
  onExtendSession: () => Promise<boolean>;
  onLogout: () => void;
  timeUntilExpiry: number; // in seconds
}

export function SessionTimeoutDialog({ 
  open, 
  onExtendSession, 
  onLogout, 
  timeUntilExpiry 
}: SessionTimeoutDialogProps) {
  const [countdown, setCountdown] = useState(timeUntilExpiry);
  const [isExtending, setIsExtending] = useState(false);

  useEffect(() => {
    setCountdown(timeUntilExpiry);
  }, [timeUntilExpiry]);

  useEffect(() => {
    if (!open || countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          onLogout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [open, countdown, onLogout]);

  const handleExtendSession = async () => {
    setIsExtending(true);
    try {
      const success = await onExtendSession();
      if (!success) {
        // If extension fails, logout
        onLogout();
      }
    } catch (error) {
      console.error('Failed to extend session:', error);
      onLogout();
    } finally {
      setIsExtending(false);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <DialogTitle>Session Expiring Soon</DialogTitle>
          </div>
          <DialogDescription className="space-y-2">
            <p>Your session will expire due to inactivity.</p>
            <div className="flex items-center gap-2 text-sm font-medium">
              <Clock className="h-4 w-4" />
              <span>Time remaining: {formatTime(countdown)}</span>
            </div>
          </DialogDescription>
        </DialogHeader>
        
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <p className="text-sm text-amber-800">
            To continue using the application, please extend your session or you will be automatically logged out.
          </p>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={onLogout}
            className="w-full sm:w-auto"
          >
            Logout Now
          </Button>
          <Button
            onClick={handleExtendSession}
            disabled={isExtending}
            className="w-full sm:w-auto"
          >
            {isExtending ? "Extending..." : "Stay Logged In"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 