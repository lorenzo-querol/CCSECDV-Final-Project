import logLevelData from "./log_levels";
import pino from "pino";
import pretty from "pino-pretty";

const logLevels = new Map(Object.entries(logLevelData));

export const getLogLevel = (logger) => {
    return logLevels.get(logger) || logLevels.get("*") || "info";
};

export const getLogger = () => {
    const logger = pino(
        pretty({
            colorize: true,
        })
    );

    return logger;
};
