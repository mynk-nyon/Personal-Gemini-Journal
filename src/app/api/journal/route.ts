import { NextResponse } from 'next/server';
import { getVerifiedUid, adminDb } from '@/lib/firebase/admin';
import { summaryModel } from '@/lib/gemini';
import { journalSummarizerPrompt } from '@/prompts';

export async function POST(req: Request) {
  try {
    // 1. Authenticate & Authorize
    const authHeader = req.headers.get('Authorization');
    const uid = await getVerifiedUid(authHeader);

    // 2. Input Validation
    const body = await req.json();
    const { history } = body;

    if (!Array.isArray(history) || history.length === 0) {
      return NextResponse.json({ error: 'Invalid or empty history' }, { status: 400 });
    }

    // Prepare conversation text for the summarizer
    const conversationText = history.map(msg => 
      `${msg.role.toUpperCase()}: ${msg.content}`
    ).join('\n');

    const prompt = `${journalSummarizerPrompt}\n\nCONVERSATION:\n${conversationText}`;

    // 3. Call Gemini (Intelligence Engine)
    const result = await summaryModel.generateContent(prompt);
    const jsonString = result.response.text();
    
    // Parse to ensure it's valid JSON
    let journalData;
    try {
      journalData = JSON.parse(jsonString);
    } catch (e) {
      console.error('Failed to parse Gemini output as JSON:', jsonString);
      return NextResponse.json({ error: 'Failed to generate valid journal summary' }, { status: 500 });
    }

    // 4. Save to Firestore ensuring Data Isolation
    // Structure: users/{uid}/journalEntries/{entryId}
    const newEntryRef = adminDb.collection('users').doc(uid).collection('journalEntries').doc();
    
    const docData = {
      entryId: newEntryRef.id,
      uid, // Immutable ownership field
      title: journalData.title || 'Untitled Entry',
      summary: journalData.summary || '',
      themes: journalData.themes || [],
      mood: journalData.mood || 'Neutral',
      actionItems: journalData.actionItems || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await newEntryRef.set(docData);

    return NextResponse.json({ success: true, entry: docData });
  } catch (error: any) {
    console.error('Journal API Error:', error);
    if (error.message.includes('Unauthorized')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
