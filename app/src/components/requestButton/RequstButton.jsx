import React, { useEffect, useRef } from 'react'
import './requstButton.scss'

const RequstButton = ({
  className,
  isLoading,
  isSuccess,
  label,
  color,
  onClick,
}) => {
  const btnRef = useRef(null)

  useEffect(() => {
    if (isLoading) btnRef.current.classList.add('loading-btn--pending')
    else btnRef.current.classList.remove('loading-btn--pending')

    // window.setTimeout(() => {
    //   btnRef.current.classList.remove(pendingClassName)
    //   btnRef.current.classList.add(successClassName)

    //   window.setTimeout(
    //     () => btnRef.current.classList.remove(successClassName),
    //     stateDuration
    //   )
    // }, stateDuration)
  }, [isLoading])

  useEffect(() => {
    if (isSuccess === null) return
    if (isSuccess) {
      btnRef.current.classList.add('loading-btn--success')
      window.setTimeout(
        () => btnRef.current.classList.remove('loading-btn--success'),
        1000
      )
    } else {
      btnRef.current.classList.add('loading-btn--fail')
      window.setTimeout(
        () => btnRef.current.classList.remove('loading-btn--fail'),
        1000
      )
    }
  }, [isSuccess])

  return (
    <span
      onClick={onClick}
      style={{ '--color': color }}
      className={`loading-btn-wrapper ${className}
      }`}
    >
      <button ref={btnRef} className='loading-btn js_success-animation-trigger'>
        <span className='loading-btn__text'>{label}</span>
      </button>
    </span>
  )
}

export default RequstButton
