export type EntityCfg = {
  entity: string;
  name?: string;
  color?: string;
};

export type MultiCalendarGridCardConfig = {
  type?: string;
  entities: EntityCfg[];

  /** TIME GRID */
  first_day?: number | "today";
  start_today?: boolean;
  slot_min_time?: string;
  slot_max_time?: string;
  slot_minutes?: number;
  locale?: string;
  time_format?: "12" | "24";
  show_now_indicator?: boolean;
  show_all_day?: boolean;

  /** LAYOUT */
  header_compact?: boolean;
  height_vh?: number;
  px_per_min?: number;
  remember_offset?: boolean;
  storage_key?: string;

  /** DATA */
  data_refresh_minutes?: number;

  /** WEATHER */
  weather_entity?: string;
  weather_days?: number;
  weather_compact?: boolean;
};

export const DEFAULTS: Required<
  Pick<
    MultiCalendarGridCardConfig,
    | "slot_min_time"
    | "slot_max_time"
    | "slot_minutes"
    | "show_now_indicator"
    | "show_all_day"
    | "height_vh"
    | "remember_offset"
    | "header_compact"
    | "data_refresh_minutes"
    | "px_per_min"
    | "storage_key"
    | "start_today"
  >
> = {
  slot_min_time: "07:00:00",
  slot_max_time: "22:00:00",
  slot_minutes: 30,
  show_now_indicator: true,
  show_all_day: true,
  height_vh: 80,
  remember_offset: true,
  header_compact: false,
  data_refresh_minutes: 5,
  px_per_min: 1.6,
  storage_key: `multi-calendar-grid-card.weekOffset`,
  start_today: true,
};
