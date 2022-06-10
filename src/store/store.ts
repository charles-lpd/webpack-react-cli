import {
  configureStore,
  ThunkAction,
  Action,
  combineReducers
} from '@reduxjs/toolkit'

import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import aboutStore from './about'

const persistConfig = {
  key: 'react',
  storage: storage
}
const reduxReducer = persistReducer(
  persistConfig,
  combineReducers({
    aboutStore
  })
)
export const store = configureStore({
  reducer: reduxReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})
persistStore(store)
export type AppDispatch = typeof store.dispatch

export type RootState = ReturnType<typeof store.getState>

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
