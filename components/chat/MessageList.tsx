"use client";

import { useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { useEffect, useRef, useState, useCallback } from "react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { MessageBubble } from "./MessageBubble";
import { EmptyState } from "@/components/shared/EmptyState";
import { NewMessageButton } from "./NewMessageButton";
import { MessageCircle } from "lucide-react";

interface MessageListProps {
    conversationId: Id<"conversations">;
}

export function MessageList({ conversationId }: MessageListProps) {
    const messages = useQuery(api.messages.getMessages, { conversationId });
    const { user } = useUser();
    const bottomRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [isNearBottom, setIsNearBottom] = useState(true);
    const [showNewMessages, setShowNewMessages] = useState(false);
    const prevMessageCountRef = useRef(0);

    const scrollToBottom = useCallback(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        setShowNewMessages(false);
    }, []);

    // Track scroll position
    const handleScroll = useCallback(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const distanceFromBottom =
            container.scrollHeight - container.scrollTop - container.clientHeight;
        const nearBottom = distanceFromBottom < 100;

        setIsNearBottom(nearBottom);
        if (nearBottom) setShowNewMessages(false);
    }, []);

    // Auto-scroll logic
    useEffect(() => {
        if (!messages) return;

        const newCount = messages.length;
        const hadMessages = prevMessageCountRef.current > 0;
        const hasNewMessages = newCount > prevMessageCountRef.current;

        if (!hadMessages) {
            // First load — scroll to bottom instantly
            bottomRef.current?.scrollIntoView();
        } else if (hasNewMessages && isNearBottom) {
            // New message + user is near bottom — smooth scroll
            scrollToBottom();
        } else if (hasNewMessages && !isNearBottom) {
            // New message + user scrolled up — show button
            setShowNewMessages(true);
        }

        prevMessageCountRef.current = newCount;
    }, [messages, isNearBottom, scrollToBottom]);

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
        <div className="flex-1 relative overflow-hidden">
            <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="h-full overflow-y-auto scrollbar-thin"
            >
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
            </div>

            {showNewMessages && (
                <NewMessageButton onClick={scrollToBottom} />
            )}
        </div>
    );
}
