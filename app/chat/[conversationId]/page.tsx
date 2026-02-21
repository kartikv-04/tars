"use client";

import { use } from "react";
import { useMutation } from "convex/react";
import { useEffect } from "react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { MessageList } from "@/components/chat/MessageList";
import { ChatInput } from "@/components/chat/ChatInput";

interface ChatPageProps {
    params: Promise<{ conversationId: string }>;
}

export default function ConversationPage({ params }: ChatPageProps) {
    const { conversationId } = use(params);
    const markAsRead = useMutation(api.conversations.markAsRead);

    const typedConversationId = conversationId as Id<"conversations">;

    useEffect(() => {
        markAsRead({ conversationId: typedConversationId });
    }, [conversationId, markAsRead, typedConversationId]);

    return (
        <div className="flex flex-col h-full bg-background">
            <ChatHeader conversationId={typedConversationId} />
            <MessageList conversationId={typedConversationId} />
            <ChatInput conversationId={typedConversationId} />
        </div>
    );
}
