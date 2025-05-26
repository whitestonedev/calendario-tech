import { Currency } from "./currency";

export interface EventTranslation {
  event_edition: string;
  cost: number;
  currency: Currency | null;
  banner_link: string;
  short_description: string;
}

export interface EventInterface {
  organization_name: string;
  event_name: string;
  start_datetime: string;
  end_datetime: string;
  address: string;
  maps_link: string;
  online: boolean;
  is_free: boolean;
  event_link: string;
  tags: string[];
  state: string;
  intl: {
    [key: string]: EventTranslation;
  };
}
