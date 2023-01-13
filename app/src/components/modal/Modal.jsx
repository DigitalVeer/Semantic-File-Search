import React, { useState, useEffect } from 'react'
import './modal.scss'

import { Modal as NativeModal } from 'react-responsive-modal'

import CloseIcon from '../../svg/close.svg'

let id

const Modal = ({ isOpen, onClose, isNotClosable, children }) => {
  // wait for 200ms before unmountin the modal , a fix requried for the modal
  const [isOpen2, setIsOpen2] = useState(isOpen)

  useEffect(() => {
    window.clearTimeout(id)
    if (isOpen) setIsOpen2(isOpen)
    else
      id = setTimeout(() => {
        setIsOpen2(isOpen)
      }, 200)
  }, [isOpen])

  return (
    isOpen2 && (
      <NativeModal
        open={isOpen}
        onClose={onClose}
        closeOnOverlayClick={!isNotClosable}
        center
        classNames={{ modal: 'custom-modal' }}
      >
        {isNotClosable ? null : (
          <CloseIcon className='custom-modal__close' onClick={onClose} />
        )}

        {children}
      </NativeModal>
    )
  )
}

export default Modal
