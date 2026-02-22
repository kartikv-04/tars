import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    subtitle?: string;
    className?: string;
}

export function EmptyState({ icon: Icon, title, subtitle, className = "" }: EmptyStateProps) {
    return (
        <div className={`flex flex-col items-center justify-center gap-3 py-12 text-muted-foreground ${className}`}>
            <div className="w-14 h-14 rounded-2xl bg-muted/50 flex items-center justify-center">
                <Icon className="h-7 w-7 opacity-40" />
            </div>
            <div className="text-center">
                <p className="text-sm font-medium">{title}</p>
                {subtitle && <p className="text-xs mt-1 opacity-70">{subtitle}</p>}
            </div>
        </div>
    );
}
