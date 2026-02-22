"use client";

import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { useEffect } from "react";
import { api } from "@/convex/_generated/api";
import { usePresence } from "@/hooks/usePresence";

export function UserSync() {
    const { user, isLoaded, isSignedIn } = useUser();
    const upsertUser = useMutation(api.users.upsertUser);

    // Start presence heartbeat
    usePresence();

    useEffect(() => {
        if (isLoaded && isSignedIn && user) {
            upsertUser({
                clerkId: user.id,
                name: `${user.firstName} ${user.lastName}`,
                email: user.emailAddresses[0]?.emailAddress || "",
                imageUrl: user.imageUrl,
            });
        }
    }, [user, isLoaded, isSignedIn, upsertUser]);

    return null;
}
