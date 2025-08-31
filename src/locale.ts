export type HourCycle = "h12" | "h23";

export const detectLang = (hass: any, cfgLocale?: string): string =>
  cfgLocale || hass?.locale?.language || "en";

export const detectHourCycle = (
  hass: any,
  cfgTimeFormat?: string,
): HourCycle => ((cfgTimeFormat || hass?.locale?.time_format) === "12" ? "h12" : "h23");

export const shortDate = (d: Date, lang: string) =>
  new Intl.DateTimeFormat(lang, { day: "2-digit", month: "short" }).format(d);

export const weekdayDate = (d: Date, lang: string) =>
  new Intl.DateTimeFormat(lang, {
    weekday: "short",
    day: "2-digit",
    month: "short",
  }).format(d);

export const time = (d: Date, lang: string, cycle: HourCycle) =>
  new Intl.DateTimeFormat(lang, {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: cycle,
  }).format(d);

export const formatRange = (
  s: Date,
  e: Date,
  allDay: boolean,
  lang: string,
  cycle: HourCycle,
) => {
  if (allDay) {
    const same = s.toDateString() === e.toDateString();
    const endAdj = new Date(e.getFullYear(), e.getMonth(), e.getDate());
    endAdj.setMilliseconds(-1);
    return same
      ? weekdayDate(s, lang)
      : `${weekdayDate(s, lang)} → ${weekdayDate(endAdj, lang)}`;
  }
  if (s.toDateString() === e.toDateString()) {
    return `${weekdayDate(s, lang)} • ${time(s, lang, cycle)}–${time(e, lang, cycle)}`;
  }
  return `${weekdayDate(s, lang)} ${time(s, lang, cycle)} → ${weekdayDate(e, lang)} ${time(
    e,
    lang,
    cycle,
  )}`;
};
