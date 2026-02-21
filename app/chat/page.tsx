import { MessageSquare } from "lucide-react";

export default function ChatPage() {
    return (
        <div className="flex-1 flex items-center justify-center bg-background">
            <div className="text-center space-y-3">
                <div className="mx-auto w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
                    <MessageSquare className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                    <h2 className="text-lg font-semibold">Welcome to Tars</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        Select a conversation or search for a user to start chatting
                    </p>
                </div>
            </div>
        </div>
    );
}
