import type { NextApiRequest, NextApiResponse } from 'next';
import { ImageFX } from '../../lib/core/ImageFX';

type Data = {
    imageUrl?: string;
    error?: string;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { mediaId, cookie } = req.body;

    if (!cookie) {
        return res.status(401).json({ error: 'Cookie is required' });
    }

    if (!mediaId) {
        return res.status(400).json({ error: 'Media ID is required' });
    }

    try {
        const fx = new ImageFX(cookie);
        const image = await fx.getImageFromId(mediaId);

        // The image object has encodedImage
        res.status(200).json({ imageUrl: `data:image/png;base64,${image.encodedImage}` });
    } catch (error: any) {
        console.error("Fetch error:", error);
        res.status(500).json({ error: error.message || 'Failed to fetch image' });
    }
}
