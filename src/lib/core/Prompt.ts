import { AspectRatio, Model } from "./Constants";
import { PromptArg } from "./Types";

export class PromptError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'PromptError';
    }
}

/**
 * Represents a prompt that describes visual property of image to be generated
 */
export class Prompt {
    /**
     * A specific number that serves as the starting point
     * for the random process used to create the image.
     *
     * Default value: `0`
     */
    seed: number;
    /**
     * Textual Description of image to be generated
     */
    prompt: string;
    /**
     * Number of image to generate in one fetch request.
     * Max may be `8` but changes with different account.
     *
     * Default value: `1`
     */
    numberOfImages: number;
    /**
     * The ratio of the width to the height of the image
     * to be generated.
     *
     * Available aspect ratios:
     * - "IMAGE_ASPECT_RATIO_PORTRAIT_THREE_FOUR" (Mobile Portrait 3:4)
     * - "IMAGE_ASPECT_RATIO_LANDSCAPE_FOUR_THREE" (Mobile Landscape 4:3)
     * - "IMAGE_ASPECT_RATIO_LANDSCAPE" (Landscape 16:9)
     * - "IMAGE_ASPECT_RATIO_PORTRAIT" (Portrait 9:16)
     * - "IMAGE_ASPECT_RATIO_SQUARE" (Square)
     */
    aspectRatio: AspectRatio;
    /**
     * Model to use for image generation.
     * 
     * Note: `"IMAGEN_3_5"` is probably `IMAGEN_4`
     * 
     * Available models:
     * - `"IMAGEN_3"`
     * - `"IMAGEN_3_1"`
     * - `"IMAGEN_3_5"`
     */
    generationModel: Model;

    constructor(args: PromptArg) {
        this.seed = args.seed ?? 0;
        this.prompt = args.prompt;
        this.numberOfImages = args.numberOfImages ?? 1;
        this.aspectRatio = args.aspectRatio ?? AspectRatio.LANDSCAPE;
        this.generationModel = args.generationModel ?? Model.IMAGEN_3_5;
    }

    /**
     * Wrapper around `JSON.stringify` that stringifies prompt object
     * 
     * @returns Stringified prompt in JSON format
     */
    public toString() {
        return JSON.stringify({
            "userInput": {
                "candidatesCount": this.numberOfImages,
                "prompts": [this.prompt],
                "seed": this.seed
            },
            "clientContext": {
                "sessionId": ";1757113025397",
                "tool": "IMAGE_FX"
            },
            "modelInput": {
                "modelNameType": this.generationModel
            },
            "aspectRatio": this.aspectRatio
        });
    }
}
