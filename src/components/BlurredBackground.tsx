import { useMusicStore, useSettingsStore } from '@src/stores'
import { FC } from 'react'

/**
 * Renders currently playing song's artwork as blurred background.
 *
 * Renders nothing when user has disabled album art or no thumbnail is available,
 * which lets pages keep their solid fallback background.
 */
const BlurredBackground: FC = () => {
  const thumbnail = useMusicStore((state) => state.song?.thumbnail)
  const showAlbumArt = useSettingsStore((state) => state.preferences.showAlbumArt ?? true)

  if (!showAlbumArt || !thumbnail) return null

  return (
    <div
      className="absolute inset-0 z-0 pointer-events-none"
      style={{
        backgroundImage: `url(${thumbnail})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'blur(25px)'
      }}
    />
  )
}

export default BlurredBackground
