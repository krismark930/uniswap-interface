import React from 'react'
import { useDarkModeManager } from 'state/user/hooks'

export default function FancyButton (
  {className = '',
  onClick = () => {},
  active = false,
  children = null}: 
  {children?: any,
  className?: string,
  active?: boolean,
  onClick?: any}) {
  const [darkMode] = useDarkModeManager()
  return <button className={`fancy-button 
    ${active ? 'fancy-button--active' : ''}
    ${!darkMode ? 'fancy-button--light' : ''} ${className}`}
    onClick={onClick}>{children}</button>
}