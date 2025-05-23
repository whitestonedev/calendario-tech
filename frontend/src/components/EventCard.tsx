
import React, { useState } from "react";
import { EventInterface } from "@/types/event";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import EventModal from "./EventModal";
import { useLanguage } from "@/context/LanguageContext";

interface EventCardProps {
  event: EventInterface;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const { language, t } = useLanguage();

  // Obtém a primeira tradução disponível como fallback
  const firstAvailableTranslation = Object.values(event.intl)[0];

  // Tenta obter a tradução para o idioma atual, se não existir, usa a primeira disponível
  const translation = event.intl[language] || firstAvailableTranslation;

  const startDate = parseISO(event.start_datetime);
  const endDate = parseISO(event.end_datetime);

  const formatDate = (date: Date) => {
    return format(date, "PPP", {
      locale: language === "pt-br" ? ptBR : undefined,
    });
  };

  const formatTime = (date: Date) => {
    return format(date, "p", {
      locale: language === "pt-br" ? ptBR : undefined,
    });
  };

  const isPaid = /\d/.test(translation.cost);

  return (
    <>
      <Card
        className="overflow-hidden flex flex-col h-full cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => setModalOpen(true)}
      >
        <div className="relative h-48 overflow-hidden">
          <img
            src={translation.banner_link}
            alt={event.event_name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 right-2 flex flex-col items-end gap-2">
            {event.online ? (
              <Badge className="bg-tech-blue">{t("event.online")}</Badge>
            ) : (
              <Badge className="bg-tech-green">{t("event.inPerson")}</Badge>
            )}
            {!isPaid && (
              <Badge className="bg-green-100 text-green-700 border border-green-300 shadow-md animate-pulse font-semibold ring-2 ring-green-300">
                {t("event.free")}
              </Badge>
            )}
          </div>
        </div>

        <CardContent className="flex-1 p-4">
          <div className="mb-3">
            <h3 className="text-lg font-semibold mb-1">{event.event_name}</h3>
            <p className="text-sm text-gray-500">{event.organization_name}</p>
            <p className="text-sm font-medium mt-1">
              {translation.event_edition}
            </p>
          </div>

          <div className="space-y-2 mb-3">
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
              <div className="flex items-center text-sm">
                <MapPin className="h-4 w-4 mr-2 text-tech-purple" />
                <span className="truncate">{event.address}</span>
              </div>
            )}
            {event.online && (
              <div className="flex items-center text-sm">
                <Globe className="h-4 w-4 mr-2 text-tech-purple" />
                <span>{t("event.onlineEvent")}</span>
              </div>
            )}
          </div>

          <p className="text-sm mb-3 line-clamp-2">
            {translation.short_description}
          </p>

          <div className="flex flex-wrap gap-1 mt-2">
            {event.tags.slice(0, 3).map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                {tag}
              </Badge>
            ))}
            {event.tags.length > 3 && (
              <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                +{event.tags.length - 3}
              </Badge>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-4 border-t flex flex-row-reverse items-center justify-between gap-3">
          <Button
            className="w-1/2 bg-tech-purple hover:bg-tech-purple/90"
            onClick={(e) => {
              e.stopPropagation();
              setModalOpen(true);
            }}
          >
            {t("event.register")}
          </Button>

          <div className="w-1/2">
            <span
              className={`block w-full text-sm font-bold tracking-wide uppercase px-3 py-1 rounded-full text-center ${
                isPaid
                  ? "bg-purple-100 text-tech-purple border border-tech-purple/30"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {translation.cost}
            </span>
          </div>
        </CardFooter>
      </Card>

      <EventModal event={event} open={modalOpen} onOpenChange={setModalOpen} />
    </>
  );
};

export default EventCard;
