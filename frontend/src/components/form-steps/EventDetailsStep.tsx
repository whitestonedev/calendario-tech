import React, { useEffect } from 'react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
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

interface EventDetailsStepProps {
  form: UseFormReturn<EventFormValues>;
}

const EventDetailsStep: React.FC<EventDetailsStepProps> = ({ form }) => {
  const { t } = useLanguage();
  const costType = form.watch('cost_type');

  useEffect(() => {
    if (costType === 'free') {
      form.setValue('cost_value', null);
      form.setValue('cost_currency', null);
    } else if (costType === 'undefined') {
      form.setValue('cost_value', 0);
      form.setValue('cost_currency', Currency.BRL);
    }
  }, [costType, form]);

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="event_link"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('form.eventLink')}</FormLabel>
            <FormControl>
              <Input placeholder="https://..." {...field} />
            </FormControl>
            <FormDescription>{t('form.eventLinkDesc')}</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="cost_type"
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
                    <SelectItem value="undefined">{t('form.costUndefined')}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {(costType === 'paid' || costType === 'undefined') && (
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="cost_value"
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
                        disabled={costType === 'undefined'}
                      />
                    </FormControl>
                    {costType === 'undefined' && (
                      <FormDescription>{t('form.costUndefinedDesc')}</FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cost_currency"
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
          name="banner_link"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('form.bannerLink')}</FormLabel>
              <FormControl>
                <Input placeholder="https://..." {...field} />
              </FormControl>
              <FormDescription>{t('form.bannerLinkDesc')}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="short_description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('form.description')}</FormLabel>
            <FormControl>
              <Textarea
                placeholder={t('form.descriptionPlaceholder')}
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

export default EventDetailsStep;
