import React, { useState } from 'react'
import { DEVICE_DESKTHING, SETTING_TYPES, ViewMode, VolMode } from '@deskthing/types'
import { useSettingsStore, useWebSocketStore } from '@src/stores'
import { SettingsBooleanComponent } from '@src/components/settings/SettingsBoolean'
import { SettingsSelectComponent } from '@src/components/settings/SettingsSelect'
import { SettingsColorComponent } from '@src/components/settings/SettingsColor'
import { IconRefresh, IconTransfer } from '@src/assets/Icons'
import Button from '@src/components/ui/Button'

interface SectionProps {
  title: string
  children: React.ReactNode
}

/** A titled group of settings, kept visually grouped for a clean scannable list. */
const Section: React.FC<SectionProps> = ({ title, children }) => (
  <div className="mb-8">
    <h2 className="mb-2 text-xl font-semibold text-gray-400">{title}</h2>
    <div className="rounded-2xl bg-black/30 px-5">{children}</div>
  </div>
)

/**
 * A flat, grouped view of the client's own preferences (theme, player, experience).
 * These are the same options that the onboarding config wizard edits, but laid out
 * as a single scrollable settings list instead of a stepped wizard.
 */
const PreferencesSettings: React.FC = () => {
  const preferences = useSettingsStore((store) => store.preferences)
  const updatePreferences = useSettingsStore((store) => store.updatePreferences)
  const resetPreferences = useSettingsStore((store) => store.resetPreferences)
  const send = useWebSocketStore((state) => state.send)

  const [isSyncing, setIsSyncing] = useState(false)
  const [isResetting, setIsResetting] = useState(false)

  const handleSyncToServer = async () => {
    setIsSyncing(true)
    await send({
      type: DEVICE_DESKTHING.CONFIG,
      request: 'set',
      payload: preferences,
      app: 'server'
    })
    setTimeout(() => setIsSyncing(false), 1000)
  }

  const handleReset = () => {
    setIsResetting(true)
    resetPreferences()
    setTimeout(() => setIsResetting(false), 1000)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation()
  }

  return (
    <div className="h-full overflow-y-scroll px-6 py-6" onTouchStart={handleTouchStart}>
      <Section title="Appearance">
        <SettingsBooleanComponent
          handleSettingChange={(value) => updatePreferences({ showAlbumArt: value })}
          setting={{
            value: preferences.showAlbumArt ?? true,
            type: SETTING_TYPES.BOOLEAN,
            label: 'Show Album Art',
            description: 'Use album artwork as the Clock background and Now Playing cover'
          }}
        />
        <SettingsBooleanComponent
          handleSettingChange={(value) => updatePreferences({ use24hour: value })}
          setting={{
            value: preferences.use24hour,
            type: SETTING_TYPES.BOOLEAN,
            label: '24 hour time'
          }}
        />
        <SettingsSelectComponent
          handleSettingChange={(value) =>
            updatePreferences({
              theme: { ...preferences.theme, scale: value as 'small' | 'medium' | 'large' }
            })
          }
          setting={{
            value: preferences.theme.scale,
            type: SETTING_TYPES.SELECT,
            label: 'Scale',
            options: [
              { value: 'small', label: 'Small' },
              { value: 'medium', label: 'Medium' },
              { value: 'large', label: 'Large' }
            ]
          }}
        />
        <SettingsSelectComponent
          handleSettingChange={(value) =>
            updatePreferences({
              ScreensaverType: {
                ...preferences.ScreensaverType,
                type: value as 'black' | 'logo' | 'clock'
              }
            })
          }
          setting={{
            value: preferences.ScreensaverType.type,
            type: SETTING_TYPES.SELECT,
            label: 'ScreenSaver',
            description: 'Choose a background for the screensaver',
            options: [
              { value: 'black', label: 'Black' },
              { value: 'logo', label: 'Logo' },
              { value: 'clock', label: 'Clock' }
            ]
          }}
        />
        <SettingsColorComponent
          handleSettingChange={(value) =>
            updatePreferences({ theme: { ...preferences.theme, primary: value } })
          }
          setting={{
            value: preferences.theme.primary,
            type: SETTING_TYPES.COLOR,
            label: 'Primary'
          }}
        />
        <SettingsColorComponent
          handleSettingChange={(value) =>
            updatePreferences({ theme: { ...preferences.theme, textLight: value } })
          }
          setting={{
            value: preferences.theme.textLight,
            type: SETTING_TYPES.COLOR,
            label: 'Text Light'
          }}
        />
        <SettingsColorComponent
          handleSettingChange={(value) =>
            updatePreferences({ theme: { ...preferences.theme, textDark: value } })
          }
          setting={{
            value: preferences.theme.textDark,
            type: SETTING_TYPES.COLOR,
            label: 'Text Dark'
          }}
        />
        <SettingsColorComponent
          handleSettingChange={(value) =>
            updatePreferences({ theme: { ...preferences.theme, background: value } })
          }
          setting={{
            value: preferences.theme.background,
            type: SETTING_TYPES.COLOR,
            label: 'Background'
          }}
        />
        <SettingsColorComponent
          handleSettingChange={(value) =>
            updatePreferences({ theme: { ...preferences.theme, icons: value } })
          }
          setting={{
            value: preferences.theme.icons,
            type: SETTING_TYPES.COLOR,
            label: 'Icon'
          }}
        />
      </Section>

      <Section title="Player">
        <SettingsSelectComponent
          handleSettingChange={(value) =>
            updatePreferences({
              miniplayer: { ...preferences.miniplayer, state: value as ViewMode }
            })
          }
          setting={{
            value: preferences.miniplayer.state,
            type: SETTING_TYPES.SELECT,
            label: 'Miniplayer',
            options: [
              { value: ViewMode.PEEK, label: 'Small' },
              { value: ViewMode.HIDDEN, label: 'Collapsed' }
            ]
          }}
        />
        <SettingsBooleanComponent
          handleSettingChange={(value) =>
            updatePreferences({
              miniplayer: { ...preferences.miniplayer, visible: value }
            })
          }
          setting={{
            value: preferences.miniplayer.visible,
            type: SETTING_TYPES.BOOLEAN,
            label: 'Show Miniplayer'
          }}
        />
        <SettingsSelectComponent
          handleSettingChange={(value) =>
            updatePreferences({
              miniplayer: {
                ...preferences.miniplayer,
                position: value as 'bottom' | 'left' | 'right'
              }
            })
          }
          setting={{
            value: preferences.miniplayer.position,
            type: SETTING_TYPES.SELECT,
            label: 'Position',
            disabled: true,
            options: [
              { value: 'bottom', label: 'Bottom' },
              { value: 'right', label: 'Right' },
              { value: 'left', label: 'Left' }
            ]
          }}
        />
        <SettingsSelectComponent
          handleSettingChange={(value) => updatePreferences({ volume: value as VolMode })}
          setting={{
            value: preferences.volume,
            type: SETTING_TYPES.SELECT,
            disabled: true,
            label: 'Wheel Type',
            options: [
              { value: VolMode.WHEEL, label: 'Weapon Wheel' },
              { value: VolMode.SLIDER, label: 'Slider' }
            ]
          }}
        />
      </Section>

      <Section title="Experience">
        <SettingsBooleanComponent
          handleSettingChange={(value) => updatePreferences({ showPullTabs: value })}
          setting={{
            value: preferences.showPullTabs,
            type: SETTING_TYPES.BOOLEAN,
            label: 'Show Pull Tabs'
          }}
        />
        <SettingsBooleanComponent
          handleSettingChange={(value) => updatePreferences({ saveLocation: value })}
          setting={{
            value: preferences.saveLocation,
            type: SETTING_TYPES.BOOLEAN,
            label: 'Save Location'
          }}
        />
        <SettingsBooleanComponent
          handleSettingChange={(value) => updatePreferences({ ShowNotifications: value })}
          setting={{
            value: preferences.ShowNotifications,
            type: SETTING_TYPES.BOOLEAN,
            label: 'Notifications'
          }}
        />
      </Section>

      <div className="flex flex-wrap gap-3 pb-6">
        <Button
          disabled={isSyncing}
          className="items-center bg-green-600 disabled:bg-green-700"
          onClick={handleSyncToServer}
        >
          <IconTransfer className={isSyncing ? 'animate-pulse' : ''} />
          <p className="ml-2 font-semibold">Save to server</p>
        </Button>
        <Button
          disabled={isResetting}
          className="items-center bg-zinc-700 disabled:bg-zinc-800"
          onClick={handleReset}
        >
          <IconRefresh className={isResetting ? 'animate-spin' : ''} />
          <p className="ml-2 font-semibold">Reset to defaults</p>
        </Button>
      </div>
    </div>
  )
}

export default PreferencesSettings
