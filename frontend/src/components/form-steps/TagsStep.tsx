
import React from "react";
import { FormControl, FormField, FormItem, FormLabel, FormDescription, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";
import { EventFormValues, eventTags } from "@/lib/form-schemas";
import { useLanguage } from "@/context/LanguageContext";

interface TagsStepProps {
  form: UseFormReturn<EventFormValues>;
}

const TagsStep: React.FC<TagsStepProps> = ({ form }) => {
  const { t } = useLanguage();
  
  return (
    <FormItem>
      <div className="mb-4">
        <FormLabel className="text-base">{t('form.tagsLabel')}</FormLabel>
        <FormDescription>
          {t('form.tagsDesc')}
        </FormDescription>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {eventTags.map((tag) => (
          <FormField
            key={tag}
            control={form.control}
            name="tags"
            render={({ field }) => {
              return (
                <FormItem
                  key={tag}
                  className="flex flex-row items-start space-x-2 space-y-0"
                >
                  <FormControl>
                    <Checkbox
                      checked={field.value?.includes(tag)}
                      onCheckedChange={(checked) => {
                        return checked
                          ? field.onChange([...field.value, tag])
                          : field.onChange(
                              field.value?.filter(
                                (value) => value !== tag
                              )
                            );
                      }}
                    />
                  </FormControl>
                  <FormLabel className="font-normal cursor-pointer">
                    {tag}
                  </FormLabel>
                </FormItem>
              );
            }}
          />
        ))}
      </div>
      <FormMessage className="mt-2" />
    </FormItem>
  );
};

export default TagsStep;
