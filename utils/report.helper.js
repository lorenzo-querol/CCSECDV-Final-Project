export const parseDuration = (duration) => {
	const [value, unit] = duration.split("_");
	const now = new Date();
	let offset = 0;

	switch (unit) {
		case "d":
			offset = value * 24 * 60 * 60 * 1000;
			break;
		case "h":
			offset = value * 60 * 60 * 1000;
			break;
		case "m":
			offset = value * 60 * 1000;
			break;
	}

	return new Date(now.getTime() + offset);
};
