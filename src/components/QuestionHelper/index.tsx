import React, { useCallback, useState } from 'react'
import {ReactComponent as Question} from 'assets/svg/info-circle.svg'
import Tooltip from '../Tooltip'

export default function QuestionHelper({ text, className = '' }: { text: string, className?: string }) {
  const [show, setShow] = useState<boolean>(false)

  const open = useCallback(() => setShow(true), [setShow])
  const close = useCallback(() => setShow(false), [setShow])

  return (
    <span className='ml-1'>
      <Tooltip text={text} show={show}>
        <div className={className} onClick={open} onMouseEnter={open} onMouseLeave={close}>
          <Question />
        </div>
      </Tooltip>
    </span>
  )
}

export function LightQuestionHelper({ text, className = '' }: { text: string, className?: string }) {
  const [show, setShow] = useState<boolean>(false)

  const open = useCallback(() => setShow(true), [setShow])
  const close = useCallback(() => setShow(false), [setShow])

  return (
    <span className='ml-1'>
      <Tooltip text={text} show={show}>
        <div className={className} onClick={open} onMouseEnter={open} onMouseLeave={close}>
        <Question />
        </div>
      </Tooltip>
    </span>
  )
}
