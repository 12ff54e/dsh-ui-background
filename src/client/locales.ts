/** `settings.background` namespace dictionaries (the Background row's copy). */

/** Simplified Chinese dictionary (the key-set source of truth). */
export const zh = {
  'background.title': '背景图片',
  'background.upload': '上传图片',
  'background.replace': '更换图片',
  'background.remove': '移除',
  'background.preview': '背景图片预览',
  'background.dim': '背景变暗',
  'upload.tooLarge': '图片过大（上限 4 MB）',
  'upload.unsupportedType': '不支持的图片格式（仅支持 PNG、JPEG、WebP、GIF）',
  'upload.readError': '图片读取失败',
} satisfies Record<string, string>

/** The settings.background namespace key union. */
export type BackgroundKey = keyof typeof zh

/** English dictionary, checked complete against the zh key set. */
export const en = {
  'background.title': 'Background image',
  'background.upload': 'Upload image',
  'background.replace': 'Replace image',
  'background.remove': 'Remove',
  'background.preview': 'Background image preview',
  'background.dim': 'Dim background',
  'upload.tooLarge': 'Image is too large (max 4 MB)',
  'upload.unsupportedType': 'Unsupported format (PNG, JPEG, WebP, GIF only)',
  'upload.readError': 'Failed to read the image',
} satisfies Record<BackgroundKey, string>
