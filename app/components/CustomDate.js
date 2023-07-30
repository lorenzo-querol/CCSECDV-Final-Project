import { format } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";

export default function CustomDate({ dateString }) {
	const dateToConvert = new Date(dateString);

	const philippineTimeZone = "Asia/Manila";
	const convertedDate = utcToZonedTime(dateToConvert, philippineTimeZone);

	const formattedDate = format(
		convertedDate,
		"eeee, MMMM d, yyyy - hh:mm:ss a",
		{
			timeZone: philippineTimeZone,
		},
	);

	return <time>{formattedDate}</time>;
}
