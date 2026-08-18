import type { PropsLocale, PropsRuntime, PropsStore } from '@deepseek-ai/dsh-client-ui-slots';
import type { createBackgroundRowStore } from './settings-store.ts';
/** Injected business face: the settings writes (upload/replace, clear, and scrim). */
export interface BackgroundRowInjected {
    /** Persist a new background image `data:` URL. */
    setImage: (image: string) => void;
    /** Clear the persisted background image. */
    clearImage: () => void;
    /** Persist a new text-contrast scrim strength (0–1). */
    setDim: (dim: number) => void;
}
/** Full component props: runtime share + store share + locale seat + injected face. */
export type BackgroundRowComponentProps = PropsRuntime<'settings.general.item'> & PropsStore<ReturnType<typeof createBackgroundRowStore>> & PropsLocale<'settings.background'> & BackgroundRowInjected;
/**
 * Render the Background row.
 * @param props - composed slot props.
 * @returns the row element tree.
 */
export declare function BackgroundRow({ t, setImage, clearImage, setDim, useStore }: BackgroundRowComponentProps): import("react").JSX.Element;
//# sourceMappingURL=BackgroundRow.d.ts.map