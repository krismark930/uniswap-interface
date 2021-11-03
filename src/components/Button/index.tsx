import React from 'react'
import { ChevronDown } from 'react-feather'
import { ButtonProps } from 'rebass/styled-components'
import { useDarkModeManager } from '../../state/user/hooks'


export const BaseButton = ({className = '', children = null, light = false, ...props}) => {
  const [darkMode] = useDarkModeManager()
  return <button className={`button ${className} ${!darkMode || light ? 'button--theme-light' : ''}`} {...props}>{children}</button>
}

export const ButtonPrimary = (props: any) => {
  return <BaseButton {...props} className={`button--primary ${props.className || ''} `}></BaseButton>
}

export const ButtonLight = (props: any) => {
  return <BaseButton {...props} className={`button--light ${props.className || ''}`}></BaseButton>
}

export const ButtonGray = (props: any) => {
  return <BaseButton {...props} className={`button--gray ${props.className || ''}`}></BaseButton>
}

export const ButtonPink = (props: any) => {
  return <BaseButton {...props} className={`button--pink ${props.className || ''}`}></BaseButton>
}

export const ButtonSecondary = (props: any) => {
  return <BaseButton {...props} className={`button--transparent ${props.className || ''}`}></BaseButton>
}

export const ButtonUNIGradient = (props: any) => {
  //  background: radial-gradient(174.47% 188.91% at 1.84% 0%, #ff007a 0%, #2172e5 100%), #edeef2;
  return <BaseButton {...props} className={`button--uni-gradient ${props.className || ''}`}></BaseButton>
}

export const ButtonEmpty = (props: any) => {
  return <BaseButton {...props} className={`button--empty ${props.className || ''}`}></BaseButton>
}

export const BaseButtonError = (props: any) => {
  return <BaseButton {...props} className={`button--error ${props.className || ''}`}></BaseButton>
}

export function ButtonError({ error, ...rest }: { error?: boolean } & ButtonProps) {
  if (error) {
    return <BaseButtonError className='button--error' {...rest}></BaseButtonError>
  } else {
    return <ButtonPrimary {...rest} />
  }
}

export function ButtonDropdown({ disabled = false, children, ...rest }: { disabled?: boolean } & ButtonProps) {
  return (
    <ButtonPrimary {...rest} disabled={disabled}>
      <div className='flex justify-between'>
        <div style={{ display: 'flex', alignItems: 'center' }}>{children}</div>
        <ChevronDown size={24} />
      </div>
    </ButtonPrimary>
  )
}

export function ButtonDropdownGrey({ disabled = false, children, ...rest }: { disabled?: boolean } & ButtonProps) {
  return (
    <ButtonGray {...rest} disabled={disabled} style={{ borderRadius: '20px' }}>
      <div className='flex justify-between items-center'>
        <div style={{ display: 'flex', alignItems: 'center' }}>{children}</div>
        <ChevronDown size={24} />
      </div>
    </ButtonGray>
  )
}

export function ButtonDropdownLight({ disabled = false, children, ...rest }: { disabled?: boolean } & ButtonProps) {
  return (
    <ButtonLight {...rest} disabled={disabled}>
      <div className='flex justify-between items-center'>
        <div style={{ display: 'flex', alignItems: 'center' }}>{children}</div>
        <ChevronDown size={24} />
      </div>
    </ButtonLight>
  )
}

export function ButtonRadio({ active, ...rest }: { active?: boolean } & ButtonProps) {
  if (!active) {
    return <ButtonLight {...rest} />
  } else {
    return <ButtonPrimary {...rest} />
  }
}
