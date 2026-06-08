import React, { useEffect, useState } from 'react'
import { useSettingsStore } from '@src/stores'
import Clock from '@src/pages/clock'
import { ScreenSaverLogo } from './Logo'
import { IconX } from '@src/assets/Icons'
import Button from '@src/components/ui/Button'
import { useUIStore } from '@src/stores/uiStore'

const ScreenSaverWrapper: React.FC = () => {
  const preferences = useSettingsStore((state) => state.preferences)
  const [screenSaverDismissed, setScreenSaverDismissed] = useState(false)
  const screensaverActive = useUIStore((state) => state.isScreensaverActive)
  const setScreensaverActive = useUIStore((state) => state.setScreensaverActive)
  const [lastActivity, setLastActivity] = useState(Date.now())
  const [requireManualDismiss, setRequireManualDismiss] = useState(false)
  const INACTIVITY_TIMEOUT = 15000

  const handleUserActivity = () => {
    setLastActivity(Date.now())
    if (screensaverActive && !requireManualDismiss) {
      setScreensaverActive(false)
    }
  }

  useEffect(() => {
    globalThis.addEventListener('keydown', handleUserActivity)
    globalThis.addEventListener('mousedown', handleUserActivity)
    globalThis.addEventListener('mousemove', handleUserActivity)
    globalThis.addEventListener('touchstart', handleUserActivity)
    globalThis.addEventListener('wheel', handleUserActivity)

    return () => {
      globalThis.removeEventListener('keydown', handleUserActivity)
      globalThis.removeEventListener('mousedown', handleUserActivity)
      globalThis.removeEventListener('mousemove', handleUserActivity)
      globalThis.removeEventListener('touchstart', handleUserActivity)
      globalThis.removeEventListener('wheel', handleUserActivity)
    }
  }, [screensaverActive, requireManualDismiss])

  useEffect(() => {
    if (screenSaverDismissed) return

    const intervalId = setInterval(() => {
      const currentTime = Date.now()
      const timeSinceLastActivity = currentTime - lastActivity

      if (timeSinceLastActivity > INACTIVITY_TIMEOUT && !screensaverActive) {
        setScreensaverActive(true)
        setRequireManualDismiss(true)
      }
    }, 1000)

    return () => clearInterval(intervalId)
  }, [lastActivity, screensaverActive, screenSaverDismissed])

  const handleClose = () => {
    setScreensaverActive(false)
    setScreenSaverDismissed(false)
    setRequireManualDismiss(false)
    setLastActivity(Date.now())
  }

  const renderScreenSaver = () => {
    switch (preferences.ScreensaverType?.type || 'black') {
      case 'clock':
        return <Clock />
      case 'logo':
        return <ScreenSaverLogo />
      case 'black':
      default:
        return null
    }
  }

  return (
    <div
      className={`${screensaverActive ? 'max-h-full z-10' : 'max-h-0'} w-full overflow-hidden duration-[3s] fixed h-full flex items-center justify-center transition-all`}
    >
      <div
        className={`${screensaverActive ? 'bg-black opacity-100' : 'bg-black/0 opacity-0'} w-screen duration-[5s] shrink-0 h-screen transition-all`}
      >
        {renderScreenSaver()}
        <Button className="absolute bottom-2 right-2" onClick={handleClose}>
          <IconX />
        </Button>
      </div>
    </div>
  )
}

export default ScreenSaverWrapper
