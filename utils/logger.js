import pino from "pino";
import pretty from "pino-pretty";

export const getLogger = () => {
	const logger = pino(
		pretty({
			colorize: true,
			translateTime: "yyyy-mm-dd HH:MM:ss",
			ignore: "pid,hostname",
			customPrettifiers: {
				time: (timestamp) => `[${timestamp}]`,
			},
		}),
	);

	return logger;
};
