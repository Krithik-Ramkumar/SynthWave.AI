'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Wand2 } from 'lucide-react';
import { Textarea } from '../ui/textarea';

export default function GeneratorWizard() {
  const [prompt, setPrompt] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (prompt.trim()) {
      router.push(`/creation?prompt=${encodeURIComponent(prompt.trim())}`);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative group w-full">
      <Textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Describe the website you want to create... e.g., 'a landing page for a new AI startup'"
        className="w-full pl-6 pr-14 py-4 text-lg bg-transparent border-2 border-primary/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow duration-500 ease-in-out shadow-[0_0_0_0px_hsl(var(--primary)/0.2)] group-hover:shadow-[0_0_30px_5px_hsl(var(--primary)/0.2)] min-h-[60px] resize-none"
        rows={1}
      />
      <button
        type="submit"
        disabled={!prompt.trim()}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-primary rounded-full text-primary-foreground disabled:bg-gray-500 disabled:cursor-not-allowed transition-transform duration-200 transform hover:scale-110"
        aria-label="Generate Website"
      >
        <Wand2 className="w-6 h-6" />
      </button>
    </form>
  );
}