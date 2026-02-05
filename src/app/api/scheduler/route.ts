import { NextResponse } from 'next/server';
import { AntigravityEngine } from '@/lib/antigravity';

export const dynamic = 'force-dynamic'; // Prevent caching

export async function GET() {
    try {
        const result = await AntigravityEngine.runScheduler();
        return NextResponse.json({ success: true, ...result });
    } catch (error) {
        console.error('Scheduler Error:', error);
        return NextResponse.json({ error: 'Scheduler Failed' }, { status: 500 });
    }
}
