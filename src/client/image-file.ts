/** Upload admission, downscaling, and file reading for the background control. */

import { MAX_BACKGROUND_IMAGE_BYTES } from '../theme-settings.ts'

/** Raster media types the upload control accepts. */
export const BACKGROUND_MEDIA_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'] as const

/** Longest edge the stored background is scaled to (keeps the durable data URL small). */
export const MAX_BACKGROUND_DIMENSION = 1920

/** JPEG quality used when re-encoding the downscaled background. */
export const BACKGROUND_JPEG_QUALITY = 0.85

/** Rejection reason keys resolved against the row's locale table. */
export type BackgroundFileErrorKey = 'upload.tooLarge' | 'upload.unsupportedType'

/**
 * Validate a selected file against the background admission policy.
 * @param file - selected file (size and declared media type).
 * @returns a rejection reason key, or `null` when the file is accepted.
 */
export function validateBackgroundFile(file: Pick<File, 'size' | 'type'>): BackgroundFileErrorKey | null {
  if (file.size > MAX_BACKGROUND_IMAGE_BYTES) return 'upload.tooLarge'
  if (!(BACKGROUND_MEDIA_TYPES as readonly string[]).includes(file.type)) return 'upload.unsupportedType'
  return null
}

/**
 * Compute the downscaled dimensions that keep the aspect ratio and bound the
 * longest edge by {@link MAX_BACKGROUND_DIMENSION}.
 * @param width - intrinsic width in pixels.
 * @param height - intrinsic height in pixels.
 * @returns the target dimensions (never larger than the input, minimum 1px).
 */
export function computeBackgroundDimensions(width: number, height: number): { width: number; height: number } {
  if (width <= 0 || height <= 0) return { width: 1, height: 1 }
  const scale = Math.min(1, MAX_BACKGROUND_DIMENSION / Math.max(width, height))
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  }
}

/**
 * Read a file as a `data:` URL.
 * @param file - accepted image file.
 * @returns the file's `data:` URL.
 */
export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => { resolve(reader.result as string) }
    reader.onerror = () => { reject(reader.error ?? new Error('background image read failed')) }
    reader.readAsDataURL(file)
  })
}

/** Load a `data:` URL into a decoded image element. */
function loadImage(source: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => { resolve(img) }
    img.onerror = () => { reject(new Error('background image decode failed')) }
    img.src = source
  })
}

/**
 * Downscale and re-encode a `data:` URL image to the background budget.
 * @param source - decoded `data:` URL image.
 * @returns a JPEG `data:` URL bounded to {@link MAX_BACKGROUND_DIMENSION}.
 */
export function downscaleImageToDataUrl(source: string): Promise<string> {
  return loadImage(source).then((img) => {
    const { width, height } = computeBackgroundDimensions(img.naturalWidth, img.naturalHeight)
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const context = canvas.getContext('2d')
    if (context === null) throw new Error('background image scaling failed')
    context.drawImage(img, 0, 0, width, height)
    return canvas.toDataURL('image/jpeg', BACKGROUND_JPEG_QUALITY)
  })
}

/**
 * Read, downscale, and re-encode a selected file as a JPEG `data:` URL.
 * @param file - accepted image file.
 * @returns the downscaled JPEG `data:` URL.
 */
export function readBackgroundDataUrl(file: File): Promise<string> {
  return readFileAsDataUrl(file).then(downscaleImageToDataUrl)
}
