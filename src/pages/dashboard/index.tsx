import BlurredBackground from '@src/components/BlurredBackground'
import {
  IconGearThin,
  IconAlbum,
  IconLogoGearLoading,
  IconPause,
  IconPlay,
  IconSkip
} from '@src/assets/Icons'
import { ScrollingText } from '@src/components/ui/ScrollingText'
import CardPanel from '@src/components/ui/CardPanel'
import AppTile from './AppTile'
import {
  useAppStore,
  useMappingStore,
  useMusicStore,
  useSettingsStore,
  useWebSocketStore
} from '@src/stores'
import { useTimeStore } from '@src/stores/timeStore'
import { MouseEvent, useState } from 'react'

/**
 * The `DashboardPage` component represents the main dashboard view of the application.
 * It displays various sections with information about the application's connection status,
 * button mappings, music player, loaded apps, and settings.
 *
 * The component uses several state hooks to access and update the application's state,
 * such as the WebSocket connection status, the current app, the user's profile, the
 * current song, and the user's preferences.
 *
 * The component also provides functionality to open the clock view and restart the
 * onboarding process.
 */
const DashboardPage = () => {
  const isConnected = useWebSocketStore((state) => state.isConnected)
  const isReconnecting = useWebSocketStore((state) => state.isReconnecting)
  const apps = useAppStore((state) => state.apps)
  const currentApp = useSettingsStore((state) => state.preferences.currentView)
  const profile = useMappingStore((state) => state.profile)
  const song = useMusicStore((state) => state.song)
  const preferences = useSettingsStore((state) => state.preferences)
  const updatePreferences = useSettingsStore((state) => state.updatePreferences)
  const manifest = useSettingsStore((state) => state.manifest)
  const logs = useSettingsStore((state) => state.logs)
  const time = useTimeStore((state) => state.currentTimeFormatted)
  const meridiem = useTimeStore((state) => state.meridiem)
  const date = useTimeStore((state) => state.currentDateFormatted)
  const musicData = useMusicStore((state) => state.song)
  const getSong = useMusicStore((state) => state.requestMusicData)
  const play = useMusicStore((state) => state.play)
  const pause = useMusicStore((state) => state.pause)
  const next = useMusicStore((state) => state.next)
  const showAlbumArt = useSettingsStore((state) => state.preferences.showAlbumArt ?? true)
  const use24hour = useSettingsStore((state) => state.preferences.use24hour)
  const textDark = useSettingsStore((state) => state.preferences.theme.textDark)
  const textLight = useSettingsStore((state) => state.preferences.theme.textLight)
  const source = song && 'source' in song ? song.source : undefined

  const textColor = showAlbumArt && musicData?.color?.isLight ? textDark || textLight : textLight
  const [refreshing, setRefreshing] = useState(false)

  // Only surface the music banner once a source has actually loaded a track.
  // A loaded track keeps a `track_name` while paused, so pausing does NOT hide
  // the banner — only "no music / not set up" (no song, no track) does.
  const hasMusic = Boolean(song?.track_name)

  // With the banner hidden there's room for far more shortcuts; otherwise keep
  // a compact row beside it.
  const maxApps = hasMusic ? 4 : 8
  const dashboardApps = apps.slice(0, maxApps)
  const appColumns = hasMusic
    ? Math.max(dashboardApps.length, 1)
    : Math.min(Math.max(dashboardApps.length, 1), 4)

  // Tapping the album art refreshes the song (like the Now Playing page)
  const refreshSong = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()

    // Early break to stop spamming
    if (refreshing) return

    // Set the refreshing state
    setRefreshing(true)

    // Set the timeout to clear the state
    setTimeout(
      () => {
        setRefreshing(false)
      },
      Math.random() * 1000 + 1000
    )

    getSong(true)
  }

  const togglePlay = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (song?.is_playing) {
      pause()
    } else {
      play()
    }
  }

  const skipSong = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    next()
  }

  let connectionLabel = 'Disconnected'
  if (isConnected) {
    connectionLabel = 'Connected'
  } else if (isReconnecting) {
    connectionLabel = 'Reconnecting...'
  }

  const handleRestartOnboarding = () => {
    updatePreferences({
      onboarding: false,
      currentView: {
        name: 'landing',
        enabled: true,
        running: true,
        timeStarted: 0,
        prefIndex: 0
      }
    })
  }

  const handleClockRoute = () => {
    updatePreferences({
      currentView: {
        name: 'clock',
        enabled: true,
        running: true,
        timeStarted: 0,
        prefIndex: 0
      }
    })
  }

  const handleSettingsRoute = () => {
    updatePreferences({
      currentView: {
        name: 'settings',
        enabled: true,
        running: true,
        timeStarted: 0,
        prefIndex: 0
      }
    })
  }

  // Tapping anywhere on the card (except the buttons) opens the Now Playing page
  const handleNowPlayingRoute = () => {
    updatePreferences({
      currentView: {
        name: 'nowplaying',
        enabled: true,
        running: true,
        timeStarted: 0,
        prefIndex: 0
      }
    })
  }

  return (
    <div
      style={{ background: song?.color?.rgb }}
      className="relative w-screen h-screen overflow-hidden bg-black"
    >
      <BlurredBackground />

      <div className="relative flex flex-col h-full">
        <div className="flex items-start justify-between p-4">
          {/* -mt-3 trims the big font's built-in top space so the clock sits as
              close to the top as it does to the left (tune if still uneven). */}
          <div className="flex flex-col -mt-3" onClick={handleClockRoute}>
            <div className="flex items-baseline">
              <p
                style={{ color: textColor }}
                className="font-bold text-8xl leading-none tabular-nums"
              >
                {time}
              </p>
              {meridiem && (
                <span
                  style={{ color: textColor }}
                  className="ml-2 text-3xl font-semibold opacity-60"
                >
                  {meridiem}
                </span>
              )}
            </div>
            <p style={{ color: textColor }} className="mt-1 text-2xl opacity-70">
              {date}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <CardPanel className="flex h-12 items-center px-4" onClick={handleRestartOnboarding}>
              <div
                className={`w-3 h-3 rounded-full mr-2 shadow-lg ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}
              />
              <span style={{ color: textColor }} className="text-sm font-robotoMono">
                {connectionLabel}
              </span>
            </CardPanel>
            <CardPanel
              onClick={handleSettingsRoute}
              className="flex h-12 w-12 items-center justify-center"
            >
              <IconGearThin iconSize={26} strokeWidth={1.5} color={textColor} />
            </CardPanel>
          </div>
        </div>

        {/* Music banner — hidden entirely when no track is set up (but kept while paused) */}
        {hasMusic && (
          <div className="flex flex-1 items-center px-4">
            {/* Tapping the card (outside the buttons) opens Now Playing */}
            <div
              onClick={handleNowPlayingRoute}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') handleNowPlayingRoute()
              }}
              role="button"
              tabIndex={0}
              className="w-full cursor-pointer"
            >
              <CardPanel className="w-full flex items-center gap-4 px-4 py-3">
                {/* Album art — tap to refresh the song */}
                <button
                  disabled={refreshing}
                  onClick={refreshSong}
                  className="relative h-28 w-28 flex-shrink-0 overflow-hidden rounded-xl"
                >
                  {refreshing ? (
                    <IconLogoGearLoading className="absolute top-0 left-0 h-full w-full animate-fade object-cover" />
                  ) : (
                    <>
                      <IconAlbum
                        className="absolute top-0 left-0 h-full w-full animate-fade rounded-xl object-cover"
                        style={{ pointerEvents: 'none' }}
                      />
                      {showAlbumArt && song?.thumbnail && (
                        <img
                          className="absolute top-0 left-0 h-full w-full animate-fade rounded-xl object-cover"
                          src={song.thumbnail}
                          alt=""
                          draggable="false"
                          style={{ pointerEvents: 'none', userSelect: 'none' }}
                          onError={(e) => (e.currentTarget.style.display = 'none')}
                        />
                      )}
                    </>
                  )}
                </button>

                {/* Album / title / artist — like the Now Playing page */}
                <div
                  style={{ color: textColor }}
                  className="flex min-w-0 flex-1 flex-col justify-center"
                >
                  <p className="truncate text-lg opacity-50">{song?.album || ''}</p>
                  <ScrollingText
                    className="text-3xl font-bold"
                    fadeWidth={48}
                    text={song?.track_name || 'Waiting For Track...'}
                  />
                  <p className="truncate text-xl opacity-70">{song?.artist || ''}</p>
                </div>

                {/* Play / pause */}
                <button
                  onClick={togglePlay}
                  style={{ color: textColor }}
                  className="flex-shrink-0 p-2"
                >
                  {song?.is_playing ? <IconPause iconSize={48} /> : <IconPlay iconSize={48} />}
                </button>

                {/* Skip */}
                <button
                  onClick={skipSong}
                  style={{ color: textColor }}
                  className="flex-shrink-0 p-2"
                >
                  <IconSkip iconSize={48} />
                </button>
              </CardPanel>
            </div>
          </div>
        )}

        {/* Installed apps from the App Tray. Compact row (max 4) beside the music
            banner; grows to fill the space (max 8) when the banner is hidden. */}
        <div
          className={`grid gap-3 p-4 ${hasMusic ? '' : 'flex-1 content-center'}`}
          style={{ gridTemplateColumns: `repeat(${appColumns}, minmax(0, 1fr))` }}
        >
          {dashboardApps.map((app) => (
            <AppTile key={app.name} app={app} textColor={textColor} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
