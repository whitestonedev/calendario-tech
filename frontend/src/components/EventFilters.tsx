import React from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Filter, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useLanguage } from "@/context/LanguageContext";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { statesOfBrazil } from "@/lib/states";

interface EventFiltersProps {
  onFilterChange: (filters: FilterState) => void;
  availableTags: string[];
  // Add the filters prop which was referenced in Index.tsx but not defined in the interface
  filters?: FilterState;
}

export interface FilterState {
  search: string;
  location: string;
  eventType: "all" | "online" | "in-person";
  selectedTags: string[];
  showFree: boolean;
  organization: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  cost: "all" | "free" | "paid";
  state: string;
}

const EventFilters: React.FC<EventFiltersProps> = ({
  onFilterChange,
  availableTags,
  filters: externalFilters,
}) => {
  const { t } = useLanguage();
  const [filters, setFilters] = React.useState<FilterState>({
    search: "",
    location: "",
    eventType: "all",
    selectedTags: [],
    showFree: false,
    organization: "",
    startDate: undefined,
    endDate: undefined,
    cost: "all",
    state: "",
  });

  const [isExpanded, setIsExpanded] = React.useState(false);

  // If external filters are provided, use them
  React.useEffect(() => {
    if (externalFilters) {
      setFilters(externalFilters);
    }
  }, [externalFilters]);

  const handleFilterChange = (
    key: keyof FilterState,
    value: FilterState[keyof FilterState]
  ) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleTagSelect = (tag: string) => {
    const newTags = filters.selectedTags.includes(tag)
      ? filters.selectedTags.filter((t) => t !== tag)
      : [...filters.selectedTags, tag];

    handleFilterChange("selectedTags", newTags);
  };

  const handleClearFilters = () => {
    const newFilters: FilterState = {
      search: "",
      location: "",
      eventType: "all",
      selectedTags: [],
      showFree: false,
      organization: "",
      startDate: undefined,
      endDate: undefined,
      cost: "all",
      state: "",
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="bg-white border rounded-lg shadow-sm p-4 mb-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-2 md:space-y-0 md:space-x-4 mb-4">
        <div className="font-medium flex items-center gap-2">
          <Filter className="h-5 w-5 text-tech-purple" />
          <span>{t("index.filterTitle")}</span>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="text-sm"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? t("index.hideFilters") : t("index.moreFilters")}
        </Button>
      </div>

      <div className="flex flex-col md:flex-row flex-wrap gap-3 md:items-center">
        <div className="flex-1 w-full">
          <label className="text-sm font-medium mb-1 block">
            {t("index.searchEvents")}
          </label>
          <Input
            placeholder={t("index.searchEventsPlaceholder")}
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            className="w-full"
          />
        </div>

        <div className="w-full md:w-48">
          <label className="text-sm font-medium mb-1 block">
            {t("index.eventType")}
          </label>
          <Select
            value={filters.eventType}
            onValueChange={(value) => handleFilterChange("eventType", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("index.eventType")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("index.all")}</SelectItem>
              <SelectItem value="online">{t("event.online")}</SelectItem>
              <SelectItem value="in-person">{t("event.inPerson")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-full md:w-48">
          <label className="text-sm font-medium mb-1 block">
            {t("index.cost")}
          </label>
          <Select
            value={filters.cost}
            onValueChange={(value) => handleFilterChange("cost", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("index.cost")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("index.all")}</SelectItem>
              <SelectItem value="free">{t("event.free")}</SelectItem>
              <SelectItem value="paid">{t("index.paid")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="organization"
                className="text-sm font-medium mb-1 block"
              >
                {t("index.organization")}
              </label>
              <Input
                id="organization"
                placeholder={t("index.organizationPlaceholder")}
                value={filters.organization}
                onChange={(e) =>
                  handleFilterChange("organization", e.target.value)
                }
                className="w-full"
              />
            </div>

            <div>
              <label
                htmlFor="location"
                className="text-sm font-medium mb-1 block"
              >
                {t("index.location")}
              </label>
              <Input
                id="location"
                placeholder={t("index.locationPlaceholder")}
                value={filters.location}
                onChange={(e) => handleFilterChange("location", e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">
                {t("form.state")}
              </label>
              <Select
                value={filters.state}
                onValueChange={(value) => handleFilterChange("state", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("form.selectState")} />
                </SelectTrigger>
                <SelectContent>
                  {statesOfBrazil.map((state) => (
                    <SelectItem key={state.value} value={state.label}>
                      {state.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">
                {t("index.startDate")}
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.startDate ? (
                      format(filters.startDate, "PPP", { locale: ptBR })
                    ) : (
                      <span>{t("index.selectDate")}</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={filters.startDate}
                    onSelect={(date) => handleFilterChange("startDate", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">
                {t("index.endDate")}
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.endDate ? (
                      format(filters.endDate, "PPP", { locale: ptBR })
                    ) : (
                      <span>{t("index.selectDate")}</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={filters.endDate}
                    onSelect={(date) => handleFilterChange("endDate", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">
              {t("index.tags")}
            </label>
            <div className="flex flex-wrap gap-2 mt-2">
              {availableTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={
                    filters.selectedTags.includes(tag) ? "default" : "outline"
                  }
                  className={`cursor-pointer ${
                    filters.selectedTags.includes(tag)
                      ? "bg-tech-purple hover:bg-tech-purple/90"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => handleTagSelect(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="text-sm flex items-center gap-1"
            >
              <X className="h-4 w-4" />
              {t("index.clearAllFilters")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventFilters;
