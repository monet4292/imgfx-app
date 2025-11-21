import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { getHistory, deleteHistoryItem, clearHistory, HistoryItem } from '@/lib/history';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { Maximize2, X } from 'lucide-react';

export default function Gallery() {
    const [history, setHistory] = useState<HistoryItem[]>([]);

    useEffect(() => {
        setHistory(getHistory());
    }, []);

    const handleDelete = (id: string) => {
        const updated = deleteHistoryItem(id);
        setHistory(updated);
    };

    const handleClear = () => {
        if (confirm('Are you sure you want to clear all history?')) {
            clearHistory();
            setHistory([]);
        }
    };

    return (
        <Layout>
            <Head>
                <title>ImageFX Web - Gallery</title>
            </Head>
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                            Gallery
                        </h1>
                        <p className="text-muted-foreground">
                            Your locally saved generation history.
                        </p>
                    </div>
                    {history.length > 0 && (
                        <Button variant="destructive" onClick={handleClear}>
                            Clear History
                        </Button>
                    )}
                </div>

                {history.length === 0 ? (
                    <div className="text-center py-20 text-muted-foreground">
                        No images generated yet. Go create some!
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-8">
                        {history.map((item) => (
                            <Card key={item.id}>
                                <CardContent className="p-6 space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-medium text-lg">{item.prompt}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {new Date(item.timestamp).toLocaleString()} • {item.model}
                                            </p>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                            onClick={() => handleDelete(item.id)}
                                        >
                                            Delete
                                        </Button>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                                        {item.images.map((img, idx) => (
                                            <div key={idx} className="relative group">
                                                <img
                                                    key={idx}
                                                    src={img}
                                                    alt={`${item.prompt} - ${idx}`}
                                                    className="w-full h-auto rounded-md object-cover transition-transform duration-200 hover:scale-105 cursor-pointer"
                                                />
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-md">
                                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-auto z-10">
                                                        <Dialog>
                                                            <DialogTrigger asChild>
                                                                <Button variant="secondary" size="icon" className="rounded-full w-8 h-8 hover:scale-110 transition-transform">
                                                                    <Maximize2 className="w-4 h-4" />
                                                                </Button>
                                                            </DialogTrigger>
                                                            <DialogContent showCloseButton={false} className="!max-w-none !w-screen !h-screen !top-0 !left-0 !translate-x-0 !translate-y-0 !rounded-none p-0 bg-black/90 backdrop-blur-sm border-none shadow-none flex items-center justify-center data-[state=open]:!slide-in-from-bottom-0 data-[state=closed]:!slide-out-to-bottom-0">
                                                                <DialogTitle className="sr-only">{item.prompt}</DialogTitle>
                                                                <DialogClose className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors z-50 rounded-sm opacity-100 ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                                                                    <X className="h-8 w-8" />
                                                                    <span className="sr-only">Close</span>
                                                                </DialogClose>
                                                                <img
                                                                    src={img}
                                                                    alt={item.prompt}
                                                                    className="max-w-full max-h-full w-auto h-auto object-contain"
                                                                />
                                                            </DialogContent>
                                                        </Dialog>
                                                    </div>
                                                    <Button variant="secondary" size="sm" asChild>
                                                        <a href={img} download={`imgfx-${item.timestamp}-${idx}.png`}>
                                                            Download
                                                        </a>
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
}
