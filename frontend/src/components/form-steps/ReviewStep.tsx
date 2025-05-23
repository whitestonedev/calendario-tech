import React from "react";
import { format } from "date-fns";
import { EventFormValues } from "@/lib/form-schemas";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Flag, GlobeIcon } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { UseFormReturn } from "react-hook-form";

interface ReviewStepProps {
  form: UseFormReturn<EventFormValues>;
}

const ReviewStep: React.FC<ReviewStepProps> = ({ form }) => {
  const { t } = useLanguage();
  const data = form.watch();

  const formatDate = (date: Date) => {
    return format(date, "dd/MM/yyyy");
  };

  // Get language display info
  const getLanguageDisplay = (code: string) => {
    switch (code) {
      case "pt-br":
        return {
          name: "Português (Brasil)",
          icon: <Flag className="h-4 w-4" />,
        };
      case "en-us":
        return {
          name: "English (US)",
          icon: <GlobeIcon className="h-4 w-4" />,
        };
      case "es-es":
        return { name: "Español", icon: <Flag className="h-4 w-4" /> };
      default:
        return { name: code, icon: <GlobeIcon className="h-4 w-4" /> };
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">{t("form.reviewTitle")}</h3>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div>
            <h4 className="font-medium text-base">{t("event.basicInfo")}</h4>
            <Separator className="my-2" />
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  {t("event.organization")}
                </dt>
                <dd>{data.organization_name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  {t("event.event")}
                </dt>
                <dd>{data.event_name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  {t("event.edition")}
                </dt>
                <dd>{data.event_edition}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  {t("form.language")}
                </dt>
                <dd className="flex items-center gap-2">
                  {getLanguageDisplay(data.event_language).icon}
                  {getLanguageDisplay(data.event_language).name}
                </dd>
              </div>
            </dl>
          </div>

          <div>
            <h4 className="font-medium text-base">{t("event.dateLocation")}</h4>
            <Separator className="my-2" />
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  {t("event.start")}
                </dt>
                <dd>
                  {formatDate(data.start_date)} às {data.start_time}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  {t("event.end")}
                </dt>
                <dd>
                  {formatDate(data.end_date)} às {data.end_time}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  {t("event.format")}
                </dt>
                <dd>{data.online ? t("event.online") : t("event.inPerson")}</dd>
              </div>
              {!data.online && (
                <div className="col-span-2">
                  <dt className="text-sm font-medium text-gray-500">
                    {t("event.addressLabel")}
                  </dt>
                  <dd>{data.address}</dd>
                </div>
              )}
            </dl>
          </div>

          <div>
            <h4 className="font-medium text-base">{t("event.details")}</h4>
            <Separator className="my-2" />
            <dl className="grid grid-cols-1 gap-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  {t("event.link")}
                </dt>
                <dd className="break-all">{data.event_link}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  {t("event.cost")}
                </dt>
                <dd>{data.cost}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  {t("event.description")}
                </dt>
                <dd>{data.short_description}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  {t("event.banner")}
                </dt>
                <dd className="break-all">
                  {data.banner_link || t("event.notProvided")}
                </dd>
              </div>
            </dl>
          </div>

          <div>
            <h4 className="font-medium text-base">{t("form.tagsLabel")}</h4>
            <Separator className="my-2" />
            <div className="flex flex-wrap gap-1">
              {data.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Show translations */}
          {data.translations && Object.keys(data.translations).length > 0 && (
            <>
              {Object.entries(data.translations).map(([lang, translation]) => {
                if (!translation) return null;

                const langDisplay = getLanguageDisplay(lang);

                return (
                  <div key={lang}>
                    <h4 className="font-medium text-base flex items-center gap-2">
                      {langDisplay.icon} {langDisplay.name}
                    </h4>
                    <Separator className="my-2" />
                    <dl className="grid grid-cols-1 gap-2">
                      {translation.event_name && (
                        <div>
                          <dt className="text-sm font-medium text-gray-500">
                            {t("event.event")}
                          </dt>
                          <dd>{translation.event_name}</dd>
                        </div>
                      )}
                      {translation.event_edition && (
                        <div>
                          <dt className="text-sm font-medium text-gray-500">
                            {t("event.edition")}
                          </dt>
                          <dd>{translation.event_edition}</dd>
                        </div>
                      )}
                      {translation.cost && (
                        <div>
                          <dt className="text-sm font-medium text-gray-500">
                            {t("event.cost")}
                          </dt>
                          <dd>{translation.cost}</dd>
                        </div>
                      )}
                      {translation.short_description && (
                        <div>
                          <dt className="text-sm font-medium text-gray-500">
                            {t("event.description")}
                          </dt>
                          <dd>{translation.short_description}</dd>
                        </div>
                      )}
                    </dl>
                  </div>
                );
              })}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReviewStep;
