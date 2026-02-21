"use client";

import { ReactNode } from "react";
import { Sidebar } from "@/components/sidebar/Sidebar";

export default function ChatLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex h-screen">
            <Sidebar />
            <main className="flex-1 flex flex-col">{children}</main>
        </div>
    );
}
