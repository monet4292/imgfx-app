import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCookie } from '@/context/CookieContext';
import { useState, useRef } from 'react';
import { ImageType } from '@/lib/core/Constants';
import Head from 'next/head';

export default function Caption() {
    const { isConfigured, cookie } = useCookie();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [captions, setCaptions] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCaption = async () => {
        if (!isConfigured) {
            setError('Please configure your Google Cookie in settings first.');
            return;
        }
        if (!selectedFile || !preview) {
            setError('Please select an image.');
            return;
        }

        setLoading(true);
        setError('');
        setCaptions([]);

        try {
            // Extract type from file (e.g. image/png -> png)
            const type = selectedFile.type.split('/')[1];

            // Check if type is valid
            if (!Object.values(ImageType).includes(type as any)) {
                throw new Error(`Unsupported image type: ${type}. Supported: ${Object.values(ImageType).join(', ')}`);
            }

            const res = await fetch('/api/caption', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    image: preview, // This is the base64 string
                    type: type,
                    cookie,
                    count: 1,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to generate captions');
            }

            setCaptions(data.captions);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <Head>
                <title>ImageFX Web - Caption</title>
            </Head>
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                        Image Captioning
                    </h1>
                    <p className="text-muted-foreground">
                        Upload an image to get a detailed description using Google's AI.
                    </p>
                </div>

                <Card>
                    <CardContent className="p-6 space-y-4">
                        <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-10 cursor-pointer hover:bg-muted/50 transition-colors"
                            onClick={() => fileInputRef.current?.click()}>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                            {preview ? (
                                <img src={preview} alt="Preview" className="max-h-64 object-contain" />
                            ) : (
                                <div className="text-center space-y-2">
                                    <p className="text-sm text-muted-foreground">Click to upload image</p>
                                    <p className="text-xs text-muted-foreground">(PNG, JPEG, WEBP supported)</p>
                                </div>
                            )}
                        </div>

                        {error && (
                            <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md border border-red-200">
                                {error}
                            </div>
                        )}

                        <Button
                            className="w-full"
                            size="lg"
                            onClick={handleCaption}
                            disabled={loading || !isConfigured || !selectedFile}
                        >
                            {loading ? 'Analyzing...' : 'Generate Caption'}
                        </Button>
                    </CardContent>
                </Card>

                {captions.length > 0 && (
                    <Card>
                        <CardContent className="p-6">
                            <h3 className="text-lg font-semibold mb-4">Result:</h3>
                            <div className="space-y-4">
                                {captions.map((caption, idx) => (
                                    <div key={idx} className="p-4 bg-muted rounded-md">
                                        <p className="text-sm leading-relaxed">{caption}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </Layout>
    );
}
