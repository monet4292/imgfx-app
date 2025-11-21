import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { useCookie } from '@/context/CookieContext';
import { useState } from 'react';
import Head from 'next/head';
import { MusicModel } from '@/lib/core/Constants';

export default function Music() {
  const { isConfigured, cookie } = useCookie();
  const [prompt, setPrompt] = useState('');
  const [duration, setDuration] = useState(30);
  const [loop, setLoop] = useState(false);
  const [count, setCount] = useState(2);
  const [loading, setLoading] = useState(false);
  const [tracks, setTracks] = useState<string[]>([]);
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
    setTracks([]);

    try {
      const res = await fetch('/api/music/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          cookie,
          duration,
          loop,
          count,
          model: MusicModel.DEFAULT
        }),
      });

      const data = await res.json() as { tracks?: string[]; error?: string };

      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate music');
      }

      const processedTracks = (data.tracks ?? []).map((base64Data) => {
          const bytes = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
          return URL.createObjectURL(new Blob([bytes], { type: 'audio/wav' }));
      });

      setTracks(processedTracks);

    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to generate music';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Head>
        <title>ImageFX Web - Music</title>
      </Head>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Generate Music
          </h1>
          <p className="text-muted-foreground">
            Create short musical clips using Google&apos;s MusicFX models.
          </p>
        </div>

        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Prompt</label>
              <Input
                placeholder="A funky bassline with jazz drums..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Duration (seconds)</label>
                <Select value={duration.toString()} onValueChange={(v) => setDuration(parseInt(v))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Duration" />
                  </SelectTrigger>
                  <SelectContent>
                    {[30, 50, 70].map((d) => (
                      <SelectItem key={d} value={d.toString()}>
                        {d}s
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 flex items-center pt-8">
                 <label className="text-sm font-medium mr-2">Loop</label>
                 <input 
                    type="checkbox" 
                    checked={loop} 
                    onChange={(e) => setLoop(e.target.checked)}
                    className="h-4 w-4"
                 />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Count</label>
                <Select value={count.toString()} onValueChange={(v) => setCount(parseInt(v))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Count" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2].map((n) => (
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
              {loading ? 'Generating...' : 'Generate Music'}
            </Button>
          </CardContent>
        </Card>

        {tracks.length > 0 && (
          <div className="grid grid-cols-1 gap-4">
             {tracks.map((trackUrl, idx) => (
                 <Card key={idx}>
                     <CardContent className="p-4 flex flex-col gap-2">
                         <div className="flex justify-between items-center">
                             <span className="font-medium">Track {idx + 1}</span>
                             <Button variant="outline" size="sm" asChild>
                                 <a href={trackUrl} download={`musicfx-track-${idx + 1}.wav`}>Download</a>
                             </Button>
                         </div>
                         <audio controls src={trackUrl} className="w-full" />
                     </CardContent>
                 </Card>
             ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
