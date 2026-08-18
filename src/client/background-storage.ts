/**
 * Browser-local persistence for the background settings. The plugin keeps its
 * own storage instead of routing through the Host settings Remote, so it can
 * run against an unmodified harness: the settings Remote only exposes
 * namespaces allowlisted by the api-proxy package, and a distributable plugin
 * cannot add itself to that list.
 */
import {
  DEFAULT_BACKGROUND_DIM, MAX_BACKGROUND_DIM, MIN_BACKGROUND_DIM,
  type BackgroundSettings,
} from '../theme-settings.ts'

/** localStorage key under which the plugin stores its settings envelope. */
export const BACKGROUND_STORAGE_KEY = 'dsh-ui-background:background.v1'

/** Default persisted background section. */
export function defaultBackgroundSettings(): BackgroundSettings {
  return { image: '', dim: DEFAULT_BACKGROUND_DIM }
}

/**
 * Read and validate the persisted background section from localStorage.
 * Malformed or out-of-range values fall back field-by-field to the defaults,
 * so a damaged envelope never breaks the row or the theme override.
 * @returns the validated persisted section.
 */
export function loadBackgroundSettings(): BackgroundSettings {
  if (typeof localStorage === 'undefined') return defaultBackgroundSettings()
  const raw = localStorage.getItem(BACKGROUND_STORAGE_KEY)
  if (raw === null) return defaultBackgroundSettings()
  try {
    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed !== 'object' || parsed === null) return defaultBackgroundSettings()
    const { image, dim } = parsed as Record<string, unknown>
    return {
      image: typeof image === 'string' ? image : '',
      dim: typeof dim === 'number' && Number.isFinite(dim)
        ? Math.min(MAX_BACKGROUND_DIM, Math.max(MIN_BACKGROUND_DIM, dim))
        : DEFAULT_BACKGROUND_DIM,
    }
  } catch (_malformedEnvelope) {
    return defaultBackgroundSettings()
  }
}

/**
 * Persist the background section to localStorage.
 * @param value - the section to write.
 */
export function saveBackgroundSettings(value: BackgroundSettings): void {
  if (typeof localStorage === 'undefined') return
  localStorage.setItem(BACKGROUND_STORAGE_KEY, JSON.stringify(value))
}
