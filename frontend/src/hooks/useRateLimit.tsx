import { useState, useEffect, useCallback } from 'react';

const MAX_REQUESTS = 10;
const TIME_WINDOW = 60000; // 1 minute in milliseconds

export const useRateLimit = () => {
  const [requestCount, setRequestCount] = useState(0);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [lastRequestTime, setLastRequestTime] = useState<number>(0);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [isValidated, setIsValidated] = useState(false);

  const resetCounter = useCallback(() => {
    setRequestCount(0);
    setLastRequestTime(Date.now());
    setTurnstileToken(null);
    // Don't reset isValidated here
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      if (now - lastRequestTime >= TIME_WINDOW) {
        resetCounter();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [lastRequestTime, resetCounter]);

  const checkRateLimit = useCallback(() => {
    const now = Date.now();

    if (now - lastRequestTime >= TIME_WINDOW) {
      resetCounter();
    }

    if (requestCount >= MAX_REQUESTS && !turnstileToken) {
      setShowCaptcha(true);
      return false;
    }

    setRequestCount((prev) => prev + 1);
    setLastRequestTime(now);
    return true;
  }, [requestCount, lastRequestTime, resetCounter, turnstileToken]);

  const handleTurnstileSuccess = useCallback((token: string) => {
    setTurnstileToken(token);
    setIsValidated(true);
  }, []);

  const handleTurnstileError = useCallback(() => {
    setTurnstileToken(null);
    setIsValidated(false);
  }, []);

  const handleTurnstileExpired = useCallback(() => {
    setTurnstileToken(null);
    setIsValidated(false);
  }, []);

  const handleClose = useCallback(() => {
    setShowCaptcha(false);
    setIsValidated(false); // Reset isValidated only when modal is closed
    resetCounter();
  }, [resetCounter]);

  return {
    showCaptcha,
    checkRateLimit,
    turnstileToken,
    handleTurnstileSuccess,
    handleTurnstileError,
    handleTurnstileExpired,
    handleClose,
    requestCount,
    isValidated,
  };
};
