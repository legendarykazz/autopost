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
            // Real Token Exchange
            const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/${platform}/callback`;

            if (platform === 'linkedin') {
                const params = new URLSearchParams();
                params.append('grant_type', 'authorization_code');
                params.append('code', code);
                params.append('redirect_uri', redirectUri);
                params.append('client_id', process.env.LINKEDIN_CLIENT_ID!);
                params.append('client_secret', process.env.LINKEDIN_CLIENT_SECRET!);

                const tokenRes = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: params
                });

                if (!tokenRes.ok) {
                    const errorText = await tokenRes.text();
                    console.error('LinkedIn Token Error:', errorText);
                    throw new Error(`LinkedIn Token Exchange Failed: ${tokenRes.statusText}`);
                }

                const data = await tokenRes.json();
                accessToken = data.access_token;
                refreshToken = data.refresh_token || ''; // LinkedIn v2 might not return refresh token for standard scopes immediately/always
                authData = JSON.stringify({ scope: data.scope, expires_in: data.expires_in });
            }
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
