import React from 'react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { EventFormValues } from '@/lib/form-schemas';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useLanguage } from '@/context/LanguageContext';

interface LanguageStepProps {
  form: UseFormReturn<EventFormValues>;
}

const LanguageStep: React.FC<LanguageStepProps> = ({ form }) => {
  const { t } = useLanguage();

  const getFlagUrl = (lang: string) => {
    switch (lang) {
      case 'pt-br':
        return 'https://flagcdn.com/24x18/br.png';
      case 'en-us':
        return 'https://flagcdn.com/24x18/us.png';
      case 'es-es':
        return 'https://flagcdn.com/24x18/es.png';
      default:
        return 'https://flagcdn.com/24x18/un.png';
    }
  };

  const getAvailableLanguages = (primaryLanguage: string) => {
    const allLanguages = [
      { code: 'pt-br', label: 'Português (Brasil)' },
      { code: 'en-us', label: 'English (US)' },
      { code: 'es-es', label: 'Español' },
    ];

    return allLanguages.filter((lang) => lang.code !== primaryLanguage);
  };

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="event_language"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('form.language')}</FormLabel>
            <Select
              onValueChange={(value) => {
                field.onChange(value);

                // Remove o idioma principal da lista de suportados
                const currentSupported = form.getValues('supported_languages') || [];
                const newSupported = currentSupported.filter((lang) => lang !== value);
                form.setValue('supported_languages', newSupported);
              }}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={t('form.selectLanguage')} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="pt-br" className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <img src={getFlagUrl('pt-br')} alt="BR" className="w-5 h-auto" />
                    <span>Português (Brasil)</span>
                  </div>
                </SelectItem>
                <SelectItem value="en-us" className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <img src={getFlagUrl('en-us')} alt="US" className="w-5 h-auto" />
                    <span>English (US)</span>
                  </div>
                </SelectItem>
                <SelectItem value="es-es" className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <img src={getFlagUrl('es-es')} alt="ES" className="w-5 h-auto" />
                    <span>Español</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <FormDescription>{t('form.language.primary')}</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="space-y-4">
        <FormLabel>{t('form.addLanguage')}</FormLabel>
        <FormDescription>{t('form.language.translation')}</FormDescription>

        <FormField
          control={form.control}
          name="supported_languages"
          render={({ field }) => {
            const primaryLanguage = form.getValues('event_language');
            const availableLanguages = getAvailableLanguages(primaryLanguage);
            const value = (field.value as string[]) || [];

            return (
              <div className="space-y-4">
                {availableLanguages.map((lang) => (
                  <FormItem
                    key={lang.code}
                    className="flex flex-row items-start space-x-3 space-y-0"
                  >
                    <FormControl>
                      <Checkbox
                        checked={value.includes(lang.code)}
                        onCheckedChange={(checked) => {
                          const newValue = checked
                            ? [...value, lang.code]
                            : value.filter((v) => v !== lang.code);
                          field.onChange(newValue);
                        }}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none flex items-center gap-2">
                      <img
                        src={getFlagUrl(lang.code)}
                        alt={lang.code.toUpperCase()}
                        className="w-5 h-auto"
                      />
                      <FormLabel>{lang.label}</FormLabel>
                    </div>
                  </FormItem>
                ))}
              </div>
            );
          }}
        />
      </div>
    </div>
  );
};

export default LanguageStep;
