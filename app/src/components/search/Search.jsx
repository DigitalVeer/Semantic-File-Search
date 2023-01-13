import React from 'react'
import './search.scss'
import Icon from './search.svg'

const Search = ({ setSearch, ...props }) => {
  return (
    <div className='search'>
      <input
        className='search__input'
        placeholder='Batch Id'
        spellCheck={false}
        onChange={(e) => setSearch(e.target.value)}
        {...props}
        required
        // minLength={3}
      ></input>
      <Icon className='search__icon' />
    </div>
  )
}

export default Search
