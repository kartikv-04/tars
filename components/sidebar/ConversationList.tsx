"use client";

import { useQuery, useMutation } from "convex/react";
import { useRouter, useParams } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export function ConversationList() {
    const conversations = useQuery(api.conversations.getMyConversations);
    const router = useRouter();
    const params = useParams();
    const activeId = params?.conversationId as string | undefined;

    if (!conversations || conversations.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center gap-3 py-12 text-muted-foreground">
                <MessageCircle className="h-12 w-12 opacity-30" />
                <div className="text-center">
                    <p className="text-sm font-medium">No conversations yet</p>
                    <p className="text-xs mt-1">Search for a user to start chatting</p>
                </div>
            </div>
        );
    }

    return (
        <ScrollArea className="flex-1">
            <div className="space-y-0.5 p-2">
                {conversations.map((conversation) => {
                    if (!conversation) return null;

                    const isActive = activeId === conversation._id;
                    const otherUser = conversation.otherUser;

                    // Check for unread messages
                    const hasUnread =
                        conversation.lastMessageTime &&
                        conversation.lastReadTime &&
                        conversation.lastMessageTime > conversation.lastReadTime;

                    return (
                        <button
                            key={conversation._id}
                            onClick={() => router.push(`/chat/${conversation._id}`)}
                            className={`flex items-center gap-3 w-full rounded-lg px-3 py-3 transition-all text-left group ${isActive
                                    ? "bg-accent shadow-sm"
                                    : "hover:bg-accent/50"
                                }`}
                        >
                            <div className="relative">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={otherUser?.imageUrl} />
                                    <AvatarFallback className="bg-primary/10 text-primary text-sm">
                                        {otherUser?.name?.slice(0, 2).toUpperCase() ?? "??"}
                                    </AvatarFallback>
                                </Avatar>
                                {otherUser?.isOnline && (
                                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-background" />
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                    <p className={`text-sm truncate ${hasUnread ? "font-semibold" : "font-medium"}`}>
                                        {otherUser?.name ?? "Unknown User"}
                                    </p>
                                    {conversation.lastMessageTime && (
                                        <span className="text-[10px] text-muted-foreground ml-2 shrink-0">
                                            {formatDistanceToNow(conversation.lastMessageTime, { addSuffix: false })}
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center justify-between mt-0.5">
                                    <p className={`text-xs truncate ${hasUnread ? "text-foreground" : "text-muted-foreground"}`}>
                                        {conversation.lastMessage?.content ?? "No messages yet"}
                                    </p>
                                    {hasUnread && (
                                        <Badge className="ml-2 h-5 min-w-5 flex items-center justify-center rounded-full bg-primary text-[10px] px-1.5 shrink-0">
                                            •
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>
        </ScrollArea>
    );
}
