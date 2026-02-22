"use client";

import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { useEffect } from "react";
import { api } from "@/convex/_generated/api";
import { usePresence } from "@/hooks/usePresence";

export function UserSync() {
    const { user, isLoaded, isSignedIn } = useUser();
    const upsertUser = useMutation(api.users.upsertUser);

    // Start presence heartbeat (guarded internally)
    usePresence();

    useEffect(() => {
        if (!isLoaded || !isSignedIn || !user) return;

        const firstName = user.firstName || "";
        const lastName = user.lastName || "";
        const fullName = `${firstName} ${lastName}`.trim();
        const displayName = fullName || user.username || user.emailAddresses[0]?.emailAddress?.split("@")[0] || "User";

        upsertUser({
            clerkId: user.id,
            name: displayName,
            email: user.emailAddresses[0]?.emailAddress || "",
            imageUrl: user.imageUrl,
        }).catch(() => { });
    }, [user, isLoaded, isSignedIn, upsertUser]);

    return null;
}
