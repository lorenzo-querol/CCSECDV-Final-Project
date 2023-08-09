import { NextResponse } from 'next/server';
import logger from '@/utils/logger';

export async function GET(req) {
    logger.info('Hello world!');
    return new NextResponse('Hello world!');
}
