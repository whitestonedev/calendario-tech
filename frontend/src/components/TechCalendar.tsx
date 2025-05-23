import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { isSameDay, parseISO } from "date-fns";
import { pt } from "date-fns/locale";
import { EventInterface } from "@/types/event";

interface TechCalendarProps {
  events: EventInterface[];
  onDateSelect: (date: Date | undefined) => void;
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
}

const TechCalendar: React.FC<TechCalendarProps> = ({
  events,
  onDateSelect,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );

  // Extract dates from events
  const eventDates = events.map((event) => parseISO(event.start_datetime));

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    onDateSelect(date);
  };

  return (
    <div className="calendar-container flex flex-col gap-4">
      <div className="flex justify-center">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          locale={pt}
          classNames={{
            day_selected:
              "bg-tech-purple text-primary-foreground hover:bg-tech-purple/90",
            day: "calendar-day relative",
            day_today: "calendar-day today",
          }}
          modifiers={{
            hasEvent: (date) =>
              eventDates.some((eventDate) => isSameDay(date, eventDate)),
          }}
          modifiersClassNames={{
            hasEvent: "has-event",
          }}
          className="p-3 pointer-events-auto"
        />
      </div>
    </div>
  );
};

export default TechCalendar;
