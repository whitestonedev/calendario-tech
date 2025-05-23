import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { EventFormValues } from "@/lib/form-schemas";
import { Flag, GlobeIcon } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface TranslationStepProps {
  form: UseFormReturn<EventFormValues>;
  translationLanguage: string;
}

const TranslationStep: React.FC<TranslationStepProps> = ({
  form,
  translationLanguage,
}) => {
  const { t } = useLanguage();
  const eventLanguage = form.watch("event_language");
  const [isPaid, setIsPaid] = React.useState(false);

  // Get language display info
  const getLanguageDisplay = (code: string) => {
    switch (code) {
      case "pt-br":
        return {
          name: "Português (Brasil)",
          icon: <Flag className="h-4 w-4" />,
        };
      case "en-us":
        return {
          name: "English (US)",
          icon: <GlobeIcon className="h-4 w-4" />,
        };
      case "es-es":
        return { name: "Español", icon: <Flag className="h-4 w-4" /> };
      default:
        return { name: code, icon: <GlobeIcon className="h-4 w-4" /> };
    }
  };

  const handleCostTypeChange = (value: string) => {
    if (value === "free") {
      setIsPaid(false);
      form.setValue(
        `translations.${translationLanguage}.cost`,
        translationLanguage === "pt-br"
          ? "Grátis"
          : translationLanguage === "es-es"
          ? "Gratis"
          : "Free"
      );
    } else {
      setIsPaid(true);
      form.setValue(`translations.${translationLanguage}.cost`, "");
    }
  };

  const handlePaidCostChange = (value: string, currency: string) => {
    const formattedValue = parseFloat(value).toFixed(2);
    form.setValue(
      `translations.${translationLanguage}.cost`,
      `${currency}${formattedValue}`
    );
  };

  const currentLang = getLanguageDisplay(translationLanguage);
  const primaryLang = getLanguageDisplay(eventLanguage);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium flex items-center gap-2">
          {currentLang.icon} {currentLang.name} (
          {t("form.language.translation")})
        </h3>
        <div className="text-sm text-gray-500 flex items-center gap-2">
          {primaryLang.icon} {primaryLang.name} ({t("form.language.primary")})
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name={`translations.${translationLanguage}.event_name`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("form.eventName")}</FormLabel>
              <FormControl>
                <Input placeholder={form.watch("event_name")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`translations.${translationLanguage}.event_edition`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("form.eventEdition")}</FormLabel>
              <FormControl>
                <Input placeholder={form.watch("event_edition")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="space-y-4">
        <FormField
          control={form.control}
          name={`translations.${translationLanguage}.cost`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("form.cost")}</FormLabel>
              <Select
                onValueChange={handleCostTypeChange}
                defaultValue={
                  field.value === "Grátis" ||
                  field.value === "Gratis" ||
                  field.value === "Free"
                    ? "free"
                    : "paid"
                }
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        translationLanguage === "pt-br"
                          ? "Selecione o tipo de custo"
                          : translationLanguage === "es-es"
                          ? "Seleccione el tipo de costo"
                          : "Select cost type"
                      }
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="free">
                    {translationLanguage === "pt-br"
                      ? "Grátis"
                      : translationLanguage === "es-es"
                      ? "Gratis"
                      : "Free"}
                  </SelectItem>
                  <SelectItem value="paid">
                    {translationLanguage === "pt-br"
                      ? "Pago"
                      : translationLanguage === "es-es"
                      ? "Pago"
                      : "Paid"}
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {isPaid && (
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name={`translations.${translationLanguage}.cost`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {translationLanguage === "pt-br"
                      ? "Valor"
                      : translationLanguage === "es-es"
                      ? "Valor"
                      : "Value"}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      onChange={(e) => {
                        const currency = field.value?.charAt(0) || "R$";
                        handlePaidCostChange(e.target.value, currency);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`translations.${translationLanguage}.cost`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {translationLanguage === "pt-br"
                      ? "Moeda"
                      : translationLanguage === "es-es"
                      ? "Moneda"
                      : "Currency"}
                  </FormLabel>
                  <Select
                    onValueChange={(value) => {
                      const currentValue =
                        field.value?.replace(/[^0-9.]/g, "") || "0";
                      handlePaidCostChange(currentValue, value);
                    }}
                    defaultValue={field.value?.charAt(0) || "R$"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="R$">R$ (Real)</SelectItem>
                      <SelectItem value="$">$ (Dólar)</SelectItem>
                      <SelectItem value="₱">₱ (Peso)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}
      </div>

      <FormField
        control={form.control}
        name={`translations.${translationLanguage}.short_description`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("form.description")}</FormLabel>
            <FormControl>
              <Textarea
                placeholder={form.watch("short_description")}
                {...field}
                className="min-h-[100px]"
              />
            </FormControl>
            <FormDescription>{t("form.descriptionDesc")}</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default TranslationStep;
