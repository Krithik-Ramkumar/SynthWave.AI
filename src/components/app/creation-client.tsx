'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Code, Eye, Download, Clipboard } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { Progress } from '@/components/ui/progress';

const loadingTexts = [
  'Booting up the flux capacitors...',
  'Compiling the cyber-ghettos...',
  'Reticulating splines...',
  'Negotiating with the AI overlords...',
  'Polishing the chrome...',
  'Initializing retro-futuristic UI...',
  'Unpacking neon-drenched assets...',
  'Generating aesthetic...',
  'Assembling pixel-perfect layouts...',
  'Teaching the AI to dream of electric sheep...',
  'Allocating more bandwidth...',
  'Warming up the rendering engines...',
  'Tuning the quantum synthesizers...',
  "Don't worry, the hamsters are getting a water break...",
  'Rerouting power from the main deflector dish...',
  'Checking for rogue AI consciousness... All clear.',
  'Finding the perfect shade of neon purple...',
  'This is not a simulation... or is it?',
  'The AI is drawing... Please do not tap on the glass.',
  'Dividing by zero... just kidding.',
  'Bending the space-time continuum for optimal design...',
  'If you can read this, you are too close to the screen.',
  'Charging the laser-guided design cannons...',
  'Untangling the information superhighway...',
  'The AI is currently arguing with a pixel about its placement.',
  'Synthesizing digital dreams...',
  'Downloading more RAM... just in case.',
  'Spinning up the hamster wheels...',
  'Herding cats into a div...',
  'Making sure the pixels are socially distanced...',
  'Converting coffee into code...',
  'Asking the magic smoke for a favor...',
  'Shuffling bits and bytes...',
  'Locating the missing semicolon...',
  'Optimizing the cyber-mainframe...',
  'Juggling kilobytes and megabytes...',
  'Engaging the pattern buffer...',
  'Our AI is currently on a coffee break. We\'ve sent a cyborg to fetch it.',
  'The server is powered by a potato. We\'re upgrading to a lemon battery soon.',
  'We\'ve sent a carrier pigeon to the AI for your request. It should be back in a bit.',
  'We\'re currently teaching the AI how to love. It\'s a slow process.',
  'Generating your website... and a sentient AI. Oops.',
];

function LoadingState() {
  const [progress, setProgress] = useState(0);
  const [text, setText] = useState(loadingTexts[0]);

  useEffect(() => {
    const textInterval = setInterval(() => {
      setText(prev => {
        const currentIndex = loadingTexts.indexOf(prev);
        return loadingTexts[(currentIndex + 1) % loadingTexts.length];
      });
    }, 2500);

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) {
          // Stay at 95% until generation is actually done
          return 95;
        }
        // Start faster, then slow down
        const increment = prev < 50 ? Math.random() * 5 : prev < 80 ? Math.random() * 2 : Math.random() * 1;
        const newProgress = Math.min(prev + increment, 95);
        return newProgress;
      });
    }, 400); // Slower interval for a more realistic feel

    return () => {
      clearInterval(textInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <div className="w-full max-w-md text-center">
        <div className="h-24 flex items-center justify-center mb-4 px-4">
            <p className="text-lg text-muted-foreground">{text}</p>
        </div>
        <Progress value={progress} className="w-full h-4 [&>div]:bg-gradient-to-r [&>div]:from-cyan-400 [&>div]:to-purple-500" />
      </div>
    </div>
  );
}

