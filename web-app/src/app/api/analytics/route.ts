import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/db';

export async function GET() {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 1. Get Total Stats (Filtered by User)
        const totalPosts = await prisma.post.count({
            where: { userId: user.id }
        });

        // Prisma doesn't support deep relation filtering in aggregate easily so we might need raw query or 
        // filter by posts that have this userId.
        // Actually, aggregate doesn't support 'where: { post: { userId: ... } }' directly in some versions,
        // but let's try the modern way.

        // Alternative: Fetch all user's posts IDs, then aggregate engagement where postId in IDs.
        const userPosts = await prisma.post.findMany({
            where: { userId: user.id },
            select: { id: true }
        });
        const postIds = userPosts.map(p => p.id);

        const aggregation = await prisma.engagement.aggregate({
            where: {
                postId: { in: postIds }
            },
            _sum: {
                likes: true,
                comments: true,
                shares: true
            }
        });

        const totalLikes = aggregation._sum.likes || 0;
        const totalComments = aggregation._sum.comments || 0;
        const totalShares = aggregation._sum.shares || 0;
        const totalEngagement = totalLikes + totalComments + totalShares;

        return NextResponse.json({
            overview: {
                impressions: totalEngagement * 12,
                engagementRate: totalPosts > 0 ? (totalEngagement / (totalPosts * 100)).toFixed(2) + '%' : '0%',
                followers: 120, // Still mock
                posts: totalPosts
            },
            engagement: {
                likes: totalLikes,
                comments: totalComments,
                shares: totalShares,
                total: totalEngagement
            }
        });
    } catch (error) {
        console.error('Analytics API Error:', error);
        return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
    }
}
