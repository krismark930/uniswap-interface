import { Placement } from '@popperjs/core'
import React, { useCallback, useState } from 'react'
import { usePopper } from 'react-popper'
import styled from 'styled-components'
import useInterval from '../../hooks/useInterval'
import Portal from '@reach/portal'
import { useDarkModeManager } from 'state/user/hooks'

const ReferenceElement = styled.div`
  display: inline-block;
`

export interface PopoverProps {
  content: React.ReactNode
  className?: string,
  show: boolean
  children: React.ReactNode
  placement?: Placement
}

export default function Popover({ content, show, children, placement = 'auto' , className = ''}: PopoverProps) {
  const [referenceElement, setReferenceElement] = useState<HTMLDivElement | null>(null)
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(null)
  const [arrowElement, setArrowElement] = useState<HTMLDivElement | null>(null)
  const { styles, update, attributes } = usePopper(referenceElement, popperElement, {
    placement,
    strategy: 'fixed',
    modifiers: [
      { name: 'offset', options: { offset: [8, 8] } },
      { name: 'arrow', options: { element: arrowElement } }
    ]
  })
  const [darkMode] = useDarkModeManager()
  const updateCallback = useCallback(() => {
    update && update()
  }, [update])
  useInterval(updateCallback, show ? 100 : null)

  return (
    <>
      <ReferenceElement ref={setReferenceElement as any}>{children}</ReferenceElement>
      <Portal>
        <div className={`z-max border ${className} 
          ${darkMode ? 'bg-inp-dark text-white border-grey-purple' : 'bg-inp-light border-grey-purple'}
          ${show ? 'opacity-1 visible' : 'invisible opacity-0'}
        `} ref={setPopperElement as any} style={styles.popper} {...attributes.popper}>
          {content}
          <div
            className={`arrow ${!darkMode ? 'arrow--light' : ''} arrow-${attributes.popper?.['data-popper-placement'] ?? ''}`}
            ref={setArrowElement as any}
            style={styles.arrow}
            {...attributes.arrow}
          />
        </div>
      </Portal>
    </>
  )
}
