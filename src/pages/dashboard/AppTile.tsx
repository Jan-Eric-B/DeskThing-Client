import ActionIcon from '@src/components/ui/ActionIcon'
import CardPanel from '@src/components/ui/CardPanel'
import { useAppStore, useSettingsStore } from '@src/stores'
import { App } from '@deskthing/types'
import { useMemo } from 'react'

interface AppTileProps {
  app: App
  /** Follows dashboard's adaptive text colour so labels stay readable. */
  textColor?: string
}

/**
 * Single app shortcut on the dashboard.
 */
const AppTile: React.FC<AppTileProps> = ({ app, textColor }) => {
  const getAppIcon = useAppStore((store) => store.getAppIcon)
  const updateCurrentView = useSettingsStore((store) => store.updateCurrentView)
  const appIcon = useMemo(() => getAppIcon(app), [app, getAppIcon])

  return (
    <CardPanel
      onClick={() => updateCurrentView(app)}
      className="flex h-full w-full flex-col items-center justify-center gap-2 px-3 py-4"
    >
      <div className="h-12 w-12 flex-shrink-0">
        <ActionIcon url={appIcon} color={textColor} />
      </div>
      <span
        style={{ color: textColor }}
        className="w-full truncate text-center text-sm font-semibold"
      >
        {app.manifest?.label || app.name}
      </span>
    </CardPanel>
  )
}

export default AppTile
