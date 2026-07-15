import { create } from 'zustand'
import { useSettingsStore } from './settingsStore'

/**
 * Manages the time-related state and functionality for the application.
 *
 * The `useTimeStore` is a Zustand store that provides the following:
 * - `currentTimeFormatted`: The current time formatted as a string based on the user's preferences.
 * - `utcTime`: The server's current UTC time in milliseconds.
 * - `timezoneOffset`: The server's timezone offset in minutes.
 * - `serverTimeOffset`: The offset between the server time and the client time in milliseconds.
 * - `syncTime`: A function to sync the client's time with the server's time.
 * - `updateCurrentTime`: A function to update the formatted current time based on the server's offset.
 */
interface TimeStore {
  currentTimeFormatted: string
  utcTime: number // Server's UTC time in ms
  meridiem: string // AM or PM or "" for 24-hour format
  currentDateFormatted: string // Current date formatted as a string
  timezoneOffset: number // Server's timezone offset in minutes
  serverTimeOffset: number // Offset between server time and client time in ms
  syncTime: (utcTime: number, timezoneOffset: number) => void // Sync with server time
  updateCurrentTime: () => void // Update formatted current time
}

export const useTimeStore = create<TimeStore>((set, get) => ({
  currentTimeFormatted: '',
  meridiem: '',
  currentDateFormatted: '',
  utcTime: 0,
  timezoneOffset: 0,
  serverTimeOffset: 0,

  // Sync time with server
  syncTime: (utcTime, timezoneOffset) => {
    const clientTime = Date.now() // Client's current time in ms
    const serverTimeOffset = utcTime - clientTime // Calculate server offset

    set({
      utcTime,
      timezoneOffset,
      serverTimeOffset
    })

    // Update the formatted current time immediately
    get().updateCurrentTime()
  },

  // Update formatted current time based on server's offset
  updateCurrentTime: () => {
    const { serverTimeOffset, timezoneOffset } = get()
    const is24Hour = useSettingsStore.getState().preferences.use24hour

    const adjustedTime = new Date(Date.now() + serverTimeOffset + timezoneOffset * 60000)
    const hours = adjustedTime.getUTCHours()
    const minutes = adjustedTime.getUTCMinutes()

    set({
      currentTimeFormatted: `${is24Hour ? hours : hours % 12 || 12}:${minutes
        .toString()
        .padStart(2, '0')}`,
      meridiem: is24Hour ? '' : hours >= 12 ? 'PM' : 'AM',
      currentDateFormatted: adjustedTime.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        timeZone: 'UTC'
      })
    })
  }
}))
