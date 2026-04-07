import { cookies } from "next/headers";
import { COOKIE_NAME, LOCALES } from "@/i18n/routing";

function isValidLocale(value: string): boolean {
  return LOCALES.some((l) => l === value);
}

export async function POST(request: Request) {
  const body: { locale: string } = await request.json();

  if (!isValidLocale(body.locale)) {
    return Response.json({ error: "Invalid locale" }, { status: 400 });
  }

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, body.locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });

  return Response.json({ locale: body.locale });
}
