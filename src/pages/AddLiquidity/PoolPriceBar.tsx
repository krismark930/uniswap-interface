import { Currency, Percent, Price } from '@uniswap/sdk'
import React from 'react'
import { AutoColumn } from '../../components/Column'
import { AutoRow } from '../../components/Row'
import { ONE_BIPS } from '../../constants'
import { Field } from '../../state/mint/actions'

export function PoolPriceBar({
  currencies,
  noLiquidity,
  poolTokenPercentage,
  price
}: {
  currencies: { [field in Field]?: Currency }
  noLiquidity?: boolean
  poolTokenPercentage?: Percent
  price?: Price
}) {
  return (
    <AutoColumn gap="md">
      <AutoRow justify="space-around" gap="4px">
        <AutoColumn justify="center">
          <div className='pt-1 text-dark'>{price?.toSignificant(6) ?? '-'}</div>
          <div className='pt-1 text-dark'>
            {currencies[Field.CURRENCY_B]?.symbol} per {currencies[Field.CURRENCY_A]?.symbol}
          </div>
        </AutoColumn>
        <AutoColumn justify="center">
        <div className='pt-1 text-dark'>{price?.invert()?.toSignificant(6) ?? '-'}</div>
          <div className='pt-1 text-dark'>
            {currencies[Field.CURRENCY_A]?.symbol} per {currencies[Field.CURRENCY_B]?.symbol}
          </div>
        </AutoColumn>
        <AutoColumn justify="center">
        <div className='pt-1 text-dark'>
            {noLiquidity && price
              ? '100'
              : (poolTokenPercentage?.lessThan(ONE_BIPS) ? '<0.01' : poolTokenPercentage?.toFixed(2)) ?? '0'}
            %
            </div>
          <div className='pt-1 text-dark'>
            Share of Pool
          </div>
        </AutoColumn>
      </AutoRow>
    </AutoColumn>
  )
}
