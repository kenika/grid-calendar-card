export const STRINGS = {
  en: {
    prev: "Prev",
    next: "Next",
    today: "Today",
    today_pill: "Today",
    no_events: "No events in this range.",
    event_details: "Event details",
    close: "Close",
    aria_prev_week: "Previous week",
    aria_next_week: "Next week",
    aria_today: "Go to current week",
    failed_load_prefix: "Failed to load:",
  },
} as const;

export function tr(
  lang: string | undefined,
  key: keyof typeof STRINGS["en"],
): string {
  const base = (lang || "en").split("-")[0] as keyof typeof STRINGS;
  return STRINGS[base]?.[key] || STRINGS.en[key] || key;
}
