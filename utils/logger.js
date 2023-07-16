import pino from "pino";
import pretty from "pino-pretty";

export const getLogger = () => {
    const logger = pino(
        pretty({
            colorize: true,
        })
    );

    return logger;
};
