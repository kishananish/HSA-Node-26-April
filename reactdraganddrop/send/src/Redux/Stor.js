import { configureStore } from '@reduxjs/toolkit'
import createTask from '../Redux/Reducer'
import AuthReducer from './AuthReducer'

export const store = configureStore({
  reducer: {
    task: createTask,
    user:AuthReducer
  },
})