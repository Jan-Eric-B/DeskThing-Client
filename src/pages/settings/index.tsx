import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAppStore, useSettingsStore } from '@src/stores'
import { IconArrowLeft } from '@src/assets/Icons'
import Button from '@src/components/ui/Button'
import AppSettingsPage from './AppSettings'
import SettingOption from './SettingOptionComponent'
import PreferencesSettings from './PreferencesSettings'

type Tab = 'preferences' | 'apps'

/**
 * A unified, clean settings page that combines the client's own preferences
 * (theme / player / experience — the "config") with per-app settings.
 *
 * - The `?app=` search param selects a specific app and defers to the existing
 *   `AppSettingsPage` (which clears the param to return here).
 * - Otherwise a tabbed view switches between the Preferences panel and the list
 *   of installed apps.
 */
const SettingsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const apps = useAppStore((store) => store.apps)
  const updatePreferences = useSettingsStore((store) => store.updatePreferences)

  const [tab, setTab] = useState<Tab>('preferences')

  const selectedApp = searchParams.get('app')
  if (selectedApp) {
    return <AppSettingsPage appName={selectedApp} />
  }

  const handleBackToDashboard = () => {
    updatePreferences({
      currentView: {
        name: 'dashboard',
        enabled: true,
        running: true,
        timeStarted: 0,
        prefIndex: 0
      }
    })
  }

  const openApp = (app: string) => {
    setSearchParams({ app })
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation()
  }

  const tabClass = (value: Tab) =>
    `px-5 py-2 rounded-full text-2xl transition ${
      tab === value ? 'bg-white/15 text-white' : 'text-gray-400 hover:text-white'
    }`

  return (
    <div className="flex h-screen w-screen flex-col bg-zinc-900 text-white">
      <div className="flex shrink-0 items-center gap-4 border-b border-gray-800 p-4">
        <Button onClick={handleBackToDashboard} className="shrink-0">
          <IconArrowLeft iconSize={32} />
        </Button>
        <h1 className="text-4xl font-semibold">Settings</h1>
        <div className="ml-auto flex items-center gap-2">
          <button className={tabClass('preferences')} onClick={() => setTab('preferences')}>
            Preferences
          </button>
          <button className={tabClass('apps')} onClick={() => setTab('apps')}>
            Apps
          </button>
        </div>
      </div>

      {tab === 'preferences' ? (
        <PreferencesSettings />
      ) : (
        <div className="flex flex-col overflow-y-scroll p-6" onTouchStart={handleTouchStart}>
          {apps.length === 0 ? (
            <p className="mt-10 text-center text-2xl text-gray-500">No apps installed</p>
          ) : (
            apps.map((app) => <SettingOption key={app.name} app={app} onClick={openApp} />)
          )}
        </div>
      )}
    </div>
  )
}

export default SettingsPage
