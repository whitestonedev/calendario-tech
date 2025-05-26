import React from 'react';
import { format } from 'date-fns';
import { EventFormValues } from '@/lib/form-schemas';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Flag,
  GlobeIcon,
  Building2,
  Calendar,
  MapPin,
  Link2,
  Tag,
  Languages,
  Info,
  DollarSign,
  Image,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { UseFormReturn } from 'react-hook-form';
import { formatCurrency } from '@/types/currency';
import { statesOfBrazil } from '@/lib/states';

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
  const getLanguageDisplay = (code: string) => {
    switch (code) {
      case 'pt-br':
        return {
          name: 'Português (Brasil)',
          icon: <Flag className="h-4 w-4" />,
        };
      case 'en-us':
        return {
          name: 'English (US)',
          icon: <GlobeIcon className="h-4 w-4" />,
        };
      case 'es-es':
        return { name: 'Español', icon: <Flag className="h-4 w-4" /> };
      default:
        return { name: code, icon: <GlobeIcon className="h-4 w-4" /> };
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
                      <DollarSign className="h-4 w-4" />
                      {data.cost_type === 'free'
                        ? t('event.free')
                        : formatCurrency(data.cost_value || 0, data.cost_currency)}
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

          {data.translations && Object.keys(data.translations).length > 0 && (
            <ReviewSection
              title={t('form.language.translation')}
              icon={<Languages className="h-5 w-5" />}
            >
              <div className="space-y-6">
                {Object.entries(data.translations).map(([lang, translation]) => {
                  if (!translation) return null;

                  const langDisplay = getLanguageDisplay(lang);

                  return (
                    <div key={lang} className="space-y-4">
                      <div className="flex items-center gap-2 text-tech-purple">
                        {langDisplay.icon}
                        <h5 className="font-medium">{langDisplay.name}</h5>
                      </div>
                      <dl className="grid grid-cols-1 gap-4">
                        {translation.event_name && (
                          <ReviewField label={t('event.event')} value={translation.event_name} />
                        )}
                        {translation.event_edition && (
                          <ReviewField
                            label={t('event.edition')}
                            value={translation.event_edition}
                          />
                        )}
                        {translation.cost_type && (
                          <ReviewField
                            label={t('event.cost')}
                            value={
                              <div className="flex items-center gap-2">
                                <DollarSign className="h-4 w-4" />
                                {translation.cost_type === 'free'
                                  ? t('event.free')
                                  : formatCurrency(
                                      translation.cost_value || 0,
                                      translation.cost_currency
                                    )}
                              </div>
                            }
                          />
                        )}
                        {translation.short_description && (
                          <ReviewField
                            label={t('event.description')}
                            value={translation.short_description}
                          />
                        )}
                      </dl>
                    </div>
                  );
                })}
              </div>
            </ReviewSection>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReviewStep;
