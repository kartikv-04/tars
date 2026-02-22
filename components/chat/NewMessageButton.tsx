"use client";

import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";

interface NewMessageButtonProps {
    onClick: () => void;
}

export function NewMessageButton({ onClick }: NewMessageButtonProps) {
    return (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 animate-in fade-in slide-in-from-bottom-2">
            <Button
                onClick={onClick}
                size="sm"
                variant="secondary"
                className="rounded-full shadow-lg gap-1.5 px-4 text-xs"
            >
                <ArrowDown className="h-3 w-3" />
                New messages
            </Button>
        </div>
    );
}
