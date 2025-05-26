/**
 * Language codes supported by the application
 */
export type LanguageCode = 'pt-br' | 'en-us' | 'es-es';

/**
 * Object containing available language codes
 */
export const LanguageCodes = {
  PORTUGUESE: 'pt-br',
  ENGLISH: 'en-us',
  SPANISH: 'es-es',
} as const;

/**
 * Checks if a string is a valid language code
 */
export const isValidLanguageCode = (code: string): code is LanguageCode => {
  return Object.values(LanguageCodes).includes(code as LanguageCode);
};
