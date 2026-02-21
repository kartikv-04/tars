"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, MessageCircle } from "lucide-react";

export function UserSearch() {
    const [search, setSearch] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const users = useQuery(api.users.searchUsers, { search });
    const createConversation = useMutation(api.conversations.getOrCreateConversation);
    const router = useRouter();

    const handleSelectUser = async (userId: Id<"users">) => {
        const conversationId = await createConversation({ participantId: userId });
        setSearch("");
        setIsOpen(false);
        router.push(`/chat/${conversationId}`);
    };

    return (
        <div className="relative">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search users..."
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                    className="pl-9 bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-primary/50"
                />
            </div>

            {isOpen && search.trim() !== "" && (
                <div className="absolute top-full left-0 right-0 mt-1 z-50 rounded-lg border bg-popover shadow-lg overflow-hidden">
                    <ScrollArea className="max-h-60">
                        {!users || users.length === 0 ? (
                            <div className="flex flex-col items-center gap-2 py-6 text-muted-foreground">
                                <MessageCircle className="h-8 w-8 opacity-50" />
                                <p className="text-sm">No users found</p>
                            </div>
                        ) : (
                            users.map((user) => (
                                <button
                                    key={user._id}
                                    onClick={() => handleSelectUser(user._id)}
                                    className="flex items-center gap-3 w-full px-3 py-2.5 hover:bg-accent transition-colors text-left"
                                >
                                    <Avatar className="h-9 w-9">
                                        <AvatarImage src={user.imageUrl} />
                                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                            {user.name?.slice(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium truncate">{user.name}</p>
                                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                                    </div>
                                </button>
                            ))
                        )}
                    </ScrollArea>
                </div>
            )}

            {isOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    );
}
