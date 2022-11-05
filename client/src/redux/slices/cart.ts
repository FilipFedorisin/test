import { createSlice } from '@reduxjs/toolkit'
import type { AppState } from 'src/redux/store'

export type Icart = {
  items: Array<IcartItem>
}

type IcartItem = {
  id: string
  name: string
  unit_price: number
  quantity: number
  vat: number
  thumbnail: string
}

const initialState: Icart = {
  items: [],
}

export const CartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartItemQuantity: (state, action) => {
      // if (action.payload.quantity == 0) {
      //   let elementPos = state.items.map((x) => x.id).indexOf(action.payload.id)
      //   state.items.splice(elementPos, 1)
      // }
      if (state.items.map((x) => x.id).indexOf(action.payload.id) >= 0) {
        let elementPos = state.items.map((x) => x.id).indexOf(action.payload.id)
        state.items[elementPos] = {
          ...state.items[elementPos],
          quantity: action.payload.quantity,
        }
      }
    },
    addItem: (state, action) => {
      if (state.items.map((x) => x.id).indexOf(action.payload.id) >= 0) {
        let elementPos = state.items.map((x) => x.id).indexOf(action.payload.id)
        state.items[elementPos] = {
          ...state.items[elementPos],
          quantity: state.items[elementPos].quantity + 1,
        }
      } else {
        state.items.push(action.payload)
      }
    },
    removeItem: (state, action) => {
      if (state.items.map((x) => x.id).indexOf(action.payload.id) >= 0) {
        let elementPos = state.items.map((x) => x.id).indexOf(action.payload.id)
        if (state.items[elementPos].quantity > 1) {
          state.items[elementPos] = {
            ...state.items[elementPos],
            quantity: state.items[elementPos].quantity - 1,
          }
        } else if (state.items[elementPos].quantity === 1) {
          let elementPos = state.items.map((x) => x.id).indexOf(action.payload.id)
          state.items.splice(elementPos, 1)
        }
      }
    },
    deleteItem: (state, action) => {
      if (state.items.map((x) => x.id).indexOf(action.payload.id) >= 0) {
        let elementPos = state.items.map((x) => x.id).indexOf(action.payload.id)
        state.items.splice(elementPos, 1)
      }
    },
  },
})

export const { setCartItemQuantity, addItem, removeItem, deleteItem } = CartSlice.actions

export const selectCart = (state: AppState) => state.CartReducer

export default CartSlice.reducer
