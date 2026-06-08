import { ClientManifest } from '@deskthing/types'
import type { JSX as ReactJSX } from 'react'

declare global {
  interface Window {
    manifest?: ClientManifest
  }

  // React 19 removed the global `JSX` namespace (it now lives under `React.JSX`).
  // Re-expose it globally so existing `JSX.Element` annotations keep compiling.
  namespace JSX {
    type Element = ReactJSX.Element
    type ElementType = ReactJSX.ElementType
    type IntrinsicElements = ReactJSX.IntrinsicElements
  }
}
