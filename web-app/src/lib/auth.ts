import { cookies } from 'next/headers';
import prisma from '@/lib/db';

export async function getCurrentUser() {
    const cookieStore = await cookies();
    const userId = cookieStore.get('userId')?.value;

    if (!userId) {
        return null;
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { accounts: true } // eager load accounts often needed
        });
        return user;
    } catch (e) {
        return null;
    }
}
