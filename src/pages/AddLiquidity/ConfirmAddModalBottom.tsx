import { Currency, CurrencyAmount, Fraction, Percent } from '@uniswap/sdk'
import React from 'react'
import { ButtonPrimary } from '../../components/Button'
import { Field } from '../../state/mint/actions'
import { useDarkModeManager } from 'state/user/hooks'

export function ConfirmAddModalBottom({
  noLiquidity,
  price,
  currencies,
  parsedAmounts,
  poolTokenPercentage,
  onAdd
}: {
  noLiquidity?: boolean
  price?: Fraction
  currencies: { [field in Field]?: Currency }
  parsedAmounts: { [field in Field]?: CurrencyAmount }
  poolTokenPercentage?: Percent
  onAdd: () => void
}) {
  const [darkMode] = useDarkModeManager()
  return (
    <div className={`${darkMode ? 'text-white' : 'text-dark'}`}>
      <div className='flex justify-between'>
        <div>{currencies[Field.CURRENCY_A]?.symbol} Deposited</div>
        <div>{parsedAmounts[Field.CURRENCY_A]?.toSignificant(6)}</div>
      </div>
      <div className='flex justify-between'>
        <div>{currencies[Field.CURRENCY_B]?.symbol} Deposited</div>
        <div>{parsedAmounts[Field.CURRENCY_B]?.toSignificant(6)}</div>
      </div>
      <div className='flex justify-between'>
        <div>Rates</div>
        <div>
          {`1 ${currencies[Field.CURRENCY_A]?.symbol} = ${price?.toSignificant(4)} ${
            currencies[Field.CURRENCY_B]?.symbol
          }`}
        </div>
      </div>
      <div className='flex justify-end'>
        <div>
          {`1 ${currencies[Field.CURRENCY_B]?.symbol} = ${price?.invert().toSignificant(4)} ${
            currencies[Field.CURRENCY_A]?.symbol
          }`}
        </div>
      </div>
      <div className='flex justify-between'>
        <div>Share of Pool:</div>
        <div>{noLiquidity ? '100' : poolTokenPercentage?.toSignificant(4)}%</div>
      </div>
      <ButtonPrimary className='mt-5' onClick={onAdd}>
        {noLiquidity ? 'Create Pool & Supply' : 'Confirm Supply'}
      </ButtonPrimary>
    </div>
  )
}
