export interface EventTranslation {
  event_edition: string;
  cost: string;
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
  event_link: string;
  tags: string[];
  cost_value: number;
  intl: {
    "pt-br": EventTranslation;
    "en-us": EventTranslation;
    "es-es": EventTranslation;
  };
}
