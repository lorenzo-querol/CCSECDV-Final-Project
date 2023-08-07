import { getLogger } from '@/utils/logger';
import { NextResponse } from 'next/server';

export async function GET(req) {
    const logger = getLogger();

    logger.info('Hello world!');
    return new NextResponse('Hello world!');
}
