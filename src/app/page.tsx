import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import GeneratorWizard from '@/components/app/generator-wizard';
import { Bot, Code, Eye } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow flex items-center">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center py-20">
            <div className="relative mb-8">
              <div className="glitch-wrapper">
                <h1
                  className="glitch font-headline text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter"
                  data-text="SynthWave.AI"
                >
                  SynthWave.AI
                </h1>
              </div>
            </div>
            <p className="font-body text-lg md:text-xl max-w-3xl text-muted-foreground mb-10">
              Generate your site. Instantly. Turn ideas into stunning, functional websites with the power of AI.
            </p>
            <div className="w-full max-w-3xl mb-12">
              <GeneratorWizard />
            </div>

            <div className="w-full max-w-5xl mt-16">
               <h2 className="text-3xl font-headline text-center mb-10">How It Works</h2>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <Card className="bg-card/60 border-primary/20 text-center p-6 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/30">
                    <CardContent className="flex flex-col items-center gap-4">
                      <Bot className="w-12 h-12 text-primary" />
                      <h3 className="font-headline text-xl font-bold">1. Describe Your Vision</h3>
                      <p className="text-muted-foreground">
                        Simply type out what you want your website to be. The more detail you provide, the better the result.
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="bg-card/60 border-primary/20 text-center p-6 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/30">
                    <CardContent className="flex flex-col items-center gap-4">
                      <Eye className="w-12 h-12 text-primary" />
                      <h3 className="font-headline text-xl font-bold">2. Watch it Build Live</h3>
                      <p className="text-muted-foreground">
                        Our AI gets to work instantly, building your website in real-time. You see the code and the preview side-by-side.
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="bg-card/60 border-primary/20 text-center p-6 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/30">
                    <CardContent className="flex flex-col items-center gap-4">
                      <Code className="w-12 h-12 text-primary" />
                      <h3 className="font-headline text-xl font-bold">3. Get The Code</h3>
                      <p className="text-muted-foreground">
                        Once you&apos;re happy with the result, you can download the complete HTML file with Tailwind CSS ready to go.
                      </p>
                    </CardContent>
                  </Card>
              </div>
            </div>

          </div>
        </div>
      </main>

      <footer className="py-6 border-t border-primary/10">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} SynthWave.AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}