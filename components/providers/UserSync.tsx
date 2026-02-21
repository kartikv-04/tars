"use client";

import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { useEffect } from "react";
import { api } from "@/convex/_generated/api";

export function UserSync() {
    const { user, isLoaded, isSignedIn } = useUser();
    const upsertUser = useMutation(api.users.upsertUser);

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

    return null; // This component just handles side-effects
}
