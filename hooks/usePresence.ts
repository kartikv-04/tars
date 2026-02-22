"use client";

import { useEffect, useRef } from "react";
import { useMutation } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";

export function usePresence() {
    const { isSignedIn } = useUser();
    const heartbeat = useMutation(api.presence.heartbeat);
    const setOffline = useMutation(api.presence.setOffline);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!isSignedIn) return;

        // Send initial heartbeat
        heartbeat().catch(() => { });

        // Heartbeat every 30 seconds
        intervalRef.current = setInterval(() => {
            heartbeat().catch(() => { });
        }, 30_000);

        // Handle tab close / navigate away
        const handleBeforeUnload = () => {
            setOffline().catch(() => { });
        };

        // Handle tab visibility change (switch tabs)
        const handleVisibilityChange = () => {
            if (document.visibilityState === "hidden") {
                setOffline().catch(() => { });
            } else {
                heartbeat().catch(() => { });
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            window.removeEventListener("beforeunload", handleBeforeUnload);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            setOffline().catch(() => { });
        };
    }, [isSignedIn, heartbeat, setOffline]);
}
