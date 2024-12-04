// src/api/services/loremService.ts
import axiosClient from '../clients/axiosClient';
import { LOREM_API_ENDPOINT } from '../endpoints/lorem';

export const fetchLoremText = async () => {
  try {
    const response = await axiosClient.get(LOREM_API_ENDPOINT);
    return response.data[0].body;
  } catch (error) {
    console.error('Erro ao buscar texto lorem:', error);
    throw new Error('Erro ao buscar texto lorem');
  }
};
