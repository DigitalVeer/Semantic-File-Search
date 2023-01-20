import React, { useState, useRef } from 'react'
import './query.scss'

import List from '../../components/list/List'
import QueryElement from '../../components/queryElement/QueryElement'
import Search from '../../components/search/Search'
import Tooltip from '@mui/material/Tooltip'
import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'

import { searchFiles } from '../../funtions/crud'

let data = [
  {
    filepath: 'pwd/file1',
    text: 'If our love is tragedy, why are you my remedy? If our love is insanity, why are you my clarity?',
    similarity: 0.9,
  },
  {
    filepath: 'pwd/file2',
    text: 'some text2',
    similarity: 0.7,
  },
  {
    filepath: 'pwd/file1',
    text: 'If our love is tragedy, why are you my remedy? If our love is insanity, why are you my clarity?',
    similarity: 0.25,
  },
  {
    filepath: 'pwd/file2',
    text: 'some text2',
    similarity: 0.55,
  },

  {
    filepath: 'pwd/file1',
    text: 'If our love is tragedy, why are you my remedy? If our love is insanity, why are you my clarity?',
    similarity: 0.99,
  },
  {
    filepath: 'pwd/file2',
    text: 'some text2',
    similarity: 0.63,
  },
]


const BatchOptions = [{ label: 'All Batches', value: 1 }]

const matchOptions = [
  { label: 'Show All Matches', value: 0 },
  { label: 'Show Strong Matches', value: 0.9 },
  { label: 'Show Moderate and Better Matches', value: 0.5 },
]

const Query = () => {
  const [query, setQuery] = useState('')
  const [selectedMatchType, setSelectedMatchType] = useState('')
  const [selectedBatch, setSelectedBatch] = useState('')
  const [batchId, setBatchId] = useState('')
  const [results, setResults] = useState(data)

  const filteredResults = results.filter(
    (item) => item.similarity >= selectedMatchType
  )

  const onSubmit = (e) => {
    e.preventDefault()
    console.log(query, batchId)
    window.loading('Searching', 'Searching through files ...')
    searchFiles(batchId, query)
      .then((res) => {
        console.log(res)
        setResults(res.data.data)
        // if (res.data.status === 'ok') setResults(res.data.data)
        // else window.notify()
      })
      .catch((err) => {
        console.log(err)
        console.log("THERE IS AN ERROR!")
        window.notify()
      })
      .finally(window.finishLoading)
  }
  return (
    <form onSubmit={onSubmit} className='query'>
      <div className='query__title'>Query Data</div>
      <div className='query__list'>
        <div className='query__list__title'>Search Results</div>
        <List items={filteredResults} Element={QueryElement} offset='2.8' />
      </div>

      <div className='query__options'>
        <div className='query__options__title'>Options</div>

        <div className='dropdown-group'>
          <div className='dropdown-group__title'>Search</div>
          <Dropdown
            className={'d1'}
            options={matchOptions}
            onChange={(selected) => setSelectedMatchType(selected.value)}
            value={matchOptions[0]}
            placeholder='Select an option'
          />
        </div>

        <div className='dropdown-group'>
          <div className='dropdown-group__title'>Search</div>

          <Dropdown
            className={'d2'}
            options={BatchOptions}
            onChange={(selected) => setSelectedBatch(selected.value)}
            value={BatchOptions[0]}
            placeholder='Select an option'
          />
        </div>

        <div className='upload__input'>
          <Search setSearch={setBatchId} maxLength={24} />
        </div>
      </div>

      <Tooltip
        title='You an ask specific text, or you can ask a natural question'
        arrow
        placement='bottom-start'
      >
        <div className='query__input'>
          <Search setSearch={setQuery} placeholder='Query' />
        </div>
      </Tooltip>

      <button className='query__btn'>Search</button>
    </form>
  )
}

export default Query
