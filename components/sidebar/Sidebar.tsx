"use client";

import { UserButton } from "@clerk/nextjs";
import { UserSearch } from "./UserSearch";
import { ConversationList } from "./ConversationList";
import { Separator } from "@/components/ui/separator";
import { MessageSquare } from "lucide-react";

export function Sidebar() {
    return (
        <aside className="w-80 border-r bg-card flex flex-col h-full">
            {/* Header */}
            <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    <h1 className="text-lg font-bold tracking-tight">Tars</h1>
                </div>
                <UserButton
                    appearance={{
                        elements: {
                            avatarBox: "h-8 w-8",
                        },
                    }}
                />
            </div>

            <Separator />

            {/* Search */}
            <div className="p-3">
                <UserSearch />
            </div>

            {/* Conversations */}
            <ConversationList />
        </aside>
    );
}
