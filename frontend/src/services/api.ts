import { EventInterface } from "@/types/event";

const API_BASE_URL = "https://api.calendario.tech";

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
    const response = await fetch(
      `${API_BASE_URL}/events?date_start_range=${startDate}&date_end_range=${endDate}`
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data: EventInterface[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
};

/**
 * Fetches calendar days with events (for highlighting in calendar)
 * Note: This endpoint is not ready yet, so we'll use the events endpoint data in the meantime
 * @returns Promise with dates that have events
 */
export const fetchCalendarDays = async (): Promise<string[]> => {
  try {
    // Placeholder until /calendar-days endpoint is available
    return [];
  } catch (error) {
    console.error("Error fetching calendar days:", error);
    return [];
  }
};

export const submitEvent = async (
  eventData: EventSubmission
): Promise<EventInterface> => {
  try {
    console.log("Enviando dados para API:", eventData);

    const response = await fetch(`${API_BASE_URL}/events/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventData),
    });

    console.log("Status da resposta:", response.status);
    console.log(
      "Headers da resposta:",
      Object.fromEntries(response.headers.entries())
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error("Erro da API:", errorData);
      throw new Error(
        errorData?.detail ||
          `API error: ${response.status} - ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log("Resposta da API:", data);
    return data;
  } catch (error) {
    console.error("Erro detalhado na submissão:", error);
    throw error;
  }
};
