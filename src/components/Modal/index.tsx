import React from 'react'
import { useTransition } from 'react-spring'
import { DialogOverlay, DialogContent } from '@reach/dialog'
import { isMobile } from 'react-device-detect'
import '@reach/dialog/styles.css'
import { useDarkModeManager } from '../../state/user/hooks'

interface ModalProps {
  isOpen: boolean
  onDismiss: () => void
  initialFocusRef?: React.RefObject<any>
  children?: React.ReactNode
}

export default function Modal({
  isOpen,
  onDismiss,
  initialFocusRef,
  children
}: ModalProps) {
  const fadeTransition = useTransition(isOpen, null, {
    config: { duration: 200 },
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 }
  })
  const [darkMode] = useDarkModeManager()
  return (
    <>
      {fadeTransition.map(
        ({ item, key, props }) =>
          item && (
            <DialogOverlay className={`modal ${!darkMode ? 'modal--light' : ''}`}
              key={key}
              style={props}
              onDismiss={onDismiss}
              initialFocusRef={initialFocusRef}
              unstable_lockFocusAcrossFrames={false}
            >
              <DialogContent className='modal__content'
                aria-label="dialog content"
              >
                {/* prevents the automatic focusing of inputs on mobile by the reach dialog */}
                {!initialFocusRef && isMobile ? <div tabIndex={1} /> : null}
                {children}
              </DialogContent>
            </DialogOverlay>
          )
      )}
    </>
  )
}
