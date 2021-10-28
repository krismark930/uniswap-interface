import React from 'react'

export interface ToggleProps {
  id?: string
  isActive: boolean
  toggle: () => void
}

export default function Toggle({ id, isActive, toggle }: ToggleProps) {
  return (
    <div className={`toggle ${isActive ? 'toggle--active' : ''}`} onClick={toggle}>
      <div className='toggle__element'/>
    </div>
  )
}
