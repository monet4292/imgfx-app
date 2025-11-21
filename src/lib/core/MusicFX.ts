import { Account } from "./Account";
import { MusicPrompt } from "./MusicPrompt";

type MusicSound = {
    data: string;
    mimeType?: string;
    audioUri?: string;
    downloadUrl?: string;
};

type MusicResponse = {
    sounds: MusicSound[];
};

export class MusicFXError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "MusicFXError";
    }
}

export class MusicFX {
    private readonly account: Account;

    constructor(cookie: string) {
        if (!cookie?.trim()) {
            throw new MusicFXError("Cookie is required and cannot be empty");
        }
        this.account = new Account(cookie);
    }

    public async generateMusic(prompt: string | MusicPrompt, retries = 0) {
        if (typeof prompt === "string") {
            if (!prompt.trim()) {
                throw new MusicFXError("Prompt cannot be empty");
            }
            prompt = new MusicPrompt({ prompt });
        }

        if (!(prompt instanceof MusicPrompt)) {
            throw new MusicFXError("Provided prompt is not an instance of MusicPrompt");
        }

        await this.account.refreshSession();

        try {
            const result = await this.fetchMusic(prompt, retries);
            await this.submitBatchLog(true);
            return result;
        } catch (error) {
            await this.submitBatchLog(false);
            throw error;
        }
    }

    private async submitBatchLog(success: boolean) {
        const url = "https://labs.google/fx/api/trpc/general.submitBatchLog";
        const body = JSON.stringify({
            "json": {
                "appEvents": [
                    {
                        "event": "IM_FEELING_LUCKY", // Using the event from docs
                        "eventProperties": [
                            { "key": "TOOL_NAME", "stringValue": "MUSICLM_V2" },
                            { "key": "USER_AGENT", "stringValue": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36" },
                            { "key": "IS_DESKTOP" },
                            { "key": "GENERATION_STATUS", "stringValue": success ? "SUCCESS" : "FAILURE" }
                        ],
                        "activeExperiments": [],
                        "eventMetadata": { "sessionId": ";1763664795734" }, // TODO: Use real session ID if available
                        "eventTime": new Date().toISOString()
                    }
                ]
            }
        });

        try {
            await fetch(url, {
                method: "POST",
                body,
                headers: this.account.getAuthHeaders()
            });
        } catch (e) {
            console.warn("Failed to submit batch log", e);
        }
    }

    private async fetchMusic(prompt: MusicPrompt, retry = 0): Promise<MusicResponse> {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout

            const response = await fetch("https://aisandbox-pa.googleapis.com/v1:soundDemo", {
                method: "POST",
                body: prompt.toString(),
                headers: this.account.getAuthHeaders(),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                if (response.status === 429) {
                    throw new MusicFXError("Rate limit exceeded. Please try again later.");
                }
                if (response.status === 401) {
                    throw new MusicFXError("Unauthorized. Please check your cookie.");
                }
                
                if (retry > 0) {
                    console.log("[!] Failed to generate music. Retrying...");
                    return this.fetchMusic(prompt, retry - 1);
                }
                const errorText = await response.text();
                throw new MusicFXError(`Server responded with invalid response (${response.status}): ${errorText}`);
            }

            const jsonResponse = await response.json() as MusicResponse;
            return jsonResponse;

        } catch (error: unknown) {
             if (error instanceof Error && error.name === 'AbortError') {
                throw new MusicFXError("Request timed out after 60 seconds");
             }

             if (retry > 0 && !(error instanceof MusicFXError)) {
                console.log("[!] Failed to generate music. Retrying...");
                return this.fetchMusic(prompt, retry - 1);
            }

            if (error instanceof MusicFXError) {
                throw error;
            }

            throw new MusicFXError(`Failed to generate music: ${error instanceof Error ? error.message : 'Network error'}`);
        }
    }
}
