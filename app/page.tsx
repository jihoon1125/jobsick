import { useTranslations } from "next-intl";
import { HomeCta } from "./home-cta";

export default function Home() {
  const t = useTranslations("home");

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-4xl font-bold tracking-tight">{t("title")}</h1>
      <p className="max-w-md text-center text-muted-foreground">
        {t("description")}
      </p>
      <HomeCta />
    </main>
  );
}
