// Packages the built `dist/` folder into the deployable client zip.
//
// The official `@deskthing/cli package-client` build is currently broken, so
// the reliable flow is: `vite build` (refreshes dist/) -> this script (zips
// dist/ into deskthing-client-<version>.zip). The zip must contain the build
// output at its ROOT (index.html, assets/, icons/, ...), matching what the
// DeskThing server expects when it stages a client.
//
// Run via: npm run build:client

import { execFileSync } from 'node:child_process'
import { readFileSync, existsSync, rmSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const distDir = resolve(root, 'dist')

if (!existsSync(distDir)) {
  console.error('dist/ not found. Run `vite build` first (or use `npm run build:client`).')
  process.exit(1)
}

const { version } = JSON.parse(readFileSync(resolve(root, 'public/manifest.json'), 'utf8'))
const zipPath = resolve(root, `deskthing-client-${version}.zip`)

if (existsSync(zipPath)) rmSync(zipPath)

// Use PowerShell 7's Compress-Archive so the zip works on this Windows dev
// setup without adding a zip dependency. `dist/*` keeps the build output at the
// zip root rather than nested inside a `dist/` folder.
//
// IMPORTANT: must be `pwsh` (PowerShell 7+), NOT `powershell` (Windows
// PowerShell 5.1). 5.1 writes backslash path separators into the zip
// (e.g. `assets\index.js`), which violates the ZIP spec and extracts as broken
// filenames on the Linux-based Car Thing. pwsh 7+ writes forward slashes.
execFileSync(
  'pwsh',
  [
    '-NoProfile',
    '-ExecutionPolicy',
    'Bypass',
    '-Command',
    `Compress-Archive -Path '${distDir}/*' -DestinationPath '${zipPath}' -CompressionLevel Optimal`
  ],
  { stdio: 'inherit' }
)

console.log(`Packaged client -> ${zipPath}`)
