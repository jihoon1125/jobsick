import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { HomeCta } from "./home-cta";

export default async function Home() {
  const t = await getTranslations("home");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-4xl font-bold tracking-tight">{t("title")}</h1>
      <p className="max-w-md text-center text-muted-foreground">
        {t("description")}
      </p>
      <HomeCta isLoggedIn={!!user} />
    </main>
  );
}
