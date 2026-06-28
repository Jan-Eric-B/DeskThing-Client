import BlurredBackground from '@src/components/BlurredBackground'
import { TimeUpdater } from '@src/components/TimeUpdater'
import { useMusicStore, useSettingsStore } from '@src/stores'
import { useTimeStore } from '@src/stores/timeStore'
import { FC, useEffect } from 'react'

/**
 * The main component for the Clock page, which displays the current time.
 *
 * When "Show Album Art" is enabled, the artwork of the currently playing song is
 * rendered as a blurred background. The time text color adapts to the artwork's brightness.
 * All customization lives in the config screen, so the page itself is purely presentational.
 */
const ClockPage: FC = () => {
  const musicData = useMusicStore((state) => state.song)
  const time = useTimeStore((state) => state.currentTimeFormatted)
  const syncTime = useTimeStore((state) => state.updateCurrentTime)
  const showAlbumArt = useSettingsStore((state) => state.preferences.showAlbumArt ?? true)
  const use24hour = useSettingsStore((state) => state.preferences.use24hour)
  const textDark = useSettingsStore((state) => state.preferences.theme.textDark)
  const textLight = useSettingsStore((state) => state.preferences.theme.textLight)

  useEffect(() => {
    syncTime()
  }, [use24hour])

  return (
    <div className="relative w-full flex items-center justify-center h-full">
      <TimeUpdater />
      <BlurredBackground />
      <div className="absolute w-full h-full inset-0 flex items-center justify-center">
        <p
          style={{
            color: showAlbumArt && musicData?.color?.isLight ? textDark || textLight : textLight
          }}
          className="text-9xl"
        >
          {time}
        </p>
      </div>
    </div>
  )
}

export default ClockPage
