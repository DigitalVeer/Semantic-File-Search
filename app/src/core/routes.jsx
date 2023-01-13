import React from 'react'
import { Routes, Route } from 'react-router'
import ROUTES from 'Constants/routes'
// import loadable from '@loadable/component'

import Nav from 'Core/Nav'
import Upload from '../pages/upload/Upload'
import Query from '../pages/query/Query'
import Settings from '../pages/settings/Settings'

const AppRoutes = () => {
  return (
    <>
      <Nav />
      <Routes>
        <Route path={ROUTES.UPLOAD} element={<Upload />}></Route>
        <Route path={ROUTES.QUERY} element={<Query />}></Route>
        <Route path={ROUTES.SETTINGS} element={<Settings />}></Route>
      </Routes>
    </>
  )
}

export default AppRoutes
