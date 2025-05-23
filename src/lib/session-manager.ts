"use client"

import { useSession, signOut } from "@/lib/auth-client";
import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

interface SessionManagerOptions {
  warningTime?: number; // Time in seconds before session expires to show warning
  autoRefresh?: boolean; // Whether to automatically refresh the session
  onSessionExpired?: () => void; // Callback when session expires
  onSessionWarning?: () => void; // Callback when session warning is triggered
}

interface SessionState {
  isExpiring: boolean;
  timeUntilExpiry: number;
  lastActivity: Date;
}

export function useSessionManager(options: SessionManagerOptions = {}) {
  const {
    warningTime = 5 * 60, // 5 minutes warning by default
    autoRefresh = true,
    onSessionExpired,
    onSessionWarning,
  } = options;

  const { data: session, isPending } = useSession();
  const router = useRouter();
  
  const [sessionState, setSessionState] = useState<SessionState>({
    isExpiring: false,
    timeUntilExpiry: 0,
    lastActivity: new Date(),
  });

  const warningShownRef = useRef<boolean>(false);
  const refreshTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const warningTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const expiryTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Memoize callbacks to prevent useEffect re-runs
  const handleSessionExpired = useCallback(async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Error during session expiry logout:', error);
      // Force redirect even if logout fails
      router.push('/');
    }
  }, [router]);

  const extendSession = useCallback(async () => {
    try {
      // Make a request to refresh the session
      const response = await fetch('/api/auth/get-session', {
        method: 'GET',
        credentials: 'include',
      });
      
      if (response.ok) {
        setSessionState(prev => ({ ...prev, isExpiring: false }));
        warningShownRef.current = false;
        console.log('✅ Session extended successfully');
        return true;
      }
      return false;
    } catch (error) {
      console.error('❌ Failed to extend session:', error);
      return false;
    }
  }, []);

  const forceLogout = useCallback(async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Error during forced logout:', error);
      router.push('/');
    }
  }, [router]);

  // Update last activity on user interaction
  const updateActivity = useCallback(() => {
    setSessionState(prev => ({
      ...prev,
      lastActivity: new Date(),
    }));
    warningShownRef.current = false;
  }, []);

  // Set up activity listeners
  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    events.forEach(event => {
      document.addEventListener(event, updateActivity, true);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, updateActivity, true);
      });
    };
  }, [updateActivity]);

  // Session monitoring and refresh logic
  useEffect(() => {
    if (!session || isPending) {
      return;
    }

    // Clear existing timeouts
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
      refreshTimeoutRef.current = undefined;
    }
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
      warningTimeoutRef.current = undefined;
    }
    if (expiryTimeoutRef.current) {
      clearTimeout(expiryTimeoutRef.current);
      expiryTimeoutRef.current = undefined;
    }

    // Calculate session expiry time (7 days from session creation)
    const sessionDuration = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
    const sessionStart = new Date(session.session.createdAt || Date.now());
    const sessionExpiry = new Date(sessionStart.getTime() + sessionDuration);
    const now = new Date();
    const timeUntilExpiry = Math.max(0, sessionExpiry.getTime() - now.getTime());

    // Only update state if the value actually changed
    setSessionState(prev => {
      const newTimeUntilExpiry = Math.floor(timeUntilExpiry / 1000);
      if (prev.timeUntilExpiry !== newTimeUntilExpiry) {
        return {
          ...prev,
          timeUntilExpiry: newTimeUntilExpiry,
        };
      }
      return prev;
    });

    // Set warning timeout
    const warningTimeout = Math.max(0, timeUntilExpiry - (warningTime * 1000));
    if (warningTimeout > 0) {
      warningTimeoutRef.current = setTimeout(() => {
        if (!warningShownRef.current) {
          setSessionState(prev => ({ ...prev, isExpiring: true }));
          onSessionWarning?.();
          warningShownRef.current = true;
        }
      }, warningTimeout);
    }

    // Set auto-refresh timeout (refresh 1 hour before expiry)
    if (autoRefresh) {
      const refreshTimeout = Math.max(0, timeUntilExpiry - (60 * 60 * 1000)); // 1 hour before expiry
      if (refreshTimeout > 0) {
        refreshTimeoutRef.current = setTimeout(async () => {
          try {
            // Trigger a session refresh by making a request to the session endpoint
            await fetch('/api/auth/get-session', {
              method: 'GET',
              credentials: 'include',
            });
            console.log('✅ Session refreshed automatically');
          } catch (error) {
            console.error('❌ Failed to refresh session:', error);
          }
        }, refreshTimeout);
      }
    }

    // Set expiry timeout
    if (timeUntilExpiry > 0) {
      expiryTimeoutRef.current = setTimeout(() => {
        onSessionExpired?.();
        handleSessionExpired();
      }, timeUntilExpiry);
    }

    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
      }
      if (expiryTimeoutRef.current) {
        clearTimeout(expiryTimeoutRef.current);
      }
    };
  }, [session?.session.id, isPending, warningTime, autoRefresh, onSessionExpired, onSessionWarning, handleSessionExpired]);

  return {
    session,
    isPending,
    sessionState,
    extendSession,
    forceLogout,
    updateActivity,
  };
} 