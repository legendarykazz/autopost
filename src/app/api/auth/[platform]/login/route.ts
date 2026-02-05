import { NextResponse } from 'next/server';
import { Platform } from '@/lib/types';

export async function GET(
    request: Request,
    { params }: { params: { platform: string } }
) {
    const platform = params.platform as Platform;

    // Real App: Redirect to actual OAuth providers
    // For MVP Phase 2: We will simulate the redirect for now, 
    // but structred to swap in real URLs easily.

    let authUrl = '';
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/${platform}/callback`;
    const state = 'random_state_string'; // Should be secure

    switch (platform) {
        case 'linkedin':
            const liClientId = process.env.LINKEDIN_CLIENT_ID;
            authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${liClientId}&redirect_uri=${redirectUri}&state=${state}&scope=w_member_social%20profile%20email`;
            break;
        case 'facebook':
            // ...
            authUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=...`;
            break;
        default:
            return NextResponse.json({ error: 'Unsupported platform' }, { status: 400 });
    }

    // NOTE: since we don't have real keys yet, we'll redirect to a mock success page 
    // or the callback with a fake code to demonstrate the flow if keys are missing.
    if (!process.env.LINKEDIN_CLIENT_ID) {
        console.log(`[MockAuth] No keys found for ${platform}. Redirecting to callback with mock code.`);
        return NextResponse.redirect(`${redirectUri}?code=MOCK_CODE_123&state=${state}`);
    }

    return NextResponse.redirect(authUrl);
}
