import React from 'react'
import useCopyClipboard from '../../hooks/useCopyClipboard'
import { CheckCircle, Copy } from 'react-feather'


export default function CopyHelper(props: { toCopy: string; children?: React.ReactNode; className?: string; }) {
  const [isCopied, setCopied] = useCopyClipboard()

  return (
    <div className={`${props.className || ''} cursor-pointer`} onClick={() => setCopied(props.toCopy)}>
      {isCopied ? (
         <div className='flex items-center'>
          <CheckCircle size={'16'} />
          Copied
          </div>
      ) : (
        <div className='flex items-center'>
          <Copy size={'16'} />
          {props.children || null}
        </div>
      )}
    </div>
  )
}
