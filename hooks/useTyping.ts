"use client";

import { useRef, useCallback } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export function useTyping(conversationId: Id<"conversations">) {
    const setTyping = useMutation(api.typing.setTyping);
    const clearTyping = useMutation(api.typing.clearTyping);
    const lastEmitRef = useRef<number>(0);

    // Throttled: emit at most once per second
    const emitTyping = useCallback(() => {
        const now = Date.now();
        if (now - lastEmitRef.current > 1000) {
            lastEmitRef.current = now;
            setTyping({ conversationId });
        }
    }, [conversationId, setTyping]);

    const stopTyping = useCallback(() => {
        lastEmitRef.current = 0;
        clearTyping({ conversationId });
    }, [conversationId, clearTyping]);

    return { emitTyping, stopTyping };
}
