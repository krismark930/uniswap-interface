import React, { useEffect } from 'react';
import { useActiveWeb3React } from '../../hooks'
import { useTranslation } from 'react-i18next';
import { ButtonPrimary } from '../../components/Button';
import { UnsupportedChainIdError } from '@web3-react/core'
import Form from './form'
import { useWalletModalToggle } from '../../state/application/hooks'
import { useDarkModeManager } from '../../state/user/hooks';

export default function TokenGetter() {
  const { account, error } = useActiveWeb3React()
  const {t} = useTranslation()
  const toggleWalletModal = useWalletModalToggle()
  const [darkMode] = useDarkModeManager()
  useEffect(() => console.log(account))
  const renderByAccountState = () => {
    if (error) {
      return <div className='token-getter__error-wrapper'>
        <>{error instanceof UnsupportedChainIdError ? 'Wrong Network' : 'Error connecting'}</>
      <div className='wallet-modal__wrapper'>
        {error instanceof UnsupportedChainIdError ? (
          <h5>Please connect to the appropriate Ethereum network.</h5>
        ) : (
          'Error connecting. Try refreshing the page.'
        )}
      </div>
      </div>
    } else if (account) return <Form/>
    else {
      return <div className='token-getter__unlogged'>
        <div className='token-getter__summary'>{t('tokenGetter.connect.summary')}</div>
        <ButtonPrimary onClick={toggleWalletModal}>{t('actions.connect')}</ButtonPrimary>
      </div>
    }
  }
  return (
    <div className={`token-getter ${!darkMode ? 'token-getter--light' : ''}`}>
      <div className='token-getter__plate'>
        <div className='token-getter__title'>{t('tokenGetter.title')}</div>
        {renderByAccountState()}
      </div>
    </div>
  )
}

