import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client';
import { type BackgroundKey } from './locales.ts';
export type { BackgroundRowComponentProps, BackgroundRowInjected } from './BackgroundRow.tsx';
export type { BackgroundRowState } from './settings-store.ts';
export type { BackgroundKey } from './locales.ts';
export type { BackgroundSettings } from '../theme-settings.ts';
/** Namespace owning this feature's settings-row copy. */
export declare const SETTINGS_NS = "settings.background";
/** Theme token the plugin sets and its injected shell styles consume. */
export declare const BACKGROUND_IMAGE_TOKEN = "--dsw-alias-bg-image";
declare module '@deepseek-ai/dsh-client-ui-slots' {
    interface LocaleNamespaceMap {
        /** The Background settings row's copy. */
        'settings.background': BackgroundKey;
    }
}
/** Required services: slots/locale for the row and theme for the override layer. */
export declare const inject: string[];
/**
 * Client plugin body: apply the persisted image through a theme override layer
 * and an injected shell-surface stylesheet, then register the upload row.
 * @param ctx - client cordis context.
 */
export declare function apply(ctx: ClientContext): void;
//# sourceMappingURL=index.d.ts.map