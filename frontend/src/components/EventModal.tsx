import React from "react";
import { EventInterface } from "@/types/event";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  MapPin,
  Globe,
  Share2,
  Tag,
  User,
  Info,
  X,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/hooks/use-toast";

interface EventModalProps {
  event: EventInterface;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EventModal = ({ event, open, onOpenChange }: EventModalProps) => {
  const { language, t } = useLanguage();
  const { toast } = useToast();

  const firstAvailableTranslation = Object.values(event.intl)[0];
  const translation = event.intl[language] || firstAvailableTranslation;

  const startDate = parseISO(event.start_datetime);
  const endDate = parseISO(event.end_datetime);

  const isPaid = /\d/.test(translation.cost);

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

  const shareEvent = () => {
    if (navigator.share) {
      navigator.share({
        title: event.event_name,
        text: translation.short_description,
        url: event.event_link,
      });
    } else {
      navigator.clipboard.writeText(event.event_link);
      toast({
        title: t("event.linkCopied"),
        description: t("event.linkCopiedDesc"),
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto  bg-white">
        <div className="relative h-48 md:h-64 -m-6 mb-0">
          <img
            src={translation.banner_link}
            alt={event.event_name}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-4 left-4 flex gap-2 z-10">
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

        <DialogHeader className="pt-6">
          <DialogTitle className="text-2xl">{event.event_name}</DialogTitle>
          <div className="flex items-center text-sm text-gray-500">
            <User className="h-4 w-4 mr-1 text-tech-purple" />
            <span>{event.organization_name}</span>
          </div>
          <div className="text-sm font-medium mt-1">
            {translation.event_edition}
          </div>
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
                  <p>{event.address}</p>
                  <a
                    href={event.maps_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-tech-purple hover:underline text-sm"
                  >
                    {t("event.viewMap")}
                  </a>
                </div>
              </div>
            )}
            {event.online && (
              <div className="flex items-center text-sm">
                <Globe className="h-4 w-4 mr-2 text-tech-purple" />
                <span>{t("event.onlineEvent")}</span>
              </div>
            )}
          </div>

          <Separator />

          <div>
            <div className="flex items-center mb-2">
              <Info className="h-4 w-4 mr-2 text-tech-purple" />
              <h3 className="font-medium">{t("event.description")}</h3>
            </div>
            <p className="text-sm">{translation.short_description}</p>
          </div>

          <div>
            <div className="flex items-center mb-2">
              <Tag className="h-4 w-4 mr-2 text-tech-purple" />
              <h3 className="font-medium">{t("form.tagsLabel")}</h3>
            </div>
            <div className="flex flex-wrap gap-1">
              {event.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="text-sm font-medium">
              {translation.cost === "Grátis" || translation.cost === "Free" ? (
                <span className="text-tech-green">{translation.cost}</span>
              ) : (
                <span>{translation.cost}</span>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={shareEvent}
                className="text-tech-dark border-tech-purple hover:bg-tech-purple/10"
              >
                <Share2 className="h-4 w-4 mr-1" /> {t("event.share")}
              </Button>

              <Button
                size="sm"
                className="bg-tech-purple hover:bg-tech-purple/90"
                asChild
              >
                <a
                  href={event.event_link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t("event.register")}
                </a>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventModal;
