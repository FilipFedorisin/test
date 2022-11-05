import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit'

import CartReducer from 'src/redux/slices/cart'

import ModalReducer from 'src/redux/slices/modal'

import { userApi } from 'src/redux/services/users'

const localStorageHydrateState = () => {
  try {
    let newCartReducer = localStorage.getItem('cart')
    if (newCartReducer != null) {
      return { CartReducer: JSON.parse(newCartReducer) }
    } else {
      return undefined
    }
  } catch {
    return undefined
  }
}

const localStorageMiddleware = (store) => (next) => (action) => {
  const result = next(action)
  if (action.type?.startsWith('cart/')) {
    const cartState = store.getState().CartReducer
    localStorage.setItem('cart', JSON.stringify(cartState))
  }
  return result
}

export function makeStore() {
  return configureStore({
    reducer: {
      ModalReducer,
      CartReducer,
      [userApi.reducerPath]: userApi.reducer,
    },
    preloadedState: localStorageHydrateState(),
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(userApi.middleware, localStorageMiddleware),
  })
}

const store = makeStore()

export type AppState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppState, unknown, Action<string>>

export default store
