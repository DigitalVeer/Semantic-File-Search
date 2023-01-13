import React, { useRef } from 'react'
import './list.scss'

const List = ({
  items,
  Element,
  emptyMessage,
  customOnClick,
  offset,
  marginTop,
  ElementProps,
}) => {
  const tbodyRef = useRef(null)

  // useEffect(() => {
  //   window.addEventListener('resize', () => addTablePadding(tbodyRef.current))
  //   return () => {
  //     window.removeEventListener('resize', () =>
  //       addTablePadding(tbodyRef.current)
  //     )
  //   }
  // }, [])

  return (
    <div
      style={{
        height: offset ? `calc(100% - ${offset}rem)` : '100%',
        marginTop,
      }}
      className='list'
    >
      <div ref={tbodyRef} className='list__body'>
        {items.length !== 0 ? (
          items.map((item, i) => (
            <div key={i} className='list__row__container'>
              <Element
                {...ElementProps}
                item={item}
                customOnClick={customOnClick}
                i={i}
              />
            </div>
          ))
        ) : (
          <div className='list__empty'>{emptyMessage}</div>
        )}
      </div>
    </div>
  )
}

export default List

export const addTablePadding = (ref) => {
  if (ref) {
    let hasVerticalScrollbar = ref.scrollHeight > ref.clientHeight
    if (hasVerticalScrollbar) {
      ref.style.width = 'calc(100% + 1.32rem)'
    } else {
      ref.style.width = 'calc(100% + 0.84rem)'
    }
  }
}
