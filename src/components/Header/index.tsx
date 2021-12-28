import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import styled from 'styled-components'

import Logo from '../../assets/svg/logo_light.svg'
import LogoDark from '../../assets/svg/logo_dark.svg'
import { useActiveWeb3React, useNetworkType } from '../../hooks'
import { useDarkModeManager } from '../../state/user/hooks'
// import { useETHBalances /*, useAggregateUniBalance */} from '../../state/wallet/hooks'
import { CardNoise } from '../earn/styled'
import { TYPE } from '../../theme'


import Row from '../Row'
import Web3Status from '../Web3Status'
import ClaimModal from '../claim/ClaimModal'
import { useToggleSelfClaimModal, useShowClaimPopup } from '../../state/application/hooks'
import { useUserHasAvailableClaim } from '../../state/claim/hooks'
import { useUserHasSubmittedClaim } from '../../state/transactions/hooks'
import { Dots } from '../swap/styleds'
import Modal from '../Modal'
import UniBalanceContent from './UniBalanceContent'
import { useWeb3React } from '@web3-react/core'
import { ChainId } from '@uniswap/sdk'
const HeaderControls = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-self: flex-end;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    flex-direction: row;
    justify-content: space-between;
    justify-self: center;
    width: 100%;
    max-width: 960px;
    padding: 1rem;
    position: fixed;
    bottom: 0px;
    left: 0px;
    width: 100%;
    z-index: 99;
    height: 72px;
    border-radius: 12px 12px 0 0;
    background-color: ${({ theme }) => theme.bg1};
  `};
`

const HeaderElement = styled.div`
  display: flex;
  align-items: center;

  /* addresses safari's lack of support for "gap" */
  & > *:not(:first-child) {
    margin-left: 8px;
  }

  ${({ theme }) => theme.mediaWidth.upToMedium`
   flex-direction: row-reverse;
    align-items: center;
  `};
`

const HeaderLinks = styled(Row)`
  justify-content: center;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 1rem 0 1rem 1rem;
    justify-content: flex-end;
`};
`

const UNIWrapper = styled.span`
  width: fit-content;
  position: relative;
  cursor: pointer;

  :hover {
    opacity: 0.8;
  }

  :active {
    opacity: 0.9;
  }
`
export default function Header() {
  const { library, active } = useWeb3React()
  const { account } = useActiveWeb3React()
  const { t } = useTranslation()
  const network = useNetworkType()


  // const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? '']
  const [darkMode] = useDarkModeManager()

  const toggleClaimModal = useToggleSelfClaimModal()

  const availableClaim: boolean = useUserHasAvailableClaim(account)

  const { claimTxn } = useUserHasSubmittedClaim(account ?? undefined)

  // const aggregateBalance: TokenAmount | undefined = useAggregateUniBalance()

  const [showUniBalanceModal, setShowUniBalanceModal] = useState(false)
  const showClaimPopup = useShowClaimPopup()

  // const countUpValue = aggregateBalance?.toFixed(0) ?? '0'
  // const countUpValuePrevious = usePrevious(countUpValue) ?? '0'

  const navLinkProps = {
    className: 'header__link',
    activeClassName: 'header__link--active'
  }
  return (
    <div className={`header ${!darkMode ? 'header--light' : ''}`}>
      <ClaimModal />
      <Modal isOpen={showUniBalanceModal} onDismiss={() => setShowUniBalanceModal(false)}>
        <UniBalanceContent setShowUniBalanceModal={setShowUniBalanceModal} />
      </Modal>
      <div className='header__plate'>
        <div className='header__logo'>
          <img width={'75px'} src={darkMode ? LogoDark : Logo} alt="logo" />
        </div>
        <HeaderLinks>
          <NavLink id={`swap-nav-link`} to={'/swap'} {...navLinkProps}>
            {t('swap')}
          </NavLink>
          <NavLink
            id={`pool-nav-link`}
            to={'/pool'}
            {...navLinkProps}
          >
            {t('pool')}
          </NavLink>
          {network && network !== 'NEONMAIN' ? 
            <NavLink id={`get-tokens-nav-link`} to={'/get-tokens'} {...navLinkProps}>
              {t('getTokens')}
            </NavLink> 
             : null
          }
          <a className='header__link'
            rel='noopener noreferrer'
            target="_blank"
            href="https://neonpass.live">
              Transfer tokens
          </a>
          {/* <NavLink id={`spl-convert-nav-link`} to={'/spl-convert'} {...navLinkProps}>
            {t('convertTokens')}
          </NavLink> */}
        </HeaderLinks>
        <HeaderControls>
        <HeaderElement>
          {availableClaim && !showClaimPopup && (
            <UNIWrapper onClick={toggleClaimModal}>
              <div className={`header__uni-amount ${!!account && !availableClaim ? 'header__uni-amount--active' : ''}`} style={{ pointerEvents: 'auto' }}>
                <TYPE.white padding="0 2px">
                  {claimTxn && !claimTxn?.receipt ? <Dots>Claiming UNI</Dots> : 'Claim UNI'}
                </TYPE.white>
              </div>
              <CardNoise />
            </UNIWrapper>
          )}
          {/* {!availableClaim && aggregateBalance && (
            <UNIWrapper onClick={() => setShowUniBalanceModal(true)}>
              <UNIAmount active={!!account && !availableClaim} style={{ pointerEvents: 'auto' }}>
                {account && (
                  <HideSmall>
                    <TYPE.white
                      style={{
                        paddingRight: '.4rem'
                      }}
                    >
                      <CountUp
                        key={countUpValue}
                        isCounting
                        start={parseFloat(countUpValuePrevious)}
                        end={parseFloat(countUpValue)}
                        thousandsSeparator={','}
                        duration={1}
                      />
                    </TYPE.white>
                  </HideSmall>
                )}
                UNI
              </UNIAmount>
              <CardNoise />
            </UNIWrapper>
          )} */}
          {active && library.network && library.network.chainId ? 
          <div className='mr-2 text-sm font-title'>{ChainId[library.network.chainId]}</div>
          : null}
          <div className={`header__account ${!!account ? 'header__account--active' : ''}`} style={{ pointerEvents: 'auto' }}>
            {/* {account && userEthBalance ? (
              <div className='header__balance'>
                <span>{userEthBalance?.toSignificant(4)}</span>
                <span className='header__b-currency'>ETH</span>
              </div>
            ) : null} */}
            <Web3Status />
          </div>
        </HeaderElement>
      </HeaderControls>
      </div>

    </div>
  )
}
