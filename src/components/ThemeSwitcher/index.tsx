import React from 'react'
import { useDarkModeManager } from '../../state/user/hooks'
import { ReactComponent as DarkSwitcher } from '../../assets/svg/dark-mode-dark.svg'
import { ReactComponent as LightSwitcher } from '../../assets/svg/dark-mode-light.svg'

export default function ThemeSwitcher({ className = '' }) {
  const [darkMode, toggleDarkMode] = useDarkModeManager()
  return <div className={`theme-switcher ${className} ${!darkMode ? 'theme-switcher--light' : ''}`} onClick={toggleDarkMode}>
    {darkMode ? <DarkSwitcher /> : <LightSwitcher />}
  </div>
}