import { useTranslations } from "next-intl";

export default function AnalyzePage() {
  const t = useTranslations("analyze");

  return (
    <main className="flex flex-1 flex-col items-center gap-6 p-8">
      <h1 className="text-2xl font-bold">{t("title")}</h1>
      <p className="text-muted-foreground">{t("inputPlaceholder")}</p>
    </main>
  );
}