function CreationClientInternal() {
  const searchParams = useSearchParams();
  const prompt = searchParams.get('prompt') || 'A cool modern website';
  
  const [html, setHtml] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(true);
  const [activeView, setActiveView] = useState<'preview' | 'code'>('preview');

  const { toast } = useToast();
  const { copy } = useCopyToClipboard();

  useEffect(() => {
    async function generate() {
      if (!prompt) return;
      setIsGenerating(true);
      try {
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ description: prompt }),
        });

        if (!response.ok) {
          let errorData;
          try {
            errorData = await response.json();
          } catch {
            // Not a JSON response
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          throw new Error(errorData.details || errorData.error || 'Failed to generate website');
        }

        const result = await response.json();

        if (result.html) {
          setHtml(result.html);
        } else {
          setHtml('<div class="w-full h-full flex items-center justify-center bg-black text-white"><p class="text-red-500 text-xl">AI failed to generate the website. Please try again.</p></div>');
          toast({
            variant: 'destructive',
            title: 'Generation Failed',
            description: 'The AI could not generate the website. Please try a different prompt.',
          })
        }
      } catch (error) {
        console.error('Error generating website:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        setHtml(`<div class="w-full h-full flex items-center justify-center bg-black text-white"><p class="text-red-500 text-xl">${errorMessage}</p></div>`);
        toast({
          variant: 'destructive',
          title: 'Generation Failed',
          description: errorMessage,
        })
      } finally {
        setIsGenerating(false);
      }
    }
    generate();
  }, [prompt, toast]);

  if (isGenerating) {
    return <LoadingState />;
  }

  const handleDownload = () => {
    const content = html;
    if (!content || content.startsWith('<div')) { // Don't download error messages
      toast({
        variant: 'destructive',
        title: 'Nothing to download',
        description: 'The code is empty or contains an error.',
      });
      return;
    }

    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'index.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      title: 'Download Started',
      description: `Your index.html file is downloading.`,
    });
  };
  
  const currentCode = html || `No code generated yet.`;

  return (
    <div className="flex flex-col h-screen max-h-screen bg-black text-white w-full">
        <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-primary/20">
          <div className="flex items-center gap-2">
             <Button 
              data-state={activeView === 'preview' ? 'active' : 'inactive'}
              variant={'ghost'}
              onClick={() => setActiveView('preview')}
              className="px-4 py-2 text-sm font-medium text-white bg-transparent border border-transparent rounded-lg data-[state=active]:bg-primary/10 data-[state=active]:border-primary/50 data-[state=active]:shadow-[0_0_15px_theme(colors.primary/50)] transition-all duration-300 hover:bg-primary/10 hover:shadow-[0_0_15px_theme(colors.primary/50)]"
              >
              <Eye className="w-5 h-5 mr-2" />
              Live Preview
            </Button>
            <Button 
              data-state={activeView === 'code' ? 'active' : 'inactive'}
              variant={'ghost'}
              onClick={() => setActiveView('code')}
              className="px-4 py-2 text-sm font-medium text-white bg-transparent border border-transparent rounded-lg data-[state=active]:bg-primary/10 data-[state=active]:border-primary/50 data-[state=active]:shadow-[0_0_15px_theme(colors.primary/50)] transition-all duration-300 hover:bg-primary/10 hover:shadow-[0_0_15px_theme(colors.primary/50)]"
            >
              <Code className="w-5 h-5 mr-2" />
              Code Editor
            </Button>
          </div>

          <div className="flex items-center gap-4">
             <Button variant="outline" size="sm" onClick={() => copy(currentCode)} disabled={!currentCode || activeView !== 'code'}>
              <Clipboard className="w-4 h-4 mr-2" />
              Copy Code
            </Button>
            <Button variant="default" size="sm" onClick={handleDownload} disabled={!html}>
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </div>

        <main className="flex-1 flex flex-col overflow-hidden">
          <div className={`w-full h-full ${activeView === 'preview' ? 'block' : 'hidden'}`}>
              <iframe
                srcDoc={html || ''}
                title="Website Preview"
                className="w-full h-full bg-white border-0"
                sandbox="allow-scripts allow-forms"
              />
          </div>
          
          <div className={`w-full h-full bg-[#1e1e1e] overflow-auto ${activeView === 'code' ? 'block' : 'hidden'}`}>
            <SyntaxHighlighter
              language={'html'}
              style={vscDarkPlus}
              customStyle={{
                height: '100%',
                width: '100%',
                backgroundColor: 'transparent',
                padding: '1rem',
                margin: 0,
                fontSize: '0.8rem',
              }}
              codeTagProps={{
                className: 'font-mono'
              }}
              showLineNumbers={true}
            >
              {currentCode}
            </SyntaxHighlighter>
          </div>
        </main>
      </div>
  );
}


export default function CreationClient() {
  return (
    <Suspense>
      <CreationClientInternal />
    </Suspense>
  )
}