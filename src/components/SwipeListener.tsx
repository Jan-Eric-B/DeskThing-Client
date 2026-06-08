import { useMappingStore } from '@src/stores'
import { useEffect } from 'react'
import { EventMode } from '@deskthing/types'

/**
 * A React component that listens for swipe gestures on the window and executes corresponding actions based on the swipe direction.
 *
 * The component uses the `useMappingStore` hook to access the `executeAction` and `getButtonAction` functions from the store.
 * It sets up event listeners for `touchstart`, `touchend`, `mousedown`, and `mouseup` events on the window.
 * When a swipe gesture is detected, the component retrieves the corresponding action from the store and executes it.
 * The component returns `null` and does not render any UI elements.
 */
export const SwipeListener = () => {
  const executeAction = useMappingStore((store) => store.executeAction)
  const getActions = useMappingStore((store) => store.getButtonAction)

  useEffect(() => {
    let startX: number | null = null
    let startY: number | null = null
    let startTime: number | null = null
    const swipeThreshold = 50
    const swipeTimeThreshold = 500 // 500ms timeout for swipe

    const getPoint = (e: TouchEvent | MouseEvent, list: 'touches' | 'changedTouches') => {
      if (e instanceof TouchEvent) {
        const touch = e[list][0]
        return { x: touch.clientX, y: touch.clientY }
      }
      return { x: e.clientX, y: e.clientY }
    }

    const getSwipeMode = (deltaX: number, deltaY: number): EventMode | null => {
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (Math.abs(deltaX) <= swipeThreshold) return null
        return deltaX > 0 ? EventMode.SwipeRight : EventMode.SwipeLeft
      }
      // Vertical swipe
      if (Math.abs(deltaY) <= swipeThreshold) return null
      return deltaY > 0 ? EventMode.SwipeDown : EventMode.SwipeUp
    }

    const startHandler = (e: TouchEvent | MouseEvent) => {
      if (e.defaultPrevented) return
      const point = getPoint(e, 'touches')
      startX = point.x
      startY = point.y
      startTime = Date.now()
    }

    const endHandler = (e: TouchEvent | MouseEvent) => {
      if (e.defaultPrevented) return
      if (startX === null || startY === null || startTime === null) return

      const point = getPoint(e, 'changedTouches')
      const deltaX = point.x - startX
      const deltaY = point.y - startY
      const deltaTime = Date.now() - startTime

      if (deltaTime <= swipeTimeThreshold) {
        const mode = getSwipeMode(deltaX, deltaY)
        if (mode !== null) {
          const action = getActions('Swipe', mode)
          if (action) executeAction(action)
        }
      }

      startX = null
      startY = null
      startTime = null
    }

    globalThis.addEventListener('touchstart', startHandler, { passive: true })
    globalThis.addEventListener('touchend', endHandler, { passive: true })
    globalThis.addEventListener('mousedown', startHandler, { passive: true })
    globalThis.addEventListener('mouseup', endHandler, { passive: true })

    return () => {
      globalThis.removeEventListener('touchstart', startHandler)
      globalThis.removeEventListener('touchend', endHandler)
      globalThis.removeEventListener('mousedown', startHandler)
      globalThis.removeEventListener('mouseup', endHandler)
    }
  }, [])
  return null
}
