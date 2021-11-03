import React, { useState } from 'react'
import { ArrowLeft } from 'react-feather'
import { Text } from 'rebass'
import { CloseIcon } from 'theme'
import styled from 'styled-components'
import { Token } from '@uniswap/sdk'
import { ManageLists } from './ManageLists'
import ManageTokens from './ManageTokens'
import { TokenList } from '@uniswap/token-lists'
import { CurrencyModalView } from './CurrencySearchModal'

const ToggleOption = styled.div<{ active?: boolean }>`
  width: 48%;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  font-weight: 600;
  background-color: ${({ theme, active }) => (active ? theme.bg1 : theme.bg3)};
  color: ${({ theme, active }) => (active ? theme.text1 : theme.text2)};
  user-select: none;

  :hover {
    cursor: pointer;
    opacity: 0.7;
  }
`

export default function Manage({
  onDismiss,
  setModalView,
  setImportList,
  setImportToken,
  setListUrl
}: {
  onDismiss: () => void
  setModalView: (view: CurrencyModalView) => void
  setImportToken: (token: Token) => void
  setImportList: (list: TokenList) => void
  setListUrl: (url: string) => void
}) {
  // toggle between tokens and lists
  const [showLists, setShowLists] = useState(true)

  return (
    <div className='w-full relative pb-8'>
      <div className='p-5 grid gap-4 auto-rows-auto'>
        <div className='modal-header'>
          <ArrowLeft style={{ cursor: 'pointer' }} onClick={() => setModalView(CurrencyModalView.search)} />
          <Text fontWeight={500} fontSize={20}>
            Manage
          </Text>
          <CloseIcon onClick={onDismiss} />
        </div>
      </div>
      <div className='pt-5 pb-0 px-5 grid gap-4 auto-rows-auto'>
        <div className='flex justify-between p-1 bg-inp-dark'>
          <ToggleOption onClick={() => setShowLists(!showLists)} active={showLists}>
            Lists
          </ToggleOption>
          <ToggleOption onClick={() => setShowLists(!showLists)} active={!showLists}>
            Tokens
          </ToggleOption>
        </div>
      </div>
      {showLists ? (
        <ManageLists setModalView={setModalView} setImportList={setImportList} setListUrl={setListUrl} />
      ) : (
        <ManageTokens setModalView={setModalView} setImportToken={setImportToken} />
      )}
    </div>
  )
}
