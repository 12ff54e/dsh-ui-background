/** Upload admission, downscaling, and file reading for the background control. */
/** Raster media types the upload control accepts. */
export declare const BACKGROUND_MEDIA_TYPES: readonly ["image/png", "image/jpeg", "image/webp", "image/gif"];
/** Longest edge the stored background is scaled to (keeps the durable data URL small). */
export declare const MAX_BACKGROUND_DIMENSION = 1920;
/** JPEG quality used when re-encoding the downscaled background. */
export declare const BACKGROUND_JPEG_QUALITY = 0.85;
/** Rejection reason keys resolved against the row's locale table. */
export type BackgroundFileErrorKey = 'upload.tooLarge' | 'upload.unsupportedType';
/**
 * Validate a selected file against the background admission policy.
 * @param file - selected file (size and declared media type).
 * @returns a rejection reason key, or `null` when the file is accepted.
 */
export declare function validateBackgroundFile(file: Pick<File, 'size' | 'type'>): BackgroundFileErrorKey | null;
/**
 * Compute the downscaled dimensions that keep the aspect ratio and bound the
 * longest edge by {@link MAX_BACKGROUND_DIMENSION}.
 * @param width - intrinsic width in pixels.
 * @param height - intrinsic height in pixels.
 * @returns the target dimensions (never larger than the input, minimum 1px).
 */
export declare function computeBackgroundDimensions(width: number, height: number): {
    width: number;
    height: number;
};
/**
 * Read a file as a `data:` URL.
 * @param file - accepted image file.
 * @returns the file's `data:` URL.
 */
export declare function readFileAsDataUrl(file: File): Promise<string>;
/**
 * Downscale and re-encode a `data:` URL image to the background budget.
 * @param source - decoded `data:` URL image.
 * @returns a JPEG `data:` URL bounded to {@link MAX_BACKGROUND_DIMENSION}.
 */
export declare function downscaleImageToDataUrl(source: string): Promise<string>;
/**
 * Read, downscale, and re-encode a selected file as a JPEG `data:` URL.
 * @param file - accepted image file.
 * @returns the downscaled JPEG `data:` URL.
 */
export declare function readBackgroundDataUrl(file: File): Promise<string>;
//# sourceMappingURL=image-file.d.ts.map