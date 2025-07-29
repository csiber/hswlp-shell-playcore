import { create } from 'zustand'
import { combine } from 'zustand/middleware'

export const useConfigStore = create(
  combine(
    {
      isTurnstileEnabled: false,
    },
    (set) => ({
      setConfig: (config: { isTurnstileEnabled: boolean }) => {
        set({
          isTurnstileEnabled: config.isTurnstileEnabled,
        })
      },
    })
  )
)
