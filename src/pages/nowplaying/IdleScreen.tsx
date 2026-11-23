import { IconRefresh } from '@src/assets/Icons'
import CardPanel from '@src/components/ui/CardPanel'
import { TimeUpdater } from '@src/components/TimeUpdater'
import { useSettingsStore, useWebSocketStore } from '@src/stores'
import { useMusicStore } from '@src/stores/musicStore'
import { useTimeStore } from '@src/stores/timeStore'
import { FC, useEffect, useState } from 'react'

/**
 * Shown by the Now Playing page while no track is loaded.
 *
 * The page used to fall back to a 300px album placeholder next to a giant
 * "Waiting For Track..." that wrapped and clipped on the 800x480 panel. An idle
 * screen is more useful than a broken one: the clock keeps the display worth
 * looking at, and a single status line explains *why* nothing is playing
 * (no connection vs. connected but nothing started).
 */
const IdleScreen: FC = () => {
  const refresh = useMusicStore((state) => state.requestMusicData)
  const isConnected = useWebSocketStore((state) => state.isConnected)
  const isReconnecting = useWebSocketStore((state) => state.isReconnecting)
  const time = useTimeStore((state) => state.currentTimeFormatted)
  const meridiem = useTimeStore((state) => state.meridiem)
  const date = useTimeStore((state) => state.currentDateFormatted)
  const syncTime = useTimeStore((state) => state.updateCurrentTime)
  const use24hour = useSettingsStore((state) => state.preferences.use24hour)
  const textLight = useSettingsStore((state) => state.preferences.theme.textLight)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // The store only reformats on an interval, so paint the current time on mount
  // instead of showing an empty clock for up to a minute.
  useEffect(() => {
    syncTime()
  }, [syncTime, use24hour])

  const refreshSong = () => {
    if (isRefreshing) return
    setIsRefreshing(true)
    refresh(true)
    setTimeout(() => setIsRefreshing(false), Math.random() * 1000 + 1000)
  }

  let status = 'Nothing playing'
  let statusDot = 'bg-white/40'
  if (!isConnected) {
    status = isReconnecting ? 'Reconnecting to DeskThing...' : 'Not connected to DeskThing'
    statusDot = isReconnecting ? 'bg-amber-400 animate-pulse' : 'bg-red-500'
  }

  return (
    <div
      style={{ color: textLight }}
      className="relative flex h-full w-full flex-col items-center justify-center"
    >
      <TimeUpdater />

      {/* Soft ambient glow so the panel isn't a flat black rectangle. Plain
          radial gradients (no backdrop-filter) keep it cheap on the CarThing. */}
      <div
        className="pointer-events-none absolute -left-32 -top-32 h-[560px] w-[560px] animate-float"
        style={{
          background: 'radial-gradient(circle, rgba(29,185,84,0.22) 0%, rgba(29,185,84,0) 70%)'
        }}
      />
      <div
        className="pointer-events-none absolute -bottom-40 -right-24 h-[620px] w-[620px] animate-float"
        style={{
          background: 'radial-gradient(circle, rgba(56,120,255,0.20) 0%, rgba(56,120,255,0) 70%)',
          animationDelay: '-7s'
        }}
      />

      <div className="relative flex animate-fade flex-col items-center">
        <div className="flex items-baseline">
          <p className="font-light leading-none tabular-nums text-[9rem] tracking-tight">{time}</p>
          {meridiem && <span className="ml-3 text-4xl font-light opacity-50">{meridiem}</span>}
        </div>
        <p className="mt-2 text-3xl font-light opacity-60">{date}</p>

        <div className="mt-8 flex items-center">
          <CardPanel className="flex h-12 items-center px-5">
            <div className={`mr-3 h-2.5 w-2.5 rounded-full ${statusDot}`} />
            <span className="text-lg opacity-80">{status}</span>
          </CardPanel>
          <CardPanel
            onClick={refreshSong}
            disabled={isRefreshing}
            className="ml-3 flex h-12 items-center px-5"
          >
            <IconRefresh
              iconSize={20}
              strokeWidth={1.75}
              className={isRefreshing ? 'animate-spin' : ''}
            />
            <span className="ml-3 text-lg opacity-80">Refresh</span>
          </CardPanel>
        </div>
      </div>
    </div>
  )
}

export default IdleScreen
