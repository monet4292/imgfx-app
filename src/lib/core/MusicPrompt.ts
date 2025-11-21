import { MusicPromptArg } from "./Types";
import { MusicModel } from "./Constants";

export class MusicPrompt {
    prompt: string;
    generationCount: number;
    soundLengthSeconds: number;
    loop: boolean;
    model: MusicModel;

    constructor(args: MusicPromptArg) {
        this.prompt = args.prompt;
        this.generationCount = args.generationCount ?? 2;
        this.soundLengthSeconds = args.soundLengthSeconds ?? 30;
        this.loop = args.loop ?? false;
        this.model = (args.model as MusicModel) ?? MusicModel.DEFAULT;
    }

    public toString() {
        return JSON.stringify({
            generationCount: this.generationCount,
            input: { textInput: this.prompt },
            loop: this.loop,
            soundLengthSeconds: this.soundLengthSeconds,
            model: this.model,
            clientContext: {
                tool: "MUSICLM_V2",
                sessionId: ";" + Date.now().toString()
            }
        });
    }
}
