import React from 'react'
import './listElement.scss'

const ListElement = ({ item, i }) => {
  return (
    <div className={`listElement ${i % 2 == 0 ? 'listElement__grayed' : ''}`}>
      {item.name}
    </div>
  )
}

export default ListElement
