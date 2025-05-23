import React, { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { eventFormSchema, EventFormValues } from "@/lib/form-schemas";
import { useToast } from "@/hooks/use-toast";
import { submitEvent } from "@/services/api";
import { useLanguage } from "@/context/LanguageContext";
import { format } from "date-fns";

// Import refactored components
import FormProgress from "./form-parts/FormProgress";
import StepNavigation from "./form-parts/StepNavigation";
import StepRenderer from "./form-parts/StepRenderer";
import { useFormSteps } from "./form-parts/useFormSteps";
import SuccessStep from "./form-steps/SuccessStep";

const MultiStepEventForm: React.FC = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  // Initialize the form
  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      organization_name: "",
      event_name: "",
      event_edition: "",
      online: false,
      tags: [],
      cost: "Grátis",
      event_language: "pt-br",
      supported_languages: ["pt-br"],
      translations: {},
      start_date: new Date(),
      start_time: "09:00",
      end_date: new Date(),
      end_time: "18:00",
      address: "",
      maps_link: "",
      event_link: "",
      banner_link: "",
      short_description: "",
      recaptcha: "",
    },
    mode: "onChange",
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
    recaptchaRef,
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
          event_name: "",
          event_edition: "",
          cost: "",
          short_description: "",
        });
      }
    });
  }, [translationLanguages, form]);

  // Handle form submission
  const onSubmit = async (values: EventFormValues) => {
    try {
      console.info("Sending envent");

      const eventData = {
        organization_name: values.organization_name,
        event_name: values.event_name,
        start_datetime: `${format(values.start_date, "yyyy-MM-dd")}T${
          values.start_time
        }`,
        end_datetime: `${format(values.end_date, "yyyy-MM-dd")}T${
          values.end_time
        }`,
        address: values.address || "",
        maps_link: values.maps_link || "",
        online: values.online,
        event_link: values.event_link,
        tags: values.tags,
        intl: {
          [values.event_language]: {
            event_edition: values.event_edition,
            cost: values.cost,
            banner_link: values.banner_link || "",
            short_description: values.short_description,
          },
          ...Object.entries(values.translations || {}).reduce(
            (acc, [lang, trans]) => ({
              ...acc,
              [lang]: {
                event_edition: trans.event_edition || "",
                cost: trans.cost || "",
                banner_link: values.banner_link || "",
                short_description: trans.short_description || "",
              },
            }),
            {}
          ),
        },
      };

      const response = await submitEvent(eventData);

      toast({
        title: t("toast.eventSubmitted"),
        description: t("toast.eventSubmittedDesc"),
      });

      setIsSubmitted(true);

      form.reset();

      // Reset reCAPTCHA
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
      }
    } catch (error) {
      console.error("Erro detalhado na submissão:", error);

      // Mostrar mensagem de erro mais detalhada
      const errorMessage =
        error instanceof Error
          ? error.message
          : typeof error === "string"
          ? error
          : t("error.submissionDesc");

      toast({
        title: t("error.submission"),
        description: errorMessage,
        variant: "destructive",
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
                recaptchaRef={recaptchaRef}
                handleRecaptchaChange={handleRecaptchaChange}
                translationLanguages={translationLanguages}
                allSteps={allSteps}
              />

              <StepNavigation
                currentStep={currentStep}
                totalSteps={allSteps.length}
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
