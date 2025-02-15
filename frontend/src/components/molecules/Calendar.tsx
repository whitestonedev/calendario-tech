import { format, getDay, parse, startOfWeek } from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export interface EventApiData {
  address: string;
  end_datetime: string;
  event_link: string;
  event_name: string;
  intl: {
    'en-us': {
      banner_link: string;
      cost: string;
      event_edition: string;
      short_description: string;
    };
    'pt-br': {
      banner_link: string;
      cost: string;
      event_edition: string;
      short_description: string;
    };
  };
  maps_link: string;
  online: boolean;
  organization_name: string;
  start_datetime: string;
  tags: string[];
}

interface MyCalendarProps {
  events: EventApiData[];
  onEventSelect: (event: EventApiData) => void;
}

const MyCalendar: React.FC<MyCalendarProps> = ({ events, onEventSelect }) => {
  const formattedEvents = events.map((event) => ({
    title: event.event_name,
    start: parse(event.start_datetime, "yyyy-MM-dd'T'HH:mm:ss", new Date()),
    end: parse(event.end_datetime, "yyyy-MM-dd'T'HH:mm:ss", new Date()),
    allDay: false,
    originalEvent: event,
  }));

  const handleEventClick = (event: { originalEvent: EventApiData }) => {
    onEventSelect(event.originalEvent);
  };

  return (
    <div className="h-full w-full rbc-container">
      <Calendar
        localizer={localizer}
        events={formattedEvents}
        startAccessor="start"
        endAccessor="end"
        className="rbc-tailwind"
        style={{ margin: '10px', height: '90%' }}
        onSelectEvent={handleEventClick}
      />
    </div>
  );
};

export default MyCalendar;
