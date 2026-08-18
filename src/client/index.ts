/**
 * Browser half: persist the page background in localStorage, project the
 * persisted image onto the theme override token (`--dsw-alias-bg-image`), and
 * register the upload row into the General section item slot. The plugin owns
 * its shell-surface styles through an injected <style> tag (removed on
 * unload), so the harness shell needs no background-image CSS of its own.
 */
import type { BoundActions } from '@deepseek-ai/dsh-client-ui-slots'
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
// Type-only: pulls the theme plugin's Context merge (ctx.theme).
import type {} from '@deepseek-ai/dsh-client-ui-theme/client'
// Type-only: pulls the locale plugin's Context merge (ctx.locale).
import type {} from '@deepseek-ai/dsh-client-locale/client'
import type { BackgroundRowInjected } from './BackgroundRow.tsx'
import { BackgroundRow } from './BackgroundRow.tsx'
import { BACKGROUND_STORAGE_KEY, loadBackgroundSettings, saveBackgroundSettings } from './background-storage.ts'
import { createBackgroundRowStore } from './settings-store.ts'
import { en, zh, type BackgroundKey } from './locales.ts'

export type { BackgroundRowComponentProps, BackgroundRowInjected } from './BackgroundRow.tsx'
export type { BackgroundRowState } from './settings-store.ts'
export type { BackgroundKey } from './locales.ts'
export type { BackgroundSettings } from '../theme-settings.ts'

/** Namespace owning this feature's settings-row copy. */
export const SETTINGS_NS = 'settings.background'

/** Theme token the plugin sets and its injected shell styles consume. */
export const BACKGROUND_IMAGE_TOKEN = '--dsw-alias-bg-image'

/**
 * Shell-surface selectors the injected stylesheet paints. The AppFrame root is
 * the sole element child of #root after boot; the conversation and details
 * roots are the first children of the center and details grid columns
 * (children 2 and 3 of the AppFrame root).
 */
const BACKGROUND_STYLE = `
#root > div {
  background-image: var(--dsw-alias-bg-image, none);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
#root > div > div:nth-child(2) > *,
#root > div > div:nth-child(3) > * {
  background-image: var(--dsw-alias-bg-image, none);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}`

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    /** The Background settings row's copy. */
    'settings.background': BackgroundKey
  }
}

/** Required services: slots/locale for the row and theme for the override layer. */
export const inject = ['slots', 'locale', 'theme']

/**
 * Wrap a data URL and scrim strength as the per-palette background-image value:
 * a scrim (white in light, black in dark) layered over the image.
 * @param image - the background image `data:` URL.
 * @param dim - scrim strength (0–1).
 * @returns the composed per-palette values.
 */
function tokenValue(image: string, dim: number): { light: string; dark: string } {
  return {
    light: `linear-gradient(rgba(255, 255, 255, ${dim}), rgba(255, 255, 255, ${dim})), url("${image}")`,
    dark: `linear-gradient(rgba(0, 0, 0, ${dim}), rgba(0, 0, 0, ${dim})), url("${image}")`,
  }
}

/**
 * Client plugin body: apply the persisted image through a theme override layer
 * and an injected shell-surface stylesheet, then register the upload row.
 * @param ctx - client cordis context.
 */
export function apply(ctx: ClientContext): void {
  const store = createBackgroundRowStore()
  let bound: BoundActions<typeof store> | undefined

  // Project the persisted value onto the theme override token; the layer is
  // removed on unload (and whenever the value clears).
  let disposeOverride: (() => void) | undefined
  const applyImage = (): void => {
    disposeOverride?.()
    disposeOverride = undefined
    const value = loadBackgroundSettings()
    if (value.image === '') return
    disposeOverride = ctx.theme.overrideTokens('ui-background', {
      [BACKGROUND_IMAGE_TOKEN]: tokenValue(value.image, value.dim),
    })
  }

  // Write-through persistence: the row's injected face is the only writer.
  const publish = (image: string, dim: number): void => {
    saveBackgroundSettings({ image, dim })
    bound?.sync(image, dim)
    applyImage()
  }

  ctx.effect(() => {
    applyImage()
    const onStorage = (event: StorageEvent): void => {
      if (event.key === null || event.key === BACKGROUND_STORAGE_KEY) applyImage()
    }
    window.addEventListener('storage', onStorage)
    return () => {
      window.removeEventListener('storage', onStorage)
      disposeOverride?.()
    }
  }, 'ui-background: theme override + storage sync')

  ctx.effect(() => {
    const style = document.createElement('style')
    style.dataset.plugin = 'dsh-ui-background'
    style.dataset.pluginCss = 'dsh-ui-background/shell-background'
    style.textContent = BACKGROUND_STYLE
    document.head.appendChild(style)
    return () => { style.remove() }
  }, 'ui-background: shell background styles')

  ctx.effect(() => ctx.locale.register(SETTINGS_NS, { zh, en }), 'ui-background: settings row dictionaries')

  const injected = (actions: BoundActions<typeof store>): BackgroundRowInjected => {
    bound = actions
    // Re-sync from storage so no value is lost between registration and first render.
    const value = loadBackgroundSettings()
    actions.sync(value.image, value.dim)
    return {
      setImage: (image) => { publish(image, loadBackgroundSettings().dim) },
      clearImage: () => { publish('', loadBackgroundSettings().dim) },
      setDim: (dim) => { publish(loadBackgroundSettings().image, dim) },
    }
  }
  ctx.slots.inject('settings.general.item', () => ctx.slots.register({
    name: 'settings.general.item',
    id: 'background',
    order: 20,
    store,
    locale: SETTINGS_NS,
    inject: injected,
  }, BackgroundRow))
}
