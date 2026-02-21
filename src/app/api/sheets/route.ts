import { NextRequest, NextResponse } from 'next/server';
// @ts-ignore
import { GOOGLE_SHEET_URL } from '../../../../app-config';

export async function GET() {
    console.log('Proxy GET started for:', GOOGLE_SHEET_URL);
    try {
        if (!GOOGLE_SHEET_URL) throw new Error('GOOGLE_SHEET_URL is not defined in app-config.js');

        const response = await fetch(GOOGLE_SHEET_URL, {
            cache: 'no-store',
            redirect: 'follow'
        });

        console.log('Google Script Response Status:', response.status);

        const contentType = response.headers.get('content-type');
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
        } catch (e) {
            console.error('Failed to parse Google Script response as JSON:', text);
            return NextResponse.json({
                error: 'Invalid JSON from Google Script',
                details: text.substring(0, 500)
            }, { status: 500 });
        }
    } catch (error: any) {
        console.error('Proxy GET Error:', error);
        return NextResponse.json({
            error: error.message || 'Failed to fetch from Google Sheets'
        }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    console.log('Proxy POST started');
    try {
        if (!GOOGLE_SHEET_URL) throw new Error('GOOGLE_SHEET_URL is not defined in app-config.js');

        const body = await request.json();
        console.log('Proxy POST body:', body);

        const response = await fetch(GOOGLE_SHEET_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
            redirect: 'follow'
        });

        console.log('Google Script POST Response Status:', response.status);
        const result = await response.text();
        console.log('Google Script POST Result:', result);

        // Apps Script might return JSON or plain text
        try {
            return NextResponse.json({
                message: JSON.parse(result),
                sentBody: body
            }, { status: response.status });
        } catch (e) {
            return NextResponse.json({
                message: result,
                sentBody: body
            }, { status: response.status });
        }
    } catch (error: any) {
        console.error('Proxy POST Error:', error);
        return NextResponse.json({
            error: error.message || 'Failed to update Google Sheets'
        }, { status: 500 });
    }
}
