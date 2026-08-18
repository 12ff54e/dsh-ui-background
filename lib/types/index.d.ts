/** Host registration for the background-image user-settings namespace. */
import type { Context } from '@deepseek-ai/cordis';
export { BACKGROUND_IMAGE_FIELD, BACKGROUND_SETTINGS_NAMESPACE, MAX_BACKGROUND_IMAGE_BYTES, type BackgroundSettings, } from './theme-settings.ts';
/**
 * Register the durable background section when the optional settings service is
 * composed; the browser half binds and writes it, and the theme override reads
 * it. Without a settings provider nothing registers, so the plugin stays a
 * no-op like every settings consumer.
 * @param ctx - Host context that may acquire the settings service.
 */
export declare function apply(ctx: Context): void;
//# sourceMappingURL=index.d.ts.map