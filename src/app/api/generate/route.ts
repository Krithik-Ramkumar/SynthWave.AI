import { generateWebsiteFromDescription } from '@/ai/flows/generate-website-from-description';
import {NextResponse} from 'next/server';

// Simple in-memory rate limiter
const rateLimit = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): { allowed: boolean; error?: string } {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute window
  const maxRequests = 10; // Max 10 requests per minute

  const record = rateLimit.get(ip);

  if (!record || now > record.resetTime) {
    // First request or window expired
    rateLimit.set(ip, { count: 1, resetTime: now + windowMs });
    return { allowed: true };
  }

  if (record.count >= maxRequests) {
    return { allowed: false, error: 'Rate limit exceeded. Please try again later.' };
  }

  record.count++;
  return { allowed: true };
}

// Input validation
function validateDescription(description: string): { valid: boolean; error?: string } {
  if (!description || typeof description !== 'string') {
    return { valid: false, error: 'Description is required and must be a string' };
  }

  const trimmed = description.trim();
  if (trimmed.length === 0) {
    return { valid: false, error: 'Description cannot be empty' };
  }

  if (trimmed.length < 10) {
    return { valid: false, error: 'Description must be at least 10 characters long' };
  }

  if (trimmed.length > 5000) {
    return { valid: false, error: 'Description must be less than 5000 characters' };
  }

  // Basic sanitization - remove potential script tags
  const sanitized = trimmed.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  return { valid: true, sanitizedDescription: sanitized };
}

export async function POST(req: Request) {
  try {
    // Get client IP for rate limiting
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ||
               req.headers.get('x-real-ip') ||
               'unknown';

    // Check rate limit
    const rateLimitCheck = checkRateLimit(ip);
    if (!rateLimitCheck.allowed) {
      return NextResponse.json({ error: rateLimitCheck.error }, { status: 429 });
    }

    const body = await req.json();
    const { description } = body;

    // Validate input
    const validation = validateDescription(description);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    if (!process.env.GROQ_API_KEY) {
      console.error('GROQ_API_KEY is missing');
      return NextResponse.json({ error: 'Server configuration error: Missing Groq API Key' }, { status: 500 });
    }

    const html = await generateWebsiteFromDescription({ description: validation.sanitizedDescription! });

    if (html && typeof html === 'string' && html.trim().length > 0) {
      console.log(`Successfully generated website for IP: ${ip}, description length: ${description.length}`);
      return NextResponse.json({ html });
    } else {
      console.error(`AI generation failed for IP: ${ip}`);
      return NextResponse.json({ error: 'AI failed to generate a response.' }, { status: 500 });
    }

  } catch (error) {
    console.error('Error in generate route:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    });
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: 'Failed to generate website', details: errorMessage }, { status: 500 });
  }
}