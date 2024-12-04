// src/store/reducers/counterSlice.ts

import { createSlice } from '@reduxjs/toolkit';

// Definindo o estado inicial
const initialState = {
  counter: 0,
};

// Criando o slice
const counterSlice = createSlice({
  name: 'counter', // Nome do slice
  initialState, // Estado inicial
  reducers: {
    increment: (state) => {
      state.counter += 1; // Incrementa o contador
    },
    decrement: (state) => {
      state.counter -= 1; // Decrementa o contador
    },
  },
});

// Exportando as ações geradas automaticamente
export const { increment, decrement } = counterSlice.actions;

// Exportando o reducer para ser usado na store
export default counterSlice.reducer;
