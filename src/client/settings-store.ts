/**
 * Background row slot store: a mirror of the settings scope value. The
 * plugin's apply-world change listener is the only writer; the row component
 * reads via props.useStore.
 */
import { defineStore, type EngineStoreHandle } from '@deepseek-ai/dsh-client-runtime/client'
import { DEFAULT_BACKGROUND_DIM } from '../theme-settings.ts'

/** Store state mirrored from the settings scope. */
export interface BackgroundRowState {
  /** Current background image `data:` URL; empty means none. */
  image: string
  /** Current text-contrast scrim strength (0–1). */
  dim: number
}

/** Declared action shape giving the exported factory a stable return type. */
type BackgroundRowActions = {
  sync: (draft: BackgroundRowState, image: string, dim: number) => void
}

/**
 * Declares the Background row state and write surface.
 * @returns the store handle.
 */
export function createBackgroundRowStore(): EngineStoreHandle<BackgroundRowState, BackgroundRowActions> {
  return defineStore({
    init: (): BackgroundRowState => ({ image: '', dim: DEFAULT_BACKGROUND_DIM }),
    actions: {
      sync: (d, image, dim) => { d.image = image; d.dim = dim },
    },
  })
}
