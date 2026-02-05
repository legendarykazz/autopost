import { Post, Platform } from './types';
import prisma from '@/lib/db';

export interface SocialResult {
    success: boolean;
    platform: Platform;
    postId?: string;
    error?: string;
}

export const AntigravityEngine = {
    /**
     * Main entry point to schedule or send a post.
     */
    dispatch: async (
        content: string,
        platforms: Platform[],
        mediaType: 'TEXT' | 'IMAGE' | 'VIDEO' = 'TEXT',
        mediaUrl?: string,
        scheduleDate?: Date
    ): Promise<SocialResult[]> => {
        console.log(`[Antigravity] Dispatching to [${platforms.join(', ')}]`);

        // 1. Get User (Singleton for MVP)
        const user = await prisma.user.findFirst({ include: { accounts: true } });
        if (!user) return platforms.map(p => ({ success: false, platform: p, error: 'No user found' }));

        const results: SocialResult[] = [];

        for (const platform of platforms) {
            const account = user.accounts.find(a => a.platform === platform && a.connected);

            if (!account) {
                results.push({ success: false, platform, error: 'Account not connected' });
                continue;
            }

            try {
                let resultId = '';

                // Route to specific handler
                switch (platform) {
                    case 'linkedin':
                        resultId = await postToLinkedin(account, content, mediaUrl);
                        break;
                    case 'facebook':
                        resultId = await postToFacebook(account, content, mediaUrl);
                        break;
                    case 'twitter':
                        resultId = await postToTwitter(account, content, mediaUrl);
                        break;
                    case 'instagram':
                        resultId = await postToInstagram(account, content, mediaUrl);
                        break;
                }

                results.push({ success: true, platform, postId: resultId });
            } catch (error: any) {
                console.error(`[Antigravity] ${platform} Error:`, error);
                results.push({ success: false, platform, error: error.message || 'API Error' });
            }
        }

        return results;
    },

    /**
     * Scheduled task runner (Called by API route or worker)
     */
    runScheduler: async () => {
        console.log('[Antigravity] Running Scheduler...');

        // 1. Find pending posts
        const posts = await prisma.post.findMany({
            where: {
                status: 'scheduled',
                scheduledDate: {
                    lte: new Date() // Less than or equal to now
                }
            }
        });

        console.log(`[Antigravity] Found ${posts.length} posts to publish.`);

        let processedCount = 0;

        for (const post of posts) {
            try {
                // Parse platforms from stored JSON
                // @ts-ignore
                const platforms: Platform[] = JSON.parse(post.platforms as string);

                // Dispatch
                const results = await AntigravityEngine.dispatch(
                    post.content,
                    platforms,
                    post.mediaType as 'TEXT' | 'IMAGE' | 'VIDEO',
                    post.mediaUrl || undefined
                );

                // Check overall success (if at least one platform succeeded, we consider it published)
                const anySuccess = results.some(r => r.success);

                // Update DB
                await prisma.post.update({
                    where: { id: post.id },
                    data: {
                        status: anySuccess ? 'published' : 'failed',
                        // Store detailed results if schema allowed, for now just status
                    }
                });

                processedCount++;

            } catch (error) {
                console.error(`[Antigravity] Failed to process post ${post.id}:`, error);
                await prisma.post.update({
                    where: { id: post.id },
                    data: { status: 'failed' }
                });
            }
        }

        return { processed: processedCount };
    }
};

// --- Platform Handlers ---

async function postToFacebook(account: any, content: string, mediaUrl?: string) {
    if (!account.accessToken.startsWith('mock_')) {
        // Real API Call
        const pageId = account.platformUser || 'me';
        let endpoint = `https://graph.facebook.com/v18.0/${pageId}/feed`;
        let body: any = { message: content };

        if (mediaUrl) {
            if (mediaUrl.match(/\.(mp4|mov)$/i)) {
                endpoint = `https://graph.facebook.com/v18.0/${pageId}/videos`;
                body = { description: content, file_url: mediaUrl };
            } else {
                endpoint = `https://graph.facebook.com/v18.0/${pageId}/photos`;
                body = { caption: content, url: mediaUrl };
            }
        }

        const res = await fetch(`${endpoint}?access_token=${account.accessToken}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(`Facebook API: ${err.error?.message}`);
        }
        const data = await res.json();
        return data.id;
    }

    // Mock Fallback
    await new Promise(r => setTimeout(r, 1000));
    return `fb_post_${Date.now()}`;
}

async function postToLinkedin(account: any, content: string, mediaUrl?: string) {
    if (!account.accessToken.startsWith('mock_')) {
        const personUrn = account.platformUser;
        if (!personUrn) throw new Error("Missing LinkedIn Person URN");

        const body: any = {
            author: personUrn,
            lifecycleState: "PUBLISHED",
            specificContent: {
                "com.linkedin.ugc.ShareContent": {
                    shareCommentary: { text: content },
                    shareMediaCategory: "NONE"
                }
            },
            visibility: { "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC" }
        };

        if (mediaUrl) {
            body.specificContent["com.linkedin.ugc.ShareContent"].shareMediaCategory = "ARTICLE";
            body.specificContent["com.linkedin.ugc.ShareContent"].media = [{
                status: "READY",
                description: { text: "Shared via AutoPost" },
                originalUrl: mediaUrl,
                title: { text: "View Content" }
            }];
        }

        const res = await fetch('https://api.linkedin.com/v2/ugcPosts', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${account.accessToken}`,
                'Content-Type': 'application/json',
                'X-Restli-Protocol-Version': '2.0.0'
            },
            body: JSON.stringify(body)
        });

        if (!res.ok) throw new Error(`LinkedIn API Failed: ${res.statusText}`);
        const data = await res.json();
        return data.id;
    }

    await new Promise(r => setTimeout(r, 1000));
    return `li_share_${Date.now()}`;
}

async function postToTwitter(account: any, content: string, mediaUrl?: string) {
    if (!account.accessToken.startsWith('mock_')) {
        const res = await fetch('https://api.twitter.com/2/tweets', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${account.accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: content + (mediaUrl ? ` ${mediaUrl}` : '') })
        });

        if (!res.ok) throw new Error(`X API Failed: ${res.statusText}`);
        const data = await res.json();
        return data.data.id;
    }

    await new Promise(r => setTimeout(r, 800));
    return `tweet_${Date.now()}`;
}

async function postToInstagram(account: any, content: string, mediaUrl?: string) {
    // Requires media
    if (!mediaUrl) throw new Error("Instagram requires an image or video");

    if (!account.accessToken.startsWith('mock_')) {
        const pageId = account.platformUser;
        // 1. Container
        const containerUrl = `https://graph.facebook.com/v18.0/${pageId}/media?image_url=${mediaUrl}&caption=${content}&access_token=${account.accessToken}`;
        const containerRes = await fetch(containerUrl, { method: 'POST' });
        if (!containerRes.ok) throw new Error("IG Container Failed");
        const container = await containerRes.json();

        // 2. Publish
        const publishUrl = `https://graph.facebook.com/v18.0/${pageId}/media_publish?creation_id=${container.id}&access_token=${account.accessToken}`;
        const pubRes = await fetch(publishUrl, { method: 'POST' });
        if (!pubRes.ok) throw new Error("IG Publish Failed");
        const data = await pubRes.json();
        return data.id;
    }

    await new Promise(r => setTimeout(r, 1500));
    return `ig_media_${Date.now()}`;
}
