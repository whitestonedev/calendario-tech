import { z, ZodIssueCode } from 'zod';
import { Currency } from '@/types/currency';
import { LanguageCode, LanguageCodes } from '@/types/language';

export interface FormEventValues {
  // Basic info
  organization_name: string;
  event_name: string;
  event_edition: string;

  // Language
  event_language: LanguageCode;
  supported_languages: LanguageCode[];

  // Date and location
  start_date: Date;
  start_time: string;
  end_date: Date;
  end_time: string;
  online: boolean;
  address?: string;
  maps_link?: string;
  state?: string;

  // Details
  event_link: string;
  cost_type: 'free' | 'paid';
  cost_value?: number | null;
  cost_currency?: Currency | null;
  short_description: string;
  banner_link?: string;

  // Tags
  tags: string[];

  // Translations for other languages
  translations?: {
    [key: string]: z.infer<typeof TranslationSchema>;
  };

  // Verification
  recaptcha: string;
}

const TranslationSchema = z
  .object({
    event_name: z.string().optional(),
    event_edition: z.string().optional(),
    short_description: z.string().optional(),
    cost_type: z.enum(['free', 'paid']).optional(),
    cost_value: z.preprocess((val) => {
      if (val === '' || val === null || val === undefined) return null;
      const num = parseFloat(val as string);
      return isNaN(num) ? null : num;
    }, z.number().nullable().optional()),
    cost_currency: z.nativeEnum(Currency).nullable().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.cost_type === 'free') {
      return;
    }

    if (data.cost_type === 'paid') {
      if (data.cost_value === undefined || data.cost_value === null) {
        ctx.addIssue({
          code: ZodIssueCode.custom,
          path: ['cost_value'],
          message: 'validation.translation.costValue.required',
        });
      }
      if (data.cost_currency === undefined || data.cost_currency === null) {
        ctx.addIssue({
          code: ZodIssueCode.custom,
          path: ['cost_currency'],
          message: 'validation.translation.costCurrency.required',
        });
      }
    }
  });

