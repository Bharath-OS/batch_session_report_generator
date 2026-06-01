import { NextRequest, NextResponse } from 'next/server';
import { GOOGLE_SHEET_URL } from '@/lib/config';

export async function GET() {
    console.log('Proxy GET started for:', GOOGLE_SHEET_URL);
    try {
        if (!GOOGLE_SHEET_URL) throw new Error('GOOGLE_SHEET_URL is not defined in environment variables or config.ts');

        const response = await fetch(GOOGLE_SHEET_URL, {
            cache: 'no-store',
            redirect: 'follow'
        });

        console.log('Google Script Response Status:', response.status);

        const text = await response.text();

        if (!response.ok) {
            console.error('Google Script Error Response:', text);
            return NextResponse.json({
                error: `Google Script returned ${response.status}`,
                details: text
            }, { status: response.status });
        }

        try {
            const data = JSON.parse(text);
            return NextResponse.json(data);
        } catch {
            console.error('Failed to parse Google Script response as JSON:', text);
            return NextResponse.json({
                error: 'Invalid JSON from Google Script',
                details: text.substring(0, 500)
            }, { status: 500 });
        }
    } catch (error: unknown) {
        const err = error as Error;
        console.error('Proxy GET Error:', err);
        return NextResponse.json({
            error: err.message || 'Failed to fetch from Google Sheets'
        }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    console.log('Proxy POST started');
    try {
        if (!GOOGLE_SHEET_URL) throw new Error('GOOGLE_SHEET_URL is not defined in environment variables or config.ts');

        const body = (await request.json()) as Record<string, unknown>;
        console.log('Proxy POST body:', body);

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 15000);

        const response = await fetch(GOOGLE_SHEET_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
            redirect: 'follow',
            signal: controller.signal,
        }).finally(() => clearTimeout(timeout));

        console.log('Google Script POST Response Status:', response.status);
        const result = await response.text();
        console.log('Google Script POST Result:', result);

        if (!response.ok) {
            return NextResponse.json({
                error: `Google Script returned status ${response.status}`,
                message: result,
                sentBody: body
            }, { status: response.status });
        }

        try {
            return NextResponse.json({
                message: JSON.parse(result),
                sentBody: body
            });
        } catch {
            return NextResponse.json({
                message: result,
                sentBody: body
            });
        }
    } catch (error: unknown) {
        const err = error as Error;
        console.error('Proxy POST Error:', err);
        const message = err.name === 'AbortError'
            ? 'Google Script request timed out after 15 seconds'
            : err.message || 'Failed to update Google Sheets';
        return NextResponse.json({
            error: message
        }, { status: 500 });
    }
}
