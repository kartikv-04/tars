"use client";

import { useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { useEffect, useRef } from "react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { MessageBubble } from "./MessageBubble";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EmptyState } from "@/components/shared/EmptyState";
import { MessageCircle } from "lucide-react";

interface MessageListProps {
    conversationId: Id<"conversations">;
}

export function MessageList({ conversationId }: MessageListProps) {
    const messages = useQuery(api.messages.getMessages, { conversationId });
    const { user } = useUser();
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    if (!messages) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="flex gap-1">
                    <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:0ms]" />
                    <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:150ms]" />
                    <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:300ms]" />
                </div>
            </div>
        );
    }

    if (messages.length === 0) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <EmptyState
                    icon={MessageCircle}
                    title="No messages yet"
                    subtitle="Send a message to start the conversation"
                />
            </div>
        );
    }

    return (
        <ScrollArea className="flex-1">
            <div className="py-4 space-y-1">
                {messages.map((message, i) => {
                    const isOwn = message.sender?.name === `${user?.firstName} ${user?.lastName}`;
                    const prevMessage = messages[i - 1];
                    const showAvatar = !prevMessage || prevMessage.senderId !== message.senderId;

                    return (
                        <MessageBubble
                            key={message._id}
                            content={message.content}
                            timestamp={message._creationTime}
                            isOwn={isOwn}
                            sender={message.sender}
                            showAvatar={showAvatar}
                        />
                    );
                })}
                <div ref={bottomRef} />
            </div>
        </ScrollArea>
    );
}
