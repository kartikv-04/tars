"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/sidebar/Sidebar";

export default function ChatLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    // On mobile, hide sidebar when viewing a conversation
    const isConversationView = pathname !== "/chat";

    return (
        <div className="flex h-screen">
            {/* Sidebar: always visible on md+, hidden on mobile when in conversation */}
            <div className={`${isConversationView ? "hidden md:flex" : "flex"} w-full md:w-80 shrink-0`}>
                <Sidebar />
            </div>

            {/* Main: always visible on md+, hidden on mobile when on /chat (showing sidebar instead) */}
            <main className={`${isConversationView ? "flex" : "hidden md:flex"} flex-1 flex-col`}>
                {children}
            </main>
        </div>
    );
}
