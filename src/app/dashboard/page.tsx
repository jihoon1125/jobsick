import { useTranslations } from "next-intl";

export default function DashboardPage() {
  const t = useTranslations("dashboard");

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-xl font-semibold">{t("analysisHistory")}</h2>
      <p className="text-muted-foreground">{t("noHistory")}</p>
    </div>
  );
}
