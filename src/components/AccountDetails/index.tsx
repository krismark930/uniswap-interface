import React  from 'react'
import styled from 'styled-components'
import { useActiveWeb3React } from '../../hooks'
import { shortenAddress } from '../../utils'
import Copy from './Copy'

import { SUPPORTED_WALLETS } from '../../constants'
import { injected, walletconnect, walletlink, fortmatic, portis } from '../../connectors'
import CoinbaseWalletIcon from '../../assets/images/coinbaseWalletIcon.svg'
import WalletConnectIcon from '../../assets/images/walletConnectIcon.svg'
import FortmaticIcon from '../../assets/images/fortmaticIcon.png'
import PortisIcon from '../../assets/images/portisIcon.png'
import Identicon from '../Identicon'
import { ButtonPrimary } from '../Button'
import {ReactComponent as CloseIcon} from 'assets/svg/cross.svg'

const IconWrapper = styled.div<{ size?: number }>`
  ${({ theme }) => theme.flexColumnNoWrap};
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  & > img,
  span {
    height: ${({ size }) => (size ? size + 'px' : '32px')};
    width: ${({ size }) => (size ? size + 'px' : '32px')};
  }
  ${({ theme }) => theme.mediaWidth.upToMedium`
    align-items: flex-end;
  `};
`


interface AccountDetailsProps {
  toggleWalletModal: () => void
  ENSName?: string
}

export default function AccountDetails({
  toggleWalletModal,
  ENSName,
}: AccountDetailsProps) {
  const { account, connector } = useActiveWeb3React()
  function formatConnectorName() {
    const { ethereum } = window
    const isMetaMask = !!(ethereum && ethereum.isMetaMask)
    const name = Object.keys(SUPPORTED_WALLETS)
      .filter(
        k =>
          SUPPORTED_WALLETS[k].connector === connector && (connector !== injected || isMetaMask === (k === 'METAMASK'))
      )
      .map(k => SUPPORTED_WALLETS[k].name)[0]
    return <div className='flex flex-col'>
      <div className='text-sm text-pink-600'>Connected with </div><div className='text-xl'>{name}</div>
    </div>
  }

  function getStatusIcon() {
    if (connector === injected) {
      return (
        <IconWrapper size={16}>
          <Identicon />
        </IconWrapper>
      )
    } else if (connector === walletconnect) {
      return (
        <IconWrapper size={16}>
          <img src={WalletConnectIcon} alt={'wallet connect logo'} />
        </IconWrapper>
      )
    } else if (connector === walletlink) {
      return (
        <IconWrapper size={16}>
          <img src={CoinbaseWalletIcon} alt={'coinbase wallet logo'} />
        </IconWrapper>
      )
    } else if (connector === fortmatic) {
      return (
        <IconWrapper size={16}>
          <img src={FortmaticIcon} alt={'fortmatic logo'} />
        </IconWrapper>
      )
    } else if (connector === portis) {
      return (
        <>
          <IconWrapper size={16}>
            <img src={PortisIcon} alt={'portis logo'} />
            <ButtonPrimary className='button--crumpled'
              onClick={() => {
                portis.portis.showPortis()
              }}
            >
              Show Portis
            </ButtonPrimary>
          </IconWrapper>
        </>
      )
    }
    return null
  }
  return (
    <>
      <div className='account-details'>
        <div className='modal-header'>
          <h3>Account</h3>
          <CloseIcon onClick={toggleWalletModal}/>
        </div>
        <div className='modal-wrapper'>
          <div className='flex justify-between py-4'>
            {formatConnectorName()}
            <div className='flex flex-col items-end'>
              <div className='flex justify-between py-4' id="web3-account-identifier-row">
                  {ENSName ? (
                    <>
                      <div>
                        {getStatusIcon()}
                        <p> {ENSName}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className='flex items-center '>
                        {getStatusIcon()}
                        <p className='text-lg'> {account && shortenAddress(account)}</p>
                      </div>
                    </>
                  )}
            </div>
            <div className='flex ltems-center '>
              {account && (
                 <Copy toCopy={account} className='flex text-sm'>
                  <span className='ml-1'>Copy Address</span>
                </Copy>
              )}
            </div>
            </div>
          </div>
        </div>
      </div> 
    </>
  )
}
