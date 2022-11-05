import { createSlice } from '@reduxjs/toolkit'
import type { AppState } from 'src/redux/store'

export interface ModalState {
  selected: 'none' | 'menu' | 'cart' | 'user'
}

const initialState: ModalState = {
  selected: 'none',
}

export const ModalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    selectMenu: (state, action) => {
      if (state.selected === action.payload) {
        state.selected = 'none'
      } else {
        state.selected = action.payload
      }
    },
    showNone: (state) => {
      state.selected = 'none'
    },
  },
})

export const { selectMenu, showNone } = ModalSlice.actions

export const selectModal = (state: AppState) => state.ModalReducer

export default ModalSlice.reducer
