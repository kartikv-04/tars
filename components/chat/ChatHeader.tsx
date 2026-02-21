"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface ChatHeaderProps {
    conversationId: Id<"conversations">;
}

export function ChatHeader({ conversationId }: ChatHeaderProps) {
    const conversations = useQuery(api.conversations.getMyConversations);
    const router = useRouter();

    const conversation = conversations?.find((c) => c?._id === conversationId);
    const otherUser = conversation?.otherUser;

    return (
        <div className="h-16 border-b bg-card/80 backdrop-blur-sm px-4 flex items-center gap-3 shrink-0">
            <Button
                variant="ghost"
                size="icon"
                className="md:hidden h-8 w-8"
                onClick={() => router.push("/chat")}
            >
                <ArrowLeft className="h-4 w-4" />
            </Button>

            <Avatar className="h-9 w-9">
                <AvatarImage src={otherUser?.imageUrl} />
                <AvatarFallback className="bg-primary/10 text-primary text-sm">
                    {otherUser?.name?.slice(0, 2).toUpperCase() ?? "??"}
                </AvatarFallback>
            </Avatar>

            <div className="min-w-0">
                <p className="text-sm font-semibold truncate">
                    {otherUser?.name ?? "Loading..."}
                </p>
                <p className="text-xs text-muted-foreground">
                    {otherUser?.isOnline ? (
                        <span className="text-emerald-500">Online</span>
                    ) : (
                        "Offline"
                    )}
                </p>
            </div>
        </div>
    );
}
