import { isToday, isThisYear, format } from "date-fns";

export function formatMessageTime(timestamp: number): string {
    const date = new Date(timestamp);

    if (isToday(date)) {
        return format(date, "h:mm a"); // "2:34 PM"
    }

    if (isThisYear(date)) {
        return format(date, "MMM d, h:mm a"); // "Feb 15, 2:34 PM"
    }

    return format(date, "MMM d yyyy, h:mm a"); // "Feb 15 2023, 2:34 PM"
}
