
import { useState, useEffect, useMemo } from "react";
import { format, addMonths, parseISO, isSameDay } from "date-fns";
import { fetchEvents } from "@/services/api";
import { EventInterface } from "@/types/event";

export const useEventApi = (initialSearchTerm: string = "") => {
  const [events, setEvents] = useState<EventInterface[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>(initialSearchTerm);
  
  // Calculate date range: from today to 12 months in the future
  const dateRange = useMemo(() => {
    const today = new Date();
    const endDate = addMonths(today, 12);
    
    return {
      startDate: format(today, "yyyy-MM-dd"),
      endDate: format(endDate, "yyyy-MM-dd")
    };
  }, []);
  
  // Fetch events when component mounts or date range changes
  useEffect(() => {
    const loadEvents = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await fetchEvents(dateRange.startDate, dateRange.endDate);
        setEvents(data);
      } catch (err) {
        setError("Failed to load events. Please try again later.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadEvents();
  }, [dateRange.startDate, dateRange.endDate]);
  
  // Filter events based on search term
  const filteredEvents = useMemo(() => {
    if (!searchTerm.trim()) return events;
    
    return events.filter(event => {
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
    return events.map(event => parseISO(event.start_datetime));
  }, [events]);
  
  // Check if a specific date has events
  const hasEventsOnDate = (date: Date) => {
    return eventDates.some(eventDate => isSameDay(eventDate, date));
  };
  
  return {
    events,
    filteredEvents,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    eventDates,
    hasEventsOnDate
  };
};
