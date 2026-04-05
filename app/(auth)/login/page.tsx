import { useTranslations } from "next-intl";

export default function LoginPage() {
  const t = useTranslations("auth");

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-2xl font-bold">{t("login")}</h1>
      <p className="text-muted-foreground">{t("loginDescription")}</p>
    </main>
  );
}
