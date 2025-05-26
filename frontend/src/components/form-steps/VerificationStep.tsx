import React, { useState } from 'react';
import Turnstile from 'react-cloudflare-turnstile';
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
import { useLanguage } from '@/context/LanguageContext';
import { TURNSTILE_SITE_KEY } from '@/lib/constants';

interface VerificationStepProps {
  form: UseFormReturn<EventFormValues>;
  handleRecaptchaChange: (token: string | null) => void;
}

const VerificationStep: React.FC<VerificationStepProps> = ({ form, handleRecaptchaChange }) => {
  const { t } = useLanguage();
  const [_isVerified, setIsVerified] = useState(false);

  const handleSuccess = (token: string) => {
    setIsVerified(true);
    handleRecaptchaChange(token);
  };

  const handleError = (_error: string) => {
    setIsVerified(false);
    handleRecaptchaChange(null);
    form.setError('recaptcha', {
      type: 'manual',
      message: t('validation.recaptcha.error'),
    });
  };

  const handleExpired = () => {
    setIsVerified(false);
    handleRecaptchaChange(null);
    form.setError('recaptcha', {
      type: 'manual',
      message: t('validation.recaptcha.expired'),
    });
  };

  return (
    <FormField
      control={form.control}
      name="recaptcha"
      render={({ _field }) => (
        <FormItem>
          <FormLabel>{t('form.verification')}</FormLabel>
          <FormControl>
            <div className="flex justify-center">
              <Turnstile
                turnstileSiteKey={TURNSTILE_SITE_KEY}
                callback={handleSuccess}
                theme="light"
                refreshExpired="auto"
                errorCallback={handleError}
                expiredCallback={handleExpired}
                retry="auto"
                retryInterval={5000}
              />
            </div>
          </FormControl>
          <FormDescription>{t('form.verificationDesc')}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default VerificationStep;
