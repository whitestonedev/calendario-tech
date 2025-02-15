import axios from 'axios';

const EVENTS_API_BASE_URL = 'https://api.calendario.tech';

const events_api = axios.create({
  baseURL: EVENTS_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Busca eventos com filtros opcionais.
 *
 * @param {Object} filtros - Objeto contendo os filtros para a busca de eventos.
 * @param {string[]} [filtros.tags] - Filtra eventos por tags (múltiplas tags permitidas).
 * @param {string} [filtros.name] - Filtra eventos por nome (case-insensitive, partial match).
 * @param {string} [filtros.org] - Filtra eventos por organização (case-insensitive, partial match).
 * @param {boolean} [filtros.online] - Filtra por eventos online (true) ou presenciais (false).
 * @param {('free' | 'paid')} [filtros.price_type] - Filtra por tipo de preço ('free' ou 'paid').
 * @param {number} [filtros.price_min] - Filtra eventos pagos com preço mínimo.
 * @param {number} [filtros.price_max] - Filtra eventos pagos com preço máximo.
 * @param {string} [filtros.address] - Filtra eventos por endereço (case-insensitive, partial match).
 * @param {string} [filtros.date_start_range] - Filtra eventos a partir desta data de início (YYYY-MM-DD).
 * @param {string} [filtros.date_end_range] - Filtra eventos até esta data de fim (YYYY-MM-DD).
 * @param {string} [filtros.date_from] - Filtra eventos a partir desta data (YYYY-MM-DD).
 *
 * @returns {Promise}
 *
 * @throws {Error}
 */
export const getEvents = async (filtros = {}) => {
  try {
    const response = await events_api.get('/events', {
      params: filtros,
    });
    return response;
  } catch (error) {
    console.error('Erro ao buscar eventos:', error);
    throw error;
  }
};

export default events_api;
