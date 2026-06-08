import { ClientManifest } from '@deskthing/types'
import type { JSX as ReactJSX } from 'react'

declare global {
  interface Window {
    manifest?: ClientManifest
  }

  // Also expose `manifest` on `globalThis` so `globalThis.manifest` type-checks
  // (the loader in public/manifest-loader.js assigns it at runtime).
  // eslint-disable-next-line no-var
  var manifest: ClientManifest | undefined

  // React 19 removed the global `JSX` namespace (it now lives under `React.JSX`).
  // Re-expose it globally so existing `JSX.Element` annotations keep compiling.
  namespace JSX {
    type Element = ReactJSX.Element
    type ElementType = ReactJSX.ElementType
    type IntrinsicElements = ReactJSX.IntrinsicElements
  }
}
