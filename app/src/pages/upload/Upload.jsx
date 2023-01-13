import React, { useRef, useState, useMemo, useEffect } from 'react'
import './upload.scss'

import List from '../../components/list/List'
import ListElement from '../../components/listElement/ListElement'
import Search from '../../components/search/Search'
import Tooltip from '@mui/material/Tooltip'

import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'

import { getSavedBatches, saveBatch } from '../../funtions'
import { uploadFiles } from '../../funtions/crud'

import { debounce } from 'lodash'
import { getEndPoint } from '../../funtions'

const options = [
  { value: '.doc,.docx,.txt,.pdf', label: 'All Items' },
  { value: '.txt', label: 'Text Files' },
  { value: '.pdf', label: 'PDF Documents' },
  { value: '.doc,.docx', label: 'Word Documents' },
]
const defaultOption = options[0]

const getMbSize = (files) => {
  if (files.length === 0) return 0
  let sizeInBytes = 0
  files.map((file) => {
    sizeInBytes += file.size
  })

  return (sizeInBytes / (1024 * 1024)).toFixed(1)
}

const Upload = () => {
  const inputRef = useRef(null)
  const [acceptedFiles, setAcceptedFiles] = useState('.doc,.docx,.txt,.pdf')
  const [selectedFiles, setSelectedFiles] = useState([])
  const [batchId, setBatchId] = useState('')
  const [previousBatches, setPreviousBatches] = useState([])

  const onChange = (event) => {
    const files = event.target.files.toArray()
    let paths = selectedFiles.map((file) => file.path)
    let newFiles = files.filter((file) => !paths.includes(file.path))
    setSelectedFiles([...selectedFiles, ...newFiles])
  }

  const debouncedSubmitFiles = useMemo(
    () =>
      debounce(
        (e) => {
          e.preventDefault()
          console.log('reading -- ', selectedFiles)
          if (selectedFiles.length === 0)
            return window.notify(
              'No Files',
              'Select some files before uploading !'
            )

          if (!getEndPoint())
            return window.notify('End Point', 'No end point is specified !')

          window.loading('Uploading Files', 'Perparing Files ...')
          window.api.send('getText', selectedFiles)
        },
        1000,
        { leading: true, trailing: false }
      ),
    [selectedFiles]
  )

  useEffect(() => {
    let getTextReplay = (err, data) => {
      console.log('call')

      console.log(err, data)
      if (err) {
        window.notify()
        window.finishLoading()
        return
      }

      window.loading('Uploading Files', 'Sending Files ...')

      uploadFiles(data, batchId)
        .then((res) => {
          window.notify(
            'Success',
            'Files uploaded successfully.',
            'rgb(86 255 125)'
          )
          setPreviousBatches(saveBatch(data.length, batchId))
          setSelectedFiles([])
          setBatchId('')
        })
        .catch((err) => {
          window.notify()
        })
        .finally(window.finishLoading)
    }

    window.api.on('getText-replay', getTextReplay)
    setPreviousBatches(getSavedBatches())
    return () => window.api.clearAll()
  }, [batchId])

  return (
    <form onSubmit={debouncedSubmitFiles} className='upload'>
      <div className='upload__title'>Upload Data</div>
      <div className='upload__list'>
        <div className='upload__list__title'>Selected Files</div>
        <List items={selectedFiles} Element={ListElement} offset='2.8' />
      </div>

      <div className='upload__summary'>
        <div className='upload__summary__item'>
          <div className='upload__summary__item__title'>Files Selected</div>
          {selectedFiles.length} Files
        </div>

        <div className='upload__summary__item'>
          <div className='upload__summary__item__title'>Batch Size</div>
          {getMbSize(selectedFiles)} MB
        </div>

        <div className='upload__summary__item'>
          <div className='upload__summary__item__title'>Current Batch ID</div>
          {batchId ? batchId : 'None'}
        </div>
      </div>
      <button className='upload__btn upload__btn--upload'>Upload Files</button>

      <div className='upload__input__group'>
        <div
          onClick={() => inputRef.current.click()}
          className='upload__btn upload__btn--select'
        >
          Select Files
          <input
            ref={inputRef}
            type='file'
            id='input'
            accept={acceptedFiles}
            multiple
            style={{ display: 'none' }}
            onChange={onChange}
          />
        </div>

        <Tooltip title='Your Searchable Index' arrow placement='right'>
          <div className='upload__input'>
            <Search setSearch={setBatchId} maxLength={24} />
          </div>
        </Tooltip>

        <div className='dropdown-group'>
          <div className='dropdown-group__title'>Search</div>

          <Dropdown
            options={options}
            onChange={(selected) => setAcceptedFiles(selected.value)}
            value={defaultOption}
            placeholder='Select an option'
          />
        </div>
      </div>

      <div className='upload__batches'>
        <div className='upload__batches__title'>Previous Batches</div>
        <div className='upload__batches__body'>
          {previousBatches.map((item, i) => (
            <div key={i} className='upload__batches__item'>
              <div className='upload__batches__item__title'>{item.title}</div>
              <div>Upload: {item.date}</div>
              <div>Files: {item.files} Files</div>
            </div>
          ))}
        </div>
      </div>
    </form>
  )
}

export default Upload
