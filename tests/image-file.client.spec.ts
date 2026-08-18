// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  computeBackgroundDimensions, downscaleImageToDataUrl, readFileAsDataUrl, validateBackgroundFile,
} from '../src/client/image-file.ts'
import { MAX_BACKGROUND_IMAGE_BYTES } from '../src/theme-settings.ts'

afterEach(() => { vi.unstubAllGlobals(); vi.restoreAllMocks() })

describe('computeBackgroundDimensions', () => {
  it('keeps images at or below the longest-edge budget unchanged', () => {
    expect(computeBackgroundDimensions(800, 600)).toEqual({ width: 800, height: 600 })
    expect(computeBackgroundDimensions(1920, 1080)).toEqual({ width: 1920, height: 1080 })
  })

  it('downscales the longest edge to the budget and preserves aspect ratio', () => {
    expect(computeBackgroundDimensions(3840, 2160)).toEqual({ width: 1920, height: 1080 })
    expect(computeBackgroundDimensions(2000, 1000)).toEqual({ width: 1920, height: 960 })
  })

  it('clamps non-positive dimensions to a 1px minimum', () => {
    expect(computeBackgroundDimensions(0, 0)).toEqual({ width: 1, height: 1 })
    expect(computeBackgroundDimensions(-10, 5)).toEqual({ width: 1, height: 1 })
  })
})

describe('downscaleImageToDataUrl', () => {
  it('loads, scales, and re-encodes a data URL as JPEG', async () => {
    let image: { onload: (() => void) | null; onerror: (() => void) | null } | undefined
    class MockImage {
      onload: (() => void) | null = null
      onerror: (() => void) | null = null
      src = ''
      naturalWidth = 3840
      naturalHeight = 2160
      constructor() { image = this }
    }
    vi.stubGlobal('Image', MockImage)
    const drawImage = vi.fn()
    const toDataURL = vi.fn(() => 'data:image/jpeg;base64,SCALED')
    const getContext = vi.fn(() => ({ drawImage }))
    vi.spyOn(document, 'createElement').mockImplementation((_tag) => {
      return { width: 0, height: 0, getContext, toDataURL } as unknown as HTMLCanvasElement
    })

    const promise = downscaleImageToDataUrl('data:image/png;base64,AAA')
    image!.onload?.()
    await expect(promise).resolves.toBe('data:image/jpeg;base64,SCALED')
    expect(drawImage).toHaveBeenCalled()
    expect(toDataURL).toHaveBeenCalledWith('image/jpeg', 0.85)
  })

  it('rejects when the image fails to decode', async () => {
    let image: { onload: (() => void) | null; onerror: (() => void) | null } | undefined
    class MockImage {
      onload: (() => void) | null = null
      onerror: (() => void) | null = null
      src = ''
      constructor() { image = this }
    }
    vi.stubGlobal('Image', MockImage)
    const promise = downscaleImageToDataUrl('data:image/png;base64,BAD')
    image!.onerror?.()
    await expect(promise).rejects.toThrow('background image decode failed')
  })
})

describe('readFileAsDataUrl', () => {
  class MockFileReader {
    onload: (() => void) | null = null
    onerror: (() => void) | null = null
    result: string | null = null
    error: Error | null = null
    readAsDataURL = vi.fn()
  }

  it('resolves with the reader result', async () => {
    let instance: MockFileReader | undefined
    class CapturingReader extends MockFileReader {
      constructor() { super(); instance = this }
    }
    vi.stubGlobal('FileReader', CapturingReader)
    const file = { name: 'bg.png' } as File
    const promise = readFileAsDataUrl(file)
    instance!.result = 'data:image/png;base64,AAA'
    instance!.onload?.()
    await expect(promise).resolves.toBe('data:image/png;base64,AAA')
    expect(instance!.readAsDataURL).toHaveBeenCalledWith(file)
  })

  it('rejects when reading fails', async () => {
    let instance: MockFileReader | undefined
    class CapturingReader extends MockFileReader {
      constructor() { super(); instance = this }
    }
    vi.stubGlobal('FileReader', CapturingReader)
    const promise = readFileAsDataUrl({} as File)
    instance!.error = new Error('read failed')
    instance!.onerror?.()
    await expect(promise).rejects.toThrow('read failed')
  })
})

describe('validateBackgroundFile', () => {
  it('accepts a supported raster within the size cap', () => {
    expect(validateBackgroundFile({ size: 1024, type: 'image/png' })).toBeNull()
    expect(validateBackgroundFile({ size: 1024, type: 'image/jpeg' })).toBeNull()
    expect(validateBackgroundFile({ size: 1024, type: 'image/webp' })).toBeNull()
    expect(validateBackgroundFile({ size: 1024, type: 'image/gif' })).toBeNull()
  })

  it('rejects an oversized file', () => {
    expect(validateBackgroundFile({ size: MAX_BACKGROUND_IMAGE_BYTES + 1, type: 'image/png' })).toBe('upload.tooLarge')
  })

  it('rejects an unsupported or missing media type', () => {
    expect(validateBackgroundFile({ size: 1024, type: 'image/svg+xml' })).toBe('upload.unsupportedType')
    expect(validateBackgroundFile({ size: 1024, type: '' })).toBe('upload.unsupportedType')
  })
})
