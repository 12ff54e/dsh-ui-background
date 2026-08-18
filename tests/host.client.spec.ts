import { Context } from '@deepseek-ai/cordis'
import { describe, expect, it } from 'vitest'
import { SettingsProvider, settingsNamespace, type SettingsNamespace } from '@deepseek-ai/dsh-settings'
import { apply, BACKGROUND_SETTINGS_NAMESPACE } from '../src/index.ts'

class MemorySettings extends SettingsProvider {
  readonly writable = true
  protected load(): Promise<Record<string, unknown>> { return Promise.resolve({}) }
  protected persist(_ns: SettingsNamespace, _section: Record<string, unknown>): Promise<void> {
    return Promise.resolve()
  }
}

describe('ui-background host', () => {
  it('registers, validates, and disposes the durable background namespace with its fiber', async () => {
    const ctx = new Context()
    await ctx.plugin(MemorySettings).await()
    const fiber = ctx.plugin({ apply })
    await fiber.await()
    const ns = settingsNamespace(BACKGROUND_SETTINGS_NAMESPACE)
    expect(ctx.settings.get(ns)).toEqual({ image: '', dim: 0.55 })
    await ctx.settings.update(ns, { image: 'data:image/png;base64,AAA', dim: 0.3 })
    expect(ctx.settings.get(ns)).toEqual({ image: 'data:image/png;base64,AAA', dim: 0.3 })
    await fiber.dispose()
    expect(ctx.settings.describe().map(row => row.ns)).not.toContain(ns)
  })

  it('rejects an oversized data URL at the durable boundary', async () => {
    const ctx = new Context()
    await ctx.plugin(MemorySettings).await()
    const fiber = ctx.plugin({ apply })
    await fiber.await()
    const ns = settingsNamespace(BACKGROUND_SETTINGS_NAMESPACE)
    await expect(ctx.settings.update(ns, { image: 'x'.repeat(6 * 1024 * 1024) })).rejects.toThrow()
    await fiber.dispose()
  })
})
