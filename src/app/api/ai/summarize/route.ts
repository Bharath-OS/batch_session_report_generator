import { NextRequest, NextResponse } from 'next/server';
import { GROQ_API_KEY, GROQ_MODEL } from '@/lib/config';

function sanitizePrompt(text: string): string {
    return text
        .replace(/\p{Extended_Pictographic}/gu, '')
        .replace(/\u00A9|\u00AE|[\u2000-\u2BFF]|[\uFE00-\uFEFF]|[\uFFF0-\uFFFF]/gu, '')
        .replace(/\s+/g, ' ')
        .trim();
}

const SYSTEM_INSTRUCTION = `You are a session report summarizer for a coding academy. Your task is to generate a concise session summary based on the user's input.

Rules:
- Write in first person perspective (use "we", "the students", "the session")
- Return ONLY 1-2 paragraphs, no bullet points or numbered lists
- Structure: what the task was → what they did during the session → whether it helped the students improve (skip this part only if not mentioned)
- Write in plain text — do not use any markdown, asterisks, bold, or special formatting
- If the user's input is NOT about a session, activity, or class (e.g. "hello", "how are you", "create a website", random text), respond with: "Please provide a brief summary or description of what was covered in today's session."
- If the user gives explicit formatting instructions (like "make it 3 paragraphs"), follow those instead of the defaults`;

export async function POST(request: NextRequest) {
    try {
        const { prompt } = (await request.json()) as { prompt?: string };

        if (!prompt || !prompt.trim()) {
            return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
        }

        if (!GROQ_API_KEY) {
            return NextResponse.json({ error: 'Groq API key is not configured' }, { status: 500 });
        }

        const cleanPrompt = sanitizePrompt(prompt);

        if (!cleanPrompt) {
            return NextResponse.json({ error: 'Prompt contains only special characters. Please write a text description of the session.' }, { status: 400 });
        }

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GROQ_API_KEY}`,
            },
            body: JSON.stringify({
                model: GROQ_MODEL,
                messages: [
                    { role: 'system', content: SYSTEM_INSTRUCTION },
                    { role: 'user', content: cleanPrompt },
                ],
                temperature: 0.7,
                max_tokens: 1024,
            }),
        });

        const data = (await response.json()) as {
            choices?: Array<{
                message?: { content?: string };
                finish_reason?: string;
            }>;
            error?: { message?: string };
        };

        if (!response.ok) {
            const groqMsg = data.error?.message || '';
            if (groqMsg.includes('rate_limit') || groqMsg.includes('Rate limit') || groqMsg.includes('quota') || groqMsg.includes('unavailable')) {
                return NextResponse.json({ error: 'AI service is currently busy. Please wait a moment and try again.' }, { status: 503 });
            }
            return NextResponse.json({ error: groqMsg || `Groq API returned ${response.status}` }, { status: response.status });
        }

        const choice = data.choices?.[0];
        if (!choice) {
            return NextResponse.json({ error: 'AI returned no response choices' }, { status: 500 });
        }

        if (choice.finish_reason === 'length') {
            return NextResponse.json({ error: 'AI response was too long and got cut off. Try a shorter prompt.' }, { status: 500 });
        }

        const summary = choice.message?.content?.trim();

        if (!summary) {
            return NextResponse.json({ error: 'AI returned an empty response' }, { status: 500 });
        }

        return NextResponse.json({ summary });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Internal server error';
        console.error('Summarize error:', message);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}