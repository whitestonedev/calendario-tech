import React from "react";
import { UseFormReturn } from "react-hook-form";
import { EventFormValues } from "@/lib/form-schemas";
import ReCAPTCHA from "react-google-recaptcha";

// Import all step components
import LanguageStep from "../form-steps/LanguageStep";
import BasicInfoStep from "../form-steps/BasicInfoStep";
import DateLocationStep from "../form-steps/DateLocationStep";
import EventDetailsStep from "../form-steps/EventDetailsStep";
import TagsStep from "../form-steps/TagsStep";
import TranslationStep from "../form-steps/TranslationStep";
import VerificationStep from "../form-steps/VerificationStep";
import ReviewStep from "../form-steps/ReviewStep";

interface StepRendererProps {
  currentStep: number;
  form: UseFormReturn<EventFormValues>;
  recaptchaRef: React.RefObject<ReCAPTCHA>;
  handleRecaptchaChange: (token: string | null) => void;
  translationLanguages: string[];
  allSteps: { title: string; description: string }[];
}

const StepRenderer: React.FC<StepRendererProps> = ({
  currentStep,
  form,
  recaptchaRef,
  handleRecaptchaChange,
  translationLanguages,
  allSteps,
}) => {
  // Determine if current step is a translation step
  const isTranslationStep = (step: number) => {
    return step > 4 && step < allSteps.length - 2;
  };

  // Get the language for the current translation step
  const getCurrentTranslationLanguage = () => {
    if (isTranslationStep(currentStep)) {
      return translationLanguages[currentStep - 5];
    }
    return null;
  };

  const reviewStepIndex = allSteps.length - 1;
  const verificationStepIndex = allSteps.length - 2;

  if (currentStep === 0) {
    return <LanguageStep form={form} />;
  }

  if (currentStep === 1) {
    return <BasicInfoStep form={form} />;
  }

  if (currentStep === 2) {
    return <DateLocationStep form={form} />;
  }

  if (currentStep === 3) {
    return <EventDetailsStep form={form} />;
  }

  if (currentStep === 4) {
    return <TagsStep form={form} />;
  }

  if (isTranslationStep(currentStep)) {
    const translationLang = getCurrentTranslationLanguage();
    return (
      <TranslationStep
        form={form}
        translationLanguage={translationLang || "en-us"}
      />
    );
  }

  if (currentStep === verificationStepIndex) {
    return (
      <VerificationStep
        form={form}
        recaptchaRef={recaptchaRef}
        handleRecaptchaChange={handleRecaptchaChange}
      />
    );
  }

  if (currentStep === reviewStepIndex) {
    return <ReviewStep form={form} />;
  }

  return null;
};

export default StepRenderer;
