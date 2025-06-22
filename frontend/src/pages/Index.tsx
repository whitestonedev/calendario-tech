import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { isSameDay, parseISO, isPast } from 'date-fns';
import { FilterState } from '@/components/EventFilters';
import TechCalendar from '@/components/TechCalendar';
import EventFilters from '@/components/EventFilters';
import EventCard from '@/components/EventCard';
import { Button } from '@/components/ui/button';
import SubmitEventDialog from '@/components/SubmitEventDialog';
import { CalendarDays } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useEventApi } from '@/hooks/useEventApi';
import { DateRange } from 'react-day-picker';
import ScrollToTopButton from '@/components/ScrollToTopButton';
import { useLocation } from 'react-router-dom';
import { RateLimitTurnstile } from '@/components/RateLimitTurnstile';
import { TypewriterEffect } from '@/components/ui/typewriter-effect';
import { cn } from '@/lib/utils';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const Index = () => {
  const location = useLocation();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [clearCalendarSelection, setClearCalendarSelection] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [eventsPerPage, setEventsPerPage] = useState(10);

  const [filters, setFilters] = useState<FilterState>({
    search: '',
    location: '',
    eventType: 'all',
    selectedTags: [],
    showFree: false,
    startDate: undefined,
    endDate: undefined,
    organization: '',
    cost: 'all',
    state: '',
  });

  const { t, language } = useLanguage();

  const {
    events,
    filteredEvents: apiFilteredEvents,
    isLoading,
    error,
    setSearchTerm,
    searchWithFilters,
    showCaptcha,
    handleTurnstileSuccess,
    handleTurnstileError,
    handleTurnstileExpired,
    handleClose,
    isValidated,
  } = useEventApi();

  // Memoize handlers to prevent unnecessary re-renders
  const handleFilterChange = useCallback(
    (newFilters: FilterState) => {
      setFilters(newFilters);
      setCurrentPage(1); // Reset to first page when filters change
      // Sync the search filter with the API search term
      if (newFilters.search !== filters.search) {
        setSearchTerm(newFilters.search);
      }
    },
    [filters.search, setSearchTerm]
  );

  const handleSearch = useCallback(
    (searchFilters: FilterState) => {
      setFilters(searchFilters);
      setCurrentPage(1); // Reset to first page when searching
      searchWithFilters(searchFilters);
    },
    [searchWithFilters]
  );

  const handleRangeSelect = useCallback((range: DateRange | undefined) => {
    setFilters((prev) => ({
      ...prev,
      startDate: range?.from,
      endDate: range?.to,
    }));
    setCurrentPage(1); // Reset to first page when date range changes
  }, []);

  const clearDateFilter = useCallback(() => {
    setSelectedDate(undefined);
    setFilters((prev) => ({
      ...prev,
      startDate: undefined,
      endDate: undefined,
    }));
    setCurrentPage(1); // Reset to first page when clearing date filter
    setClearCalendarSelection(true);
    setTimeout(() => setClearCalendarSelection(false), 100);
  }, []);

  // Otimizar o useEffect para evitar chamadas desnecessárias
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (location.state?.searchTag && !filters.selectedTags.includes(location.state.searchTag)) {
      const newFilters = {
        ...filters,
        selectedTags: [location.state.searchTag],
      };
      setFilters(newFilters);
    }
  }, [location.state?.searchTag, filters.selectedTags]);

  const eventsSource = events;

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    eventsSource.forEach((event) => {
      if (Array.isArray(event.tags)) {
        event.tags.forEach((tag) => tagSet.add(tag));
      }
    });
    return Array.from(tagSet);
  }, [eventsSource]);

  const filteredEvents = useMemo(() => {
    // Start with the API filtered events if available, otherwise filter the events source
    const filtered = events.length > 0 ? apiFilteredEvents : eventsSource;

    return filtered
      .filter((event) => {
        const eventDate = parseISO(event.start_datetime);
        const eventEndDate = parseISO(event.end_datetime);

        // Get the first available translation as fallback
        const firstAvailableTranslation = Object.values(event.intl)[0];

        // Try to get the translation for the current language, if it doesn't exist, use the first available
        const translation = event.intl[language] || firstAvailableTranslation;

        if (!translation) return false;

        // Filter by selected date
        if (selectedDate && !isSameDay(eventDate, selectedDate)) return false;

        // Filter by start date
        if (filters.startDate && eventDate < filters.startDate) return false;

        // Filter by end date
        if (filters.endDate && eventEndDate > filters.endDate) return false;

        // Filter by location
        if (
          filters.location &&
          !event.address.toLowerCase().includes(filters.location.toLowerCase())
        ) {
          return false;
        }

        // Filter by organization
        if (
          filters.organization &&
          !event.organization_name.toLowerCase().includes(filters.organization.toLowerCase())
        ) {
          return false;
        }

        // Filter by state
        if (filters.state) {
          if (event.state !== filters.state) {
            return false;
          }
        }

        // Filter by event type
        if (filters.eventType === 'online' && !event.online) return false;
        if (filters.eventType === 'in-person' && event.online) return false;

        // Filter by tags
        if (
          filters.selectedTags.length > 0 &&
          !filters.selectedTags.some((tag) => event.tags.includes(tag))
        ) {
          return false;
        }

        // Filter by cost
        if (filters.cost === 'free' && !event.is_free) return false;
        if (filters.cost === 'paid' && event.is_free) return false;

        return true;
      })
      .sort((a, b) => {
        const dateA = parseISO(a.start_datetime);
        const dateB = parseISO(b.start_datetime);
        const isPastA = isPast(parseISO(a.end_datetime));
        const isPastB = isPast(parseISO(b.end_datetime));

        // If both events are past or both are future, sort by date
        if (isPastA === isPastB) {
          return dateA.getTime() - dateB.getTime();
        }

        // If A is past and B is future, B comes first
        if (isPastA && !isPastB) {
          return 1;
        }

        // If A is future and B is past, A comes first
        return -1;
      });
  }, [selectedDate, filters, eventsSource, apiFilteredEvents, events.length, language]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when changing pages with smooth animation
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // Handle events per page change
  const handleEventsPerPageChange = (value: string) => {
    const newEventsPerPage = value === 'all' ? filteredEvents.length : parseInt(value);
    setEventsPerPage(newEventsPerPage);
    setCurrentPage(1); // Reset to first page when changing events per page
    // Scroll to top when changing events per page
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // Calculate pagination
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
  const startIndex = (currentPage - 1) * eventsPerPage;
  const endIndex = startIndex + eventsPerPage;
  const paginatedEvents = filteredEvents.slice(startIndex, endIndex);

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first page, last page, current page and neighbors
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('ellipsis');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('ellipsis');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-tech-purple mx-auto mb-3"></div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">{t('loading.events')}</h3>
          <p className="text-xs text-gray-500">{t('index.loadingEvents')}</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-3">
            <svg className="h-8 w-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-2">{t('error.loading')}</h3>
          <p className="text-xs text-gray-500 mb-4 max-w-sm mx-auto">{error}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.reload()}
            className="text-gray-600 border-gray-300 hover:bg-gray-50 hover:text-gray-700"
          >
            {t('index.tryAgain')}
          </Button>
        </div>
      );
    }

    if (paginatedEvents.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="text-gray-300 mb-3">
            <svg
              className="h-10 w-10 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33"
              />
            </svg>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-2">{t('index.noEventsFound')}</h3>
          <p className="text-xs text-gray-500 mb-4 max-w-sm mx-auto">
            {t('index.noEventsMessage')}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setFilters({
                search: '',
                location: '',
                eventType: 'all',
                selectedTags: [],
                showFree: false,
                startDate: undefined,
                endDate: undefined,
                organization: '',
                cost: 'all',
                state: '',
              });
              setSelectedDate(undefined);
              setSearchTerm('');
              setCurrentPage(1);
            }}
            className="text-gray-600 border-gray-300 hover:bg-gray-50 hover:text-gray-700"
          >
            {t('index.clearAllFilters')}
          </Button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {paginatedEvents.map((event) => (
          <div key={event.event_name} className="transition-opacity duration-200">
            <EventCard event={event} />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      {showCaptcha && (
        <RateLimitTurnstile
          onSuccess={handleTurnstileSuccess}
          onError={handleTurnstileError}
          onExpired={handleTurnstileExpired}
          onClose={handleClose}
          isValidated={isValidated}
        />
      )}

      <section className="mb-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-3">
            <img src="img/logotipo.png" alt="WhiteStone Dev Logo" className="max-h-24" />
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-2">{t('index.subtitle')}</p>
          <div className="text-sm text-tech-purple">
            <a href="https://whitestonedev.com.br/" target="_blank" rel="noopener noreferrer">
              <TypewriterEffect
                key={language}
                words={t('index.initiative')
                  .split(' ')
                  .map((word) => ({
                    text: word,
                    className: word.toLowerCase().includes('whitestone_dev')
                      ? 'text-tech-purple'
                      : 'text-neutral-600 dark:text-neutral-200',
                  }))}
                className={cn('flex justify-center items-center', 'w-full')}
                textClassName={'text-sm sm:text-base'}
                cursorClassName="bg-tech-purple"
                fontWeight="normal"
              />
            </a>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        <div className="lg:col-span-4">
          <div className="sticky top-20">
            <TechCalendar
              events={events}
              onRangeSelect={handleRangeSelect}
              clearSelection={clearCalendarSelection}
            />
            {(selectedDate || filters.startDate || filters.endDate) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearDateFilter}
                className="mt-2 text-tech-purple hover:text-tech-purple/90 w-full"
              >
                {t('index.clearDateFilter')}
              </Button>
            )}
          </div>
        </div>

        <div className="lg:col-span-8">
          <EventFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            availableTags={allTags}
            onSearch={handleSearch}
            isLoading={isLoading}
          />

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            {/* Bloco da Esquerda (Contador e Seletor) */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              {/* No mobile, este bloco contém o contador e o botão */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-tech-purple" />
                  <h2 className="text-lg sm:text-xl font-medium">
                    {filteredEvents.length}{' '}
                    {filteredEvents.length === 1
                      ? `${t('index.event')} ${t('index.eventFound')}`
                      : `${t('index.events')} ${t('index.eventsFound')}`}
                  </h2>
                </div>
                {/* Botão visível apenas no mobile */}
                <div className="sm:hidden">
                  <SubmitEventDialog />
                </div>
              </div>

              {/* Seletor de quantidade */}
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>{t('index.showPerPage')}:</span>
                <Select
                  value={eventsPerPage === filteredEvents.length ? 'all' : eventsPerPage.toString()}
                  onValueChange={handleEventsPerPageChange}
                >
                  <SelectTrigger className="w-16 h-7 text-sm border-gray-200 bg-white hover:bg-gray-50 focus:ring-1 focus:ring-tech-purple/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10" className="text-sm">
                      10
                    </SelectItem>
                    <SelectItem value="20" className="text-sm">
                      20
                    </SelectItem>
                    <SelectItem value="50" className="text-sm">
                      50
                    </SelectItem>
                    <SelectItem value="all" className="text-sm">
                      {t('index.all')}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Bloco da Direita (Botão visível apenas no desktop) */}
            <div className="hidden sm:block">
              <SubmitEventDialog />
            </div>
          </div>

          {renderContent()}

          {/* Pagination */}
          {totalPages > 1 && eventsPerPage !== filteredEvents.length && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <Pagination className="flex-wrap gap-1 flex-shrink-0">
                  <PaginationContent className="flex-wrap gap-1">
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                        className={cn(
                          'cursor-pointer transition-colors text-sm',
                          currentPage === 1
                            ? 'pointer-events-none opacity-40 text-gray-400'
                            : 'hover:bg-gray-100 hover:text-gray-700'
                        )}
                      />
                    </PaginationItem>

                    {/* Show page numbers only on larger screens */}
                    <div className="hidden sm:flex">
                      {getPageNumbers().map((page, index) => (
                        <PaginationItem key={index}>
                          {page === 'ellipsis' ? (
                            <PaginationEllipsis className="text-gray-400" />
                          ) : (
                            <PaginationLink
                              onClick={() => handlePageChange(page as number)}
                              isActive={currentPage === page}
                              className={cn(
                                'cursor-pointer transition-colors text-sm',
                                currentPage === page
                                  ? 'bg-tech-purple text-white border-tech-purple hover:bg-tech-purple/90'
                                  : 'hover:bg-gray-100 hover:text-gray-700'
                              )}
                            >
                              {page}
                            </PaginationLink>
                          )}
                        </PaginationItem>
                      ))}
                    </div>

                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          currentPage < totalPages && handlePageChange(currentPage + 1)
                        }
                        className={cn(
                          'cursor-pointer transition-colors text-sm',
                          currentPage === totalPages
                            ? 'pointer-events-none opacity-40 text-gray-400'
                            : 'hover:bg-gray-100 hover:text-gray-700'
                        )}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </div>
          )}
        </div>
      </section>

      <ScrollToTopButton />
    </div>
  );
};

export default Index;
