export type Platform = 'facebook' | 'instagram' | 'linkedin' | 'twitter';

export type SocialAccount = {
    id: string;
    platform: Platform;
    connected: boolean;
    username?: string;
    avatarUrl?: string;
};

export type Post = {
    id: string;
    content: string;

    // Media
    mediaType: 'TEXT' | 'IMAGE' | 'VIDEO';
    mediaUrl?: string;

    platforms: Platform[];

    // Schedule/Queue
    scheduledDate?: Date;
    queuePosition?: number;

    status: 'draft' | 'scheduled' | 'queued' | 'published' | 'failed';
    createdAt: Date;
    stats?: {
        likes: number;
        comments: number;
        shares: number;
    };
};

export type DashboardStats = {
    totalPosts: number;
    totalLikes: number;
    totalComments: number;
    growth: number; // percentage
};
