import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { EventFormValues } from "@/lib/form-schemas";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Flag, GlobeIcon } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface LanguageStepProps {
  form: UseFormReturn<EventFormValues>;
}

const LanguageStep: React.FC<LanguageStepProps> = ({ form }) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="event_language"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("form.language")}</FormLabel>
            <Select
              onValueChange={(value) => {
                field.onChange(value);

                // Ensure the primary language is always in the supported languages
                const currentSupported =
                  form.getValues("supported_languages") || [];
                if (!currentSupported.includes(value)) {
                  form.setValue("supported_languages", [
                    ...currentSupported,
                    value,
                  ]);
                }
              }}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={t("form.selectLanguage")} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="pt-br" className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <Flag className="h-4 w-4" />
                    <span>Português (Brasil)</span>
                  </div>
                </SelectItem>
                <SelectItem value="en-us" className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <GlobeIcon className="h-4 w-4" />
                    <span>English (US)</span>
                  </div>
                </SelectItem>
                <SelectItem value="es-es" className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <Flag className="h-4 w-4" />
                    <span>Español</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <FormDescription>{t("form.language.primary")}</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="supported_languages"
        render={() => (
          <FormItem>
            <div className="mb-4">
              <FormLabel>{t("form.addLanguage")}</FormLabel>
              <FormDescription>
                {t("form.language.translation")}
              </FormDescription>
            </div>
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="supported_languages"
                render={({ field }) => {
                  // Safely handle the field value as string[]
                  const value = (field.value as string[]) || [];

                  return (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={value.includes("pt-br")}
                          onCheckedChange={(checked) => {
                            const newValue = checked
                              ? [...value, "pt-br"]
                              : value.filter((v) => v !== "pt-br");
                            field.onChange(newValue);
                          }}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none flex items-center gap-2">
                        <Flag className="h-4 w-4" />
                        <FormLabel>Português (Brasil)</FormLabel>
                      </div>
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="supported_languages"
                render={({ field }) => {
                  // Safely handle the field value as string[]
                  const value = (field.value as string[]) || [];

                  return (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={value.includes("en-us")}
                          onCheckedChange={(checked) => {
                            const newValue = checked
                              ? [...value, "en-us"]
                              : value.filter((v) => v !== "en-us");
                            field.onChange(newValue);
                          }}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none flex items-center gap-2">
                        <GlobeIcon className="h-4 w-4" />
                        <FormLabel>English (US)</FormLabel>
                      </div>
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="supported_languages"
                render={({ field }) => {
                  // Safely handle the field value as string[]
                  const value = (field.value as string[]) || [];

                  return (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={value.includes("es-es")}
                          onCheckedChange={(checked) => {
                            const newValue = checked
                              ? [...value, "es-es"]
                              : value.filter((v) => v !== "es-es");
                            field.onChange(newValue);
                          }}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none flex items-center gap-2">
                        <Flag className="h-4 w-4" />
                        <FormLabel>Español</FormLabel>
                      </div>
                    </FormItem>
                  );
                }}
              />
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default LanguageStep;
