// @vitest-environment jsdom
/** BackgroundRow behavior: upload/replace/remove controls, preview, and the
 * scrim slider follow the store mirror; writes drive the injected face. */
import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { createSnapshotStore, type SessionListState, type WorkspaceListState } from '@deepseek-ai/dsh-client-runtime/client'
import { bindSnapshotSelector } from '@deepseek-ai/dsh-client-web-react'
import { BackgroundRow } from '../src/client/BackgroundRow.tsx'
import type { BackgroundRowComponentProps } from '../src/client/BackgroundRow.tsx'
import { createBackgroundRowStore } from '../src/client/settings-store.ts'
import { en } from '../src/client/locales.ts'

afterEach(cleanup)

/** Empty global standard-kit hooks (the row reads neither). */
function emptySessions() {
  const store = createSnapshotStore<SessionListState>(
    { ids: [], byId: {}, current: undefined, phase: 'ready', subagentsByParent: {}, jobsBySession: {}, currentAddress: undefined })
  return bindSnapshotSelector(store)
}
function emptyWorkspaces() {
  const store = createSnapshotStore<WorkspaceListState>({
    items: [], archivedSessionIds: [], state: 'idle', phase: 'ready', error: null,
    baselinesReady: true, recentWorkspaceId: undefined,
  })
  return bindSnapshotSelector(store)
}

function mount(image = '', dim = 0.55) {
  const store = createBackgroundRowStore().create()
  store.actions.sync(image, dim)
  const setImage = vi.fn()
  const clearImage = vi.fn()
  const setDim = vi.fn()
  const props: BackgroundRowComponentProps = {
    useSessions: emptySessions(),
    useWorkspaces: emptyWorkspaces(),
    useStore: bindSnapshotSelector(store),
    actions: store.actions,
    t: (key: string) => (en as Record<string, string>)[key] ?? key,
    setImage,
    clearImage,
    setDim,
  }
  render(<BackgroundRow {...props} />)
  return { store, setImage, clearImage, setDim }
}

describe('BackgroundRow', () => {
  it('renders the title and upload control when no image is set', () => {
    mount('')
    expect(screen.getByText('Background image')).toBeDefined()
    expect(screen.getByRole('button', { name: 'Upload image' })).toBeDefined()
    expect(screen.queryByRole('button', { name: 'Remove' })).toBeNull()
    expect(screen.queryByRole('slider')).toBeNull()
  })

  it('renders preview, replace, remove, and the slider when an image is set; remove drives clearImage', () => {
    const b = mount('data:image/png;base64,AAA')
    expect(screen.getByRole('button', { name: 'Replace image' })).toBeDefined()
    expect(screen.getByAltText('Background image preview')).toBeDefined()
    const preview = screen.getByAltText('Background image preview') as HTMLImageElement
    expect(preview.src).toBe('data:image/png;base64,AAA')
    fireEvent.click(screen.getByRole('button', { name: 'Remove' }))
    expect(b.clearImage).toHaveBeenCalledOnce()
  })

  it('renders the slider at the persisted dim and drives setDim on change', () => {
    const b = mount('data:image/png;base64,AAA', 0.7)
    const slider = screen.getByRole('slider') as HTMLInputElement
    expect(slider.value).toBe('0.7')
    fireEvent.change(slider, { target: { value: '0.3' } })
    expect(b.setDim).toHaveBeenCalledWith(0.3)
  })
})
