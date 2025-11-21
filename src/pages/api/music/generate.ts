import type { NextApiRequest, NextApiResponse } from 'next';
import { MusicFX } from '../../../lib/core/MusicFX';
import { MusicPrompt } from '../../../lib/core/MusicPrompt';
import { MusicModel } from '../../../lib/core/Constants';

type MusicSound = {
    data: string;
    mimeType?: string;
    audioUri?: string;
    downloadUrl?: string;
};

type MusicApiResponse = {
    sounds: MusicSound[];
};

type Data = {
    tracks?: string[];
    error?: string;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { prompt, cookie, duration, loop, count, model } = req.body;

    if (!cookie) {
        return res.status(401).json({ error: 'Cookie is required' });
    }

    if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
    }

    try {
        const fx = new MusicFX(cookie);

        const promptObj = new MusicPrompt({
            prompt: prompt,
            generationCount: count || 2,
            soundLengthSeconds: duration || 30,
            loop: loop || false,
            model: (model as MusicModel) || "DEFAULT",
        });

        const result = await fx.generateMusic(promptObj);
        const musicResponse = result as MusicApiResponse;
        
        const tracks = musicResponse.sounds?.map((sound) => sound.data) || [];
        
        res.status(200).json({ tracks });
    } catch (error: unknown) {
        console.error("Music Generation error:", error);
        const message = error instanceof Error ? error.message : 'Failed to generate music';
        res.status(500).json({ error: message });
    }
}
