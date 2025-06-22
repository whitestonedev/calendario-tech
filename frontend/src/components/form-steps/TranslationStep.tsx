import React, { useEffect } from 'react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { EventFormValues } from '@/lib/form-schemas';
import { useLanguage } from '@/context/LanguageContext';
import { Currency, CurrencySymbol } from '@/types/currency';
import { formatCurrency } from '@/types/currency';
import { getFlagUrl } from '@/lib/flag-utils';
import { LanguageCodes, isValidLanguageCode } from '@/types/language';

interface TranslationStepProps {
  form: UseFormReturn<EventFormValues>;
  translationLanguage: string;
}

const TranslationStep: React.FC<TranslationStepProps> = ({ form, translationLanguage }) => {
  const { t } = useLanguage();
  const eventLanguage = form.watch('event_language');
  const primaryCostType = form.watch('cost_type');
  const primaryCostValue = form.watch('cost_value');
  const primaryCostCurrency = form.watch('cost_currency');
  const primaryBannerLink = form.watch('banner_link');

  useEffect(() => {
    form.setValue(`translations.${translationLanguage}.cost_type`, primaryCostType);

    if (primaryCostType === 'paid') {
      form.setValue(`translations.${translationLanguage}.cost_value`, primaryCostValue);
      form.setValue(`translations.${translationLanguage}.cost_currency`, primaryCostCurrency);
    }

    const translationBanner = form.getValues(`translations.${translationLanguage}.banner_link`);
    if (!translationBanner && primaryBannerLink) {
      form.setValue(`translations.${translationLanguage}.banner_link`, primaryBannerLink);
    }
  }, [
    primaryCostType,
    primaryCostValue,
    primaryCostCurrency,
    translationLanguage,
    form,
    primaryBannerLink,
  ]);

  // Get language display info
  const getLanguageDisplay = (lang: string) => {
    if (!isValidLanguageCode(lang)) {
      return {
        name: t('languages.other'),
        icon: <img src={getFlagUrl(LanguageCodes.PORTUGUESE)} alt="Other" className="h-4 w-4" />,
      };
    }

    switch (lang) {
      case LanguageCodes.PORTUGUESE:
        return {
          name: t('languages.pt-br'),
          icon: <img src={getFlagUrl(lang)} alt="BR" className="h-4 w-4" />,
        };
      case LanguageCodes.ENGLISH:
        return {
          name: t('languages.en-us'),
          icon: <img src={getFlagUrl(lang)} alt="US" className="h-4 w-4" />,
        };
      case LanguageCodes.SPANISH:
        return {
          name: t('languages.es-es'),
          icon: <img src={getFlagUrl(lang)} alt="ES" className="h-4 w-4" />,
        };
      default:
        return {
          name: t('languages.other'),
          icon: <img src={getFlagUrl(LanguageCodes.PORTUGUESE)} alt="Other" className="h-4 w-4" />,
        };
    }
  };

  const currentLang = getLanguageDisplay(translationLanguage);
  const primaryLang = getLanguageDisplay(eventLanguage);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium flex items-center gap-2">
          {currentLang.icon} {currentLang.name} ({t('form.language.translation')})
        </h3>
        <div className="text-sm text-gray-500 flex items-center gap-2">
          {primaryLang.icon} {primaryLang.name} ({t('form.language.primary')})
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name={`translations.${translationLanguage}.event_name`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('form.eventName')}</FormLabel>
              <FormControl>
                <Input placeholder={form.watch('event_name')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`translations.${translationLanguage}.event_edition`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('form.eventEdition')}</FormLabel>
              <FormControl>
                <Input placeholder={form.watch('event_edition')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="space-y-4">
        <FormField
          control={form.control}
          name={`translations.${translationLanguage}.cost_type`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('form.cost')}</FormLabel>
              <Select onValueChange={field.onChange} value={primaryCostType} disabled>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t('form.selectCostType')} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="free">{t('event.free')}</SelectItem>
                  <SelectItem value="paid">{t('index.paid')}</SelectItem>
                  <SelectItem value="undefined">{t('form.costUndefined')}</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {(primaryCostType === 'paid' || primaryCostType === 'undefined') && (
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name={`translations.${translationLanguage}.cost_value`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('form.value')}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      {...field}
                      onChange={(e) =>
                        field.onChange(e.target.value === '' ? null : parseFloat(e.target.value))
                      }
                      value={field.value === null || field.value === undefined ? '' : field.value}
                      disabled={primaryCostType === 'undefined'}
                    />
                  </FormControl>
                  {primaryCostType === 'paid' && primaryCostValue && primaryCostCurrency && (
                    <FormDescription>
                      {t('form.originalCost')}:{' '}
                      {formatCurrency(primaryCostValue, primaryCostCurrency)}
                    </FormDescription>
                  )}
                  {primaryCostType === 'undefined' && (
                    <FormDescription>{t('form.costUndefinedDesc')}</FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`translations.${translationLanguage}.cost_currency`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('form.currency')}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || undefined}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('form.selectCurrency')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(Currency).map((currency) => (
                        <SelectItem key={currency} value={currency}>
                          {CurrencySymbol[currency]} ({currency})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}
      </div>

      <FormField
        control={form.control}
        name={`translations.${translationLanguage}.short_description`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('form.description')}</FormLabel>
            <FormControl>
              <Textarea
                placeholder={form.watch('short_description')}
                {...field}
                className="min-h-[100px]"
              />
            </FormControl>
            <FormDescription>{t('form.descriptionDesc')}</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={`translations.${translationLanguage}.banner_link`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('form.bannerLink')}</FormLabel>
            <FormControl>
              <Input placeholder="https://..." {...field} />
            </FormControl>
            <FormDescription>{t('form.bannerLinkDesc')}</FormDescription>
            {field.value && (
              <div className="mt-2 w-full max-w-[200px] aspect-[2/1] rounded-lg overflow-hidden border border-gray-200">
                <img
                  src={field.value}
                  alt="Banner preview"
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://placehold.co/800x400/e2e8f0/94a3b8?text=Banner+Preview';
                  }}
                />
              </div>
            )}
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default TranslationStep;
