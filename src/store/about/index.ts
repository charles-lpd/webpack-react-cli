import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { updateBook } from '../../libs/api'
import { Book } from '../../libs/types'
interface About {
  name: string
  age: number
  book: Book[]
}
const initialState: About = {
  name: '刘',
  age: 22,
  book: []
}

export const updateAsyncBook= createAsyncThunk('async/book', async () => {
  const data = await updateBook()
  return data
})
export const aboutInfo = createSlice({
  name: 'about',
  initialState,
  reducers: {
    updateAge: (state: About, action: PayloadAction<number>) => {
      console.log(state, action.payload)
      state.age = action.payload
    }
  },
  extraReducers(builder) {
    builder.addCase(
      updateAsyncBook.fulfilled,
      (state: About, action: PayloadAction<Book>) => {
        state.book.push(action.payload)
      }
    )
  }
})

export const { actions, reducer } = aboutInfo
export const { updateAge } = actions

export default reducer
