// @vitest-environment jsdom
/** ui-background apply wiring: dictionaries, declaration-aware row
 * registration, localStorage-backed theme projection, face write routing, and
 * teardown. */
import { Context } from '@deepseek-ai/cordis'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { SlotRegistry } from '@deepseek-ai/dsh-client-runtime/client'
import { LocaleRuntime } from '@deepseek-ai/dsh-client-locale/client'
import { apply, inject, SETTINGS_NS, BACKGROUND_IMAGE_TOKEN } from '../src/client/index.ts'
import { BackgroundRow, type BackgroundRowInjected } from '../src/client/BackgroundRow.tsx'
import { BACKGROUND_STORAGE_KEY } from '../src/client/background-storage.ts'
import type { createBackgroundRowStore } from '../src/client/settings-store.ts'

const SLOT = 'settings.general.item'

beforeEach(() => {
  localStorage.clear()
  document.head.innerHTML = ''
  document.body.removeAttribute('style')
})

function declareItems(slots: SlotRegistry): () => void {
  return slots.register(
    { name: 'root', children: { [SLOT]: { kind: 'list', scope: 'root' } } } as never,
    () => null,
  )
}

async function bench() {
  const ctx = new Context()
  await ctx.plugin(SlotRegistry).await()
  const locale = new LocaleRuntime(ctx)
  ctx.provide('locale', locale)
  const overrideTokens = vi.fn(() => () => {})
  ctx.provide('theme', { overrideTokens } as never)
  return { ctx, slots: ctx.get('slots') as SlotRegistry, locale, overrideTokens }
}

function faceOf(slots: SlotRegistry) {
  const entry = slots.entries(SLOT).find(e => e.component === BackgroundRow)!
  const handle = entry.store as ReturnType<typeof createBackgroundRowStore>
  const instance = handle.create()
  const face = (entry.inject as unknown as (a: typeof instance.actions) => BackgroundRowInjected)(instance.actions)
  return { entry, instance, face }
}

describe('ui-background apply', () => {
  it('declares the slot, locale, and theme services', () => {
    expect(inject).toEqual(['slots', 'locale', 'theme'])
  })

  it('registers localized copy and the row with its options', async () => {
    const b = await bench()
    declareItems(b.slots)
    b.locale.setLocale('zh')
    await b.ctx.plugin({ inject: [...inject], apply }).await()
    expect(b.locale.bind(SETTINGS_NS)('background.title')).toBe('背景图片')
    b.locale.setLocale('en')
    expect(b.locale.bind(SETTINGS_NS)('background.title')).toBe('Background image')
    const entry = b.slots.entries(SLOT).find(e => e.component === BackgroundRow)!
    expect(entry.options).toMatchObject({ id: 'background', order: 20 })
    expect(entry.locale).toBe(SETTINGS_NS)
  })

  it('injects shell background styles and removes them on dispose', async () => {
    const b = await bench()
    declareItems(b.slots)
    const fiber = b.ctx.plugin({ inject: [...inject], apply })
    await fiber.await()
    const style = document.head.querySelector('style[data-plugin="dsh-ui-background"]')!
    expect(style).toBeDefined()
    expect(style.textContent).toContain('--dsw-alias-bg-image')
    await fiber.dispose()
    expect(document.head.querySelector('style[data-plugin="dsh-ui-background"]')).toBeNull()
  })

  it('projects the persisted localStorage value onto the theme override token and clears it', async () => {
    const b = await bench()
    declareItems(b.slots)
    const image = 'data:image/png;base64,AAA'
    localStorage.setItem(BACKGROUND_STORAGE_KEY, JSON.stringify({ image, dim: 0.3 }))
    await b.ctx.plugin({ inject: [...inject], apply }).await()
    expect(b.overrideTokens).toHaveBeenCalledTimes(1)
    expect(b.overrideTokens).toHaveBeenCalledWith('ui-background', {
      [BACKGROUND_IMAGE_TOKEN]: {
        light: `linear-gradient(rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.3)), url("${image}")`,
        dark: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url("${image}")`,
      },
    })

    const { face } = faceOf(b.slots)
    face.clearImage()
    expect(localStorage.getItem(BACKGROUND_STORAGE_KEY)).toBe(JSON.stringify({ image: '', dim: 0.3 }))
    expect(b.overrideTokens).toHaveBeenCalledTimes(1)
  })

  it('routes face writes to localStorage and mirrors the store', async () => {
    const b = await bench()
    declareItems(b.slots)
    await b.ctx.plugin({ inject: [...inject], apply }).await()
    const { instance, face } = faceOf(b.slots)

    face.setImage('data:image/png;base64,BBB')
    expect(JSON.parse(localStorage.getItem(BACKGROUND_STORAGE_KEY)!)).toEqual({ image: 'data:image/png;base64,BBB', dim: 0.55 })
    expect(instance.getSnapshot().image).toBe('data:image/png;base64,BBB')
    expect(instance.getSnapshot().dim).toBe(0.55)

    face.setDim(0.7)
    expect(JSON.parse(localStorage.getItem(BACKGROUND_STORAGE_KEY)!)).toEqual({ image: 'data:image/png;base64,BBB', dim: 0.7 })
    expect(instance.getSnapshot().dim).toBe(0.7)
  })

  it('teardown removes the row, dictionaries, styles, and the override layer', async () => {
    const b = await bench()
    declareItems(b.slots)
    const fiber = b.ctx.plugin({ inject: [...inject], apply })
    await fiber.await()
    expect(b.slots.entries(SLOT)).toHaveLength(1)
    const image = 'data:image/png;base64,AAA'
    localStorage.setItem(BACKGROUND_STORAGE_KEY, JSON.stringify({ image, dim: 0.3 }))
    // The startup projection only happens inside the effect; simulate a write
    // so the override layer exists before disposal.
    faceOf(b.slots).face.setImage(image)
    expect(b.overrideTokens).toHaveBeenCalled()
    await fiber.dispose()
    expect(b.slots.entries(SLOT)).toHaveLength(0)
    expect(b.locale.bind(SETTINGS_NS)('background.title')).toBe('background.title')
    expect(document.head.querySelector('style[data-plugin="dsh-ui-background"]')).toBeNull()
  })
})
