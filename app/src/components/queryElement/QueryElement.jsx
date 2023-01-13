import React from 'react'
import './queryElement.scss'

const QueryElement = ({ item, i }) => {
  return (
    <div className={`queryElement ${i % 2 == 0 ? 'queryElement__grayed' : ''}`}>
      <div className='queryElement__item'>
        <div>
          {item.similarity >= 0.9 ? 'Strong Match' : ''} (
          {(item.similarity * 100).toFixed()}% Confidence )
        </div>
        <div>
          File:
          <span className='queryElement__item__path'>{item.filepath}</span>
        </div>
      </div>
      <div className='queryElement__item queryElement__item--text'>
        <div>Text Chunk:</div>
        <div className='queryElement__item__content'>"{item.text}"</div>
      </div>
    </div>
  )
}

export default QueryElement
