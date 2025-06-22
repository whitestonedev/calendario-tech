import React from 'react';
import { format } from 'date-fns';
import { EventFormValues } from '@/lib/form-schemas';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Building2, Calendar, MapPin, Link2, Tag, Languages, Info, Image } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { UseFormReturn } from 'react-hook-form';
import { formatCurrency } from '@/types/currency';
import { statesOfBrazil } from '@/lib/states';
import { getFlagUrl } from '@/lib/flag-utils';
import { LanguageCodes, isValidLanguageCode } from '@/types/language';

interface ReviewStepProps {
  form: UseFormReturn<EventFormValues>;
}

const ReviewStep: React.FC<ReviewStepProps> = ({ form }) => {
  const { t } = useLanguage();
  const data = form.watch();

  const formatDate = (date: Date) => {
    return format(date, 'dd/MM/yyyy');
  };

  // Get language display info
  const getLanguageDisplay = (lang: string) => {
    if (!isValidLanguageCode(lang)) {
      return {
        name: t('languages.other'),
        icon: (
          <img src={getFlagUrl(LanguageCodes.PORTUGUESE)} alt="Other" className="w-5 h-auto mr-2" />
        ),
      };
    }

    switch (lang) {
      case LanguageCodes.PORTUGUESE:
        return {
          name: t('languages.pt-br'),
          icon: <img src={getFlagUrl(lang)} alt="BR" className="w-5 h-auto mr-2" />,
        };
      case LanguageCodes.ENGLISH:
        return {
          name: t('languages.en-us'),
          icon: <img src={getFlagUrl(lang)} alt="US" className="w-5 h-auto mr-2" />,
        };
      case LanguageCodes.SPANISH:
        return {
          name: t('languages.es-es'),
          icon: <img src={getFlagUrl(lang)} alt="ES" className="w-5 h-auto mr-2" />,
        };
      default:
        return {
          name: t('languages.other'),
          icon: (
            <img
              src={getFlagUrl(LanguageCodes.PORTUGUESE)}
              alt="Other"
              className="w-5 h-auto mr-2"
            />
          ),
        };
    }
  };

  const ReviewSection = ({
    title,
    icon,
    children,
  }: {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
  }) => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-tech-purple">
        {icon}
        <h4 className="font-medium text-base">{title}</h4>
      </div>
      <Separator className="my-2" />
      {children}
    </div>
  );

  const ReviewField = ({
    label,
    value,
    className,
  }: {
    label: string;
    value: React.ReactNode;
    className?: string;
  }) => (
    <div className={`space-y-1 ${className || ''}`}>
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="text-gray-900">{value}</dd>
    </div>
  );

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900">{t('form.reviewTitle')}</h3>

      <Card className="border-2 border-gray-100">
        <CardContent className="pt-6 space-y-8">
          <ReviewSection title={t('event.basicInfo')} icon={<Building2 className="h-5 w-5" />}>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ReviewField label={t('event.organization')} value={data.organization_name} />
              <ReviewField label={t('event.event')} value={data.event_name} />
              <ReviewField label={t('event.edition')} value={data.event_edition} />
              <ReviewField
                label={t('form.language')}
                value={
                  <div className="flex items-center gap-2">
                    {getLanguageDisplay(data.event_language).icon}
                    {getLanguageDisplay(data.event_language).name}
                  </div>
                }
              />
            </dl>
          </ReviewSection>

          <ReviewSection title={t('event.dateLocation')} icon={<Calendar className="h-5 w-5" />}>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ReviewField
                label={t('event.start')}
                value={`${formatDate(data.start_date)} ${data.start_time}`}
              />
              <ReviewField
                label={t('event.end')}
                value={`${formatDate(data.end_date)} ${data.end_time}`}
              />
              <ReviewField
                label={t('event.format')}
                value={
                  <Badge variant={data.online ? 'default' : 'secondary'}>
                    {data.online ? t('event.online') : t('event.inPerson')}
                  </Badge>
                }
              />
              {!data.online && (
                <>
                  <ReviewField label={t('event.addressLabel')} value={data.address} />
                  <ReviewField
                    label={t('form.state')}
                    value={
                      statesOfBrazil.find((state) => state.value === data.state)?.label ||
                      data.state
                    }
                  />
                  <ReviewField
                    label={t('form.mapsLink')}
                    value={
                      <a
                        href={data.maps_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-tech-purple hover:underline flex items-center gap-1"
                      >
                        <MapPin className="h-4 w-4" />
                        {t('event.viewMap')}
                      </a>
                    }
                  />
                </>
              )}
            </dl>
          </ReviewSection>

          <ReviewSection title={t('event.details')} icon={<Info className="h-5 w-5" />}>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <ReviewField
                  label={t('event.cost')}
                  value={
                    <div className="flex items-center gap-2">
                      {' '}
                      {data.cost_type === 'free'
                        ? t('event.free')
                        : data.cost_type === 'undefined'
                          ? t('form.costUndefined')
                          : (() => {
                              const formattedCost = formatCurrency(
                                data.cost_value,
                                data.cost_currency
                              );
                              return formattedCost || t('event.notProvided');
                            })()}
                    </div>
                  }
                />
                <ReviewField label={t('event.description')} value={data.short_description} />
              </div>

              <div className="space-y-4">
                <ReviewField
                  label={t('event.banner')}
                  value={
                    data.banner_link ? (
                      <div className="space-y-2">
                        <a
                          href={data.banner_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-tech-purple hover:underline flex items-center gap-1"
                        >
                          <Image className="h-4 w-4" />
                          {t('event.viewBanner')}
                        </a>
                        <div className="relative w-full max-w-[200px] aspect-[2/1] rounded-lg overflow-hidden border border-gray-200">
                          <img
                            src={data.banner_link}
                            alt="Banner preview"
                            className="object-cover w-full h-full"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src =
                                'https://placehold.co/800x400/e2e8f0/94a3b8?text=Banner+Preview';
                            }}
                          />
                        </div>
                      </div>
                    ) : (
                      t('event.notProvided')
                    )
                  }
                />
                <ReviewField
                  label={t('event.link')}
                  value={
                    <a
                      href={data.event_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-tech-purple hover:underline flex items-center gap-1"
                    >
                      <Link2 className="h-4 w-4" />
                      {data.event_link}
                    </a>
                  }
                />
              </div>
            </dl>
          </ReviewSection>

          <ReviewSection title={t('form.tagsLabel')} icon={<Tag className="h-5 w-5" />}>
            <div className="flex flex-wrap gap-2">
              {data.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="bg-tech-purple/10 text-tech-purple hover:bg-tech-purple/20"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </ReviewSection>

          {data.translations &&
            data.supported_languages &&
            data.supported_languages.length > 0 &&
            (() => {
              const validTranslations = data.supported_languages.filter(
                (lang) => !!data.translations[lang]
              );
              if (validTranslations.length === 0) return null;
              return (
                <ReviewSection
                  title={t('form.language.translation')}
                  icon={<Languages className="h-5 w-5" />}
                >
                  <div className="space-y-6">
                    {validTranslations.map((lang) => {
                      const translation = data.translations[lang];
                      const langDisplay = getLanguageDisplay(lang as string);
                      const main = data;
                      return (
                        <div key={lang} className="space-y-4 p-4 border rounded-md bg-gray-50">
                          <div className="flex items-center gap-2 text-tech-purple mb-2">
                            {langDisplay.icon}
                            <h5 className="font-medium">{langDisplay.name}</h5>
                          </div>
                          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <ReviewField
                              label={t('event.event')}
                              value={
                                translation.event_name || main.event_name || t('event.notProvided')
                              }
                            />
                            <ReviewField
                              label={t('event.edition')}
                              value={
                                translation.event_edition ||
                                main.event_edition ||
                                t('event.notProvided')
                              }
                            />
                            <ReviewField
                              label={t('event.cost')}
                              value={
                                <div className="flex items-center gap-2">
                                  {(() => {
                                    if (
                                      translation.cost_type === 'free' ||
                                      (!translation.cost_type && main.cost_type === 'free')
                                    ) {
                                      return t('event.free');
                                    }
                                    if (
                                      translation.cost_type === 'undefined' ||
                                      (!translation.cost_type && main.cost_type === 'undefined')
                                    ) {
                                      return t('form.costUndefined');
                                    }
                                    const formattedCost = formatCurrency(
                                      translation.cost_value,
                                      translation.cost_currency
                                    );
                                    return formattedCost || t('event.notProvided');
                                  })()}
                                </div>
                              }
                            />
                            <ReviewField
                              label={t('form.currency')}
                              value={
                                translation.cost_currency ||
                                main.cost_currency ||
                                t('event.notProvided')
                              }
                            />
                            <ReviewField
                              label={t('event.description')}
                              value={
                                translation.short_description ||
                                main.short_description ||
                                t('event.notProvided')
                              }
                              className="md:col-span-2"
                            />
                            <ReviewField
                              label={t('event.banner')}
                              value={
                                translation.banner_link || main.banner_link ? (
                                  <div className="space-y-2">
                                    <a
                                      href={translation.banner_link || main.banner_link}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-tech-purple hover:underline flex items-center gap-1"
                                    >
                                      <Image className="h-4 w-4" />
                                      {t('event.viewBanner')}
                                    </a>
                                    <div className="relative w-full max-w-[200px] aspect-[2/1] rounded-lg overflow-hidden border border-gray-200">
                                      <img
                                        src={translation.banner_link || main.banner_link}
                                        alt="Banner preview"
                                        className="object-cover w-full h-full"
                                        onError={(e) => {
                                          const target = e.target as HTMLImageElement;
                                          target.src =
                                            'https://placehold.co/800x400/e2e8f0/94a3b8?text=Banner+Preview';
                                        }}
                                      />
                                    </div>
                                  </div>
                                ) : (
                                  t('event.notProvided')
                                )
                              }
                              className="md:col-span-2"
                            />
                          </dl>
                        </div>
                      );
                    })}
                  </div>
                </ReviewSection>
              );
            })()}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReviewStep;
