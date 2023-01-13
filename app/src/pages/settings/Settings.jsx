import React, { useState, useEffect } from 'react'
import './settings.scss'

import FormField from '../../components/formInput/FormInput'

const Settings = () => {
  const [ip, setIp] = useState('')
  const [port, setPort] = useState('')

  const onSubmit = (e) => {
    e.preventDefault()
    try {
      window.localStorage.setItem('endPoint', JSON.stringify({ ip, port }))
      window.notify(
        'Success',
        'End Point saved successfully.',
        'rgb(86 255 125)'
      )
    } catch (err) {
      console.log(err)
      window.notify()
    }
  }

  useEffect(() => {
    try {
      let endPoint = window.localStorage.getItem('endPoint')
      if (endPoint) {
        endPoint = JSON.parse(endPoint)
        setIp(endPoint.ip)
        setPort(endPoint.port)
      }
    } catch (err) {
      console.log(err)
      window.notify('Error', 'Error reading the end point data.')
    }
  }, [])

  return (
    <div className='settings'>
      <div className='settings__title'>Settings</div>
      <form onSubmit={onSubmit} className='settings__form'>
        <FormField
          id={'ip'}
          label='IP Address'
          placeholder='IP'
          type='text'
          minLength='7'
          maxLength='15'
          size='15'
          pattern='^((\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.){3}(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$'
          value={ip}
          onChange={(e) => setIp(e.target.value)}
        />

        <FormField
          id={'port'}
          label='Port'
          type='number'
          placeholder='Port'
          max={65535}
          value={port}
          onChange={(e) => setPort(e.target.value)}
        />
        <button className='settings__btn'>Save</button>
      </form>
    </div>
  )
}

export default Settings
