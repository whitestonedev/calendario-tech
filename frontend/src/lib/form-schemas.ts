import { z, ZodIssueCode } from "zod";
import { Currency } from "@/types/currency";

export interface FormEventValues {
  // Basic info
  organization_name: string;
  event_name: string;
  event_edition: string;

  // Language
  event_language: "pt-br" | "en-us" | "es-es";
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
  cost_type: "free" | "paid";
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
    cost_type: z.enum(["free", "paid"]).optional(),
    cost_value: z.preprocess(
      (val) => (val === "" ? null : parseFloat(val as string)),
      z.number().nullable().optional()
    ),
    cost_currency: z.nativeEnum(Currency).nullable().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.cost_type === "paid") {
      if (
        data.cost_value === undefined ||
        data.cost_value === null ||
        data.cost_value < 0
      ) {
        ctx.addIssue({
          code: ZodIssueCode.custom,
          path: ["cost_value"],
          message:
            "Valor do custo é obrigatório e não pode ser negativo para eventos pagos nesta tradução",
        });
      }
      if (data.cost_currency === undefined || data.cost_currency === null) {
        ctx.addIssue({
          code: ZodIssueCode.custom,
          path: ["cost_currency"],
          message: "Moeda é obrigatória para eventos pagos nesta tradução",
        });
      }
    }
  });

export const eventFormSchema = z
  .object({
    organization_name: z.string().min(2, {
      message: "Nome da organização deve ter pelo menos 2 caracteres",
    }),
    event_name: z.string().min(3, {
      message: "Nome do evento deve ter pelo menos 3 caracteres",
    }),
    event_language: z.string().min(1, {
      message: "Selecione um idioma",
    }),
    supported_languages: z.array(z.string()).default([]),
    start_date: z.date({
      required_error: "Data de início é obrigatória",
    }),
    start_time: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
      message: "Formato inválido, use HH:MM (ex: 13:30)",
    }),
    end_date: z.date({
      required_error: "Data de término é obrigatória",
    }),
    end_time: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
      message: "Formato inválido, use HH:MM (ex: 13:30)",
    }),
    online: z.boolean().default(false),
    address: z.string().optional(),
    maps_link: z
      .string()
      .optional()
      .refine(
        (val) => {
          // Se o evento for online, aceita qualquer valor (incluindo vazio)
          if (val === undefined || val === "") return true;
          // Se não for online e tiver um valor, deve ser uma URL válida
          try {
            new URL(val);
            return true;
          } catch {
            return false;
          }
        },
        { message: "URL inválida" }
      ),
    event_link: z.string().url({
      message: "URL do evento inválida",
    }),
    tags: z.array(z.string()).min(1, {
      message: "Selecione pelo menos uma tag",
    }),
    event_edition: z.string().min(1, {
      message: "Edição do evento é obrigatória",
    }),
    cost_type: z.enum(["free", "paid"], {
      required_error: "Selecione o tipo de custo",
    }),
    cost_value: z.preprocess(
      (val) => (val === "" ? null : parseFloat(val as string)),
      z.number().nullable().optional()
    ),
    cost_currency: z.nativeEnum(Currency).nullable().optional(),
    banner_link: z
      .string()
      .url({
        message: "URL do banner inválida",
      })
      .optional(),
    short_description: z
      .string()
      .min(10, {
        message: "Descrição deve ter pelo menos 10 caracteres",
      })
      .max(300, {
        message: "Descrição não pode ter mais de 300 caracteres",
      }),
    recaptcha: z
      .string()
      .min(1, { message: "Por favor, complete o reCAPTCHA" }),
    translations: z.record(TranslationSchema).optional(),
    state: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // Validação cruzada para campos de custo principais
    if (data.cost_type === "paid") {
      if (
        data.cost_value === undefined ||
        data.cost_value === null ||
        data.cost_value < 0
      ) {
        ctx.addIssue({
          code: ZodIssueCode.custom,
          path: ["cost_value"],
          message:
            "Valor do custo é obrigatório e não pode ser negativo para eventos pagos",
        });
      }
      if (data.cost_currency === undefined || data.cost_currency === null) {
        ctx.addIssue({
          code: ZodIssueCode.custom,
          path: ["cost_currency"],
          message: "Moeda é obrigatória para eventos pagos",
        });
      }
    }
    if (!data.online && (!data.state || data.state.trim() === "")) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        path: ["state"],
        message: "O estado é obrigatório para eventos presenciais",
      });
    }
  });

export const eventTags = [
  "javascript",
  "typescript",
  "react",
  "vue",
  "angular",
  "node",
  "python",
  "django",
  "flask",
  "fastapi",
  "java",
  "spring",
  "go",
  "rust",
  "php",
  "laravel",
  "ruby",
  "rails",
  "aws",
  "azure",
  "gcp",
  "devops",
  "docker",
  "kubernetes",
  "mobile",
  "flutter",
  "react-native",
  "ios",
  "android",
  "data",
  "machine-learning",
  "ai",
  "blockchain",
  "ux",
  "ui",
  "design",
  "product",
  "agile",
  "scrum",
  "management",
  "career",
  "cybersecurity",
  "networking",
];

export type EventFormValues = z.infer<typeof eventFormSchema>;
