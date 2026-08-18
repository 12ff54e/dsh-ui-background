/** Background-image user settings stored in the Host user-settings document. */
import z from '@deepseek-ai/schemastery';
/** Settings namespace owned by the background plugin. */
export declare const BACKGROUND_SETTINGS_NAMESPACE = "ui-background";
/** Field carrying the background image (a `data:` URL produced by the upload control). */
export declare const BACKGROUND_IMAGE_FIELD = "image";
/** Field carrying the text-contrast scrim strength (0–1, 0 = no scrim). */
export declare const BACKGROUND_DIM_FIELD = "dim";
/** Default scrim strength when the user document has no override. */
export declare const DEFAULT_BACKGROUND_DIM = 0.55;
/** Minimum scrim strength the slider offers (no scrim). */
export declare const MIN_BACKGROUND_DIM = 0;
/** Maximum scrim strength the slider offers (fully obscured image). */
export declare const MAX_BACKGROUND_DIM = 1;
/** Maximum raw upload size accepted by the upload control. */
export declare const MAX_BACKGROUND_IMAGE_BYTES: number;
/** Durable background section shared by the Host schema and the browser scope. */
export interface BackgroundSettings {
    /** Background image as a `data:` URL; empty means no background. */
    image: string;
    /** Text-contrast scrim strength (0–1). */
    dim: number;
}
/** Durable background schema; also the wire envelope the browser scope validates against. */
export declare const BackgroundSettingsSchema: z<BackgroundSettings>;
//# sourceMappingURL=theme-settings.d.ts.map