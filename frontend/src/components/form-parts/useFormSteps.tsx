import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { EventFormValues } from '@/lib/form-schemas';
import { useLanguage } from '@/context/LanguageContext';
import { LanguageCodes } from '@/types/language';

export const useFormSteps = (form: UseFormReturn<EventFormValues>) => {
  const [currentStep, setCurrentStep] = useState(0);
  const { t } = useLanguage();

  // Get steps based on the language
  const baseSteps = [
    {
      title: t('form.step.language'),
      description: t('form.step.language.desc'),
    },
    {
      title: t('form.step.basicInfo'),
      description: t('form.step.basicInfo.desc'),
    },
    {
      title: t('form.step.dateLocation'),
      description: t('form.step.dateLocation.desc'),
    },
    { title: t('form.step.details'), description: t('form.step.details.desc') },
    { title: t('form.step.tags'), description: t('form.step.tags.desc') },
    {
      title: t('form.step.verification'),
      description: t('form.step.verification.desc'),
    },
    { title: t('form.step.review'), description: t('form.step.review.desc') },
  ];

  // Get supported languages
  const supportedLangs = form.watch('supported_languages') || [LanguageCodes.PORTUGUESE];
  const primaryLanguage = form.watch('event_language');

  // Add translation steps if there are additional languages
  const translationLanguages = supportedLangs.filter((lang) => lang !== primaryLanguage);

  // Modified steps with translation steps
  const allSteps = [...baseSteps];

  // Insert translation steps after tags step
  if (translationLanguages.length > 0) {
    translationLanguages.forEach((lang, index) => {
      allSteps.splice(5 + index, 0, {
        title: `${t('form.step.language')} (${
          lang === LanguageCodes.PORTUGUESE
            ? 'Português'
            : lang === LanguageCodes.ENGLISH
              ? 'English'
              : 'Español'
        })`,
        description: t('form.step.language.desc'),
      });
    });
  }

  // Handle step navigation
  const goToNextStep = async () => {
    // Validate fields in current step
    let fieldsToValidate: (keyof EventFormValues)[] = [];

    switch (currentStep) {
      case 0:
        fieldsToValidate = ['event_language', 'supported_languages'];
        break;
      case 1:
        fieldsToValidate = ['organization_name', 'event_name', 'event_edition'];
        break;
      case 2:
        fieldsToValidate = ['start_date', 'start_time', 'end_date', 'end_time'];
        if (!form.getValues('online')) {
          fieldsToValidate.push('address', 'state', 'maps_link');
        }
        break;
      case 3:
        fieldsToValidate = ['event_link', 'cost_type', 'short_description'];

        if (form.getValues('cost_type') === 'paid') {
          fieldsToValidate.push('cost_value', 'cost_currency');

          const costValue = form.getValues('cost_value');
          const costCurrency = form.getValues('cost_currency');

          if (costValue === null || costValue === undefined) {
            form.setError('cost_value', {
              type: 'manual',
              message: t('validation.costValue.required'),
            });
            return;
          }

          if (costCurrency === null || costCurrency === undefined) {
            form.setError('cost_currency', {
              type: 'manual',
              message: t('validation.costCurrency.required'),
            });
            return;
          }
        }

        if (form.getValues('cost_type') === 'undefined') {
          fieldsToValidate.push('cost_value', 'cost_currency');

          const costValue = form.getValues('cost_value');
          const costCurrency = form.getValues('cost_currency');

          if (costValue !== 0) {
            form.setError('cost_value', {
              type: 'manual',
              message: t('validation.costValue.undefined'),
            });
            return;
          }

          if (costCurrency === null || costCurrency === undefined) {
            form.setError('cost_currency', {
              type: 'manual',
              message: t('validation.costCurrency.required'),
            });
            return;
          }
        }
        break;
      case 4:
        fieldsToValidate = ['tags'];
        break;
      case allSteps.length - 2:
        fieldsToValidate = ['recaptcha'];
        break;
      default:
        break;
    }

    const isStepValid = await form.trigger(fieldsToValidate);

    const hasErrors = fieldsToValidate.some((field) => form.formState.errors[field]);

    if (isStepValid && !hasErrors) {
      if (currentStep < allSteps.length - 1) {
        setCurrentStep((prev) => prev + 1);
      }
    }
  };

  const goToPrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleRecaptchaChange = (token: string | null) => {
    form.setValue('recaptcha', token || '', { shouldValidate: true });
  };

  return {
    currentStep,
    allSteps,
    translationLanguages,
    goToNextStep,
    goToPrevStep,
    handleRecaptchaChange,
  };
};
