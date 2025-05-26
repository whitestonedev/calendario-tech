import { LanguageCode, LanguageCodes } from '@/types/language';

/**
 * Returns the flag URL for a given language code
 * @param lang Language code (e.g. pt-br, en-us, es-es)
 * @returns Flag URL from flagcdn.com service
 */
export const getFlagUrl = (lang: LanguageCode): string => {
  switch (lang) {
    case LanguageCodes.PORTUGUESE:
      return 'https://flagcdn.com/24x18/br.png';
    case LanguageCodes.ENGLISH:
      return 'https://flagcdn.com/24x18/us.png';
    case LanguageCodes.SPANISH:
      return 'https://flagcdn.com/24x18/es.png';
    default:
      return 'https://flagcdn.com/24x18/un.png';
  }
};
