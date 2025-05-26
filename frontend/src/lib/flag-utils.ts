import { LanguageCode, LanguageCodes } from '@/types/language';

/**
 * Returns the flag URL for a given language code
 * @param lang Language code (e.g. pt-br, en-us, es-es)
 * @returns Flag URL from local static files
 */
export const getFlagUrl = (lang: LanguageCode): string => {
  switch (lang) {
    case LanguageCodes.PORTUGUESE:
      return '/flags/br.png';
    case LanguageCodes.ENGLISH:
      return '/flags/us.png';
    case LanguageCodes.SPANISH:
      return '/flags/es.png';
    default:
      return '/flags/un.png';
  }
};
