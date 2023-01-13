import React, { useState, useEffect } from 'react'
import './loadingModal.scss'

import Modal from '../modal/Modal'
import BoxesSpinner from '../spinners/BoxesSpinner'

const LoadingModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [data, setDate] = useState({
    title: 'Error',
    message: 'Something went wrong.',
    color: 'green',
  })

  useEffect(() => {
    window.loading = (title, message, color) => {
      if (!title || !message)
        setDate({
          title: 'Loading',
          message: 'Something getting done.',
          color: 'green',
        })
      else setDate({ title, message, color })
      setIsOpen(true)
    }

    window.finishLoading = () => {
      setIsOpen(false)
    }
  })

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      isNotClosable={true}
    >
      <div className='modal__window loadingModal'>
        <div className='loadingModal__title'>{data.title}</div>
        <div className='loadingModal__message'>{data.message}</div>

        <div className='loadingModal__spinner'>
          <BoxesSpinner
            color={
              data.color
                ? data.color === 'green'
                  ? 'rgb(86 255 125)'
                  : 'rgb(255, 86, 86)'
                : 'rgb(86 255 125)'
            }
          />
        </div>
      </div>
    </Modal>
  )
}

export default LoadingModal
