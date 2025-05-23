import React, { useState, useMemo } from "react";
import { isSameDay, parseISO } from "date-fns";
import { FilterState } from "@/components/EventFilters";
import TechCalendar from "@/components/TechCalendar";
import EventFilters from "@/components/EventFilters";
import EventCard from "@/components/EventCard";
import { Button } from "@/components/ui/button";
import SubmitEventDialog from "@/components/SubmitEventDialog";
import { CalendarDays } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useEventApi } from "@/hooks/useEventApi";
import { DateRange } from "react-day-picker";

const Index = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [clearCalendarSelection, setClearCalendarSelection] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    location: "",
    eventType: "all",
    selectedTags: [],
    showFree: false,
    startDate: undefined,
    endDate: undefined,
    organization: "",
    cost: "all",
  });

  const { t, language } = useLanguage();

  const {
    events,
    filteredEvents: apiFilteredEvents,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    eventDates,
  } = useEventApi();

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

        const isPaid = /\d/.test(translation.cost);

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
          !event.organization_name
            .toLowerCase()
            .includes(filters.organization.toLowerCase())
        ) {
          return false;
        }

        // Filter by event type
        if (filters.eventType === "online" && !event.online) return false;
        if (filters.eventType === "in-person" && event.online) return false;

        // Filter by tags
        if (
          filters.selectedTags.length > 0 &&
          !filters.selectedTags.some((tag) => event.tags.includes(tag))
        ) {
          return false;
        }

        // Filter by cost
        if (filters.cost === "free" && isPaid) return false;
        if (filters.cost === "paid" && !isPaid) return false;

        return true;
      })
      .sort((a, b) => {
        const dateA = parseISO(a.start_datetime);
        const dateB = parseISO(b.start_datetime);
        return dateA.getTime() - dateB.getTime();
      });
  }, [
    selectedDate,
    filters,
    eventsSource,
    apiFilteredEvents,
    events.length,
    language,
  ]);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  const handleRangeSelect = (range: DateRange | undefined) => {
    setFilters((prev) => ({
      ...prev,
      startDate: range?.from,
      endDate: range?.to,
    }));
  };

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    // Sync the search filter with the API search term
    if (newFilters.search !== filters.search) {
      setSearchTerm(newFilters.search);
    }
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setFilters({
      ...filters,
      search: term,
    });
  };

  const clearDateFilter = () => {
    setSelectedDate(undefined);
    setFilters((prev) => ({
      ...prev,
      startDate: undefined,
      endDate: undefined,
    }));
    setClearCalendarSelection(true);
    // Reset the clear flag after a short delay
    setTimeout(() => setClearCalendarSelection(false), 100);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium mb-2">{t("loading.events")}</h3>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium mb-2 text-red-500">
            {t("error.loading")}
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
        </div>
      );
    }

    if (filteredEvents.length === 0) {
      return (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium mb-2">
            {t("index.noEventsFound")}
          </h3>
          <p className="text-gray-600 mb-4">{t("index.noEventsMessage")}</p>
          <Button
            variant="outline"
            onClick={() => {
              setFilters({
                search: "",
                location: "",
                eventType: "all",
                selectedTags: [],
                showFree: false,
                startDate: undefined,
                endDate: undefined,
                organization: "",
                cost: "all",
              });
              setSelectedDate(undefined);
              setSearchTerm("");
            }}
          >
            {t("index.clearAllFilters")}
          </Button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredEvents.map((event) => (
          <EventCard key={event.event_name} event={event} />
        ))}
      </div>
    );
  };

  return (
    <div>
      <section className="mb-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-3">
            <img
              src="img/logotipo.png"
              alt="WhiteStone Dev Logo"
              className="max-h-24"
            />
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-2">
            {t("index.subtitle")}
          </p>
          <p className="text-sm text-tech-purple">
            <a
              href="https://whitestonedev.com.br/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-tech-purple/80 font-medium"
            >
              {t("index.initiative")}
            </a>
          </p>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        <div className="lg:col-span-4">
          <div className="sticky top-4">
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
                {t("index.clearDateFilter")}
              </Button>
            )}
          </div>
        </div>

        <div className="lg:col-span-8">
          <EventFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            availableTags={allTags}
          />

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-tech-purple" />
              <h2 className="text-xl font-medium">
                {filteredEvents.length}{" "}
                {filteredEvents.length === 1
                  ? t("index.event")
                  : t("index.events")}{" "}
                {t("index.eventsFound")}
              </h2>
            </div>
            <SubmitEventDialog />
          </div>

          {renderContent()}
        </div>
      </section>
    </div>
  );
};

export default Index;
