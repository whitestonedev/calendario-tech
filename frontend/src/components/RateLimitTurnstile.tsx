import React from 'react';
import Turnstile from 'react-cloudflare-turnstile';
import { useLanguage } from '@/context/LanguageContext';
import { TURNSTILE_SITE_KEY } from '@/config/constants';
import { Button } from '@/components/ui/button';

interface RateLimitTurnstileProps {
  onSuccess: (token: string) => void;
  onError: () => void;
  onExpired: () => void;
  onClose: () => void;
  isValidated: boolean;
}

export const RateLimitTurnstile: React.FC<RateLimitTurnstileProps> = ({
  onSuccess,
  onError,
  onExpired,
  onClose,
  isValidated,
}) => {
  const { t } = useLanguage();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full mx-4">
        <h3 className="text-lg font-medium mb-4">{t('rateLimit.title')}</h3>
        <p className="text-sm text-gray-600 mb-4">{t('rateLimit.description')}</p>

        <div className="flex flex-col items-center gap-4">
          <Turnstile
            turnstileSiteKey={TURNSTILE_SITE_KEY}
            callback={onSuccess}
            theme="light"
            refreshExpired="auto"
            errorCallback={onError}
            expiredCallback={onExpired}
            retry="auto"
            retryInterval={5000}
          />

          {isValidated && (
            <Button variant="outline" onClick={onClose} className="mt-4 w-full">
              {t('rateLimit.close')}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
