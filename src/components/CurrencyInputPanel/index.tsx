import { Currency, Pair } from '@uniswap/sdk'
import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import CurrencySearchModal from '../SearchModal/CurrencySearchModal'
import { Input as NumericalInput } from '../NumericalInput'
import { ReactComponent as DropDown } from '../../assets/images/dropdown.svg'
import { useDarkModeManager } from '../../state/user/hooks'

import { useActiveWeb3React } from '../../hooks'
import { useTranslation } from 'react-i18next'

const StyledDropDown = styled(DropDown)<{ selected: boolean }>`
  margin: 0 0.25rem 0 0.5rem;
  height: 35%;

  path {
    stroke: ${({ selected, theme }) => (selected ? theme.text1 : theme.white)};
    stroke-width: 1.5px;
  }
`

interface CurrencyInputPanelProps {
  value: string
  onUserInput: (value: string) => void
  onMax?: () => void
  showMaxButton: boolean
  label?: string
  onCurrencySelect?: (currency: Currency) => void
  currency?: Currency | null
  disableCurrencySelect?: boolean
  hideBalance?: boolean
  pair?: Pair | null
  hideInput?: boolean
  otherCurrency?: Currency | null
  id: string,
  className?: string
}

export default function CurrencyInputPanel({
  value,
  onUserInput,
  onMax,
  showMaxButton,
  label = 'Input',
  onCurrencySelect,
  currency,
  disableCurrencySelect = false,
  hideBalance = false,
  pair = null, // used for double token logo
  hideInput = false,
  otherCurrency,
  id,
  className = '',
}: CurrencyInputPanelProps) {
  const { t } = useTranslation()
  const [darkMode] = useDarkModeManager()

  const [modalOpen, setModalOpen] = useState(false)
  const { account } = useActiveWeb3React()

  const handleDismissSearch = useCallback(() => {
    setModalOpen(false)
  }, [setModalOpen])

  return (
    <div id={id} className={`flex h-80px relative ${!darkMode ? ' bg-inp-light' : ' bg-inp-dark'} ${className}`}>
      <div className={`flex w-full align-center ${disableCurrencySelect ? ' py-3 pr-2 pl-4' : ' py-3 pr-3 pl-4'}`}>
        <div className={` open-currency-select-button flex-col justify-center h-9 text-lg outline-none font-title`}>
          <div className={`flex items-center space-between cursor-pointer
              ${!!currency ? ' hover:text-purple' : ''} hover:text-blue ${!darkMode ? ' text-dark': ' text-white'}`} onClick={() => {
              if (!disableCurrencySelect) {
                setModalOpen(true)
              }
            }}>
              {pair ? (
                <div className={`my-0 mr-1 ml-3 text-md pair-name-container`}>
                  {pair?.token0.symbol} : {pair?.token1.symbol}
                </div>
              ) : (
                <div className={`token-symbol-container 
                    ${Boolean(currency && currency.symbol) ? ' my-0 mx-1 text-lg' : ' my-0 mr-1 ml-3 text-md'}`
                  }>
                    {(currency && currency.symbol && currency.symbol.length > 20
                    ? currency.symbol.slice(0, 4) +
                      '...' +
                      currency.symbol.slice(currency.symbol.length - 5, currency.symbol.length)
                    : currency?.symbol) || t('selectToken')}
                </div>
              )}
              {!disableCurrencySelect && <StyledDropDown selected={!!currency} />}
          </div>
          {account && currency && showMaxButton && label !== 'To' && (
            <div className='mt-2 pb-1 px-1 text-sm text-soft-grey hover:text-purple cursor-pointer' onClick={onMax}>MAX</div>
            )}
        </div>
          {!hideInput && (
            <>
              <NumericalInput
                className="token-amount-input text-right pr-1 flex-grow font-title text-lg"
                value={value}
                onUserInput={val => {
                  onUserInput(val)
                }}
              />
              
            </>
          )}
      </div>
      {!disableCurrencySelect && onCurrencySelect && (
        <CurrencySearchModal
          isOpen={modalOpen}
          onDismiss={handleDismissSearch}
          onCurrencySelect={onCurrencySelect}
          selectedCurrency={currency}
          otherSelectedCurrency={otherCurrency}
        />
      )}
    </div>
  )
}
