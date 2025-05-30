import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format, parseISO, isPast } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  Clock,
  MapPin,
  Globe,
  Share2,
  Tag,
  User,
  Info,
  ArrowLeft,
  ExternalLink,
  Ticket,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/types/currency';
import { LanguageCodes, LanguageCode } from '@/types/language';
import { EventInterface } from '@/types/event';
import { API_BASE_URL } from '@/config/constants';
import ScrollToTopButton from '@/components/ScrollToTopButton';
import { QrCodeModal } from '@/components/QrCodeModal';
import { getStateLabel } from '@/lib/states';

const EventPage = () => {
  const { eventId, dateStart, title } = useParams();
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const { toast } = useToast();
  const [event, setEvent] = useState<EventInterface | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSharing, setIsSharing] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId) {
        setError('Event ID not found');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/events/${eventId}`);
        if (!response.ok) {
          throw new Error('Event not found');
        }

        const eventData: EventInterface = await response.json();

        // Validate if the event matches the URL
        const eventDate = format(parseISO(eventData.start_datetime), 'yyyy-MM-dd');
        const eventTitle = eventData.event_name.toLowerCase().replace(/\s+/g, '-');

        if (dateStart !== eventDate || title !== eventTitle) {
          setError('Invalid URL for this event');
          setLoading(false);
          return;
        }

        setEvent(eventData);
      } catch (err) {
        setError('Error loading event');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId, dateStart, title]);

  const handleTagClick = (tag: string) => {
    navigate('/', { state: { searchTag: tag } });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tech-purple mx-auto mb-4"></div>
          <p>{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{t('common.notFound')}</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => navigate('/')} className="bg-tech-purple hover:bg-tech-purple/90">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('common.back')}
          </Button>
        </div>
      </div>
    );
  }

  const firstAvailableTranslation = Object.values(event.intl)[0];
  const translation = event.intl[language as LanguageCode] || firstAvailableTranslation;

  const startDate = parseISO(event.start_datetime);
  const endDate = parseISO(event.end_datetime);
  const isEventPast = isPast(endDate);

  const formatDate = (date: Date) => {
    return format(date, 'PPP', {
      locale: language === LanguageCodes.PORTUGUESE ? ptBR : undefined,
    });
  };

  const formatTime = (date: Date) => {
    return format(date, 'p', {
      locale: language === LanguageCodes.PORTUGUESE ? ptBR : undefined,
    });
  };

  const shareEvent = async () => {
    const eventUrl = `https://calendario.tech/#/${dateStart}/${eventId}/${title}`;

    if (isSharing) return;
    setIsSharing(true);

    try {
      if (navigator.share) {
        await navigator.share({
          title: event?.event_name,
          text: translation?.short_description,
          url: eventUrl,
        });
      } else {
        await navigator.clipboard.writeText(eventUrl);
        toast({
          title: t('event.linkCopied'),
          description: t('event.linkCopiedDesc'),
        });
      }
    } catch (err) {
      console.error('Erro ao compartilhar:', err);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-[1200px] mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
        {/* Header with back button */}
        <div className="mb-4 sm:mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="hover:bg-tech-purple/10 text-gray-600"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('common.back')}
          </Button>
        </div>

        {/* Event banner */}
        <div className="relative aspect-video mb-6 sm:mb-12 rounded-xl sm:rounded-2xl overflow-hidden">
          <img
            src={translation.banner_link}
            alt={event.event_name}
            className={`w-full h-full object-cover object-center ${isEventPast ? 'grayscale opacity-75' : ''}`}
          />
          {isEventPast && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -rotate-12 z-20">
              <Badge className="bg-red-500 text-white px-4 sm:px-6 py-1 sm:py-2 text-sm sm:text-base font-bold shadow-lg animate-pulse whitespace-nowrap">
                {t('event.past')}
              </Badge>
            </div>
          )}
          <div className="absolute bottom-4 sm:bottom-8 left-4 sm:left-8 flex flex-wrap gap-2 sm:gap-3 z-20">
            {event.online ? (
              <Badge className="bg-tech-blue text-white px-2 sm:px-3 py-1 text-xs sm:text-sm">
                {t('event.online')}
              </Badge>
            ) : (
              <Badge className="bg-tech-green text-white px-2 sm:px-3 py-1 text-xs sm:text-sm">
                {t('event.inPerson')}
              </Badge>
            )}
            {event.is_free && (
              <Badge className="bg-green-100 text-green-700 border border-green-300 px-2 sm:px-3 py-1 text-xs sm:text-sm shadow-md animate-pulse font-semibold ring-2 ring-green-300">
                {t('event.free')}
              </Badge>
            )}
          </div>
        </div>

        {/* Mobile price and actions */}
        <div className="lg:hidden mb-6">
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <div className="flex flex-col items-center">
              <div className="mb-4 text-center">
                {event.is_free ? (
                  <div className="text-xl font-bold text-green-600">{t('event.free')}</div>
                ) : (
                  <div className="text-xl font-bold text-gray-900">
                    {formatCurrency(translation.cost, translation.currency)}
                  </div>
                )}
              </div>
              <div className="flex gap-3 w-full">
                <QrCodeModal
                  event={event}
                  eventUrl={`https://calendario.tech/#/${dateStart}/${eventId}/${title}`}
                />
                <Button
                  variant="outline"
                  className="flex-1 text-tech-dark border-tech-purple hover:bg-tech-purple/10 text-sm py-2"
                  asChild
                >
                  <a href={event.event_link} target="_blank" rel="noopener noreferrer">
                    {t('event.details')}
                  </a>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={shareEvent}
                  className="text-gray-500 hover:text-tech-purple hover:bg-tech-purple/10"
                  title={t('event.share')}
                >
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-8">
          {/* Left column - Event details */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 p-4 sm:p-8">
              {/* Title and organization */}
              <div className="mb-4 sm:mb-8">
                <h1 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-gray-900">
                  {event.event_name}
                </h1>
                <div className="flex items-center text-sm sm:text-base text-gray-600 mb-2">
                  <User className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-tech-purple" />
                  <span>{event.organization_name}</span>
                </div>
                <div className="text-sm sm:text-base font-medium text-tech-purple">
                  {translation.event_edition}
                </div>
              </div>

              <Separator className="mb-4 sm:mb-8" />

              {/* Event info */}
              <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-8">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-tech-purple" />
                  <span className="text-sm sm:text-base">{formatDate(startDate)}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-tech-purple" />
                  <span className="text-sm sm:text-base">
                    {formatTime(startDate)} - {formatTime(endDate)}
                  </span>
                </div>
                {!event.online && (
                  <div className="flex items-start">
                    <MapPin className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 mt-1 text-tech-purple" />
                    <div>
                      <p className="text-sm sm:text-base">
                        {event.state && (
                          <span className="text-tech-purple font-medium">
                            ({getStateLabel(event.state)})
                          </span>
                        )}{' '}
                        {event.address}
                      </p>
                      <a
                        href={event.maps_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-tech-purple hover:underline inline-flex items-center mt-1 text-xs sm:text-sm"
                      >
                        {t('event.viewMap')}
                        <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
                      </a>
                    </div>
                  </div>
                )}
                {event.online && (
                  <div className="flex items-center">
                    <Globe className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-tech-purple" />
                    <span className="text-sm sm:text-base">{t('event.onlineEvent')}</span>
                  </div>
                )}
              </div>

              <Separator className="mb-4 sm:mb-8" />

              {/* Description */}
              <div className="mb-4 sm:mb-8">
                <div className="flex items-center mb-2 sm:mb-3">
                  <Info className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-tech-purple" />
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                    {t('event.description')}
                  </h2>
                </div>
                <p className="text-sm sm:text-base leading-relaxed text-gray-700">
                  {translation.short_description}
                </p>
              </div>

              {/* Tags */}
              <div>
                <div className="flex items-center mb-2 sm:mb-3">
                  <Tag className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-tech-purple" />
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                    {t('form.tagsLabel')}
                  </h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="bg-gray-100 text-gray-700 hover:bg-gray-200 text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full cursor-pointer"
                      onClick={() => handleTagClick(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right column - Price and actions (desktop only) */}
          <div className="hidden lg:block lg:col-span-4">
            <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 p-4 sm:p-8 sticky top-24">
              <div className="flex flex-col items-center">
                <div className="mb-6 text-center">
                  {event.is_free ? (
                    <div className="text-2xl font-bold text-green-600">{t('event.free')}</div>
                  ) : (
                    <div className="text-2xl font-bold text-gray-900">
                      {formatCurrency(translation.cost, translation.currency)}
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-3 sm:gap-4 w-full">
                  <div className="flex gap-3 w-full">
                    <Button
                      variant="outline"
                      className="flex-1 text-tech-dark border-tech-purple hover:bg-tech-purple/10 text-sm sm:text-base py-3 sm:py-4"
                      asChild
                    >
                      <a
                        href={event.event_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2"
                      >
                        <Ticket className="h-4 w-4" />
                        {t('event.details')}
                      </a>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={shareEvent}
                      className="text-gray-500 hover:text-tech-purple hover:bg-tech-purple/10"
                      title={t('event.share')}
                    >
                      <Share2 className="h-5 w-5" />
                    </Button>
                    <QrCodeModal
                      event={event}
                      eventUrl={`https://calendario.tech/#/${dateStart}/${eventId}/${title}`}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <ScrollToTopButton />
      </div>
    </div>
  );
};

export default EventPage;
