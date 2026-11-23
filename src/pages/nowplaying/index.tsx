import { IconAlbum, IconLogoGearLoading } from '@src/assets/Icons'
import BlurredBackground from '@src/components/BlurredBackground'
import IdleScreen from './IdleScreen'
import { useSettingsStore } from '@src/stores'
import { useMusicStore } from '@src/stores/musicStore'

import { useState } from 'react'

/**
 * The `NowPlaying` component displays the currently playing song, including the album cover, song title, artist, and album name. It also provides a button to refresh the currently playing song.
 *
 * The component uses the `useMusicStore` and `useSettingsStore` hooks to access the current song data and theme preferences, respectively. It also uses the `useState` hook to manage the state of the refresh button.
 *
 * When the refresh button is clicked, the `refreshSong` function is called, which updates the currently playing song by calling the `requestMusicData` function from the `useMusicStore` hook. The `isRefreshing` state is used to display a loading indicator while the song is being refreshed.
 *
 * The component renders the album cover, song title, artist, and album name, with the colors and styles adjusted based on the current song's color and the user's theme preferences.
 */
export default function NowPlaying() {
  const song = useMusicStore((state) => state.song)
  const refresh = useMusicStore((state) => state.requestMusicData)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const showAlbumArt = useSettingsStore((state) => state.preferences.showAlbumArt ?? true)
  const textLight = useSettingsStore((state) => state.preferences.theme.textLight)
  const textDark = useSettingsStore((state) => state.preferences.theme.textDark)
  const refreshSong = () => {
    setIsRefreshing(true)
    refresh(true)
    setTimeout(() => setIsRefreshing(false), Math.random() * 1000 + 1000)
  }

  // No track loaded (nothing started yet, or the source isn't set up): show the
  // idle clock instead of an empty album placeholder with clipped text.
  const hasTrack = Boolean(song?.track_name)

  return (
    <div
      style={{ background: song?.color?.rgb }}
      className="relative overflow-hidden w-screen h-full max-h-full flex-shrink bg-black flex-col flex items-center justify-center"
    >
      <BlurredBackground />
      {!hasTrack && <IdleScreen />}
      <div
        className="relative w-full h-full flex items-center justify-start px-12"
        style={{ display: hasTrack ? undefined : 'none' }}
      >
        <div className="relative flex-shrink-0 h-[300px] w-[300px]">
          <button
            disabled={isRefreshing}
            onClick={refreshSong}
            className="relative h-full w-full flex-shrink-0 cursor-pointer"
          >
            {isRefreshing ? (
              <IconLogoGearLoading className="select-none absolute animate-fade top-0 left-0 w-full h-full object-cover" />
            ) : (
              <>
                <IconAlbum
                  className="select-none w-full h-full absolute animate-fade top-0 left-0 object-cover rounded-2xl shadow-[0_10px_25px_-5px_rgba(0,0,0,0.3)]"
                  style={{ pointerEvents: 'none' }}
                />
                <img
                  className="select-none absolute w-full h-full animate-fade top-0 left-0 object-cover rounded-2xl shadow-[0_10px_25px_-5px_rgba(0,0,0,0.3)]"
                  src={song?.thumbnail || ''}
                  alt=""
                  style={{
                    display: showAlbumArt && song?.thumbnail ? 'block' : 'none',
                    pointerEvents: 'none',
                    userSelect: 'none'
                  }}
                  draggable="false"
                  onError={(e) => (e.currentTarget.style.display = 'none')}
                />
              </>
            )}
          </button>
        </div>
        <div
          style={{ color: song?.color?.isLight ? textDark : textLight }}
          className={`ml-10 flex-1 min-w-0 flex flex-col justify-center`}
        >
          <h1 className={`md:text-3xl lg:text-5xl opacity-50`}>{song?.album || ''}</h1>
          <p
            className={`text-xl sm:text-3xl md:text-6xl xl:text-9xl line-clamp-3 overflow-hidden break-words font-bold`}
          >
            {song?.track_name}
          </p>
          <p className={`md:text-3xl lg:text-5xl opacity-70`}>{song?.artist || ''}</p>
        </div>
      </div>
    </div>
  )
}
