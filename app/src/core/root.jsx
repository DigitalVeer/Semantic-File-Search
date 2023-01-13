import React from 'react'
import { HistoryRouter } from 'redux-first-history/rr6'
import { Provider } from 'react-redux'
import AppRoutes from 'Core/routes'
import './root.scss'

import Axios from 'axios'

import NotifyModal from '../components/notifiyModal/NotifyModal'
import LoadingModal from '../components/loadingModal/LoadingModal'
import ConfirmModal from '../components/confrimModal/ConfirmModal'

// Axios.defaults.baseURL = 'http://18.117.221.18:8080'
Axios.defaults.baseURL = 'http://localhost:8080'

const Root = ({ store, history }) => {
  return (
    <React.Fragment>
      <Provider store={store}>
        <HistoryRouter history={history}>
          <NotifyModal />
          <LoadingModal />
          <ConfirmModal />
          <AppRoutes></AppRoutes>
        </HistoryRouter>
      </Provider>
    </React.Fragment>
  )
}

export default Root

File.prototype.toObject = function () {
  return Object({
    lastModified: parseInt(this.lastModified),
    lastModifiedDate: String(this.lastModifiedDate),
    name: String(this.name),
    path: String(this.path),
    size: parseInt(this.size),
    type: String(this.type),
  })
}

FileList.prototype.toArray = function () {
  return Array.from(this).map(function (file) {
    return file.toObject()
  })
}
