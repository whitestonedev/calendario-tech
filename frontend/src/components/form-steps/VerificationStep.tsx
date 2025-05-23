
import React from "react";
import ReCAPTCHA from 'react-google-recaptcha';
import { FormControl, FormField, FormItem, FormLabel, FormDescription, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { EventFormValues } from "@/lib/form-schemas";
import { useLanguage } from "@/context/LanguageContext";

interface VerificationStepProps {
  form: UseFormReturn<EventFormValues>;
  recaptchaRef: React.RefObject<ReCAPTCHA>;
  handleRecaptchaChange: (token: string | null) => void;
}

const VerificationStep: React.FC<VerificationStepProps> = ({ 
  form, 
  recaptchaRef, 
  handleRecaptchaChange 
}) => {
  const { t } = useLanguage();
  
  return (
    <FormField
      control={form.control}
      name="recaptcha"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t('form.verification')}</FormLabel>
          <FormControl>
            <div className="flex justify-center">
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI" // This is Google's test key
                onChange={handleRecaptchaChange}
              />
            </div>
          </FormControl>
          <FormDescription>
            {t('form.verificationDesc')}
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default VerificationStep;
