import { JSBI, Pair, Percent, TokenAmount } from '@uniswap/sdk'
import React, { useState } from 'react'
import { ChevronDown, ChevronUp } from 'react-feather'
import { Link } from 'react-router-dom'
import { useTotalSupply } from '../../data/TotalSupply'

import { useActiveWeb3React } from '../../hooks'
import { useTokenBalance } from '../../state/wallet/hooks'
import { currencyId } from '../../utils/currencyId'
import { unwrappedToken } from '../../utils/wrappedCurrency'
import { ButtonPrimary, ButtonEmpty } from '../Button'
import { AutoColumn } from '../Column'
import { RowFixed, AutoRow } from '../Row'
import { Dots } from '../swap/styleds'
import { BIG_INT_ZERO } from '../../constants'

interface PositionCardProps {
  pair: Pair
  className?: string
  showUnwrapped?: boolean
  border?: string
  stakedBalance?: TokenAmount // optional balance to indicate that liquidity is deposited in mining pool
}

export function MinimalPositionCard({ pair, className = '', showUnwrapped = false, border }: PositionCardProps) {
  const { account } = useActiveWeb3React()

  const currency0 = showUnwrapped ? pair.token0 : unwrappedToken(pair.token0)
  const currency1 = showUnwrapped ? pair.token1 : unwrappedToken(pair.token1)

  const [showMore, setShowMore] = useState(false)

  const userPoolBalance = useTokenBalance(account ?? undefined, pair.liquidityToken)
  const totalPoolTokens = useTotalSupply(pair.liquidityToken)

  const poolTokenPercentage =
    !!userPoolBalance && !!totalPoolTokens && JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? new Percent(userPoolBalance.raw, totalPoolTokens.raw)
      : undefined

  const [token0Deposited, token1Deposited] =
    !!pair &&
    !!totalPoolTokens &&
    !!userPoolBalance &&
    // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
    JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? [
          pair.getLiquidityValue(pair.token0, totalPoolTokens, userPoolBalance, false),
          pair.getLiquidityValue(pair.token1, totalPoolTokens, userPoolBalance, false)
        ]
      : [undefined, undefined]

  return (
    <>
      {userPoolBalance && JSBI.greaterThan(userPoolBalance.raw, JSBI.BigInt(0)) ? (
        <div className={`pool-card-clip pool-card-gradient p-4 ${className}`}>
          <div className='w-full flex flex-col'>
            <div className='flex justify-between h-24px mb-2'>
              <div className='text-lg text-dark font-title'>
                  Your position
              </div>
            </div>
            <div className='flex justify-between h-24px mb-2' onClick={() => setShowMore(!showMore)}>
              <div className='flex items-center'>
                <p className='text-lg text-dark'>
                  {currency0.symbol}/{currency1.symbol}
                </p>
              </div>
              <div className='text-lg text-dark'>
                {userPoolBalance ? userPoolBalance.toSignificant(4) : '-'}
              </div>
            </div>
            <div className='flex flex-col w-full'>
              <div className='flex justify-between h-24px mb-2 text-dark'>
                <span>
                  Your pool share:
                </span>
                <div className='text-lg text-dark'>
                  {poolTokenPercentage ? poolTokenPercentage.toFixed(6) + '%' : '-'}
                </div>
              </div>
              <div className='flex justify-between h-24px mb-2 text-dark'>
                <span>
                  {currency0.symbol}:
                </span>
                {token0Deposited ? (
                  <RowFixed>
                    <span>
                      {token0Deposited?.toSignificant(6)}
                    </span>
                  </RowFixed>
                ) : (
                  '-'
                )}
              </div>
              <div className='flex justify-between h-24px mb-2 text-dark'>
                <span>
                  {currency1.symbol}:
                </span>
                {token1Deposited ? (
                  <RowFixed>
                    <span>
                      {token1Deposited?.toSignificant(6)}
                    </span>
                  </RowFixed>
                ) : (
                  '-'
                )}
              </div>
            </div>
          </div>
        </div>
      ) :  null}
    </>
  )
}

