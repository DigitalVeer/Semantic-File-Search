import React, { useState, useEffect } from 'react'
import './notifyModal.scss'

import Modal from '../modal/Modal'

const NotifyModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [data, setDate] = useState({
    title: 'Error',
    message: 'Something went wrong.',
  })

  useEffect(() => {
    window.notify = (title, message, color) => {
      if (!title || !message)
        setDate({ title: 'Error', message: 'Something went wrong.' })
      else setDate({ title, message, color })
      setIsOpen(true)
    }
  })

  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <div className='modal__window notifyModal'>
        <div className='notifyModal__title'>{data.title}</div>
        <div
          style={{ color: data.color ? data.color : 'rgb(255, 86, 86)' }}
          className='notifyModal__message'
        >
          {data.message}
        </div>
        <div className='notifyModal__btns'>
          <div onClick={() => setIsOpen(false)} className='notifyModal__btn'>
            OK
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default NotifyModal
