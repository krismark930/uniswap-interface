import React, { useRef, useState } from 'react'
import { X } from 'react-feather'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { useOnClickOutside } from '../../hooks/useOnClickOutside'
import { ApplicationModal } from '../../state/application/actions'
import { useModalOpen, useToggleSettingsMenu } from '../../state/application/hooks'
import {
  useExpertModeManager,
  useUserTransactionTTL,
  useUserSlippageTolerance,
  useUserSingleHopOnly,
  useDarkModeManager
} from '../../state/user/hooks'
import { ButtonSecondary } from '../Button'
import { AutoColumn } from '../Column'
import Modal from '../Modal'
import InterfaceSettings from './InterfaceSettings'
import TransactionSettings from './TransactionSettings'
import {ReactComponent as SettingsIcon} from '../../assets/svg/settings-icon.svg'


const StyledCloseIcon = styled(X)`
  height: 20px;
  width: 20px;
  :hover {
    cursor: pointer;
  }

  > * {
    stroke: ${({ theme }) => theme.text1};
  }
`

const EmojiWrapper = styled.div`
  position: absolute;
  bottom: -6px;
  right: 0px;
  font-size: 14px;
`

const Break = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${({ theme }) => theme.bg3};
`

export default function SettingsTab() {
  const node = useRef<HTMLDivElement>()
  const open = useModalOpen(ApplicationModal.SETTINGS)
  const toggle = useToggleSettingsMenu()
  const [userSlippageTolerance, setUserslippageTolerance] = useUserSlippageTolerance()

  const [ttl, setTtl] = useUserTransactionTTL()

  const {t} = useTranslation()

  const [expertMode, toggleExpertMode] = useExpertModeManager()

  const [darkMode] = useDarkModeManager()

  const [singleHopOnly, setSingleHopOnly] = useUserSingleHopOnly()

  // show confirmation view before turning on
  const [showConfirmation, setShowConfirmation] = useState(false)

  useOnClickOutside(node, open ? toggle : undefined)

  return (
    // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/30451
    <div className={`settings ${!darkMode ? 'settings--light' : ''}`} ref={node as any}>
      <Modal isOpen={showConfirmation} onDismiss={() => setShowConfirmation(false)}>
        <div className={`exp-mode-confirm ${!darkMode ? 'exp-mode-confirm--light' : ''}`}>
          <AutoColumn gap="lg">
            <div className='flex justify-between px-8'>
              <div />
              <div className='exp-mode-confirm__title'>
                Are you sure?
              </div>
              <StyledCloseIcon onClick={() => setShowConfirmation(false)} />
            </div>
            <Break />
            <AutoColumn gap="lg" style={{ padding: '0 2rem' }}>
              <p className='text-md'>
                Expert mode turns off the confirm transaction prompt and allows high slippage trades that often result
                in bad rates and lost funds.
              </p>
              <p className='font-title uppercase text-lg'>
                ONLY USE THIS MODE IF YOU KNOW WHAT YOU ARE DOING.
              </p>
              <ButtonSecondary
                error={true}
                padding={'12px'}
                onClick={() => {
                  if (window.prompt(`Please type the word "confirm" to enable expert mode.`) === 'confirm') {
                    toggleExpertMode()
                    setShowConfirmation(false)
                  }
                }}
              >
                  Turn On Expert Mode
              </ButtonSecondary>
            </AutoColumn>
          </AutoColumn>
        </div>
      </Modal>
      <div className='relative w-full h-full border-0 p-0 m-0 cursor-pointer' onClick={toggle} id="open-settings-dialog-button">
        <SettingsIcon/>
        {expertMode ? (
          <EmojiWrapper>
            <span role="img" aria-label="wizard-icon">
              🧙
            </span>
          </EmojiWrapper>
        ) : null}
      </div>
      {open && (
        <div className='settings__modal'>
            <div className='settings__title'>{t('settings.title')}</div>
            <TransactionSettings
              rawSlippage={userSlippageTolerance}
              setRawSlippage={setUserslippageTolerance}
              deadline={ttl}
              setDeadline={setTtl}
            />
            <InterfaceSettings
              isExpertMode={expertMode}
              isSingleHopOnly={singleHopOnly}
              toggleExpertMode={expertMode
                ? () => {
                    toggleExpertMode()
                    setShowConfirmation(false)
                  }
                : () => {
                    toggle()
                    setShowConfirmation(true)
                  }}
                toggleSingleHop={() => (singleHopOnly ? setSingleHopOnly(false) : setSingleHopOnly(true))}/>
        </div>
      )}
    </div>
  )
}
