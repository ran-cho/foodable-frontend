import { format, isToday, isYesterday } from "date-fns";

export function formatSmartDate(dateStringOrDate: string | Date) {
  
  const date = typeof dateStringOrDate === "string" ? new Date(dateStringOrDate) : dateStringOrDate;

  if (isToday(date)) return format(date, "h:mm a");
  if (isYesterday(date)) return "Yesterday";
  return format(date, "MMM d, yyyy h:mm a");
}
