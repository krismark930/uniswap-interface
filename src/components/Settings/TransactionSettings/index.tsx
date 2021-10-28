import React, { useState, useRef } from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'

import QuestionHelper from '../../QuestionHelper'
import FancyButton from './FancyButton'
import { useDarkModeManager } from 'state/user/hooks'

enum SlippageError {
  InvalidInput = 'InvalidInput',
  RiskyLow = 'RiskyLow',
  RiskyHigh = 'RiskyHigh'
}

const SlippageEmojiContainer = styled.span`
  color: #f3841e;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: none;  
  `}
`

export interface SlippageTabsProps {
  rawSlippage: number
  setRawSlippage: (rawSlippage: number) => void
  deadline: number
  setDeadline: (deadline: number) => void
}

export default function SlippageTabs({ rawSlippage, setRawSlippage, deadline, setDeadline }: SlippageTabsProps) {

  const inputRef = useRef<HTMLInputElement>()

  const [slippageInput, setSlippageInput] = useState('')
  const [deadlineInput, setDeadlineInput] = useState('')

  const {t} = useTranslation()

  const slippageInputIsValid =
    slippageInput === '' || (rawSlippage / 100).toFixed(2) === Number.parseFloat(slippageInput).toFixed(2)

  let slippageError: SlippageError | undefined
  if (slippageInput !== '' && !slippageInputIsValid) {
    slippageError = SlippageError.InvalidInput
  } else if (slippageInputIsValid && rawSlippage < 50) {
    slippageError = SlippageError.RiskyLow
  } else if (slippageInputIsValid && rawSlippage > 500) {
    slippageError = SlippageError.RiskyHigh
  } else {
    slippageError = undefined
  }

  function parseCustomSlippage(value: string) {
    setSlippageInput(value)

    try {
      const valueAsIntFromRoundedFloat = Number.parseInt((Number.parseFloat(value) * 100).toString())
      if (!Number.isNaN(valueAsIntFromRoundedFloat) && valueAsIntFromRoundedFloat < 5000) {
        setRawSlippage(valueAsIntFromRoundedFloat)
      }
    } catch {}
  }

  function parseCustomDeadline(value: string) {
    setDeadlineInput(value)

    try {
      const valueAsInt: number = Number.parseInt(value) * 60
      if (!Number.isNaN(valueAsInt) && valueAsInt > 0) {
        setDeadline(valueAsInt)
      }
    } catch {}
  }

  const [darkMode] = useDarkModeManager()

  return (
    <div className={`trs-settings ${!darkMode ? 'trs-settings--light' : ''}`}>
        <div className='trs-settings__title'>
          <span>{t('trsSettings.tolerance.title')}</span>
          <QuestionHelper text={t('trsSettings.tolerance.tip')} />
        </div>
        <div className='trs-settings__options'>
        <FancyButton className='trs-settings__option'
            onClick={() => {
              setSlippageInput('')
              setRawSlippage(10)
            }}
            active={rawSlippage === 10}
          >{'0.1%'}
          </FancyButton>
          <FancyButton className='trs-settings__option'
            onClick={() => {
              setSlippageInput('')
              setRawSlippage(50)
            }}
            active={rawSlippage === 50}
          >
            0.5%
          </FancyButton>
          <FancyButton className='trs-settings__option'
            onClick={() => {
              setSlippageInput('')
              setRawSlippage(100)
            }}
            active={rawSlippage === 100}
          >
            1%
          </FancyButton>
        </div>
        <div className={`trs-settings__input-panel
          ${![10, 50, 100].includes(rawSlippage) ? 'trs-settings__input-panel--active' : '' }
          ${!slippageInputIsValid ? 'trs-settings__input-panel--warning' : ''}`}>
              {!!slippageInput &&
              (slippageError === SlippageError.RiskyLow || slippageError === SlippageError.RiskyHigh) ? (
                <SlippageEmojiContainer>
                  <span role="img" aria-label="warning">
                    ⚠️
                  </span>
                </SlippageEmojiContainer>
              ) : null}
              {/* https://github.com/DefinitelyTyped/DefinitelyTyped/issues/30451 */}
              <input
                ref={inputRef as any}
                placeholder={(rawSlippage / 100).toFixed(2)}
                value={slippageInput}
                onBlur={() => {
                  parseCustomSlippage((rawSlippage / 100).toFixed(2))
                }}
                onChange={e => parseCustomSlippage(e.target.value)}
                color={!slippageInputIsValid ? 'red' : ''}
              />
               <div className='trs-settings__postfix'>%</div>
        </div>
        {!!slippageError && (
          <div className='trs-settings__warn' style={{
            fontSize: '14px',
            color: slippageError === SlippageError.InvalidInput ? 'red' : '#F3841E'
          }}>
            {slippageError === SlippageError.InvalidInput
              ? 'Enter a valid slippage percentage'
              : slippageError === SlippageError.RiskyLow
              ? 'Your transaction may fail'
              : 'Your transaction may be frontrun'}
          </div>
        )}
        <div className='trs-settings__title'>
          <span>{t('trsSettings.deadline.title')}</span>
          <QuestionHelper text={t('trsSettings.deadline.tip')} />
        </div>
        <div className='flex'>
          <div className='trs-settings__input-panel'>
            <input
              onBlur={() => {
                parseCustomDeadline((deadline / 60).toString())
              }}
              placeholder={(deadline / 60).toString()}
              value={deadlineInput}
              onChange={e => parseCustomDeadline(e.target.value)}
            />
            <div className='trs-settings__postfix'>
              minutes
            </div>
          </div>
          
        </div>
      </div>
  )
}
