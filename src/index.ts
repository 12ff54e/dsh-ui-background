/** Host registration for the background-image user-settings namespace. */

import type { Context } from '@deepseek-ai/cordis'
import { settingsNamespace } from '@deepseek-ai/dsh-settings'
import { BACKGROUND_SETTINGS_NAMESPACE, BackgroundSettingsSchema } from './theme-settings.ts'

export {
  BACKGROUND_IMAGE_FIELD, BACKGROUND_SETTINGS_NAMESPACE, MAX_BACKGROUND_IMAGE_BYTES,
  type BackgroundSettings,
} from './theme-settings.ts'

const NAMESPACE = settingsNamespace(BACKGROUND_SETTINGS_NAMESPACE)

/**
 * Register the durable background section when the optional settings service is
 * composed; the browser half binds and writes it, and the theme override reads
 * it. Without a settings provider nothing registers, so the plugin stays a
 * no-op like every settings consumer.
 * @param ctx - Host context that may acquire the settings service.
 */
export function apply(ctx: Context): void {
  ctx.inject(['settings'], (settingsCtx) => {
    settingsCtx.settings.register(NAMESPACE, BackgroundSettingsSchema)
  })
}
