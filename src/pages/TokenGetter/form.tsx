import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ButtonPrimary, ButtonSecondary } from '../../components/Button';
import { useDarkModeManager } from '../../state/user/hooks';
import { Input as NumericalInput } from '../../components/NumericalInput'
import Loader from '../../components/Loader'
import { useHistory } from 'react-router-dom';
import { useWeb3React } from '@web3-react/core';
import axios from 'axios'

interface Response {
  success: boolean,
  message: string
}

export default function Form({className = ''}) {
  const responseTimeout: any = useRef(null)
  const history = useHistory()
  const [darkMode] = useDarkModeManager()
  const {t} = useTranslation()
  const [amount, setAmount] = useState(0)
  const [isMaxAmountIncreaced, setIsMaxAmointIncreased] = useState(false)
  const {account} = useWeb3React()
  const [response, setResponse] = useState({
    success: true,
    message: ''
  })

  const updateResponse = (resp: Response) => {
    setResponse(resp)
    responseTimeout.current = setTimeout(() => {
      setResponse({success: true, message: ''})
    }, 10000)
  }

  const [airdropPending, setAirdropPending] = useState(false)

  const postAirdrop = () => {
    const {hostname} = window.location
    const url = `${hostname}/request_airdrop`
    setAirdropPending(true)
    axios( {
      url,
      method: 'POST',
      headers: {
        'content-type': 'text/plain',
      },
      data: {
        amount, wallet: account
      }
    }).then(resp => {
      const text = resp.statusText
      console.dir(resp)
      updateResponse({
        success: true,
        message: text
      })
    }).catch(err => {
      const message = err.response === undefined ? 
        `Request seems to be blocked by CORS policy. Response isn't avaliable` : err.message
      updateResponse({
        success: false,
        message
      })
    }).finally(() => setAirdropPending(false))
  }

  const updateAmount = (value: number) => {
    setAmount(value)
    if (value < 0) return
    if (value > 1000) setIsMaxAmointIncreased(true)
    else setIsMaxAmointIncreased(false)
  }

  return <div className={`${className} tg-form ${!darkMode ? 'tg-form--light' : ''}`}>
  <div className='tg-form__amount'>
    <div className='tg-form__label-wrapper'>
    <label htmlFor='token-getter-amount' className='tg-form__label'>{t('tokenGetter.form.label')}</label>
    {airdropPending ? <Loader /> : null}
    </div>
    <NumericalInput
      id='token-getter-amount'
      className="tg-form__input"
      value={amount}
      error={isMaxAmountIncreaced ? 'true' : 'false'}
      onUserInput={val => {
        updateAmount(+val)
      }}
    />
  </div>
  <div className='tg-form__footer'>
    <div className='tg-form__btn-wrapper'>
      <ButtonPrimary className='tg-form__btn' disabled={isMaxAmountIncreaced || amount === 0 || (response && response.message) || airdropPending === true}
        onClick={() => postAirdrop()}>{t('actions.getTokens')}</ButtonPrimary>
    </div>
    <div className='tg-form__btn-wrapper'>
      <ButtonSecondary className='tg-form__btn'
        onClick={() => history.push('/swap')}>{t('swap')}</ButtonSecondary>
    </div>
  </div>
    {response.message && response.message.length ? 
    <div className='tg-form__response'>
      <div className={`tg-form__res-text ${!response.success ? 'tg-form__res-text--error' : ''}`}>{response.message}</div>
      <div className='tg-form__res-lock'>{t('tokenGetter.locker')}</div>
    </div>
    : null}
  </div>
}