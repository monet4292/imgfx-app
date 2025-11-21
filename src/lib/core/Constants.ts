export const Model = Object.freeze({
    IMAGEN_3_5: "IMAGEN_3_5",
} as const);

export const AspectRatio = Object.freeze({
    MOBILE_PORTRAIT_THREE_FOUR: "IMAGE_ASPECT_RATIO_PORTRAIT_THREE_FOUR",
    MOBILE_LANDSCAPE_FOUR_THREE: "IMAGE_ASPECT_RATIO_LANDSCAPE_FOUR_THREE",
    LANDSCAPE: "IMAGE_ASPECT_RATIO_LANDSCAPE",
    PORTRAIT: "IMAGE_ASPECT_RATIO_PORTRAIT",
    SQUARE: "IMAGE_ASPECT_RATIO_SQUARE",
} as const);

// Can be mutated and shared :)
export const DefaultHeader = new Headers({
    "Origin": "https://labs.google",
    "content-type": "application/json",
    "Referer": "https://labs.google/fx/tools/image-fx"
});

export const ImageType = Object.freeze({
    JPEG: "jpeg",
    JPG: "jpg",
    JPE: "jpe",
    PNG: "png",
    GIF: "gif",
    WEBP: "webp",
    SVG: "svg",
    BMP: "bmp",
    TIFF: "tiff",
    APNG: "apng",
    AVIF: "avif",
} as const);

export type Model = typeof Model[keyof typeof Model];
export type AspectRatio = typeof AspectRatio[keyof typeof AspectRatio];
export type ImageType = typeof ImageType[keyof typeof ImageType];

export const AspectRatioLabels: Record<AspectRatio, string> = Object.freeze({
    [AspectRatio.MOBILE_PORTRAIT_THREE_FOUR]: "Mobile Portrait (3:4)",
    [AspectRatio.MOBILE_LANDSCAPE_FOUR_THREE]: "Mobile Landscape (4:3)",
    [AspectRatio.LANDSCAPE]: "Landscape (16:9)",
    [AspectRatio.PORTRAIT]: "Portrait (9:16)",
    [AspectRatio.SQUARE]: "Square",
});
