import { Currency, ETHER, JSBI, TokenAmount } from '@uniswap/sdk'
import React, { useCallback, useEffect, useState } from 'react'
import { Plus } from 'react-feather'
import { Text } from 'rebass'
import { ButtonDropdownLight, ButtonSecondary } from '../../components/Button'
import CurrencyLogo from '../../components/CurrencyLogo'
import { MinimalPositionCard } from '../../components/PositionCard'
import Row from '../../components/Row'
import CurrencySearchModal from '../../components/SearchModal/CurrencySearchModal'
import { PairState, usePair } from '../../data/Reserves'
import { useActiveWeb3React } from '../../hooks'
import { usePairAdder } from '../../state/user/hooks'
import { useTokenBalance } from '../../state/wallet/hooks'
import { Link } from 'react-router-dom'
import { currencyId } from '../../utils/currencyId'
import AppBody from '../../components/AppBody'
import { Dots } from '../Pool/styleds'

enum Fields {
  TOKEN0 = 0,
  TOKEN1 = 1
}

export default function PoolFinder() {
  const { account } = useActiveWeb3React()

  const [showSearch, setShowSearch] = useState<boolean>(false)
  const [activeField, setActiveField] = useState<number>(Fields.TOKEN1)

  const [currency0, setCurrency0] = useState<Currency | null>(ETHER)
  const [currency1, setCurrency1] = useState<Currency | null>(null)

  const [pairState, pair] = usePair(currency0 ?? undefined, currency1 ?? undefined)
  const addPair = usePairAdder()
  useEffect(() => {
    if (pair) {
      addPair(pair)
    }
  }, [pair, addPair])

  const validPairNoLiquidity: boolean =
    pairState === PairState.NOT_EXISTS ||
    Boolean(
      pairState === PairState.EXISTS &&
        pair &&
        JSBI.equal(pair.reserve0.raw, JSBI.BigInt(0)) &&
        JSBI.equal(pair.reserve1.raw, JSBI.BigInt(0))
    )

  const position: TokenAmount | undefined = useTokenBalance(account ?? undefined, pair?.liquidityToken)
  const hasPosition = Boolean(position && JSBI.greaterThan(position.raw, JSBI.BigInt(0)))

  const handleCurrencySelect = useCallback(
    (currency: Currency) => {
      if (activeField === Fields.TOKEN0) {
        setCurrency0(currency)
      } else {
        setCurrency1(currency)
      }
    },
    [activeField]
  )

  const handleSearchDismiss = useCallback(() => {
    setShowSearch(false)
  }, [setShowSearch])

  const prerequisiteMessage = (
    <div className='pool-card-clip pool-card-gradient p-4'>
      <p className='text-dark text-center'>
        {!account ? 'Connect to a wallet to find pools' : 'Select a token to find your liquidity.'}
      </p>
    </div>
  )

  return (
    <AppBody>
      <div className='p-4 w-full flex flex-col'>
        <div className='pool-card-clip pool-card-gradient p-4'>
          <div className='text-dark'>
            <b>Tip:</b> Use this tool to find pairs that don&apos;t automatically appear in the interface.
          </div>
        </div>
        <ButtonDropdownLight
          className='my-4'
          onClick={() => {
            setShowSearch(true)
            setActiveField(Fields.TOKEN0)
          }}
        >
          {currency0 ? (
            <Row>
              <CurrencyLogo currency={currency0} />
              <Text fontWeight={500} fontSize={20} marginLeft={'12px'}>
                {currency0.symbol}
              </Text>
            </Row>
          ) : (
            <Text fontWeight={500} fontSize={20} marginLeft={'12px'}>
              Select a Token
            </Text>
          )}
        </ButtonDropdownLight>

        <div className='flex flex-col items-center'>
          <Plus size="16" color="#888D9B" />
        </div>
        <ButtonDropdownLight
          className='my-4'
          onClick={() => {
            setShowSearch(true)
            setActiveField(Fields.TOKEN1)
          }}
        >
          {currency1 ? (
            <Row>
              <CurrencyLogo currency={currency1} />
              <Text fontWeight={500} fontSize={20} marginLeft={'12px'}>
                {currency1.symbol}
              </Text>
            </Row>
          ) : (
            <Text fontWeight={500} fontSize={20} marginLeft={'12px'}>
              Select a Token
            </Text>
          )}
        </ButtonDropdownLight>

        {hasPosition && (
          <div className='w-full flex flex-col items-center py-3'>
            <p className='text-center text-dark mb-4'>
              Pool Found!
            </p>
            <Link to={`/pool`}>
              <ButtonSecondary>Manage this pool</ButtonSecondary>
            </Link>
          </div>
        )}

        {currency0 && currency1 ? (
          pairState === PairState.EXISTS ? (
            hasPosition && pair ? (
              <MinimalPositionCard pair={pair} border="1px solid #CED0D9" />
            ) : (
              <div className='pool-card-clip pool-card-gradient p-4'>
                <div className='w-full flex flex-col items-center'>
                <p className='text-center text-dark mb-4'>You don’t have liquidity in this pool yet.</p>
                  <Link to={`/add/${currencyId(currency0)}/${currencyId(currency1)}`}>
                    <ButtonSecondary>Add liquidity</ButtonSecondary>
                  </Link>
                </div>
              </div>
            )
          ) : validPairNoLiquidity ? (
            <div className='pool-card-clip pool-card-gradient p-4'>
              <div className='w-full flex flex-col items-center'>
                <p className='text-center text-dark mb-4'>{'No pool found.'}</p>
                <Link to={`/add/${currencyId(currency0)}/${currencyId(currency1)}`}>
                  <ButtonSecondary>Create pool</ButtonSecondary>
                </Link>
              </div>
            </div>
          ) : pairState === PairState.INVALID ? (
            <div className='pool-card-clip pool-card-gradient p-4'>
              <div className='w-full flex flex-col items-center'>
                <p className='text-center text-dark mb-4'>
                  Invalid pair.
                </p>
              </div>
            </div>
          ) : pairState === PairState.LOADING ? (
            <div className='pool-card-clip pool-card-gradient p-4'>
              <div className='w-full flex flex-col items-center'>
              <p className='text-center text-dark'>
                  Loading
                  <Dots />
                </p>
              </div>
            </div>
          ) : null
        ) : (
          prerequisiteMessage
        )}
      </div>

      <CurrencySearchModal
        isOpen={showSearch}
        onCurrencySelect={handleCurrencySelect}
        onDismiss={handleSearchDismiss}
        selectedCurrency={(activeField === Fields.TOKEN0 ? currency1 : currency0) ?? undefined}
      />
    </AppBody>
  )
}
