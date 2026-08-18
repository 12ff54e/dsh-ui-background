import { settingsNamespace } from "@deepseek-ai/dsh-settings";
import z from "@deepseek-ai/schemastery";
//#region lib/types/theme-settings.js
/** Background-image user settings stored in the Host user-settings document. */
/** Settings namespace owned by the background plugin. */
const BACKGROUND_SETTINGS_NAMESPACE = "ui-background";
/** Field carrying the background image (a `data:` URL produced by the upload control). */
const BACKGROUND_IMAGE_FIELD = "image";
/** Default scrim strength when the user document has no override. */
const DEFAULT_BACKGROUND_DIM = .55;
/** Maximum raw upload size accepted by the upload control. */
const MAX_BACKGROUND_IMAGE_BYTES = 4 * 1024 * 1024;
/**
* Headroom for the `data:` prefix over the base64 expansion of
* {@link MAX_BACKGROUND_IMAGE_BYTES}; the Host schema caps the stored string so
* an oversized write fails at the durable boundary even if the client check is
* bypassed.
*/
const MAX_BACKGROUND_IMAGE_DATA_URL_LENGTH = Math.ceil(MAX_BACKGROUND_IMAGE_BYTES * 4 / 3) + 1024;
/** Durable background schema; also the wire envelope the browser scope validates against. */
const BackgroundSettingsSchema = z.object({
	[BACKGROUND_IMAGE_FIELD]: z.string().max(MAX_BACKGROUND_IMAGE_DATA_URL_LENGTH).default(""),
	["dim"]: z.number().min(0).max(1).default(DEFAULT_BACKGROUND_DIM)
});
//#endregion
//#region lib/types/index.js
/** Host registration for the background-image user-settings namespace. */
const NAMESPACE = settingsNamespace(BACKGROUND_SETTINGS_NAMESPACE);
/**
* Register the durable background section when the optional settings service is
* composed; the browser half binds and writes it, and the theme override reads
* it. Without a settings provider nothing registers, so the plugin stays a
* no-op like every settings consumer.
* @param ctx - Host context that may acquire the settings service.
*/
function apply(ctx) {
	ctx.inject(["settings"], (settingsCtx) => {
		settingsCtx.settings.register(NAMESPACE, BackgroundSettingsSchema);
	});
}
//#endregion
export { BACKGROUND_IMAGE_FIELD, BACKGROUND_SETTINGS_NAMESPACE, MAX_BACKGROUND_IMAGE_BYTES, apply };
