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
import { Flag, GlobeIcon } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Currency, CurrencySymbol } from '@/types/currency';

interface TranslationStepProps {
  form: UseFormReturn<EventFormValues>;
  translationLanguage: string;
}

const TranslationStep: React.FC<TranslationStepProps> = ({ form, translationLanguage }) => {
  const { t } = useLanguage();
  const eventLanguage = form.watch('event_language');
  const translatedCostType = form.watch(`translations.${translationLanguage}.cost_type`);

  useEffect(() => {
    if (translatedCostType === 'free') {
      form.setValue(`translations.${translationLanguage}.cost_value`, null);
      form.setValue(`translations.${translationLanguage}.cost_currency`, null);
    }
  }, [translatedCostType, translationLanguage, form]);

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
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t('form.selectCostType')} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="free">{t('event.free')}</SelectItem>
                  <SelectItem value="paid">{t('index.paid')}</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {translatedCostType === 'paid' && (
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
                    />
                  </FormControl>
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
    </div>
  );
};

export default TranslationStep;
