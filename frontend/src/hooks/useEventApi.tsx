import { useState, useEffect, useMemo, useCallback } from 'react';
import { format, addMonths, parseISO, isSameDay } from 'date-fns';
import { fetchEvents, searchEvents } from '@/services/api';
import { EventInterface } from '@/types/event';
import { FilterState } from '@/components/EventFilters';
import { useToast } from '@/hooks/use-toast';
import { useRateLimit } from './useRateLimit';

const DEBOUNCE_DELAY = 500; // 500ms de debounce
const MAX_RETRIES = 3;

export const useEventApi = (initialSearchTerm: string = '') => {
  const [events, setEvents] = useState<EventInterface[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>(initialSearchTerm);
  const [retryCount, setRetryCount] = useState(0);
  const { toast } = useToast();
  const { checkRateLimit, CaptchaComponent } = useRateLimit();

  // Calculate date range: from today to 12 months in the future
  const dateRange = useMemo(() => {
    const today = new Date();
    const endDate = addMonths(today, 12);

    return {
      startDate: format(today, 'yyyy-MM-dd'),
      endDate: format(endDate, 'yyyy-MM-dd'),
    };
  }, []);

  // Fetch events when component mounts or date range changes
  useEffect(() => {
    const loadEvents = async () => {
      if (!checkRateLimit()) return;

      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchEvents(dateRange.startDate, dateRange.endDate);
        setEvents(data);
        setRetryCount(0);
      } catch (err) {
        setError('Failed to load events. Please try again later.');
        console.error(err);

        if (retryCount < MAX_RETRIES) {
          setRetryCount((prev) => prev + 1);
          setTimeout(loadEvents, 1000 * retryCount);
        } else {
          toast({
            title: 'Erro ao carregar eventos',
            description:
              'Não foi possível carregar os eventos. Por favor, tente novamente mais tarde.',
            variant: 'destructive',
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadEvents();
  }, [dateRange.startDate, dateRange.endDate, retryCount, toast, checkRateLimit]);

  // Filter events based on search term
  const filteredEvents = useMemo(() => {
    if (!searchTerm.trim()) return events;

    return events.filter((event) => {
      // Get first available translation as fallback
      const firstAvailableTranslation = Object.values(event.intl)[0];

      return (
        event.event_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.organization_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        firstAvailableTranslation?.short_description
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    });
  }, [events, searchTerm]);

  // Get the dates that have events (for calendar highlighting)
  const eventDates = useMemo(() => {
    return events.map((event) => parseISO(event.start_datetime));
  }, [events]);

  // Check if a specific date has events
  const hasEventsOnDate = (date: Date) => {
    return eventDates.some((eventDate) => isSameDay(eventDate, date));
  };

  // Debounced search function
  const debouncedSearch = useCallback(
    (filters: FilterState) => {
      let timeoutId: NodeJS.Timeout;

      return new Promise<void>((resolve) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(async () => {
          if (!checkRateLimit()) {
            resolve();
            return;
          }

          setIsLoading(true);
          setError(null);

          try {
            const data = await searchEvents(filters);
            setEvents(data);
            setRetryCount(0);
          } catch (err) {
            setError('Failed to fetch events.');
            console.error(err);

            if (retryCount < MAX_RETRIES) {
              setRetryCount((prev) => prev + 1);
              setTimeout(() => debouncedSearch(filters), 1000 * retryCount);
            } else {
              toast({
                title: 'Erro na busca',
                description:
                  'Não foi possível realizar a busca. Por favor, tente novamente mais tarde.',
                variant: 'destructive',
              });
            }
          } finally {
            setIsLoading(false);
            resolve();
          }
        }, DEBOUNCE_DELAY);
      });
    },
    [retryCount, toast, checkRateLimit]
  );

  const searchWithFilters = async (filters: FilterState) => {
    await debouncedSearch(filters);
  };

  return {
    events,
    filteredEvents,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    eventDates,
    hasEventsOnDate,
    searchWithFilters,
    CaptchaComponent,
  };
};
