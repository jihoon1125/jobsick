import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { LocaleToggle } from "@/components/common/locale-toggle";

export default function Home() {
  const t = useTranslations("home");

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 p-8">
      <div className="absolute right-4 top-4">
        <LocaleToggle />
      </div>
      <h1 className="text-4xl font-bold tracking-tight">{t("title")}</h1>
      <p className="max-w-md text-center text-muted-foreground">
        {t("description")}
      </p>
      <div className="flex gap-3">
        <Button>{t("cta")}</Button>
        <Button variant="outline">{t("learnMore")}</Button>
      </div>
    </main>
  );
}
