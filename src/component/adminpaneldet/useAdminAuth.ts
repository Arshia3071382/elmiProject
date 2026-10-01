"use client";

import { useEffect } from "react";

export function useAdminAuth(isChecking: boolean, setIsChecking: (v: boolean) => void, onLogout: () => void) {
  // Auto-logout after 5 min inactivity
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => { onLogout(); }, 300000);
    };
    const events = ["mousedown", "keypress", "scroll", "touchstart"];
    events.forEach((event) => { window.addEventListener(event, resetTimer); });
    resetTimer();
    return () => {
      clearTimeout(timeoutId);
      events.forEach((event) => { window.removeEventListener(event, resetTimer); });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Verify auth on mount
  useEffect(() => {
    async function verifyAuth() {
      try {
        const res = await fetch("/api/check-auth", { cache: "no-store" });
        const data = await res.json();
        if (!data.success && !data.isLoggedIn) {
          window.location.href = "/";
          return;
        }
      } catch {
        window.location.href = "/";
        return;
      }
      setIsChecking(false);
    }
    verifyAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}