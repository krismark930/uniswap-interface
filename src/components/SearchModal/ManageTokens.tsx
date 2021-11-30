import React, { useRef, RefObject, useCallback, useState, useMemo } from 'react'
import {  SearchInput } from './styleds'
import { TYPE, ExternalLinkIcon, TrashIcon, ButtonText, ExternalLink } from 'theme'
import { useToken } from 'hooks/Tokens'
import { useUserAddedTokens, useRemoveUserAddedToken } from 'state/user/hooks'
import { Token } from '@uniswap/sdk'
import CurrencyLogo from 'components/CurrencyLogo'
import { getEtherscanLink, isAddress } from 'utils'
import { useActiveWeb3React } from 'hooks'
import Card from 'components/Card'
import ImportRow from './ImportRow'
import useTheme from '../../hooks/useTheme'

import { CurrencyModalView } from './CurrencySearchModal'

export default function ManageTokens({
  setModalView,
  setImportToken
}: {
  setModalView: (view: CurrencyModalView) => void
  setImportToken: (token: Token) => void
}) {
  const { chainId } = useActiveWeb3React()

  const [searchQuery, setSearchQuery] = useState<string>('')
  const theme = useTheme()

  // manage focus on modal show
  const inputRef = useRef<HTMLInputElement>()
  const handleInput = useCallback(event => {
    const input = event.target.value
    const checksummedInput = isAddress(input)
    setSearchQuery(checksummedInput || input)
  }, [])

  // if they input an address, use it
  const isAddressSearch = isAddress(searchQuery)
  const searchToken = useToken(searchQuery)

  // all tokens for local lisr
  const userAddedTokens: Token[] = useUserAddedTokens()
  const removeToken = useRemoveUserAddedToken()

  const handleRemoveAll = useCallback(() => {
    if (chainId && userAddedTokens) {
      userAddedTokens.map(token => {
        return removeToken(chainId, token.address)
      })
    }
  }, [removeToken, userAddedTokens, chainId])

  const tokenList = useMemo(() => {
    return (
      chainId &&
      userAddedTokens.map(token => (
        <div className='flex justify-between w-full' key={token.address}>
          <div className='flex w-full'>
            <CurrencyLogo currency={token} size={'20px'} />
            <ExternalLink href={getEtherscanLink(chainId, token.address, 'address')}>
              <TYPE.main ml={'10px'} fontWeight={600}>
                {token.symbol}
              </TYPE.main>
            </ExternalLink>
          </div>
          <div className='flex w-full'>
            <TrashIcon onClick={() => removeToken(chainId, token.address)} />
            <ExternalLinkIcon href={getEtherscanLink(chainId, token.address, 'address')} />
          </div>
        </div>
      ))
    )
  }, [userAddedTokens, chainId, removeToken])

  return (
    <div className='w-full h-full relative'>
      <div className='flex flex-col flex-grow flex-shrink w-full'>
        <div className='p-4 grid gap-3 auto-rows-auto'>
          <div className='flex'>
            <SearchInput
              type="text"
              id="token-search-input"
              placeholder={'0x0000'}
              value={searchQuery}
              autoComplete="off"
              ref={inputRef as RefObject<HTMLInputElement>}
              onChange={handleInput}
            />
          </div>
          {searchQuery !== '' && !isAddressSearch && <TYPE.error error={true}>Enter valid token address</TYPE.error>}
          {searchToken && (
            <Card backgroundColor={theme.bg2} padding="10px 0">
              <ImportRow
                token={searchToken}
                showImportView={() => setModalView(CurrencyModalView.importToken)}
                setImportToken={setImportToken}
                style={{ height: 'fit-content' }}
              />
            </Card>
          )}
        </div>
        <div className='w-full h-1px bg-grey-purple' />
        <div className='p-4 grid gap-3 auto-rows-auto'>
          <div className='flex justify-between'>
            <TYPE.main fontWeight={600}>
              {userAddedTokens?.length} Custom {userAddedTokens.length === 1 ? 'Token' : 'Tokens'}
            </TYPE.main>
            {userAddedTokens.length > 0 && (
              <ButtonText onClick={handleRemoveAll}>
                <TYPE.blue>Clear all</TYPE.blue>
              </ButtonText>
            )}
          </div>
          {tokenList}
        </div>
      </div>
      <div className=' w-full p-5 border-t border-grey-purple'>
        <TYPE.darkGray>Tip: Custom tokens are stored locally in your browser</TYPE.darkGray>
      </div>
    </div>
  )
}
