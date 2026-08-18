/**
 * Browser-local persistence for the background settings. The plugin keeps its
 * own storage instead of routing through the Host settings Remote, so it can
 * run against an unmodified harness: the settings Remote only exposes
 * namespaces allowlisted by the api-proxy package, and a distributable plugin
 * cannot add itself to that list.
 */
import { type BackgroundSettings } from '../theme-settings.ts';
/** localStorage key under which the plugin stores its settings envelope. */
export declare const BACKGROUND_STORAGE_KEY = "dsh-ui-background:background.v1";
/** Default persisted background section. */
export declare function defaultBackgroundSettings(): BackgroundSettings;
/**
 * Read and validate the persisted background section from localStorage.
 * Malformed or out-of-range values fall back field-by-field to the defaults,
 * so a damaged envelope never breaks the row or the theme override.
 * @returns the validated persisted section.
 */
export declare function loadBackgroundSettings(): BackgroundSettings;
/**
 * Persist the background section to localStorage.
 * @param value - the section to write.
 */
export declare function saveBackgroundSettings(value: BackgroundSettings): void;
//# sourceMappingURL=background-storage.d.ts.map