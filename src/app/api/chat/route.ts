import { NextResponse } from 'next/server';
import { getVerifiedUid } from '@/lib/firebase/admin';
import { chatModel } from '@/lib/gemini';
import { journalAssistantPrompt } from '@/prompts';

export async function POST(req: Request) {
  try {
    // 1. Authenticate & Authorize
    const authHeader = req.headers.get('Authorization');
    const uid = await getVerifiedUid(authHeader);

    // 2. Input Validation
    const body = await req.json();
    const { history, message } = body;

    if (!message || typeof message !== 'string' || message.length > 2000) {
      return NextResponse.json({ error: 'Invalid message payload' }, { status: 400 });
    }

    if (!Array.isArray(history)) {
      return NextResponse.json({ error: 'Invalid history payload' }, { status: 400 });
    }

    // 3. Format history for Gemini API
    const formattedHistory = [
      { role: "user", parts: [{ text: journalAssistantPrompt }] },
      { role: "model", parts: [{ text: "Understood. I am ready to assist the user securely." }] },
    ];

    for (const msg of history) {
      formattedHistory.push({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      });
    }

    // 4. Call Gemini
    const chat = chatModel.startChat({
      history: formattedHistory,
    });

    const result = await chat.sendMessage(message);
    const responseText = result.response.text();

    return NextResponse.json({ response: responseText });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    if (error.message.includes('Unauthorized')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
