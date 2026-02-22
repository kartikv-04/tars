"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface TypingIndicatorProps {
    conversationId: Id<"conversations">;
}

export function TypingIndicator({ conversationId }: TypingIndicatorProps) {
    const typers = useQuery(api.typing.getTyping, { conversationId });

    if (!typers || typers.length === 0) return null;

    const name = typers[0].name.split(" ")[0]; // First name only

    return (
        <div className="px-4 py-1.5 shrink-0">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="flex gap-0.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:0ms]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:150ms]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:300ms]" />
                </div>
                <span>{name} is typing...</span>
            </div>
        </div>
    );
}
