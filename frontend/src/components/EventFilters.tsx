import React from 'react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Filter, X, Info, Trash2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { statesOfBrazil } from '@/lib/states';

interface EventFiltersProps {
  onFilterChange: (filters: FilterState) => void;
  availableTags: string[];
  filters?: FilterState;
  onSearch: (filters: FilterState) => void;
}

export interface FilterState {
  search: string;
  location: string;
  eventType: 'all' | 'online' | 'in-person';
  selectedTags: string[];
  showFree: boolean;
  organization: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  cost: 'all' | 'free' | 'paid';
  state: string;
}

const EventFilters: React.FC<EventFiltersProps> = ({
  onFilterChange,
  availableTags,
  filters: externalFilters,
  onSearch,
}) => {
  const { t } = useLanguage();
  const [filters, setFilters] = React.useState<FilterState>({
    search: '',
    location: '',
    eventType: 'all',
    selectedTags: [],
    showFree: false,
    organization: '',
    startDate: undefined,
    endDate: undefined,
    cost: 'all',
    state: '',
  });

  const [isExpanded, setIsExpanded] = React.useState(false);

  const handleSearch = () => {
    onSearch(filters);
  };

  // If external filters are provided, use them
  React.useEffect(() => {
    if (externalFilters) {
      setFilters(externalFilters);
    }
  }, [externalFilters]);

  const handleFilterChange = (key: keyof FilterState, value: FilterState[keyof FilterState]) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleTagSelect = (tag: string) => {
    const newTags = filters.selectedTags.includes(tag)
      ? filters.selectedTags.filter((t) => t !== tag)
      : [...filters.selectedTags, tag];

    handleFilterChange('selectedTags', newTags);
  };

  const handleClearFilters = () => {
    const newFilters: FilterState = {
      search: '',
      location: '',
      eventType: 'all',
      selectedTags: [],
      showFree: false,
      organization: '',
      startDate: undefined,
      endDate: undefined,
      cost: 'all',
      state: '',
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="bg-white border rounded-lg shadow-sm p-4 mb-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-2 md:space-y-0 md:space-x-4 mb-4">
        <div className="font-medium flex items-center gap-2">
          <Filter className="h-5 w-5 text-tech-purple" />
          <span>{t('index.filterTitle')}</span>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-gray-500 hover:text-tech-purple hover:bg-transparent px-2 h-7 hidden md:flex"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? t('index.hideFilters') : t('index.moreFilters')}
        </Button>
      </div>

      <div className="flex flex-col md:flex-row flex-wrap gap-3 md:items-end">
        <div className="flex-1 w-full">
          <label className="text-sm font-medium mb-1 block">{t('index.searchEvents')}</label>
          <Input
            placeholder={t('index.searchEventsPlaceholder')}
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="w-full"
          />
        </div>

        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto md:items-end">
          <div className="flex flex-row gap-3 w-full md:w-auto">
            <div className="flex-1 md:w-48">
              <label className="text-sm font-medium mb-1 block">{t('index.eventType')}</label>
              <Select
                value={filters.eventType}
                onValueChange={(value) => handleFilterChange('eventType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('index.eventType')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('index.all')}</SelectItem>
                  <SelectItem value="online">{t('event.online')}</SelectItem>
                  <SelectItem value="in-person">{t('event.inPerson')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 md:w-48">
              <label className="text-sm font-medium mb-1 block">{t('index.cost')}</label>
              <Select
                value={filters.cost}
                onValueChange={(value) => handleFilterChange('cost', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('index.cost')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('index.all')}</SelectItem>
                  <SelectItem value="free">{t('event.free')}</SelectItem>
                  <SelectItem value="paid">{t('index.paid')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {!isExpanded && (
            <div className="flex items-end md:items-center">
              <TooltipProvider>
                <Tooltip delayDuration={50}>
                  <TooltipTrigger asChild>
                    <div className="flex flex-col items-center w-full md:w-auto">
                      <Button
                        className="bg-tech-purple hover:bg-tech-purple/90 h-10 gap-2 w-full md:w-auto"
                        onClick={handleSearch}
                      >
                        {t('index.search')}
                        <Info className="h-4 w-4 text-white/80" />
                      </Button>
                      <span className="text-xs text-gray-500 italic mt-1 md:hidden flex items-center gap-1">
                        <Info className="h-3 w-3" />
                        {t('index.applyFilterTooltip')}
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="hidden md:block">
                    <p>{t('index.applyFilterTooltip')}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
        </div>

        <div className="flex justify-end md:hidden mt-1">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-gray-500 hover:text-tech-purple hover:bg-transparent px-2 h-7"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? t('index.hideFilters') : t('index.moreFilters')}
          </Button>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-4 space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700">{t('index.basicInfo')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="organization" className="text-sm font-medium mb-1 block">
                  {t('index.organization')}
                </label>
                <Input
                  id="organization"
                  placeholder={t('index.organizationPlaceholder')}
                  value={filters.organization}
                  onChange={(e) => handleFilterChange('organization', e.target.value)}
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">{t('index.cost')}</label>
                <Select
                  value={filters.cost}
                  onValueChange={(value) => handleFilterChange('cost', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('index.cost')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('index.all')}</SelectItem>
                    <SelectItem value="free">{t('event.free')}</SelectItem>
                    <SelectItem value="paid">{t('index.paid')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">{t('index.startDate')}</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.startDate ? (
                        format(filters.startDate, 'PPP', { locale: ptBR })
                      ) : (
                        <span>{t('index.selectDate')}</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={filters.startDate}
                      onSelect={(date) => handleFilterChange('startDate', date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">{t('index.endDate')}</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.endDate ? (
                        format(filters.endDate, 'PPP', { locale: ptBR })
                      ) : (
                        <span>{t('index.selectDate')}</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={filters.endDate}
                      onSelect={(date) => handleFilterChange('endDate', date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700">{t('index.location')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="location" className="text-sm font-medium mb-1 block">
                  {t('index.address')}
                </label>
                <Input
                  id="location"
                  placeholder={t('index.locationPlaceholder')}
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">{t('form.state')}</label>
                <Select
                  value={filters.state}
                  onValueChange={(value) => handleFilterChange('state', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('form.selectState')} />
                  </SelectTrigger>
                  <SelectContent>
                    {statesOfBrazil.map((state) => (
                      <SelectItem key={state.value} value={state.value}>
                        {state.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Grupo: Tags */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700">{t('index.tags')}</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {availableTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={filters.selectedTags.includes(tag) ? 'default' : 'outline'}
                  className={`cursor-pointer ${
                    filters.selectedTags.includes(tag)
                      ? 'bg-tech-purple hover:bg-tech-purple/90'
                      : 'hover:bg-gray-100'
                  }`}
                  onClick={() => handleTagSelect(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-end gap-2">
            <div className="flex gap-2 justify-center md:justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="text-sm flex items-center gap-1"
              >
                <Trash2 className="h-4 w-4" />
                {t('index.clearAllFilters')}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(false)}
                className="text-sm flex items-center gap-1"
              >
                <X className="h-4 w-4" />
                {t('index.hideFilters')}
              </Button>
            </div>
            <TooltipProvider>
              <Tooltip delayDuration={50}>
                <TooltipTrigger asChild>
                  <div className="flex flex-col items-center w-full md:w-auto">
                    <Button
                      className="bg-tech-purple hover:bg-tech-purple/90 gap-2 w-full md:w-auto"
                      onClick={handleSearch}
                    >
                      {t('index.search')}
                      <Info className="h-4 w-4 text-white/80" />
                    </Button>
                    <span className="text-xs text-gray-500 italic mt-1 md:hidden flex items-center gap-1">
                      <Info className="h-3 w-3" />
                      {t('index.applyFilterTooltip')}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="hidden md:block">
                  <p>{t('index.applyFilterTooltip')}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventFilters;
