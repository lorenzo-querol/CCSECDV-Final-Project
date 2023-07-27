import { format, parseISO } from "date-fns";

export default function CustomDate({ dateString }) {
    const date = parseISO(dateString) || new Date();

    if (dateString !== undefined)
        return (
            <time dateTime={date}>
                {format(date, "LLLL d, yyyy - HH:mm a")}
            </time>
        );

    return (
        <time dateTime={date}>{format(date, "LLLL d, yyyy - HH:mm a")}</time>
    );
}
