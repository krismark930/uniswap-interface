import { ButtonPrimary } from 'components/Button'
import React from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { ExternalLink } from '../../theme'

const GreenCircle = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  justify-content: center;
  align-items: center;

  &:first-child {
    height: 8px;
    width: 8px;
    margin-right: 8px;
    background-color: ${({ theme }) => theme.green1};
    border-radius: 50%;
  }
`

const CircleWrapper = styled.div`
  color: ${({ theme }) => theme.green1};
  display: flex;
  justify-content: center;
  align-items: center;
`

export default function Option({
  link = null,
  name = '',
  clickable = true,
  size,
  onClick = null,
  header,
  subheader = null,
  icon,
  active = false,
  withPolicy = false,
  id
}: {
  link?: string | null
  name: string
  clickable?: boolean
  size?: number | null
  onClick?: null | (() => void)
  header: React.ReactNode
  subheader: React.ReactNode | null
  icon: string
  active?: boolean
  id: string,
  withPolicy?: boolean
}) {
  const {t} = useTranslation()
  const content = (
    <div className={`m-connect-option 
      ${clickable && !active ? 'm-connect-option--clickable' : ''}
      ${active ? 'm-connect-option--active' : ''}`} id={id} >
      <div className='m-connect-option__col'>
        {subheader && <div className='m-connect-option__subheader'>{subheader}</div>}
        {withPolicy ? <div className='m-connect-option__policy'>{t('wallet-option.connect.policy')}</div> : null}
        <div className='m-connect-option__row' >
          <div className={`m-connect-option__icon ${size ? `m-connect-option__icon--${size}-size` : ''}`}>
            <img src={icon} alt={'Icon'} />
          </div>
          <div className='m-connect-option__name'>
          {active ? (
            <CircleWrapper>
              <GreenCircle>
                <div />
              </GreenCircle>
            </CircleWrapper>
          ) : (
            ''
          )}
          {header}
          </div>
        </div>
      </div>
      <ButtonPrimary className={'m-connect-option__submit'} 
        onClick={() => typeof onClick === 'function' ? onClick() : null}>
        {`connect ${name}`}
        </ButtonPrimary>
    </div>
  )
  if (link) {
    return <ExternalLink href={link}>{content}</ExternalLink>
  }

  return content
}
