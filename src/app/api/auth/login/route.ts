import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_CONFIG } from '@/lib/config';

export async function POST(request: NextRequest) {
    try {
        const { email, password } = (await request.json()) as { email?: string; password?: string };

        if (email === ADMIN_CONFIG.email && password === ADMIN_CONFIG.password) {
            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    } catch {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
}
