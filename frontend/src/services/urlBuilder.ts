import { format } from 'date-fns';
import { FilterState } from '@/components/EventFilters';
import { statesOfBrazil } from '@/lib/states';
import { API_BASE_URL } from '@/config/constants';

/**
 * Builds a search URL for the events API based on the provided filters
 * @param filters - The filter state containing search parameters like name, location, dates, etc.
 * @returns A complete URL string with query parameters for the events API
 * @example
 * // Returns: https://api.calendario.tech/events?name=conference&state=SP&online=true
 * buildSearchUrl({ search: 'conference', state: 'São Paulo', eventType: 'online' })
 */
export const buildSearchUrl = (filters: FilterState): string => {
  const params = new URLSearchParams();

  // Add parameters based on filters
  if (filters.search) params.append('name', filters.search);
  if (filters.organization) params.append('org', filters.organization);
  if (filters.location) params.append('address', filters.location);

  // Convert state name to code
  if (filters.state) {
    const stateCode = statesOfBrazil.find((state) => state.label === filters.state)?.value;
    if (stateCode) {
      params.append('state', stateCode);
    }
  }

  // Convert event type to API format
  if (filters.eventType !== 'all') {
    params.append('online', filters.eventType === 'online' ? 'true' : 'false');
  }

  // Convert cost to API format
  if (filters.cost !== 'all') {
    params.append('is_free', filters.cost === 'free' ? 'true' : 'false');
  }

  // Add tags if any
  if (filters.selectedTags.length > 0) {
    params.append('tags', filters.selectedTags.join(','));
  }

  // Add dates if any
  if (filters.startDate) {
    params.append('date_start_range', format(filters.startDate, 'yyyy-MM-dd'));
  }
  if (filters.endDate) {
    params.append('date_end_range', format(filters.endDate, 'yyyy-MM-dd'));
  }

  const queryString = params.toString();
  const url = queryString ? `${API_BASE_URL}/events?${queryString}` : `${API_BASE_URL}/events`;

  return url;
};
