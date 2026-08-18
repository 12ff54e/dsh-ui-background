/** Background-image user settings stored in the Host user-settings document. */

import z from '@deepseek-ai/schemastery'

/** Settings namespace owned by the background plugin. */
export const BACKGROUND_SETTINGS_NAMESPACE = 'ui-background'

/** Field carrying the background image (a `data:` URL produced by the upload control). */
export const BACKGROUND_IMAGE_FIELD = 'image'

/** Field carrying the text-contrast scrim strength (0–1, 0 = no scrim). */
export const BACKGROUND_DIM_FIELD = 'dim'

/** Default scrim strength when the user document has no override. */
export const DEFAULT_BACKGROUND_DIM = 0.55

/** Minimum scrim strength the slider offers (no scrim). */
export const MIN_BACKGROUND_DIM = 0

/** Maximum scrim strength the slider offers (fully obscured image). */
export const MAX_BACKGROUND_DIM = 1

/** Maximum raw upload size accepted by the upload control. */
export const MAX_BACKGROUND_IMAGE_BYTES = 4 * 1024 * 1024

/**
 * Headroom for the `data:` prefix over the base64 expansion of
 * {@link MAX_BACKGROUND_IMAGE_BYTES}; the Host schema caps the stored string so
 * an oversized write fails at the durable boundary even if the client check is
 * bypassed.
 */
const MAX_BACKGROUND_IMAGE_DATA_URL_LENGTH = Math.ceil(MAX_BACKGROUND_IMAGE_BYTES * 4 / 3) + 1024

/** Durable background section shared by the Host schema and the browser scope. */
export interface BackgroundSettings {
  /** Background image as a `data:` URL; empty means no background. */
  image: string
  /** Text-contrast scrim strength (0–1). */
  dim: number
}

/** Durable background schema; also the wire envelope the browser scope validates against. */
export const BackgroundSettingsSchema: z<BackgroundSettings> = z.object({
  [BACKGROUND_IMAGE_FIELD]: z.string().max(MAX_BACKGROUND_IMAGE_DATA_URL_LENGTH).default(''),
  [BACKGROUND_DIM_FIELD]: z.number().min(MIN_BACKGROUND_DIM).max(MAX_BACKGROUND_DIM).default(DEFAULT_BACKGROUND_DIM),
})
