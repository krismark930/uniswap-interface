import React, { useMemo } from 'react'
import { Pair, JSBI } from '@uniswap/sdk'
import { NavLink } from 'react-router-dom'
import FullPositionCard from '../../components/PositionCard'
import { useUserHasLiquidityInAllTokens } from '../../data/V1'
import { useTokenBalancesWithLoadingIndicator } from '../../state/wallet/hooks'
import { ButtonEmpty } from '../../components/Button'
import { useActiveWeb3React } from '../../hooks'
import { usePairs } from '../../data/Reserves'
import { toV2LiquidityToken, useTrackedTokenPairs } from '../../state/user/hooks'
import { useStakingInfo } from '../../state/stake/hooks'
import { BIG_INT_ZERO } from '../../constants'
import { useDarkModeManager } from '../../state/user/hooks'
import {useTranslation} from 'react-i18next'

export default function Pool() {
  const { account } = useActiveWeb3React()
  const {t} = useTranslation()

  // fetch the user's balances of all tracked V2 LP tokens
  const trackedTokenPairs = useTrackedTokenPairs()
  const tokenPairsWithLiquidityTokens = useMemo(
    () => trackedTokenPairs.map(tokens => ({ liquidityToken: toV2LiquidityToken(tokens), tokens })),
    [trackedTokenPairs]
  )
  const liquidityTokens = useMemo(() => tokenPairsWithLiquidityTokens.map(tpwlt => tpwlt.liquidityToken), [
    tokenPairsWithLiquidityTokens
  ])
  const [v2PairsBalances, fetchingV2PairBalances] = useTokenBalancesWithLoadingIndicator(
    account ?? undefined,
    liquidityTokens
  )

  // fetch the reserves for all V2 pools in which the user has a balance
  const liquidityTokensWithBalances = useMemo(
    () =>
      tokenPairsWithLiquidityTokens.filter(({ liquidityToken }) =>
        v2PairsBalances[liquidityToken.address]?.greaterThan('0')
      ),
    [tokenPairsWithLiquidityTokens, v2PairsBalances]
  )

  const v2Pairs = usePairs(liquidityTokensWithBalances.map(({ tokens }) => tokens))
  const v2IsLoading =
    fetchingV2PairBalances || v2Pairs?.length < liquidityTokensWithBalances.length || v2Pairs?.some(V2Pair => !V2Pair)

  const allV2PairsWithLiquidity = v2Pairs.map(([, pair]) => pair).filter((v2Pair): v2Pair is Pair => Boolean(v2Pair))

  const hasV1Liquidity = useUserHasLiquidityInAllTokens()

  // show liquidity even if its deposited in rewards contract
  const stakingInfo = useStakingInfo()
  const stakingInfosWithBalance = stakingInfo?.filter(pool => JSBI.greaterThan(pool.stakedAmount.raw, BIG_INT_ZERO))
  const stakingPairs = usePairs(stakingInfosWithBalance?.map(stakingInfo => stakingInfo.tokens))

  // remove any pairs that also are included in pairs with stake in mining pool
  const v2PairsWithoutStakedAmount = allV2PairsWithLiquidity.filter(v2Pair => {
    return (
      stakingPairs
        ?.map(stakingPair => stakingPair[1])
        .filter(stakingPair => stakingPair?.liquidityToken.address === v2Pair.liquidityToken.address).length === 0
    )
  })

  const [darkMode] = useDarkModeManager()

  return (
    <>
      <div className={`pool ${!darkMode ? 'pool--light' : ''}`}>
        {/* <div className='pool__card pool-card'>
          <div className='pool-card__title'>{t('pool.card.title')}</div>
          <div className='pool-card__summary'>{t('pool.card.summary')}</div>
          <a className='pool-card__read-more' target="_blank" rel='noopener noreferrer'
            href="https://uniswap.org/docs/v2/core-concepts/pools/">
            <ButtonEmpty light>{t('pool.card.readMore')}</ButtonEmpty>
          </a>
        </div> */}
        <div className={`pool-liq ${!darkMode ? 'pool-liq--light' : ''}`}>
          <div className='pool-liq__header'>
            <div className='pool-liq__title'>{t('pool.liq.title')}</div>
            <div className='pool-liq__btn-group'>
              {/* <NavLink to={'/create/ETH'}>
                <ButtonEmpty className='pool-liq__btn' >{t('pool.liq.action.createPair')}</ButtonEmpty>
              </NavLink> */}
              <NavLink to={'/add/ETH'}>
                <ButtonEmpty className='pool-liq__btn' >{t('pool.liq.action.addLiq')}</ButtonEmpty>
              </NavLink>
            </div>
          </div>
          {!account ? (
            <div className='pool-liq__summary'>{'Connect to a wallet to view your liquidity'}</div>
          ) : v2IsLoading ? (
            <div className='pool-liq__summary'>{'Loading...'}</div>
          ) : allV2PairsWithLiquidity?.length > 0 || stakingPairs?.length > 0 ? (
            <>
              {v2PairsWithoutStakedAmount.map(v2Pair => (
                   <FullPositionCard className='mb-2' key={v2Pair.liquidityToken.address} pair={v2Pair} />
               ))}
               {stakingPairs.map(
                   (stakingPair, i) =>
                     stakingPair[1] && ( // skip pairs that arent loaded
                       <FullPositionCard className='mb-2' 
                        key={stakingInfosWithBalance[i].stakingRewardAddress}
                        pair={stakingPair[1]}
                        stakedBalance={stakingInfosWithBalance[i].stakedAmount}/>)
                  )}
            </>
          ) : (
            <div className='pool-liq__summary'>{'No liquidity found.'}</div>
          )}
          <div className='pool-liq__footer'>
            {hasV1Liquidity ? 'Uniswap V1 liquidity found!' : "Don't see a pool you joined?"}{' '}
            <NavLink to={hasV1Liquidity ? '/migrate/v1' : '/find'}>{hasV1Liquidity ? 'Migrate now.' : 'Import it.'}</NavLink>
          </div>
        </div>
      </div>
    </>
  )
}
