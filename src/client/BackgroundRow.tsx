/**
 * Background preference row registered into the General section item slot:
 * title, upload/replace control, preview, remove, and a scrim-strength slider.
 * Selection reads the persisted image and scrim from the row store; writes
 * route through the injected face to the settings scope (which the plugin's
 * apply also projects onto the theme override token).
 */
import { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import type { PropsLocale, PropsRuntime, PropsStore } from '@deepseek-ai/dsh-client-ui-slots'
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'
import { MAX_BACKGROUND_DIM, MIN_BACKGROUND_DIM } from '../theme-settings.ts'
import type { createBackgroundRowStore } from './settings-store.ts'
import { readBackgroundDataUrl, validateBackgroundFile, type BackgroundFileErrorKey } from './image-file.ts'
import css from './BackgroundRow.module.css'

/** Injected business face: the settings writes (upload/replace, clear, and scrim). */
export interface BackgroundRowInjected {
  /** Persist a new background image `data:` URL. */
  setImage: (image: string) => void
  /** Clear the persisted background image. */
  clearImage: () => void
  /** Persist a new text-contrast scrim strength (0–1). */
  setDim: (dim: number) => void
}

/** Full component props: runtime share + store share + locale seat + injected face. */
export type BackgroundRowComponentProps =
  PropsRuntime<'settings.general.item'> & PropsStore<ReturnType<typeof createBackgroundRowStore>>
  & PropsLocale<'settings.background'> & BackgroundRowInjected

/**
 * Render the Background row.
 * @param props - composed slot props.
 * @returns the row element tree.
 */
export function BackgroundRow({ t, setImage, clearImage, setDim, useStore }: BackgroundRowComponentProps) {
  const image = useStore(state => state.image)
  const storedDim = useStore(state => state.dim)
  const inputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<BackgroundFileErrorKey | 'upload.readError' | null>(null)
  // Transient slider position: tracks the drag immediately while setDim commits
  // the value through the settings scope (which settles asynchronously).
  const [dim, setDimDraft] = useState(storedDim)
  useEffect(() => { setDimDraft(storedDim) }, [storedDim])

  const handleFile = (file: File): void => {
    const problem = validateBackgroundFile(file)
    if (problem !== null) {
      setError(problem)
      return
    }
    setError(null)
    void readBackgroundDataUrl(file).then(setImage).catch(() => { setError('upload.readError') })
  }

  const handleDim = (value: number): void => {
    setDimDraft(value)
    setDim(value)
  }

  return (
    <div className={css.group}>
      <div className={css.title}>{t('background.title')}</div>
      <div className={css.row}>
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          className={css.input}
          onChange={(event) => {
            const file = event.target.files?.[0]
            if (file !== undefined) handleFile(file)
            event.target.value = ''
          }}
        />
        <button
          type="button"
          className={clsx(css.control, image !== '' && css.replace)}
          onClick={() => { inputRef.current?.click() }}
        >
          {t(image === '' ? 'background.upload' : 'background.replace')}
        </button>
        {image !== '' && (
          <>
            <img className={css.preview} src={image} alt={t('background.preview')} />
            <button type="button" className={css.control} onClick={clearImage}>{t('background.remove')}</button>
          </>
        )}
      </div>
      {image !== '' && (
        <div className={css.dimRow}>
          <span className={css.dimLabel}>{t('background.dim')}</span>
          <input
            type="range"
            min={MIN_BACKGROUND_DIM}
            max={MAX_BACKGROUND_DIM}
            step={0.05}
            value={dim}
            className={css.dimSlider}
            onChange={(event) => { handleDim(Number(event.target.value)) }}
          />
        </div>
      )}
      {error !== null && <div className={css.error}>{t(error)}</div>}
    </div>
  )
}
