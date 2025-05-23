
import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface EventSearchProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  className?: string;
}

const EventSearch: React.FC<EventSearchProps> = ({ 
  searchTerm, 
  onSearchChange,
  className = "" 
}) => {
  const { t } = useLanguage();
  
  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      <Input
        type="text"
        placeholder={t("search.placeholder")}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10 w-full"
      />
    </div>
  );
};

export default EventSearch;
