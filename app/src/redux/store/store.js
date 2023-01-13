import { combineReducers } from 'redux'
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import { createHashHistory } from 'history'
import { createReduxHistoryContext } from 'redux-first-history'

import userReducer from '../components/user/userSlice'

const { routerMiddleware, createReduxHistory, routerReducer } =
  createReduxHistoryContext({
    history: createHashHistory(),
  })

export const store = configureStore({
  reducer: combineReducers({
    router: routerReducer,
    user: userReducer,
  }),
  middleware: [
    ...getDefaultMiddleware({
      serializableCheck: false,
    }),
    routerMiddleware,
  ],
})

export const history = createReduxHistory(store)
