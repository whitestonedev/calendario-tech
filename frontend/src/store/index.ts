import { configureStore } from '@reduxjs/toolkit';

import counterReducer from './reducers/counterSlice';
import themeReducer from './reducers/themeSlice';

const store = configureStore({
  reducer: {
    counter: counterReducer,
    theme: themeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
