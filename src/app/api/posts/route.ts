import { NextResponse } from 'next/server';
import { AntigravityEngine } from '@/lib/antigravity';
import { Platform } from '@/lib/types';
import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/db';

export async function POST(request: Request) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { content, platforms, scheduledDate, mediaType, mediaUrl } = body;

        if (!content && !mediaUrl) {
            return NextResponse.json({ error: 'Content or Media is required.' }, { status: 400 });
        }

        if (!platforms || platforms.length === 0) {
            return NextResponse.json({ error: 'At least one platform is required.' }, { status: 400 });
        }

        // 1. Determine Status
        const isScheduled = !!scheduledDate;
        const status = isScheduled ? 'scheduled' : 'queued'; // or PUBLISHED if we want immediate

        // 2. Save to DB
        const post = await prisma.post.create({
            data: {
                userId: user.id,
                content: content || '',
                mediaType: mediaType || 'TEXT',
                mediaUrl,
                platforms: JSON.stringify(platforms),
                status: status,
                scheduledDate: isScheduled ? new Date(scheduledDate) : undefined,
                queuePosition: 100 // Logic to put at end of queue needed
            }
        });

        // 3. Dispatch (If Instant)
        // Only dispatch immediately if NOT scheduled.
        let results = null;
        if (!isScheduled) {
            results = await AntigravityEngine.dispatch(
                content,
                platforms as Platform[],
                mediaType || 'TEXT',
                mediaUrl,
                undefined
            );

            // Should update status to PUBLISHED here ideally
        }

        return NextResponse.json({
            success: true,
            message: isScheduled ? 'Post scheduled successfully' : 'Post dispatched successfully',
            post,
            results
        });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
