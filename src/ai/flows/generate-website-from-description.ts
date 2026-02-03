'use server';

/**
 * @fileOverview Generates a website based on a user-provided description.
 *
 * - generateWebsiteFromDescription - A function that generates a website based on a description.
 * - GenerateWebsiteFromDescriptionInput - The input type for the generateWebsiteFromDescription function.
 */

import Groq from 'groq-sdk';

export interface GenerateWebsiteFromDescriptionInput {
  description: string;
}

export async function generateWebsiteFromDescription(
  input: GenerateWebsiteFromDescriptionInput
): Promise<string> {
  const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });

  const chatCompletion = await groq.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: 'You are an expert web developer creating a complete, production-ready website based on a user\'s description.',
      },
      {
        role: 'user',
        content: `You are a world-class Senior Web Developer and UI/UX Designer. Your goal is to create a stunning, professional, and highly conversion-oriented website based on the user's description.

    User Description: "${input.description}"
    
    CRITICAL TECHNICAL REQUIREMENTS:
    1.  **Frameworks:** 
        *   Tailwind CSS via CDN.
        *   AOS (Animate On Scroll) library via CDN (https://unpkg.com/aos@2.3.1/dist/aos.js and https://unpkg.com/aos@2.3.1/dist/aos.css). Initialize it with AOS.init({ duration: 1000, once: true }); in the script.
    2.  **Architecture:** Generate a single, self-contained HTML5 file. All CSS in <style>, all JS in <script> before </body>.
    3.  **Imagery:** Use high-quality, relevant images from 'https://images.unsplash.com/photo-...' or 'https://picsum.photos/seed/...'. Ensure images have proper aspect ratios and object-fit properties.
    4.  **Icons:** Use ONLY inline SVG icons. Ensure they are sized correctly and match the design aesthetic.
    5.  **Responsiveness:** Mobile-first, ultra-wide optimized.

    ADVANCED VISUAL EFFECTS & UI:
    1.  **Scroll Animations:** Use data-aos attributes (e.g., fade-up, fade-right, zoom-in) on all major sections and cards to create a premium, dynamic feel.
    2.  **Glassmorphism:** Use semi-transparent backgrounds with backdrop-blur-md for navigation bars, cards, and overlays to add modern depth.
    3.  **Micro-interactions:** Add smooth hover transitions (transition-all duration-300) to all buttons, links, and interactive elements.
    4.  **Gradient Depth:** Utilize complex Tailwind gradients (e.g., bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500) for backgrounds or accents where appropriate.
    5.  **Typography:** Use a professional Google Font pairing (e.g., 'Outfit' for headings, 'Plus Jakarta Sans' for body) imported via CDN.
    4.  **Sections to Include (unless specifically asked otherwise):**
        *   Sticky Navigation Bar with Logo and CTA button.
        *   Hero Section: Compelling headline, subheadline, and primary/secondary CTAs.
        *   Features/Services: Grid layout with icons and descriptions.
        *   Social Proof: Testimonials or Client Logos.
        *   About/Process: Narrative section explaining the value proposition.
        *   Contact/Footer: Clean footer with links and a simple contact form shell.

    OUTPUT INSTRUCTIONS:
    *   Return ONLY the raw HTML code.
    *   Do NOT include markdown formatting, backticks ( \`\`\` ), or "Here is your code" text.
    *   Ensure the code is clean, commented, and ready for production.

    Create the masterpiece now.`,
      },
    ],
    model: 'llama-3.3-70b-versatile',
  });

  const text = chatCompletion.choices[0]?.message?.content || '';
  const cleanedOutput = text.replace(/```html/g, '').replace(/```/g, '').trim();
  return cleanedOutput;
}