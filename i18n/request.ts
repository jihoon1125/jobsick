import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

const LOCALES = ["ko", "en"] as const;
const DEFAULT_LOCALE = "ko";
const COOKIE_NAME = "locale";

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const saved = cookieStore.get(COOKIE_NAME)?.value;

  const locale =
    saved && LOCALES.includes(saved as (typeof LOCALES)[number])
      ? saved
      : DEFAULT_LOCALE;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
