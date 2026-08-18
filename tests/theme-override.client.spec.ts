// @vitest-environment jsdom
/** End-to-end theme-override chain: applyImage → ThemeRuntime.overrideTokens →
 * theme/change → body inline token, using the real ThemeRuntime and the
 * plugin's localStorage-backed persistence. */
import { Context } from '@deepseek-ai/cordis'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { SlotRegistry } from '@deepseek-ai/dsh-client-runtime/client'
import { LocaleRuntime } from '@deepseek-ai/dsh-client-locale/client'
import { ThemeRuntime } from '@deepseek-ai/dsh-client-ui-theme/client'
import type { SettingsScope, SettingsScopeSnapshot } from '@deepseek-ai/dsh-client-runtime/client'
import { apply, inject, BACKGROUND_IMAGE_TOKEN } from '../src/client/index.ts'
import { BackgroundRow, type BackgroundRowInjected } from '../src/client/BackgroundRow.tsx'
import { BACKGROUND_STORAGE_KEY } from '../src/client/background-storage.ts'
import type { createBackgroundRowStore } from '../src/client/settings-store.ts'

const SLOT = 'settings.general.item'

beforeEach(() => {
  localStorage.clear()
  document.head.innerHTML = ''
  document.body.removeAttribute('style')
})

function stubThemeHost(): SettingsScope<{ preference: string }> {
  let snapshot: SettingsScopeSnapshot<{ preference: string }> = {
    status: 'ready', value: { preference: 'system' }, base: undefined, user: undefined,
    revision: 0, writable: true, mode: 'host',
  }
  const listeners = new Set<() => void>()
  return {
    getSnapshot: () => snapshot,
    subscribe: (fn) => { listeners.add(fn); return () => { listeners.delete(fn) } },
    set: vi.fn(() => Promise.resolve()),
    unset: vi.fn(() => Promise.resolve()),
  }
}

function faceOf(slots: SlotRegistry) {
  const entry = slots.entries(SLOT).find(e => e.component === BackgroundRow)!
  const handle = entry.store as ReturnType<typeof createBackgroundRowStore>
  const instance = handle.create()
  const face = (entry.inject as unknown as (a: typeof instance.actions) => BackgroundRowInjected)(instance.actions)
  return { instance, face }
}

async function bench() {
  const ctx = new Context()
  await ctx.plugin(SlotRegistry).await()
  const locale = new LocaleRuntime(ctx)
  ctx.provide('locale', locale)

  // Real ThemeRuntime over a stubbed theme settings host; a presenter stand-in
  // projects every theme/change snapshot onto the body inline tokens.
  const theme = new ThemeRuntime(ctx, stubThemeHost() as never)
  ctx.provide('theme', theme)
  let applied: string[] = []
  ctx.on('theme/change', (snapshot) => {
    for (const name of applied) document.body.style.removeProperty(name)
    applied = []
    for (const [name, value] of Object.entries(snapshot.active.tokens)) {
      document.body.style.setProperty(name, value)
      applied.push(name)
    }
  })

  ctx.slots.register({ name: 'root', children: { [SLOT]: { kind: 'list', scope: 'root' } } } as never, () => null)
  await ctx.plugin({ inject: [...inject], apply }).await()
  return { ctx, theme, slots: ctx.get('slots') as SlotRegistry }
}

describe('theme override chain', () => {
  it('publishes a stored image and lands the scrim-over-image token on the body', async () => {
    const b = await bench()
    const image = 'data:image/png;base64,AAA'
    localStorage.setItem(BACKGROUND_STORAGE_KEY, JSON.stringify({ image, dim: 0.4 }))
    faceOf(b.slots).face.setImage(image)
    const expected = `linear-gradient(rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.4)), url("${image}")`
    expect(document.body.style.getPropertyValue(BACKGROUND_IMAGE_TOKEN)).toBe(expected)
    expect(b.theme.getTheme().active.tokens[BACKGROUND_IMAGE_TOKEN]).toBe(expected)
  })

  it('clears the token when the image empties', async () => {
    const b = await bench()
    localStorage.setItem(BACKGROUND_STORAGE_KEY, JSON.stringify({ image: 'data:image/png;base64,AAA', dim: 0.4 }))
    const face = faceOf(b.slots).face
    face.setImage('data:image/png;base64,AAA')
    face.clearImage()
    expect(document.body.style.getPropertyValue(BACKGROUND_IMAGE_TOKEN)).toBe('')
    expect(b.theme.getTheme().active.tokens[BACKGROUND_IMAGE_TOKEN]).toBeUndefined()
  })
})
