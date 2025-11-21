import type { NextApiRequest, NextApiResponse } from 'next';
import { ImageFX } from '../../lib/core/ImageFX';
import { ImageType } from '../../lib/core/Constants';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

type Data = {
    captions?: string[];
    error?: string;
};

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '10mb',
        },
    },
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { image, type, cookie, count } = req.body;

    if (!cookie) {
        return res.status(401).json({ error: 'Cookie is required' });
    }

    if (!image || !type) {
        return res.status(400).json({ error: 'Image (base64) and type are required' });
    }

    // Use local tmp directory
    const tempDir = path.join(process.cwd(), 'tmp');
    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
    }

    const fileName = `${uuidv4()}.${type}`;
    const filePath = path.join(tempDir, fileName);

    try {
        // Remove header if present (e.g. "data:image/png;base64,")
        const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
        fs.writeFileSync(filePath, base64Data, 'base64');

        const fx = new ImageFX(cookie);

        // Map string type to ImageType enum if needed, or cast
        const imageType = type as ImageType;

        const captions = await fx.generateCaptionsFromImage(filePath, imageType, count || 1);

        res.status(200).json({ captions });
    } catch (error: unknown) {
        console.error("Caption error:", error);
        const message = error instanceof Error ? error.message : 'Failed to generate captions';
        res.status(500).json({ error: message });
    } finally {
        // Cleanup temp file
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }
}
