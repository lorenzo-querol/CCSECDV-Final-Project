import { getLogger } from "@/utils/logger";

export async function GET(req) {
    const logger = getLogger();

    logger.info("Hello world!");
    return new Response("Hello world!");
}
