import { NextResponse, NextRequest } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/db';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ platform: string }> }
) {
    const { platform } = await params;
    const url = new URL(request.url);
    const code = url.searchParams.get('code');

    if (!code) {
        return NextResponse.json({ error: 'No code provided' }, { status: 400 });
    }

    try {
        // 1. Validate User Session
        const user = await getCurrentUser();
        if (!user) {
            // If they aren't logged in, they shouldn't be connecting an account.
            // Redirect to login.
            return NextResponse.redirect(new URL('/login', request.url));
        }

        // 2. Mock Token Exchange (Simulated)
        let accessToken = '';
        let refreshToken = '';
        let authData = '';

        if (code === 'MOCK_CODE_123') {
            accessToken = `mock_access_token_${platform}_${Date.now()}`;
            refreshToken = `mock_refresh_token`;
            authData = JSON.stringify({ scope: 'mock_scope', expires_in: 3600 });
        } else {
            // Real exchange logic would go here
        }

        // 3. Find existing connection or create new FOR THIS USER
        const existingAccount = await prisma.socialAccount.findFirst({
            where: {
                userId: user.id, // Crucial Change: Bind to Session User
                platform: platform
            }
        });

        if (existingAccount) {
            await prisma.socialAccount.update({
                where: { id: existingAccount.id },
                data: {
                    accessToken,
                    refreshToken,
                    authData,
                    connected: true,
                    updatedAt: new Date()
                }
            });
        } else {
            await prisma.socialAccount.create({
                data: {
                    userId: user.id,
                    platform,
                    accessToken,
                    refreshToken,
                    authData,
                    connected: true
                }
            });
        }

        return NextResponse.redirect(new URL('/accounts', request.url));

    } catch (error) {
        console.error('Auth Error:', error);
        return NextResponse.redirect(new URL('/accounts?error=auth_failed', request.url));
    }
}