export const eventFormSchema = z
  .object({
    organization_name: z.string().min(2, {
      message: 'validation.orgName.min',
    }),
    event_name: z.string().min(3, {
      message: 'validation.eventName.min',
    }),
    event_language: z.nativeEnum(LanguageCodes, {
      required_error: 'validation.eventLanguage.required',
    }),
    supported_languages: z.array(z.nativeEnum(LanguageCodes)).default([LanguageCodes.PORTUGUESE]),
    start_date: z.date({
      required_error: 'validation.startDate.required',
    }),
    start_time: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
      message: 'validation.startTime.format',
    }),
    end_date: z.date({
      required_error: 'validation.endDate.required',
    }),
    end_time: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
      message: 'validation.endTime.format',
    }),
    online: z.boolean().default(false),
    address: z.string().optional(),
    maps_link: z.string().optional(),
    state: z.string().optional(),
    event_link: z.string().url({
      message: 'validation.eventLink.invalid',
    }),
    tags: z.array(z.string()).min(1, {
      message: 'validation.tags.min',
    }),
    event_edition: z.string().min(1, {
      message: 'validation.eventEdition.required',
    }),
    cost_type: z.enum(['free', 'paid'], {
      required_error: 'validation.costType.required',
    }),
    cost_value: z.preprocess(
      (val) => {
        if (val === '' || val === null || val === undefined) return null;
        const num = parseFloat(val as string);
        return isNaN(num) ? null : num;
      },
      z
        .number({
          invalid_type_error: 'validation.costValue.invalid',
        })
        .nullable()
    ),
    cost_currency: z.nativeEnum(Currency).nullable(),
    banner_link: z
      .string()
      .url({
        message: 'validation.bannerLink.invalid',
      })
      .optional(),
    short_description: z
      .string()
      .min(10, {
        message: 'validation.description.min',
      })
      .max(300, {
        message: 'validation.description.max',
      }),
    recaptcha: z.string().min(1, {
      message: 'validation.recaptcha.required',
    }),
    translations: z.record(z.string(), TranslationSchema).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.cost_type === 'paid') {
      if (data.cost_value === null || data.cost_value === undefined) {
        ctx.addIssue({
          code: ZodIssueCode.custom,
          path: ['cost_value'],
          message: 'validation.costValue.required',
        });
      } else if (data.cost_value < 0) {
        ctx.addIssue({
          code: ZodIssueCode.custom,
          path: ['cost_value'],
          message: 'validation.costValue.invalid',
        });
      }

      if (data.cost_currency === null || data.cost_currency === undefined) {
        ctx.addIssue({
          code: ZodIssueCode.custom,
          path: ['cost_currency'],
          message: 'validation.costCurrency.required',
        });
      }
    }

    if (!data.online) {
      if (!data.address || data.address.trim().length < 10) {
        ctx.addIssue({
          code: ZodIssueCode.custom,
          path: ['address'],
          message: 'validation.address.min',
        });
      }

      if (!data.maps_link) {
        ctx.addIssue({
          code: ZodIssueCode.custom,
          path: ['maps_link'],
          message: 'validation.mapsLink.required',
        });
      } else {
        try {
          const url = new URL(data.maps_link);
          const isValidGoogleMaps =
            url.hostname.includes('google.com') ||
            url.hostname.includes('goo.gl') ||
            url.hostname.includes('maps.app.goo.gl');

          if (!isValidGoogleMaps) {
            ctx.addIssue({
              code: ZodIssueCode.custom,
              path: ['maps_link'],
              message: 'validation.mapsLink.invalid',
            });
          }
        } catch {
          ctx.addIssue({
            code: ZodIssueCode.custom,
            path: ['maps_link'],
            message: 'validation.mapsLink.invalid',
          });
        }
      }

      if (
        !data.state ||
        data.state.trim() === '' ||
        data.state === 'undefined' ||
        data.state === 'null'
      ) {
        ctx.addIssue({
          code: ZodIssueCode.custom,
          path: ['state'],
          message: 'validation.state.required',
        });
      }
    }

    if (data.translations) {
      Object.entries(data.translations).forEach(([lang, trans]) => {
        if (lang === data.event_language) return;

        if (trans.cost_type !== data.cost_type) {
          ctx.addIssue({
            code: ZodIssueCode.custom,
            path: ['translations', lang, 'cost_type'],
            message: 'validation.translation.costType.mustMatch',
          });
        }

        if (!trans.event_name || trans.event_name.trim().length < 3) {
          ctx.addIssue({
            code: ZodIssueCode.custom,
            path: ['translations', lang, 'event_name'],
            message: 'validation.eventName.min',
          });
        }

        if (!trans.event_edition || trans.event_edition.trim().length === 0) {
          ctx.addIssue({
            code: ZodIssueCode.custom,
            path: ['translations', lang, 'event_edition'],
            message: 'validation.eventEdition.required',
          });
        }

        if (!trans.short_description || trans.short_description.trim().length < 10) {
          ctx.addIssue({
            code: ZodIssueCode.custom,
            path: ['translations', lang, 'short_description'],
            message: 'validation.description.min',
          });
        }

        if (data.cost_type === 'paid') {
          if (trans.cost_value === null || trans.cost_value === undefined) {
            ctx.addIssue({
              code: ZodIssueCode.custom,
              path: ['translations', lang, 'cost_value'],
              message: 'validation.costValue.required',
            });
          }

          if (!trans.cost_currency) {
            ctx.addIssue({
              code: ZodIssueCode.custom,
              path: ['translations', lang, 'cost_currency'],
              message: 'validation.costCurrency.required',
            });
          }
        }
      });
    }
  });

export const eventTags = [
  'javascript',
  'typescript',
  'react',
  'vue',
  'angular',
  'node',
  'python',
  'django',
  'flask',
  'fastapi',
  'java',
  'spring',
  'go',
  'rust',
  'php',
  'laravel',
  'ruby',
  'rails',
  'aws',
  'azure',
  'gcp',
  'devops',
  'docker',
  'kubernetes',
  'mobile',
  'flutter',
  'react-native',
  'ios',
  'android',
  'data',
  'machine-learning',
  'ai',
  'blockchain',
  'ux',
  'ui',
  'design',
  'product',
  'agile',
  'scrum',
  'management',
  'career',
  'cybersecurity',
  'networking',
];

export type EventFormValues = z.infer<typeof eventFormSchema>;
