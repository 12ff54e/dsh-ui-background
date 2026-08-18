# dsh-ui-background — plugin authoring/build/release notes

## Package shape

A distributable dsh plugin is its own npm package with:

- `package.json`:
  - `main: lib/index.js` (Node half)
  - `exports["./client"]` (browser half)
  - `dsh.bundle.patch: ./cordis.patch.yml`
  - `dsh.client`: `{ platform: "web", inject: [...] }`
  - `files`: main lib JS, `cordis.patch.yml`, and `lib/types/**/*.d.ts`
- `cordis.patch.yml`: inserts the row after the web-app roster:
  ```yaml
  - insert:
      - id: ui-background
        name: 'dsh-ui-background'
  ```
- `src/index.ts`: host half (`apply(ctx)`)
- `src/client/index.ts`: browser half (`export const inject = ['slots', 'locale', 'theme']`)
- `src/invariant.ts`: invariant companion registering under the package name
- `tsconfig.json`: self-contained TS build (`tsc -b` emits `lib/types`)
- `tsdown.config.ts`: bundles Node half (`lib/index.js`, `lib/invariant.js`) and browser half (`lib/client.js`)

## Build

```sh
cd dsh-ui-background
pnpm install
pnpm run build    # tsc -b && tsdown
```

When building inside the deepseek-harness source checkout, add the plugin to the
workspace first so `@deepseek-ai/*` deps resolve to the harness packages:

```yaml
packages:
  - dsh-plugins/*
```

Then build the harness libs before the plugin, because a fresh checkout does
not include built `lib/types`:

```sh
pnpm install --no-frozen-lockfile
pnpm run build:lib:host
pnpm run build:lib:client
pnpm --filter dsh-ui-background run build
```

## CI release

The release workflow (`.github/workflows/release.yml`) does the same thing on
`v*` tags:

1. checkout plugin repo
2. checkout `deepseek-ai/deepseek-harness`
3. move plugin into `harness/dsh-plugins/dsh-ui-background`
4. add `- dsh-plugins/*` to `harness/pnpm-workspace.yaml`
5. `pnpm install --no-frozen-lockfile`
6. `pnpm run build:lib:host`
7. `pnpm run build:lib:client`
8. `pnpm --filter dsh-ui-background run build`
9. `pnpm pack`
10. upload tarball to GitHub release

## Install from release

```sh
dsh plugin --profile web add \
  https://github.com/12ff54e/dsh-ui-background/releases/download/v0.1.0-rc.5/dsh-ui-background-0.1.0-rc.5.tgz
```

## Pitfalls

- Do not commit `node_modules` or `*.tsbuildinfo`.
- Commit `lib/` for simple git installs; the release workflow rebuilds it.
- If a package is imported only for its type declarations, it still must be in
  `devDependencies`/`peerDependencies` or tsc will not find it.
- Keep `@deepseek-ai/dsh-*` versions aligned with the harness workspace used
  for the build; the public npm versions may be incomplete.
