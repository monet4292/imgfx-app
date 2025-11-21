import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCookie } from '@/context/CookieContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from '@/components/ui/label';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const router = useRouter();
    const { cookie, setCookie, isConfigured } = useCookie();
    const [tempCookie, setTempCookie] = useState(cookie);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const handleSaveCookie = () => {
        setCookie(tempCookie);
        setIsSettingsOpen(false);
    };

    return (
        <div className="min-h-screen bg-background font-sans antialiased flex flex-col">
            <header className="border-b">
                <div className="container flex h-16 items-center px-4">
                    <div className="mr-4 hidden md:flex">
                        <Link href="/" className="mr-6 flex items-center space-x-2">
                            <span className="hidden font-bold sm:inline-block">
                                ImageFX Web
                            </span>
                        </Link>
                        <nav className="flex items-center space-x-6 text-sm font-medium">
                            <Link
                                href="/"
                                className={router.pathname === '/' ? 'text-foreground' : 'text-foreground/60 transition-colors hover:text-foreground'}
                            >
                                Generate
                            </Link>
                            <Link
                                href="/caption"
                                className={router.pathname === '/caption' ? 'text-foreground' : 'text-foreground/60 transition-colors hover:text-foreground'}
                            >
                                Caption
                            </Link>
                            <Link
                                href="/gallery"
                                className={router.pathname === '/gallery' ? 'text-foreground' : 'text-foreground/60 transition-colors hover:text-foreground'}
                            >
                                Gallery
                            </Link>
                            <Link
                                href="/music"
                                className={router.pathname === '/music' ? 'text-foreground' : 'text-foreground/60 transition-colors hover:text-foreground'}
                            >
                                Music
                            </Link>
                        </nav>
                    </div>
                    <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                        <div className="w-full flex-1 md:w-auto md:flex-none">
                            {/* Search or other controls could go here */}
                        </div>
                        <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" size="sm" className={!isConfigured ? "border-red-500 text-red-500" : ""}>
                                    {isConfigured ? "Settings" : "Setup Cookie"}
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Configuration</DialogTitle>
                                    <DialogDescription>
                                        Enter your Google Cookie to authenticate with ImageFX.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="cookie" className="text-right">
                                            Cookie
                                        </Label>
                                        <div className="col-span-3 space-y-2">
                                            <Input
                                                id="cookie"
                                                value={tempCookie}
                                                onChange={(e) => setTempCookie(e.target.value)}
                                                type="password"
                                                placeholder="Paste your cookie here"
                                            />
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    type="file"
                                                    id="cookie-file"
                                                    className="hidden"
                                                    accept=".txt"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) {
                                                            const reader = new FileReader();
                                                            reader.onload = (ev) => {
                                                                const text = ev.target?.result as string;
                                                                if (text) setTempCookie(text.trim());
                                                            };
                                                            reader.readAsText(file);
                                                        }
                                                    }}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="secondary"
                                                    size="sm"
                                                    className="w-full"
                                                    onClick={() => document.getElementById('cookie-file')?.click()}
                                                >
                                                    Import from Text File
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="submit" onClick={handleSaveCookie}>Save changes</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </header>
            <main className="flex-1 container mx-auto py-6">
                {children}
            </main>
        </div>
    );
};

export default Layout;
