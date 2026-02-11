"use client";

import { useEffect, useRef, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

const INACTIVITY_TIMEOUT = 30 * 60 * 1000;  // 30 minutes in ms
const MAX_SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours in ms
const LOGIN_TIMESTAMP_KEY = "np_login_timestamp";

export default function SessionManager() {
    const router = useRouter();
    const inactivityTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const sessionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isLoggedIn = useRef(false);
    const isLoggingOut = useRef(false);

    // ── Logout handler ──────────────────────────────────────────────
    const performLogout = useCallback(
        async (reason: string) => {
            // Prevent double-logout
            if (isLoggingOut.current) return;
            isLoggingOut.current = true;

            try {
                // Clear timers
                if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
                if (sessionTimer.current) clearTimeout(sessionTimer.current);

                // Remove stored login timestamp
                localStorage.removeItem(LOGIN_TIMESTAMP_KEY);

                // Sign out via Supabase client (clears browser session)
                const supabase = createClient();
                await supabase.auth.signOut();

                // Also call the server-side logout to clear cookies
                await fetch("/api/auth/logout", { method: "POST" });

                console.log(`[SessionManager] Auto-logout: ${reason}`);

                // Redirect to login page
                router.push("/login");
                router.refresh();
            } catch (err) {
                console.error("[SessionManager] Logout error:", err);
            } finally {
                isLoggingOut.current = false;
                isLoggedIn.current = false;
            }
        },
        [router]
    );

    // ── Reset the 30-min inactivity timer ────────────────────────────
    const resetInactivityTimer = useCallback(() => {
        if (!isLoggedIn.current) return;

        if (inactivityTimer.current) clearTimeout(inactivityTimer.current);

        inactivityTimer.current = setTimeout(() => {
            performLogout("30 minutes of inactivity");
        }, INACTIVITY_TIMEOUT);
    }, [performLogout]);

    // ── Start / restart the 24-hour absolute session timer ───────────
    const startSessionTimer = useCallback(() => {
        if (sessionTimer.current) clearTimeout(sessionTimer.current);

        const loginTime = localStorage.getItem(LOGIN_TIMESTAMP_KEY);
        if (!loginTime) return;

        const elapsed = Date.now() - parseInt(loginTime, 10);
        const remaining = MAX_SESSION_DURATION - elapsed;

        if (remaining <= 0) {
            // Already exceeded 24 hours – log out immediately
            performLogout("24-hour session limit exceeded");
            return;
        }

        sessionTimer.current = setTimeout(() => {
            performLogout("24-hour session limit reached");
        }, remaining);
    }, [performLogout]);

    // ──  auth listener + activity events ─────────────────
    useEffect(() => {
        const supabase = createClient();

        // Activity events that reset the inactivity timer
        const activityEvents: (keyof WindowEventMap)[] = [
            "mousemove",
            "mousedown",
            "keydown",
            "scroll",
            "touchstart",
            "click",
        ];

        const handleActivity = () => resetInactivityTimer();

        // Listen for auth state changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((event, session) => {
            if (session?.user) {
                // User is logged in
                isLoggedIn.current = true;

                // Set login timestamp (only on fresh sign-in, not on token refresh)
                if (
                    event === "SIGNED_IN" &&
                    !localStorage.getItem(LOGIN_TIMESTAMP_KEY)
                ) {
                    localStorage.setItem(
                        LOGIN_TIMESTAMP_KEY,
                        Date.now().toString()
                    );
                }

                // Start both timers
                resetInactivityTimer();
                startSessionTimer();

                // Attach activity listeners
                activityEvents.forEach((evt) =>
                    window.addEventListener(evt, handleActivity, {
                        passive: true,
                    })
                );
            } else {
                // User is logged out – clean up everything
                isLoggedIn.current = false;

                if (inactivityTimer.current)
                    clearTimeout(inactivityTimer.current);
                if (sessionTimer.current) clearTimeout(sessionTimer.current);

                localStorage.removeItem(LOGIN_TIMESTAMP_KEY);

                // Remove activity listeners
                activityEvents.forEach((evt) =>
                    window.removeEventListener(evt, handleActivity)
                );
            }
        });

        // check initial session on mount
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                isLoggedIn.current = true;

                // If no login timestamp exists yet, set it now
                if (!localStorage.getItem(LOGIN_TIMESTAMP_KEY)) {
                    localStorage.setItem(
                        LOGIN_TIMESTAMP_KEY,
                        Date.now().toString()
                    );
                }

                resetInactivityTimer();
                startSessionTimer();

                activityEvents.forEach((evt) =>
                    window.addEventListener(evt, handleActivity, {
                        passive: true,
                    })
                );
            }
        });

        // Cleanup on unmount
        return () => {
            subscription.unsubscribe();

            if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
            if (sessionTimer.current) clearTimeout(sessionTimer.current);

            activityEvents.forEach((evt) =>
                window.removeEventListener(evt, handleActivity)
            );
        };
    }, [resetInactivityTimer, startSessionTimer]);


    return null;
}
