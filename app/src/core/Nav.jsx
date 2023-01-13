import React from 'react'
import './nav.scss'

import ROUTES from 'Constants/routes'
import { NavLink } from 'react-router-dom'

import Query from '../svg/query.svg'
import Upload from '../svg/upload.svg'
import Settings from '../svg/settings.svg'

const nav = ({}) => {
  return (
    <div className='nav'>
      <div className='nav__group'>
        <NavLink className='nav__link' to={ROUTES.UPLOAD}>
          <Upload className='nav__icon' />
        </NavLink>

        <NavLink className='nav__link' to={ROUTES.QUERY}>
          <Query className='nav__icon' />
        </NavLink>

        <NavLink className='nav__link' to={ROUTES.SETTINGS}>
          <Settings className='nav__icon' />
        </NavLink>
      </div>
    </div>
  )
}

export default nav

// window.api.store.onReceive(writeConfigResponse, function (args) {
//   console.log(count)
//   console.log(args)
//   if (args.success) {
//     console.log('File deleted')
//     if (--count === 0) {
//       setIsUserLogged(false)
//       navigate('/')
//     }
//   }
// })

// window.api.store.send(writeConfigRequest, 'projects', null)
// window.api.store.send(writeConfigRequest, 'homeFolderPath', null)
// window.api.store.send(writeConfigRequest, 'user', null)
