import React from 'react'
import SettingComponent from './SettingComponent'
import { SettingsFile } from '@deskthing/types'

interface SettingsFileProps {
  setting: SettingsFile
  handleSettingChange: (value: string) => void
  className?: string
}

const commonClasses =
  'px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'

/**
 * A React component that renders a file setting as a text input for the file path.
 *
 * @param setting - The file setting object, containing the current path value and optional placeholder.
 * @param handleSettingChange - A callback function to update the setting value.
 * @param className - An optional CSS class name to apply to the component.
 */
export const SettingsFileComponent: React.FC<SettingsFileProps> = ({
  className,
  setting,
  handleSettingChange
}) => {
  return (
    <SettingComponent setting={setting} className={className}>
      <div className="flex items-center w-full">
        <input
          disabled={setting.disabled}
          type="text"
          value={setting.value}
          placeholder={setting.placeholder}
          onChange={(e) => handleSettingChange(e.target.value)}
          className={commonClasses + ' text-black w-96 max-w-s'}
        />
      </div>
    </SettingComponent>
  )
}
