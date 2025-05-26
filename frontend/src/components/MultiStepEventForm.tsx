import React, { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { eventFormSchema, EventFormValues } from '@/lib/form-schemas';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/LanguageContext';
import { format } from 'date-fns';
import { Currency } from '@/types/currency';
import { submitEvent } from '@/services/api';
import { LanguageCodes } from '@/types/language';

// Import refactored components
import FormProgress from './form-parts/FormProgress';
import StepNavigation from './form-parts/StepNavigation';
import StepRenderer from './form-parts/StepRenderer';
import { useFormSteps } from './form-parts/useFormSteps';
import SuccessStep from './form-steps/SuccessStep';

const MultiStepEventForm: React.FC = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  // Initialize the form
  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      organization_name: '',
      event_name: '',
      event_edition: '',
      online: false,
      tags: [],
      cost_type: 'free',
      cost_value: null,
      cost_currency: null,
      event_language: LanguageCodes.PORTUGUESE,
      supported_languages: [LanguageCodes.PORTUGUESE],
      translations: {},
      start_date: new Date(),
      start_time: '09:00',
      end_date: new Date(),
      end_time: '18:00',
      address: '',
      maps_link: '',
      event_link: '',
      banner_link: '',
      short_description: '',
      recaptcha: '',
    },
    mode: 'all',
    reValidateMode: 'onChange',
  });
  const handleFinalSubmit = () => {
    form.handleSubmit((values) => {
      onSubmit(values);
    })();
  };

  // Get form step handling logic from custom hook
  const {
    currentStep,
    allSteps,
    translationLanguages,
    goToNextStep,
    goToPrevStep,
    handleRecaptchaChange,
  } = useFormSteps(form);

  useEffect(() => {
    translationLanguages.forEach((lang) => {
      const path = `translations.${lang}` as const;
      const value = form.getValues(path);

      if (!value) {
        form.setValue(path, {
          event_name: '',
          event_edition: '',
          cost_type: 'free',
          cost_value: null,
          cost_currency: null,
          short_description: '',
        });
      }
    });
  }, [translationLanguages, form]);

  // Helper para formatar o custo
  const formatCost = (
    type: 'free' | 'paid' | undefined,
    value: number | null | undefined,
    currency: Currency | null | undefined,
    _lang: string
  ): { value: number | undefined; currency: Currency | undefined } => {
    if (type === 'free') {
      return { value: undefined, currency: undefined };
    } else if (type === 'paid' && value !== undefined && value !== null && currency) {
      return { value, currency };
    }
    return { value: undefined, currency: undefined };
  };

  // Handle form submission
  const onSubmit = async (values: EventFormValues) => {
    try {
      const _eventData = {
        organization_name: values.organization_name,
        event_name: values.event_name,
        start_datetime: `${format(values.start_date, 'yyyy-MM-dd')}T${values.start_time}`,
        end_datetime: `${format(values.end_date, 'yyyy-MM-dd')}T${values.end_time}`,
        address: values.address || '',
        maps_link: values.maps_link || '',
        online: values.online,
        is_free: values.cost_type === 'free',
        event_link: values.event_link,
        tags: values.tags,
        state: values.state,
        intl: {
          [values.event_language]: {
            event_edition: values.event_edition,
            cost: formatCost(
              values.cost_type,
              values.cost_value,
              values.cost_currency,
              values.event_language
            ).value,
            currency: formatCost(
              values.cost_type,
              values.cost_value,
              values.cost_currency,
              values.event_language
            ).currency,
            banner_link: values.banner_link || '',
            short_description: values.short_description,
          },
          ...Object.entries(values.translations || {}).reduce((acc, [lang, trans]) => {
            const costInfo = formatCost(
              trans.cost_type,
              trans.cost_value,
              trans.cost_currency,
              lang
            );

            return {
              ...acc,
              [lang]: {
                event_edition: trans.event_edition || '',
                cost: costInfo.value,
                currency: costInfo.currency,
                banner_link: values.banner_link || '',
                short_description: trans.short_description || '',
              },
            };
          }, {}),
        },
      };

      await submitEvent(_eventData);

      toast({
        title: t('toast.eventSubmitted'),
        description: t('toast.eventSubmittedDesc'),
      });

      setIsSubmitted(true);
      form.reset();
    } catch (error) {
      console.error('Erro detalhado na submissão:', error);
      console.error(
        'Stack trace:',
        error instanceof Error ? error.stack : 'No stack trace available'
      );

      const errorMessage =
        error instanceof Error
          ? t(error.message)
          : typeof error === 'string'
            ? error
            : t('error.submissionDesc');

      toast({
        title: t('error.submission'),
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      {!isSubmitted ? (
        <>
          <FormProgress steps={allSteps} currentStep={currentStep} />
          <Form {...form}>
            <form className="space-y-6">
              <StepRenderer
                currentStep={currentStep}
                form={form}
                handleRecaptchaChange={handleRecaptchaChange}
                translationLanguages={translationLanguages}
                allSteps={allSteps}
              />

              <StepNavigation
                currentStep={currentStep}
                onPrevious={goToPrevStep}
                onNext={goToNextStep}
                isSubmitStep={currentStep === allSteps.length - 1}
                onSubmitClick={handleFinalSubmit}
              />
            </form>
          </Form>
        </>
      ) : (
        <SuccessStep />
      )}
    </div>
  );
};

export default MultiStepEventForm;
