"use client";

import { formatMessageTime } from "@/lib/formatTime";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface MessageBubbleProps {
    content: string;
    timestamp: number;
    isOwn: boolean;
    sender: {
        name: string;
        imageUrl?: string;
    } | null;
    showAvatar: boolean;
}

export function MessageBubble({ content, timestamp, isOwn, sender, showAvatar }: MessageBubbleProps) {
    return (
        <div className={cn("flex gap-2 px-4 group", isOwn ? "flex-row-reverse" : "flex-row")}>
            {/* Avatar */}
            <div className="w-8 shrink-0">
                {showAvatar && !isOwn && (
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={sender?.imageUrl} />
                        <AvatarFallback className="bg-primary/10 text-primary text-[10px]">
                            {sender?.name?.slice(0, 2).toUpperCase() ?? "??"}
                        </AvatarFallback>
                    </Avatar>
                )}
            </div>

            {/* Bubble */}
            <div className={cn("max-w-[70%] flex flex-col", isOwn ? "items-end" : "items-start")}>
                <div
                    className={cn(
                        "rounded-2xl px-3.5 py-2 text-sm leading-relaxed",
                        isOwn
                            ? "bg-blue-600 text-white rounded-br-sm"
                            : "bg-muted rounded-bl-sm"
                    )}
                >
                    {content}
                </div>
                <span className="text-[10px] text-muted-foreground mt-1 px-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {formatMessageTime(timestamp)}
                </span>
            </div>
        </div>
    );
}
