import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/db';

export async function GET() {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const queue = await prisma.post.findMany({
            where: {
                userId: user.id, // Security: Only fetch own posts
                status: 'QUEUED'
            },
            orderBy: {
                queuePosition: 'asc'
            }
        });

        return NextResponse.json(queue);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch queue' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { items } = body; // Array of { id, queuePosition }

        // Security: Verify these posts belong to the user before updating
        // For MVP speed, we'll just add the userId clause to the updateMany/update

        // Transactional update
        await prisma.$transaction(
            items.map((item: any) =>
                prisma.post.update({
                    where: {
                        id: item.id,
                        userId: user.id // Security: Ensure ownership
                    },
                    data: { queuePosition: item.queuePosition }
                })
            )
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to reorder' }, { status: 500 });
    }
}
