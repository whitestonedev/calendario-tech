import { z, ZodIssueCode } from 'zod';
import { Currency } from '@/types/currency';

export interface FormEventValues {
  // Basic info
  organization_name: string;
  event_name: string;
  event_edition: string;

  // Language
  event_language: 'pt-br' | 'en-us' | 'es-es';
  supported_languages: string[];

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
    cost_value: z.preprocess(
      (val) => (val === '' ? null : parseFloat(val as string)),
      z.number().nullable().optional()
    ),
    cost_currency: z.nativeEnum(Currency).nullable().optional(),
  })
  .superRefine((data, ctx) => {
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
    event_language: z.string().min(1, {
      message: 'validation.eventLanguage.required',
    }),
    supported_languages: z.array(z.string()).default([]),
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
    address: z.string().refine(
      (val) => {
        const normalizedAddress = val?.trim();

        if (!normalizedAddress) {
          return false;
        }

        if (normalizedAddress.length < 10) {
          return false;
        }

        return true;
      },
      {
        message: 'validation.address.min',
      }
    ),
    maps_link: z.string().refine(
      (val) => {
        const normalizedLink = val?.trim();

        if (!normalizedLink) {
          return false;
        }

        try {
          const url = new URL(normalizedLink);
          const isValidGoogleMaps =
            url.hostname.includes('google.com') ||
            url.hostname.includes('goo.gl') ||
            url.hostname.includes('maps.app.goo.gl');

          if (!isValidGoogleMaps) {
            return false;
          }

          return true;
        } catch {
          return false;
        }
      },
      {
        message: 'validation.mapsLink.invalid',
      }
    ),
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
    recaptcha: z.string().min(1, { message: 'validation.recaptcha.required' }),
    translations: z.record(TranslationSchema).optional(),
    state: z.string(),
  })
  .superRefine((data, ctx) => {
    // Validação cruzada para campos de custo principais
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

      if (
        !data.maps_link ||
        data.maps_link.trim() === '' ||
        data.maps_link === 'undefined' ||
        data.maps_link === 'null'
      ) {
        ctx.addIssue({
          code: ZodIssueCode.custom,
          path: ['maps_link'],
          message: 'validation.mapsLink.required',
        });
      }
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