export default function FullPositionCard({ pair, className = '', border, stakedBalance }: PositionCardProps) {
  const { account } = useActiveWeb3React()

  const currency0 = unwrappedToken(pair.token0)
  const currency1 = unwrappedToken(pair.token1)

  const [showMore, setShowMore] = useState(false)

  const userDefaultPoolBalance = useTokenBalance(account ?? undefined, pair.liquidityToken)
  const totalPoolTokens = useTotalSupply(pair.liquidityToken)

  // if staked balance balance provided, add to standard liquidity amount
  const userPoolBalance = stakedBalance ? userDefaultPoolBalance?.add(stakedBalance) : userDefaultPoolBalance

  const poolTokenPercentage =
    !!userPoolBalance && !!totalPoolTokens && JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? new Percent(userPoolBalance.raw, totalPoolTokens.raw)
      : undefined

  const [token0Deposited, token1Deposited] =
    !!pair &&
    !!totalPoolTokens &&
    !!userPoolBalance &&
    // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
    JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? [
          pair.getLiquidityValue(pair.token0, totalPoolTokens, userPoolBalance, false),
          pair.getLiquidityValue(pair.token1, totalPoolTokens, userPoolBalance, false)
        ]
      : [undefined, undefined]

  return (
    <div className={`pool-card-clip pool-card-gradient p-4 ${className}`}>
      <AutoColumn gap="12px">
        <div className='flex justify-between h-24px'>
          <AutoRow gap="8px">
            <p className='text-lg text-dark'>
              {!currency0 || !currency1 ? <Dots>Loading</Dots> : `${currency0.symbol}/${currency1.symbol}`}
            </p>
          </AutoRow>
          <RowFixed gap="8px">
            <ButtonEmpty
              light
              onClick={() => setShowMore(!showMore)}
            >
              {showMore ? (
                <>
                  Manage
                  <ChevronUp size="20" style={{ marginLeft: '10px' }} />
                </>
              ) : (
                <>
                  Manage
                  <ChevronDown size="20" style={{ marginLeft: '10px' }} />
                </>
              )}
            </ButtonEmpty>
          </RowFixed>
        </div>

        {showMore && (
          <AutoColumn gap="8px">
            <div className='flex justify-between h-24px'>
              <p className='text-lg text-dark'>
                Your total pool tokens:
              </p>
              <p className='text-lg text-dark'>
                {userPoolBalance ? userPoolBalance.toSignificant(4) : '-'}
              </p>
            </div>
            {stakedBalance && (
              <div className='flex justify-between h-24px'>
                <p className='text-lg text-dark'>
                  Pool tokens in rewards pool:
                </p>
                <p className='text-lg text-dark'>
                  {stakedBalance.toSignificant(4)}
                </p>
              </div>
            )}
            <div className='flex justify-between h-24px'>
              <RowFixed>
                <p className='text-lg text-dark'>
                  Pooled {currency0.symbol}:
                </p>
              </RowFixed>
              {token0Deposited ? (
                <RowFixed>
                    <p className='text-lg text-dark ml-1'>
                    {token0Deposited?.toSignificant(6)}
                  </p>
                </RowFixed>
              ) : (
                '-'
              )}
            </div>

            <div className='flex justify-between h-24px'>
              <RowFixed>
                <p className='text-lg text-dark'>
                  Pooled {currency1.symbol}:
                </p>
              </RowFixed>
              {token1Deposited ? (
                <RowFixed>
                  <p className='text-lg text-dark ml-1'>
                    {token1Deposited?.toSignificant(6)}
                  </p>
                </RowFixed>
              ) : (
                '-'
              )}
            </div>

            <div className='flex justify-between h-24px'>
              <p className='text-lg text-dark'>
                Your pool share:
              </p>
              <p className='text-lg text-dark'>
                {poolTokenPercentage
                  ? (poolTokenPercentage.toFixed(2) === '0.00' ? '<0.01' : poolTokenPercentage.toFixed(2)) + '%'
                  : '-'}
              </p>
            </div>
            {userDefaultPoolBalance && JSBI.greaterThan(userDefaultPoolBalance.raw, BIG_INT_ZERO) && (
              <div className='flex justify-between mt-2'>
                <Link to={`/add/${currencyId(currency0)}/${currencyId(currency1)}`}>
                <ButtonPrimary>
                  Add
                </ButtonPrimary>
                </Link>
                <Link to={`/remove/${currencyId(currency0)}/${currencyId(currency1)}`}>
                <ButtonPrimary>
                  Remove
                </ButtonPrimary>
                </Link>
              </div>
            )}
            {stakedBalance && JSBI.greaterThan(stakedBalance.raw, BIG_INT_ZERO) && (
              <ButtonPrimary
                padding="8px"
                borderRadius="8px"
                as={Link}
                to={`/uni/${currencyId(currency0)}/${currencyId(currency1)}`}
                width="100%"
              >
                Manage Liquidity in Rewards Pool
              </ButtonPrimary>
            )}
          </AutoColumn>
        )}
      </AutoColumn>
    </div>
  )
}
