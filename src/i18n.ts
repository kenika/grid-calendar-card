import en from "./locales/en";
import de from "./locales/de";

export const STRINGS = {
  en,
  de,
} as const;

export type TranslationKey = keyof typeof en;

export function tr(lang: string | undefined, key: TranslationKey): string {
  const base = (lang || "en").split("-")[0] as keyof typeof STRINGS;
  return STRINGS[base]?.[key] || STRINGS.en[key] || key;
}
