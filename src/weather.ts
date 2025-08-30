import { dayKey } from "./utils";

export type WxDaily = { hi: number | null; lo: number | null; cond: string; pp?: number | null };

type WItem = {
  datetime?: string;
  date?: string;
  time?: string;
  dt?: number;
  timestamp?: number;
  condition?: string;
  condition_description?: string;
  state?: string;
  symbol?: string;
  temperature?: number;
  temperature_high?: number;
  temperature_low?: number;
  templow?: number;
  temp?: number;
  precipitation_probability?: number;
  precipitation_chance?: number;
};

const toNum = (v: any): number | null => {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

const maxNum = (arr: any[]): number | null => {
  let m: number | null = null;
  for (const v of arr) {
    const n = toNum(v);
    if (n == null) continue;
    m = m == null ? n : Math.max(m, n);
  }
  return m;
};

const mode = <T>(arr: T[]): T | null => {
  if (!arr.length) return null;
  const c = new Map<T, number>();
  for (const v of arr) c.set(v, (c.get(v) || 0) + 1);
  return [...c.entries()].sort((a, b) => b[1] - a[1])[0][0];
};

const wsForecast = async (hass: any, entity_id: string, type: "daily" | "hourly") => {
  const payload = {
    type: "call_service",
    domain: "weather",
    service: "get_forecasts",
    service_data: { entity_id, type },
    return_response: true,
  };
  const resp = await hass.callWS(payload);
  const box = resp?.response ?? resp ?? {};
  const data = box[entity_id] ?? box;
  const list = data?.forecast ?? [];
  return Array.isArray(list) ? (list as WItem[]) : [];
};

const aggregateHourlyToDaily = (hourly: WItem[], daysWanted: number) => {
  const by = new Map<string, WItem[]>();
  const todayK = dayKey(new Date());
  for (const h of hourly) {
    const t =
      h.datetime || h.date || h.time || (h.dt ? new Date(h.dt * 1000) : h.timestamp) || Date.now();
    const d = new Date(t as any);
    const k = dayKey(d);
    if (k < todayK) continue;
    if (!by.has(k)) by.set(k, []);
    by.get(k)!.push(h);
  }
  const out: WItem[] = [];
  for (const [k, list] of [...by.entries()].sort()) {
    let hi = -Infinity,
      lo = +Infinity;
    for (const it of list) {
      const t = toNum(it.temperature ?? it.temp);
      if (t == null) continue;
      if (t > hi) hi = t;
      if (t < lo) lo = t;
    }
    if (!Number.isFinite(hi)) hi = NaN;
    if (!Number.isFinite(lo)) lo = NaN;
    const cond =
      mode(
        list
          .map((it) => it.condition ?? it.condition_description ?? it.symbol ?? it.state)
          .filter(Boolean) as string[]
      ) || "-";
    const pp = maxNum(list.map((it) => it.precipitation_probability ?? it.precipitation_chance));
    out.push({
      datetime: `${k}T12:00:00`,
      condition: cond,
      temperature: Number.isFinite(hi) ? hi : undefined,
      templow: Number.isFinite(lo) ? lo : undefined,
      precipitation_probability: pp ?? undefined,
    } as WItem);
    if (out.length >= daysWanted) break;
  }
  return out;
};

const robustForecast = async (hass: any, entity_id: string, daysWanted: number) => {
  try {
    const daily = await wsForecast(hass, entity_id, "daily");
    if (daily && daily.length) return { items: daily, kind: "daily" } as const;
  } catch {}
  try {
    const hourly = await wsForecast(hass, entity_id, "hourly");
    if (hourly && hourly.length) {
      return {
        items: aggregateHourlyToDaily(hourly, daysWanted),
        kind: "hourly-aggregated",
      } as const;
    }
  } catch {}
  const st = hass.states?.[entity_id];
  const attr = st?.attributes?.forecast;
  if (Array.isArray(attr) && attr.length) {
    return { items: attr as WItem[], kind: "attributes" } as const;
  }
  return { items: [] as WItem[], kind: null } as const;
};

export const fetchWeather = async (
  hass: any,
  entity: string,
  daysWanted: number,
): Promise<Map<string, WxDaily>> => {
  const { items } = await robustForecast(hass, entity, daysWanted);
  const map = new Map<string, WxDaily>();
  for (const f of items) {
    const dt = new Date((f.datetime || f.date || f.time) as any || Date.now());
    const k = dayKey(dt);
    const hi = toNum(f.temperature ?? f.temperature_high ?? f.temp);
    const lo = toNum(f.templow ?? f.temperature_low);
    const cond = String(f.condition ?? f.condition_description ?? f.state ?? "-");
    const pp = toNum(f.precipitation_probability ?? f.precipitation_chance) ?? undefined;
    map.set(k, { hi: hi ?? null, lo: lo ?? null, cond, pp });
  }
  return map;
};

