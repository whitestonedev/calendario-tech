import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
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
import { useLanguage } from "@/context/LanguageContext";

interface EventDetailsStepProps {
  form: UseFormReturn<EventFormValues>;
}

const EventDetailsStep: React.FC<EventDetailsStepProps> = ({ form }) => {
  const { t, language } = useLanguage();
  const [isPaid, setIsPaid] = React.useState(false);

  const handleCostTypeChange = (value: string) => {
    if (value === "free") {
      setIsPaid(false);
      form.setValue(
        "cost",
        language === "pt-br"
          ? "Grátis"
          : language === "es-es"
          ? "Gratis"
          : "Free"
      );
    } else {
      setIsPaid(true);
      form.setValue("cost", "");
    }
  };

  const handlePaidCostChange = (value: string, currency: string) => {
    const formattedValue = parseFloat(value).toFixed(2);
    form.setValue("cost", `${currency}${formattedValue}`);
  };

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="event_link"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("form.eventLink")}</FormLabel>
            <FormControl>
              <Input placeholder="https://..." {...field} />
            </FormControl>
            <FormDescription>{t("form.eventLinkDesc")}</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="cost"
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
                          language === "pt-br"
                            ? "Selecione o tipo de custo"
                            : language === "es-es"
                            ? "Seleccione el tipo de costo"
                            : "Select cost type"
                        }
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="free">
                      {language === "pt-br"
                        ? "Grátis"
                        : language === "es-es"
                        ? "Gratis"
                        : "Free"}
                    </SelectItem>
                    <SelectItem value="paid">
                      {language === "pt-br"
                        ? "Pago"
                        : language === "es-es"
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
                name="cost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {language === "pt-br"
                        ? "Valor"
                        : language === "es-es"
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
                name="cost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {language === "pt-br"
                        ? "Moeda"
                        : language === "es-es"
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
          name="banner_link"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("form.bannerLink")}</FormLabel>
              <FormControl>
                <Input placeholder="https://..." {...field} />
              </FormControl>
              <FormDescription>{t("form.bannerLinkDesc")}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="short_description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("form.description")}</FormLabel>
            <FormControl>
              <Textarea
                placeholder={
                  language === "pt-br"
                    ? "Descreva brevemente o evento (máximo 300 caracteres)"
                    : "Briefly describe the event (maximum 300 characters)"
                }
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

export default EventDetailsStep;
