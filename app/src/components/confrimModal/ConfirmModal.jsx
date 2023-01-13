import React, { useState, useEffect } from 'react'
import './confirmModal.scss'
import Modal from '../modal/Modal'

const ConfirmModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [data, setDate] = useState({
    title: 'Confirm',
    message: 'Are you sure you want to do this ?',
    onConfirm: () => {},
  })

  useEffect(() => {
    window.testConfirm = (title, message, onConfirm) => {
      if (!title || !message || !onConfirm)
        setDate({
          title: 'Confirm',
          message: 'Are you sure you want to do this ?',
          onConfirm: () => {},
        })
      else setDate({ title, message, onConfirm })
      setIsOpen(true)
    }
  })

  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <div className='modal__window confirmModal'>
        <div className='confirmModal__title'>{data.title}</div>
        <div className='confirmModal__message'>{data.message}</div>
        <div className='confirmModal__btns'>
          <div
            onClick={() => {
              data.onConfirm()
              setIsOpen(false)
            }}
            className='confirmModal__btn'
          >
            Confirm
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default ConfirmModal
