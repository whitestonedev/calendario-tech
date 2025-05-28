import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { TURNSTILE_SITE_KEY } from '@/config/constants';
import Turnstile from 'react-cloudflare-turnstile';

const MAX_REQUESTS = 10;
const TIME_WINDOW = 60000; // 1 minuto em milissegundos

export const useRateLimit = () => {
  const [requestCount, setRequestCount] = useState(0);
  const [lastRequestTime, setLastRequestTime] = useState<number>(0);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const { toast } = useToast();

  const resetCounter = useCallback(() => {
    setRequestCount(0);
    setLastRequestTime(Date.now());
  }, []);

  useEffect(() => {
    // Reset counter after TIME_WINDOW
    const timer = setInterval(() => {
      if (Date.now() - lastRequestTime >= TIME_WINDOW) {
        resetCounter();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [lastRequestTime, resetCounter]);

  const checkRateLimit = useCallback(() => {
    const now = Date.now();

    // Se passou o tempo da janela, reseta o contador
    if (now - lastRequestTime >= TIME_WINDOW) {
      resetCounter();
      return true;
    }

    // Se atingiu o limite de requisições
    if (requestCount >= MAX_REQUESTS) {
      setShowCaptcha(true);
      toast({
        title: 'Limite de requisições excedido',
        description: 'Por favor, complete a verificação para continuar.',
        variant: 'destructive',
      });
      return false;
    }

    // Incrementa o contador
    setRequestCount((prev) => prev + 1);
    setLastRequestTime(now);
    return true;
  }, [requestCount, lastRequestTime, resetCounter, toast]);

  const handleCaptchaSuccess = useCallback(
    (token: string) => {
      setCaptchaToken(token);
      setShowCaptcha(false);
      resetCounter();
    },
    [resetCounter]
  );

  const handleCaptchaError = useCallback(
    (error: string) => {
      console.error('Turnstile error:', error);
      setCaptchaToken(null);
      toast({
        title: 'Erro na verificação',
        description: 'Por favor, tente novamente.',
        variant: 'destructive',
      });
    },
    [toast]
  );

  const handleCaptchaExpired = useCallback(() => {
    setCaptchaToken(null);
    toast({
      title: 'Verificação expirada',
      description: 'Por favor, complete a verificação novamente.',
      variant: 'destructive',
    });
  }, [toast]);

  const CaptchaComponent = useCallback(() => {
    if (!showCaptcha) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
          <h3 className="text-lg font-medium mb-4">Verificação necessária</h3>
          <p className="text-gray-600 mb-4">
            Você atingiu o limite de requisições. Por favor, complete a verificação para continuar.
          </p>
          <div className="flex justify-center">
            <Turnstile
              turnstileSiteKey={TURNSTILE_SITE_KEY}
              callback={handleCaptchaSuccess}
              errorCallback={handleCaptchaError}
              expiredCallback={handleCaptchaExpired}
              theme="light"
              size="normal"
              execution="render"
              action="rate_limit"
              refreshExpired="auto"
              retry="auto"
              retryInterval={5000}
              refreshTimeout="auto"
            />
          </div>
        </div>
      </div>
    );
  }, [showCaptcha, handleCaptchaSuccess, handleCaptchaError, handleCaptchaExpired]);

  return {
    checkRateLimit,
    captchaToken,
    CaptchaComponent,
    showCaptcha,
  };
};
