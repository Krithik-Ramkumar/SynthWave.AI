import { generateWebsiteFromDescription } from '@/ai/flows/generate-website-from-description';
import {NextResponse} from 'next/server';

export async function POST(req: Request) {
  try {
    const { description } = await req.json();

    if (!description) {
      return NextResponse.json({ error: 'Description is required' }, { status: 400 });
    }

    if (!process.env.GROQ_API_KEY) {
      console.error('GROQ_API_KEY is missing');
      return NextResponse.json({ error: 'Server configuration error: Missing Groq API Key' }, { status: 500 });
    }

    const html = await generateWebsiteFromDescription({ description });
    
    if (html && typeof html === 'string' && html.trim().length > 0) {
      return NextResponse.json({ html });
    } else {
      return NextResponse.json({ error: 'AI failed to generate a response.' }, { status: 500 });
    }

  } catch (error) {
    console.error('Error in generate route:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: 'Failed to generate website', details: errorMessage }, { status: 500 });
  }
}