const LOCALES = ["ko", "en"] as const;
const DEFAULT_LOCALE = "ko";
const COOKIE_NAME = "locale";

type Locale = (typeof LOCALES)[number];

export { LOCALES, DEFAULT_LOCALE, COOKIE_NAME };
export type { Locale };
