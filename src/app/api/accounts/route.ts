import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/db';

export async function GET() {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const accounts = await prisma.socialAccount.findMany({
            where: { userId: user.id }
        });

        return NextResponse.json(accounts);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch accounts' }, { status: 500 });
    }
}
