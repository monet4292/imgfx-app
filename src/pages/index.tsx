import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { useCookie } from '@/context/CookieContext';
import { useState } from 'react';
import { AspectRatio, Model, AspectRatioLabels } from '@/lib/core/Constants';
import Head from 'next/head';
import { addToHistory } from '@/lib/history';
import { Maximize2, X } from 'lucide-react';

export default function Home() {
  const { isConfigured, cookie } = useCookie();
  const [prompt, setPrompt] = useState('');
  const [model, setModel] = useState<string>('IMAGEN_3_5');
  const aspectRatioOptions = [
    AspectRatio.MOBILE_PORTRAIT_THREE_FOUR,
    AspectRatio.MOBILE_LANDSCAPE_FOUR_THREE,
    AspectRatio.LANDSCAPE,
    AspectRatio.PORTRAIT,
    AspectRatio.SQUARE,
  ];
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(AspectRatio.LANDSCAPE);
  const [count, setCount] = useState(2);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!isConfigured) {
      setError('Please configure your Google Cookie in settings first.');
      return;
    }
    if (!prompt.trim()) {
      setError('Please enter a prompt.');
      return;
    }

    setLoading(true);
    setError('');
    setImages([]);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          cookie,
          model,
          aspectRatio,
          count,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate images');
      }

      setImages(data.images);

      // Save to history
      addToHistory({
        prompt,
        model,
        images: data.images
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to generate images';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Head>
        <title>ImageFX Web - Generate</title>
      </Head>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Generate Images
          </h1>
          <p className="text-muted-foreground">
            Create stunning visuals using Google&apos;s ImageFX models.
          </p>
        </div>

        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Prompt</label>
              <Input
                placeholder="A cyberpunk city in the rain..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Model</label>
                <Select value={model} onValueChange={setModel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(Model).map((m) => (
                      <SelectItem key={m} value={m}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Aspect Ratio</label>
                <Select value={aspectRatio} onValueChange={(value) => setAspectRatio(value as AspectRatio)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select ratio" />
                  </SelectTrigger>
                  <SelectContent>
                    {aspectRatioOptions.map((r) => (
                      <SelectItem key={r} value={r}>
                        {AspectRatioLabels[r]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Count</label>
                <Select value={count.toString()} onValueChange={(v) => setCount(parseInt(v))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Count" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4].map((n) => (
                      <SelectItem key={n} value={n.toString()}>
                        {n}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md border border-red-200">
                {error}
              </div>
            )}

            <Button
              className="w-full"
              size="lg"
              onClick={handleGenerate}
              disabled={loading || !isConfigured}
            >
              {loading ? 'Generating...' : 'Generate Images'}
            </Button>
          </CardContent>
        </Card>

        {images.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {images.map((img, idx) => (
              <Card key={idx} className="overflow-hidden group">
                <div className="relative">
                  <img
                    src={img}
                    alt={`Generated ${idx}`}
                    className="w-full h-auto object-cover transition-transform duration-200 hover:scale-105 cursor-pointer"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-auto z-10">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="secondary" size="icon" className="rounded-full w-8 h-8 hover:scale-110 transition-transform">
                            <Maximize2 className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent showCloseButton={false} className="!max-w-none !w-screen !h-screen !top-0 !left-0 !translate-x-0 !translate-y-0 !rounded-none p-0 bg-black/90 backdrop-blur-sm border-none shadow-none flex items-center justify-center data-[state=open]:!slide-in-from-bottom-0 data-[state=closed]:!slide-out-to-bottom-0">
                          <DialogTitle className="sr-only">Generated Image {idx}</DialogTitle>
                          <DialogClose className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors z-50 rounded-sm opacity-100 ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                            <X className="h-8 w-8" />
                            <span className="sr-only">Close</span>
                          </DialogClose>
                          <img
                            src={img}
                            alt={`Generated ${idx}`}
                            className="max-w-full max-h-full w-auto h-auto object-contain"
                          />
                        </DialogContent>
                      </Dialog>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="text-white bg-black bg-opacity-50 hover:bg-opacity-70"
                    >
                      <a href={img} download={`generated-${idx}.png`}>Download</a>
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

    </Layout>
  );
}
