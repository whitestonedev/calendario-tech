import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { EventFormValues } from '@/lib/form-schemas';
import { useLanguage } from '@/context/LanguageContext';

interface BasicInfoStepProps {
  form: UseFormReturn<EventFormValues>;
}

const BasicInfoStep: React.FC<BasicInfoStepProps> = ({ form }) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="organization_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('form.orgName')}</FormLabel>
              <FormControl>
                <Input placeholder={t('form.orgName')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="event_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('form.eventName')}</FormLabel>
              <FormControl>
                <Input placeholder={t('form.eventName')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="event_edition"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('form.eventEdition')}</FormLabel>
            <FormControl>
              <Input placeholder="2025, Edição de Verão, etc." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default BasicInfoStep;
