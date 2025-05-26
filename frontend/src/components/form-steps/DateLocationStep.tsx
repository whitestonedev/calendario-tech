import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Clock } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";
import { EventFormValues } from "@/lib/form-schemas";
import { useLanguage } from "@/context/LanguageContext";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { StaticTimePicker } from "@mui/x-date-pickers/StaticTimePicker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { statesOfBrazil } from "@/lib/states";

interface DateLocationStepProps {
  form: UseFormReturn<EventFormValues>;
}

const DateLocationStep: React.FC<DateLocationStepProps> = ({ form }) => {
  const isOnline = form.watch("online");
  const { t } = useLanguage();

  const parseTimeToDate = (timeString: string): Date => {
    const [hours, minutes] = timeString.split(":").map(Number);
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    return date;
  };

  const [startTimeDialogOpen, setStartTimeDialogOpen] = useState(false);
  const [endTimeDialogOpen, setEndTimeDialogOpen] = useState(false);
  const [tempStartTime, setTempStartTime] = useState<Date | null>(
    parseTimeToDate(form.getValues("start_time"))
  );
  const [tempEndTime, setTempEndTime] = useState<Date | null>(
    parseTimeToDate(form.getValues("end_time"))
  );

  const formatDateToTimeString = (date: Date): string => {
    return `${String(date.getHours()).padStart(2, "0")}:${String(
      date.getMinutes()
    ).padStart(2, "0")}`;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="start_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>{t("form.startDate")}</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "dd/MM/yyyy")
                      ) : (
                        <span>{t("form.selectDate")}</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 " />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="start_time"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>{t("form.startTime")}</FormLabel>
              <FormControl>
                <div className="flex items-center">
                  <Input
                    placeholder="HH:MM"
                    {...field}
                    readOnly
                    onClick={() => setStartTimeDialogOpen(true)}
                    className="cursor-pointer"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="ml-2"
                    aria-label="Abrir seletor de horário"
                    onClick={() => setStartTimeDialogOpen(true)}
                  >
                    <Clock className="ml-auto h-4 w-4" />
                  </Button>
                </div>
              </FormControl>
              <Dialog
                open={startTimeDialogOpen}
                onOpenChange={setStartTimeDialogOpen}
              >
                <DialogContent className="p-4 bg-white rounded-xl shadow-xl w-fit space-y-4">
                  <div className="text-center text-2xl font-semibold text-gray-800 tracking-wide">
                    {tempStartTime
                      ? formatDateToTimeString(tempStartTime)
                      : t("form.selectTime")}
                  </div>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <StaticTimePicker
                      displayStaticWrapperAs="desktop"
                      value={tempStartTime}
                      onChange={(newValue) => {
                        setTempStartTime(newValue);
                      }}
                      onAccept={(finalValue) => {
                        if (finalValue) {
                          form.setValue(
                            "start_time",
                            formatDateToTimeString(finalValue),
                            {
                              shouldValidate: true,
                            }
                          );
                          setStartTimeDialogOpen(false);
                        }
                      }}
                      onClose={() => {
                        setStartTimeDialogOpen(false);
                      }}
                    />
                  </LocalizationProvider>
                </DialogContent>
              </Dialog>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="end_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>{t("form.endDate")}</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "dd/MM/yyyy")
                      ) : (
                        <span>{t("form.selectDate")}</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => {
                      const startDate = form.getValues("start_date");
                      return startDate ? date < startDate : date < new Date();
                    }}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="end_time"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>{t("form.endTime")}</FormLabel>
              <FormControl>
                <div className="flex items-center">
                  <Input
                    placeholder="HH:MM"
                    {...field}
                    readOnly
                    onClick={() => setEndTimeDialogOpen(true)}
                    className="cursor-pointer"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="ml-2"
                    aria-label="Abrir seletor de horário"
                    onClick={() => setEndTimeDialogOpen(true)}
                  >
                    <Clock className="ml-auto h-4 w-4" />
                  </Button>
                </div>
              </FormControl>
              <Dialog
                open={endTimeDialogOpen}
                onOpenChange={setEndTimeDialogOpen}
              >
                <DialogContent className="p-4 bg-white rounded-xl shadow-xl w-fit space-y-4">
                  <div className="text-center text-2xl font-semibold text-gray-800 tracking-wide">
                    {tempEndTime
                      ? formatDateToTimeString(tempEndTime)
                      : t("form.selectTime")}
                  </div>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <StaticTimePicker
                      displayStaticWrapperAs="desktop"
                      value={tempEndTime}
                      onChange={(newValue) => {
                        setTempEndTime(newValue);
                      }}
                      onAccept={(finalValue) => {
                        if (finalValue) {
                          form.setValue(
                            "end_time",
                            formatDateToTimeString(finalValue),
                            {
                              shouldValidate: true,
                            }
                          );
                          setEndTimeDialogOpen(false);
                        }
                      }}
                      onClose={() => {
                        setEndTimeDialogOpen(false);
                      }}
                    />
                  </LocalizationProvider>
                </DialogContent>
              </Dialog>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="online"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>{t("form.online")}</FormLabel>
              <FormDescription>{t("form.onlineDesc")}</FormDescription>
            </div>
          </FormItem>
        )}
      />

      {!isOnline && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("form.address")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("form.address")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("form.state")}</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("form.selectState")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {statesOfBrazil.map((state) => (
                      <SelectItem key={state.value} value={state.value}>
                        {state.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="maps_link"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("form.mapsLink")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://maps.google.com/?q=..."
                    {...field}
                  />
                </FormControl>
                <FormDescription>{t("form.mapsLinkDesc")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}
    </div>
  );
};

export default DateLocationStep;
