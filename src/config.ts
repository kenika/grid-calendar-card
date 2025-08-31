export type EntityCfg = {
  entity: string;
  name?: string;
  color?: string;
};

export type GridCalendarCardConfig = {
  type?: string;
  entities: EntityCfg[];

  /** VIEW */
  view_start_time?: string;
  view_end_time?: string;
  view_slot_minutes?: number;
  locale?: string;
  time_format?: "12" | "24";
  show_now_indicator?: boolean;

  /** LAYOUT */
  height_vh?: number;
  px_per_min?: number;
  remember_offset?: boolean;

  /** DATA */
  data_refresh_minutes?: number;

  /** WEATHER */
  weather_entity?: string;
};

export const DEFAULTS: Required<
  Pick<
    GridCalendarCardConfig,
    | "view_start_time"
    | "view_end_time"
    | "view_slot_minutes"
    | "show_now_indicator"
    | "height_vh"
    | "remember_offset"
    | "data_refresh_minutes"
    | "px_per_min"
  >
> = {
  view_start_time: "07:00:00",
  view_end_time: "22:00:00",
  view_slot_minutes: 30,
  show_now_indicator: true,
  height_vh: 80,
  remember_offset: true,
  data_refresh_minutes: 5,
  px_per_min: 1.6,
};
