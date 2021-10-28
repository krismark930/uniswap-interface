import React, { useContext } from 'react'
import { Link, RouteComponentProps, withRouter } from 'react-router-dom'
import { Token, TokenAmount, WETH } from '@uniswap/sdk'

import { Text } from 'rebass'
import { AutoColumn } from '../Column'
import { ButtonSecondary } from '../Button'
import { RowFixed } from '../Row'
import { useActiveWeb3React } from '../../hooks'
import { ThemeContext } from 'styled-components'

interface PositionCardProps extends RouteComponentProps<{}> {
  token: Token
  V1LiquidityBalance: TokenAmount
}

function V1PositionCard({ token, V1LiquidityBalance }: PositionCardProps) {
  const theme = useContext(ThemeContext)

  const { chainId } = useActiveWeb3React()


  return (
    <div className='pool-card-clip pool-card-gradient p-4'>
      <AutoColumn gap="12px">
        <div className='flex justify-between h-24px'>
          <RowFixed>
            <Text fontWeight={500} fontSize={20} style={{ marginLeft: '' }}>
              {`${chainId && token.equals(WETH[chainId]) ? 'WETH' : token.symbol}/ETH`}
            </Text>
            <Text
              fontSize={12}
              fontWeight={500}
              ml="0.5rem"
              px="0.75rem"
              py="0.25rem"
              style={{ borderRadius: '1rem' }}
              backgroundColor={theme.yellow1}
              color={'black'}
            >
              V1
            </Text>
          </RowFixed>
        </div>

        <AutoColumn gap="8px">
          <div className='flex justify-between mt-2'>
            <ButtonSecondary width="68%" as={Link} to={`/migrate/v1/${V1LiquidityBalance.token.address}`}>
              Migrate
            </ButtonSecondary>

            <ButtonSecondary
              style={{ backgroundColor: 'transparent' }}
              width="28%"
              as={Link}
              to={`/remove/v1/${V1LiquidityBalance.token.address}`}
            >
              Remove
            </ButtonSecondary>
          </div>
        </AutoColumn>
      </AutoColumn>
    </div>
  )
}

export default withRouter(V1PositionCard)
