import React from 'react'
import { useDarkModeManager } from 'state/user/hooks'
import QuestionHelper from '../../QuestionHelper'
import Toggle from '../../Toggle'
import { useTranslation } from 'react-i18next'

export default function InterfaceSettings ({
  isExpertMode = false,
  toggleExpertMode = () => {},
  isSingleHopOnly = false,
  toggleSingleHop = () => {}
}) {
  const [darkMode] = useDarkModeManager()
  const {t} = useTranslation()
  return (
    <div className={`interface-settings ${!darkMode ? 'interface-settings--light' : ''}`}>
      <div className='interface-settings__title'>{t('settings.interface.title')}</div>
      <div className='interface-settings__row'>
        <div className='flex items-center'>
          <div className='interface-settings__toggle-label'>Toggle Expert Mode</div>
          <QuestionHelper text="Bypasses confirmation modals and allows high slippage trades. Use at your own risk." />
        </div>
        <Toggle
          id="toggle-expert-mode-button"
          isActive={isExpertMode}
          toggle={toggleExpertMode}/>
      </div>
      <div className='interface-settings__row'>
        <div className='flex items-center'>
          <div className='interface-settings__toggle-label'>Disable Multihops</div>
          <QuestionHelper text="Restricts swaps to direct pairs only." />
        </div>
        <Toggle
          id="toggle-disable-multihop-button"
          isActive={isSingleHopOnly}
          toggle={toggleSingleHop} />
      </div>
    </div>
  )
}