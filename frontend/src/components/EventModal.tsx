import React from 'react';
import { EventInterface } from '@/types/event';
import { format, parseISO, isPast } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, Globe, Share2, Tag, User, Info } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/types/currency';
import { LanguageCodes, LanguageCode } from '@/types/language';
import { useNavigate } from 'react-router-dom';

interface EventModalProps {
  event: EventInterface;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EventModal = ({ event, open, onOpenChange }: EventModalProps) => {
  const { language, t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();

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

  const shareEvent = () => {
    const eventDate = format(startDate, 'yyyy-MM-dd');
    const eventTitle = event.event_name.toLowerCase().replace(/\s+/g, '-');
    const eventUrl = `https://calendario.tech/#/${eventDate}/${event.id}/${eventTitle}`;

    if (navigator.share) {
      navigator.share({
        title: event.event_name,
        text: translation.short_description,
        url: eventUrl,
      });
    } else {
      navigator.clipboard.writeText(eventUrl);
      toast({
        title: t('event.linkCopied'),
        description: t('event.linkCopiedDesc'),
      });
    }
  };

  const goToEventPage = () => {
    const eventDate = format(startDate, 'yyyy-MM-dd');
    const eventTitle = event.event_name.toLowerCase().replace(/\s+/g, '-');
    navigate(`/${eventDate}/${event.id}/${eventTitle}`);
    onOpenChange(false);
  };

  const handleTagClick = (tag: string) => {
    navigate('/', { state: { searchTag: tag } });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto  bg-white">
        <div className="relative h-48 md:h-64 -m-6 mb-0">
          <img
            src={translation.banner_link}
            alt={event.event_name}
            className={`w-full h-full object-cover ${isEventPast ? 'grayscale opacity-75' : ''}`}
          />
          {isEventPast && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -rotate-12 z-20">
              <Badge className="bg-red-500 text-white px-6 py-3 text-xl font-bold shadow-lg animate-pulse whitespace-nowrap">
                {t('event.past')}
              </Badge>
            </div>
          )}
          <div className="absolute bottom-4 left-4 flex gap-2 z-10">
            {event.online ? (
              <Badge className="bg-tech-blue">{t('event.online')}</Badge>
            ) : (
              <Badge className="bg-tech-green">{t('event.inPerson')}</Badge>
            )}
            {event.is_free && (
              <Badge className="bg-green-100 text-green-700 border border-green-300 shadow-md animate-pulse font-semibold ring-2 ring-green-300">
                {t('event.free')}
              </Badge>
            )}
          </div>
        </div>

        <DialogHeader className="pt-6">
          <DialogTitle className="text-2xl">{event.event_name}</DialogTitle>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-1 text-tech-purple" />
              <span>{event.organization_name}</span>
            </div>
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
          <div className="text-sm font-medium">{translation.event_edition}</div>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <Calendar className="h-4 w-4 mr-2 text-tech-purple" />
              <span>{formatDate(startDate)}</span>
            </div>
            <div className="flex items-center text-sm">
              <Clock className="h-4 w-4 mr-2 text-tech-purple" />
              <span>
                {formatTime(startDate)} - {formatTime(endDate)}
              </span>
            </div>
            {!event.online && (
              <div className="flex items-start text-sm">
                <MapPin className="h-4 w-4 mr-2 mt-1 text-tech-purple" />
                <div>
                  <p>
                    {event.address}
                    {event.state && (
                      <span className="ml-1 text-tech-purple font-medium">({event.state})</span>
                    )}
                  </p>
                  <a
                    href={event.maps_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-tech-purple hover:underline text-sm"
                  >
                    {t('event.viewMap')}
                  </a>
                </div>
              </div>
            )}
            {event.online && (
              <div className="flex items-center text-sm">
                <Globe className="h-4 w-4 mr-2 text-tech-purple" />
                <span>{t('event.onlineEvent')}</span>
              </div>
            )}
          </div>

          <Separator />

          <div>
            <div className="flex items-center mb-2">
              <Info className="h-4 w-4 mr-2 text-tech-purple" />
              <h3 className="font-medium">{t('event.description')}</h3>
            </div>
            <p className="text-sm">{translation.short_description}</p>
          </div>

          <div>
            <div className="flex items-center mb-2">
              <Tag className="h-4 w-4 mr-2 text-tech-purple" />
              <h3 className="font-medium">{t('form.tagsLabel')}</h3>
            </div>
            <div className="flex flex-wrap gap-1">
              {event.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer"
                  onClick={() => handleTagClick(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Price Section */}
          <div className="flex flex-col items-center justify-center py-4 border-t border-b border-gray-100">
            {event.is_free ? (
              <div className="flex flex-col items-center">
                <span className="text-2xl font-medium text-green-600">{t('event.free')}</span>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <span className="text-2xl font-medium text-gray-900">
                  {formatCurrency(translation.cost, translation.currency)}
                </span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-tech-dark border-tech-purple hover:bg-tech-purple/10"
              asChild
            >
              <a href={event.event_link} target="_blank" rel="noopener noreferrer">
                {t('event.details')}
              </a>
            </Button>
            <Button
              size="sm"
              className="bg-tech-purple hover:bg-tech-purple/90"
              onClick={goToEventPage}
            >
              {t('event.page')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventModal;
