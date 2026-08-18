# `dsh-ui-background`

English | [中文](README.zh.md)

Web UI background-image plugin: a dual-face package whose Host half registers the `ui-background` user-settings namespace for deployments that expose it, and whose browser half registers the Appearance settings row that uploads, replaces, or removes the page background. The browser half persists the selection in `localStorage`, so it works against an unmodified harness without an api-proxy settings allowlist entry. The persisted image is a `data:` URL; the browser half projects it onto the theme override token `--dsw-alias-bg-image` and injects a plugin-owned `<style>` tag that paints the AppFrame, conversation, and details surfaces with it — a per-palette text-contrast scrim (white in light, black in dark) is layered over the image so foreground text stays legible, its strength adjustable through an Appearance slider, and the shell's `--dsw-alias-bg-base` remains underneath as the fallback color. The upload control accepts PNG, JPEG, WebP, and GIF up to 4 MB, downscales the image to a 1920px longest edge, and re-encodes it as JPEG so the stored value stays small.

The plugin ships as a standalone bundle package in this directory. Add it to a web profile with `dsh plugin --profile <name> add ./ui-background` (the bundle patch inserts the `ui-background` row after the web-app roster). In the General settings section: pick an image to set the background, pick another to replace it, or remove it to revert to the default background. The value survives reloads because it lives in `localStorage`; the theme override layer and injected stylesheet are both removed on plugin unload, restoring the default background.

## Model Experience

None, as the plugin only changes the browser page background and stores the image in localStorage; nothing here reaches a model request.

#### KV Cache effect

None; this package neither assembles nor sends a provider request.

## Known Limitations and Deferred Work

- **The image is stored as a downscaled JPEG `data:` URL in `localStorage`** — the upload re-encodes to a 1920px JPEG (quality 0.85), so the stored value stays bounded; a deployment needing the original bytes would need a file-storage plus serving route instead.
- **Transparency and animation are flattened** — the background is always re-encoded as JPEG, so an animated GIF becomes its first frame and PNG alpha is lost; such sources should be prepared as a static JPEG before upload.
- **One image for both palettes** — the same image serves light and dark themes; per-scheme backgrounds would need a per-mode settings field.
