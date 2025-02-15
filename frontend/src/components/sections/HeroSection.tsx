import React, { useCallback, useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { getEvents } from '../../services/api/clients/axiosClient';
import Button from '../atoms/Button';
import MyCalendar, { EventApiData } from '../molecules/Calendar';
import EventModal from '../molecules/EventModal';

const HeroSection: React.FC = () => {
  const { t } = useTranslation();
  const [events, setEvents] = useState<EventApiData[]>([]);
  const [filters, setFilters] = useState({
    tags: '',
    price_type: '',
    date_from: '',
    name: '',
    online: '',
    org: '',
    address: '',
    date_start_range: '',
    date_end_range: '',
    price_min: '',
    price_max: '',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventApiData | null>(null);
  const [isFiltersCollapsed, setIsFiltersCollapsed] = useState(true);

  interface Filters {
    name: string;
    tags: string;
    online: string;
    price_type: string;
    org: string;
    address: string;
    date_start_range: string;
    date_end_range: string;
    date_from: string;
    price_min: string;
    price_max: string;
  }

  const fetchEventsWithFilters = useCallback(
    async (currentFilters: Filters) => {
      console.log(
        'fetchEventsWithFilters chamado com filtros:',
        currentFilters,
      );
      try {
        const params = Object.entries(currentFilters).reduce(
          (acc: { [key: string]: string }, [key, value]) => {
            if (value) {
              acc[key] = value;
            }
            return acc;
          },
          {},
        );

        console.log('Parâmetros da requisição para a API:', params);
        const response = await getEvents(params);
        setEvents(response.data || []);
      } catch (error) {
        console.error('Erro ao buscar eventos com filtros:', error);
      }
    },
    [],
  );

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('handleFilterSubmit foi chamado!');
    fetchEventsWithFilters(filters);
  };

  const handleEventSelect = (event: EventApiData) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  const toggleFiltersCollapse = () => {
    setIsFiltersCollapsed(!isFiltersCollapsed);
  };

  useEffect(() => {
    fetchEventsWithFilters({
      name: '',
      tags: '',
      online: '',
      price_type: '',
      org: '',
      address: '',
      date_start_range: '',
      date_end_range: '',
      date_from: '',
      price_min: '',
      price_max: '',
    });
  }, [fetchEventsWithFilters]);

  return (
    <section className="bg-background-light dark:bg-background-dark py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Coluna para Conteúdo do Projeto - Mantido no topo */}
          <div className="md:col-span-1 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-text-primary dark:text-text-light mb-6">
              {t('hero.title')}
            </h1>
            <p className="text-lg md:text-xl text-neutral-500 dark:text-neutral-400 mb-10">
              {t('hero.subtitle')}
            </p>
          </div>

          {/* Coluna para o Calendário - Mantido na direita */}
          <div className="md:col-span-3 h-[600px]">
            <MyCalendar events={events} onEventSelect={handleEventSelect} />
          </div>
        </div>

        {/* Formulário de Filtro - MOVIDO PARA DEPOIS DO CALENDÁRIO */}
        <form
          onSubmit={handleFilterSubmit}
          className="mt-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 shadow-sm"
        >
          <div className="p-4 md:p-6">
            <h2 className="text-lg font-semibold text-text-primary dark:text-text-light mb-3">
              {t('hero.filterFormTitle')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-3">
              {/* Filtros sempre visíveis */}
              <div className="mb-2">
                <label
                  htmlFor="tags"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  {t('hero.filterTagsLabel')}:
                </label>
                <input
                  type="text"
                  name="tags"
                  id="tags"
                  className="mt-1 p-1.5 w-full border rounded-md dark:bg-neutral-700 dark:border-neutral-600 dark:text-white text-sm focus:ring-accent-500 focus:border-accent-500"
                  placeholder={t('hero.filterTagsPlaceholder')}
                  value={filters.tags}
                  onChange={handleFilterChange}
                />
              </div>
              <div className="mb-2">
                <label
                  htmlFor="price_type"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  {t('hero.filterPriceLabel')}:
                </label>
                <select
                  name="price_type"
                  id="price_type"
                  className="mt-1 p-1.5 w-full border rounded-md dark:bg-neutral-700 dark:border-neutral-600 dark:text-white text-sm focus:ring-accent-500 focus:border-accent-500"
                  value={filters.price_type}
                  onChange={handleFilterChange}
                >
                  <option value="">{t('hero.filterPriceOptionAll')}</option>
                  <option value="free">
                    {t('hero.filterPriceOptionFree')}
                  </option>
                  <option value="paid">
                    {t('hero.filterPriceOptionPaid')}
                  </option>
                </select>
              </div>
              <div className="mb-2">
                <label
                  htmlFor="date_from"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  {t('hero.filterDateFromLabel')}:
                </label>
                <input
                  type="date"
                  name="date_from"
                  id="date_from"
                  className="mt-1 p-1.5 w-full border rounded-md dark:bg-neutral-700 dark:border-neutral-600 dark:text-white text-sm focus:ring-accent-500 focus:border-accent-500"
                  placeholder={t('hero.filterDateFromPlaceholder')}
                  value={filters.date_from}
                  onChange={handleFilterChange}
                />
              </div>
            </div>

            {/* Filtros Collapsáveis - Mantido */}
            <div
              className={`${isFiltersCollapsed ? 'hidden' : 'grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-3'} mt-2`}
            >
              <div className="mb-2">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  {t('hero.filterNameLabel')}:
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="mt-1 p-1.5 w-full border rounded-md dark:bg-neutral-700 dark:border-neutral-600 dark:text-white text-sm focus:ring-accent-500 focus:border-accent-500"
                  placeholder={t('hero.filterNamePlaceholder')}
                  value={filters.name}
                  onChange={handleFilterChange}
                />
              </div>
              <div className="mb-2">
                <label
                  htmlFor="org"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  {t('hero.filterOrgLabel')}:
                </label>
                <input
                  type="text"
                  name="org"
                  id="org"
                  className="mt-1 p-1.5 w-full border rounded-md dark:bg-neutral-700 dark:border-neutral-600 dark:text-white text-sm focus:ring-accent-500 focus:border-accent-500"
                  placeholder={t('hero.filterOrgPlaceholder')}
                  value={filters.org}
                  onChange={handleFilterChange}
                />
              </div>
              <div className="mb-2">
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  {t('hero.filterAddressLabel')}:
                </label>
                <input
                  type="text"
                  name="address"
                  id="address"
                  className="mt-1 p-1.5 w-full border rounded-md dark:bg-neutral-700 dark:border-neutral-600 dark:text-white text-sm focus:ring-accent-500 focus:border-accent-500"
                  placeholder={t('hero.filterAddressPlaceholder')}
                  value={filters.address}
                  onChange={handleFilterChange}
                />
              </div>
              <div className="mb-2">
                <label
                  htmlFor="online"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  {t('hero.filterTypeLabel')}:
                </label>
                <select
                  name="online"
                  id="online"
                  className="mt-1 p-1.5 w-full border rounded-md dark:bg-neutral-700 dark:border-neutral-600 dark:text-white text-sm focus:ring-accent-500 focus:border-accent-500"
                  value={filters.online}
                  onChange={handleFilterChange}
                >
                  <option value="">{t('hero.filterTypeOptionAll')}</option>
                  <option value="true">
                    {t('hero.filterTypeOptionOnline')}
                  </option>
                  <option value="false">
                    {t('hero.filterTypeOptionInPerson')}
                  </option>
                </select>
              </div>

              <div className="md:col-span-2 mb-2">
                <label
                  htmlFor="date_start_range"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  {t('hero.filterDateRangeLabel')}:
                </label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    name="date_start_range"
                    id="date_start_range"
                    className="mt-1 p-1.5 w-1/2 border rounded-md dark:bg-neutral-700 dark:border-neutral-600 dark:text-white text-sm focus:ring-accent-500 focus:border-accent-500"
                    placeholder={t('hero.filterDateStartPlaceholder')}
                    value={filters.date_start_range}
                    onChange={handleFilterChange}
                  />
                  <input
                    type="date"
                    name="date_end_range"
                    id="date_end_range"
                    className="mt-1 p-1.5 w-1/2 border rounded-md dark:bg-neutral-700 dark:border-neutral-600 dark:text-white text-sm focus:ring-accent-500 focus:border-accent-500"
                    placeholder={t('hero.filterDateEndPlaceholder')}
                    value={filters.date_end_range}
                    onChange={handleFilterChange}
                  />
                </div>
              </div>
              <div className="mb-2">
                <label
                  htmlFor="price_min"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  {t('hero.filterPriceMinLabel')}:
                </label>
                <input
                  type="number"
                  name="price_min"
                  id="price_min"
                  className="mt-1 p-1.5 w-full border rounded-md dark:bg-neutral-700 dark:border-neutral-600 dark:text-white text-sm focus:ring-accent-500 focus:border-accent-500"
                  placeholder={t('hero.filterPriceMinPlaceholder')}
                  value={filters.price_min}
                  onChange={handleFilterChange}
                />
              </div>
              <div className="mb-2">
                <label
                  htmlFor="price_max"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  {t('hero.filterPriceMaxLabel')}:
                </label>
                <input
                  type="number"
                  name="price_max"
                  id="price_max"
                  className="mt-1 p-1.5 w-full border rounded-md dark:bg-neutral-700 dark:border-neutral-600 dark:text-white text-sm focus:ring-accent-500 focus:border-accent-500"
                  placeholder={t('hero.filterPriceMaxPlaceholder')}
                  value={filters.price_max}
                  onChange={handleFilterChange}
                />
              </div>
            </div>

            {/* Container Flex para alinhar botões */}
            <div className="mt-4 flex justify-between items-center">
              <button
                type="button"
                onClick={toggleFiltersCollapse}
                className="text-sm text-accent-500 dark:text-accent-300 hover:underline focus:outline-none"
              >
                {isFiltersCollapsed
                  ? t('hero.filterShowMore')
                  : t('hero.filterShowLess')}
              </button>
              <Button
                type="submit"
                className="bg-primary hover:bg-accent-700 text-white font-semibold py-2 px-4 rounded-md text-sm"
              >
                {t('hero.filterButton')}
              </Button>
            </div>
          </div>
        </form>
      </div>
      {isModalOpen && selectedEvent && (
        <EventModal event={selectedEvent} onClose={handleCloseModal} />
      )}
    </section>
  );
};

export default HeroSection;
