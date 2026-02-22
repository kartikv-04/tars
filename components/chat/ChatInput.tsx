"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { SendHorizontal } from "lucide-react";
import { useTyping } from "@/hooks/useTyping";

interface ChatInputProps {
    conversationId: Id<"conversations">;
}

export function ChatInput({ conversationId }: ChatInputProps) {
    const [message, setMessage] = useState("");
    const sendMessage = useMutation(api.messages.sendMessage);
    const { emitTyping, stopTyping } = useTyping(conversationId);

    const handleSend = async () => {
        const trimmed = message.trim();
        if (!trimmed) return;

        setMessage("");
        stopTyping();
        await sendMessage({
            conversationId,
            content: trimmed,
        });
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="border-t bg-card/80 backdrop-blur-sm p-3">
            <div className="flex items-end gap-2 max-w-4xl mx-auto">
                <div className="flex-1 relative">
                    <textarea
                        value={message}
                        onChange={(e) => {
                            setMessage(e.target.value);
                            emitTyping();
                        }}
                        onKeyDown={handleKeyDown}
                        placeholder="Type a message..."
                        rows={1}
                        className="w-full resize-none rounded-xl border bg-muted/50 px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 placeholder:text-muted-foreground max-h-32"
                        style={{ minHeight: "40px" }}
                    />
                </div>
                <Button
                    onClick={handleSend}
                    disabled={!message.trim()}
                    size="icon"
                    className="h-10 w-10 rounded-xl shrink-0"
                >
                    <SendHorizontal className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
