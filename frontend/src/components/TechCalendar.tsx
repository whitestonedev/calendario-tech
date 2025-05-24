import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { isSameDay, parseISO } from "date-fns";
import { pt } from "date-fns/locale";
import { EventInterface } from "@/types/event";
import { DateRange } from "react-day-picker";

interface TechCalendarProps {
  events: EventInterface[];
  onRangeSelect: (range: DateRange | undefined) => void;
  clearSelection?: boolean;
}

const TechCalendar: React.FC<TechCalendarProps> = ({
  events,
  onRangeSelect,
  clearSelection,
}) => {
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>();

  const eventDates = events.map((event) => parseISO(event.start_datetime));

  const handleCalendarSelect = (range: DateRange | undefined) => {
    if (range?.from && range?.to) {
      const adjustedRange = {
        from: range.from,
        to: new Date(range.to.setHours(23, 59, 59, 999)),
      };
      setSelectedRange(adjustedRange);
      onRangeSelect(adjustedRange);
    } else {
      setSelectedRange(range);
      onRangeSelect(range);
    }
  };

  React.useEffect(() => {
    if (clearSelection) {
      setSelectedRange(undefined);
    }
  }, [clearSelection]);

  return (
    <div className="calendar-container flex flex-col gap-4">
      <div className="flex justify-center">
        <Calendar
          mode="range"
          selected={selectedRange}
          onSelect={handleCalendarSelect}
          locale={pt}
          classNames={{
            day_range_start: `bg-tech-purple text-primary-foreground rounded-full hover:bg-tech-purple/90 focus:bg-tech-purple focus:ring-2 focus:ring-tech-purple focus:ring-offset-2`,
            day_range_end: `bg-tech-purple text-primary-foreground rounded-full hover:bg-tech-purple/90 focus:bg-tech-purple focus:ring-2 focus:ring-tech-purple focus:ring-offset-2`,
            day_range_middle:
              "bg-tech-purple-light text-purple-800 rounded-none hover:bg-tech-purple-light/90 focus:bg-tech-purple-light focus:ring-1 focus:ring-tech-purple !h-7 mt-[4.5px]",
            day_today: "bg-accent text-accent-foreground rounded-full",
          }}
          modifiers={{
            hasEvent: (date: Date) =>
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
