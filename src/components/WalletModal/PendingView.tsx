import { AbstractConnector } from '@web3-react/abstract-connector'
import React from 'react'
import Option from './Option'
import { SUPPORTED_WALLETS } from '../../constants'
import { injected } from '../../connectors'
import Loader from '../Loader'
import { ButtonSecondary } from 'components/Button'

export default function PendingView({
  connector,
  error = false,
  setPendingError,
  tryActivation
}: {
  connector?: AbstractConnector
  error?: boolean
  setPendingError: (error: boolean) => void
  tryActivation: (connector: AbstractConnector) => void
}) {
  const isMetamask = window?.ethereum?.isMetaMask

  return (
    <>
      <div className='w-full'>
        <div className='flex align-center justify-center'>
          {error ? (
            <div className='w-full flex items-center justify-between px-5 py-3'>
              <div className='text-red-400'>Error connecting.</div>
              <ButtonSecondary className='button--crumpled'
                onClick={() => {
                  setPendingError(false)
                  connector && tryActivation(connector)
                }}
              >
                Try Again
              </ButtonSecondary>
            </div>
          ) : (
            <div className='py-2 flex align-items'>
              <Loader className='mr-4' />
              <span>Initializing...</span>
            </div>
          )}
        </div>
      </div>
      {Object.keys(SUPPORTED_WALLETS).map(key => {
        const option = SUPPORTED_WALLETS[key]
        if (option.connector === connector) {
          if (option.connector === injected) {
            if (isMetamask && option.name !== 'MetaMask') {
              return null
            }
            if (!isMetamask && option.name === 'MetaMask') {
              return null
            }
          }
          return (
            <Option
            name={option.name}
              id={`connect-${key}`}
              key={key}
              clickable={false}
              header={option.name}
              subheader={option.description}
              icon={require('../../assets/images/' + option.iconName)}
            />
          )
        }
        return null
      })}
    </>
  )
}
