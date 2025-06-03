import { EventInterface } from '@/types/event';
import { FilterState } from '@/components/EventFilters';
import { buildSearchUrl } from './urlBuilder';
import { API_BASE_URL } from '@/config/constants';

export interface ApiResponse {
  events: EventInterface[];
}

export interface EventSubmission {
  organization_name: string;
  event_name: string;
  start_datetime: string;
  end_datetime: string;
  address: string;
  maps_link: string;
  online: boolean;
  is_free: boolean;
  event_link: string;
  tags: string[];
  state: string;
  intl: {
    [key: string]: {
      event_edition: string;
      cost: number;
      currency: string | null;
      banner_link: string;
      short_description: string;
    };
  };
}

interface CalendarDay {
  date: string;
  event_ids: number[];
}

/**
 * Fetches events from the API within a specified date range
 * @param startDate Start date in YYYY-MM-DD format
 * @param endDate End date in YYYY-MM-DD format
 * @returns Promise with event data
 */
export const fetchEvents = async (
  startDate: string,
  endDate: string
): Promise<EventInterface[]> => {
  try {
    const url = `${API_BASE_URL}/events?date_start_range=${startDate}&date_end_range=${endDate}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data: EventInterface[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
};

/**
 * Fetches calendar days with events (for highlighting in calendar)
 * @returns Promise with dates that have events and their respective event IDs
 */
export const fetchCalendarDays = async (): Promise<CalendarDay[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/events/calendar`);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data: CalendarDay[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching calendar days:', error);
    return [];
  }
};

export const submitEvent = async (eventData: EventSubmission): Promise<EventInterface> => {
  try {
    const response = await fetch(`${API_BASE_URL}/events/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(eventData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('Erro da API:', errorData);

      if (errorData?.error?.includes('Event already exists')) {
        throw new Error('error.duplicateEvent');
      }

      throw new Error(
        errorData?.detail || `API error: ${response.status} - ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro detalhado na submissão:', error);
    throw error;
  }
};

export const searchEvents = async (filters: FilterState): Promise<EventInterface[]> => {
  try {
    const url = buildSearchUrl(filters);
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data: EventInterface[] = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to search events.', error);
    return [];
  }
};
