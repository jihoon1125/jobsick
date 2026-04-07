import { useTranslations } from "next-intl";
import { LoginButtons } from "./login-buttons";

export default function LoginPage() {
  const t = useTranslations("auth");

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-8 p-8">
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-3xl font-bold">Jobsick</h1>
        <p className="text-muted-foreground">{t("loginDescription")}</p>
      </div>
      <LoginButtons />
    </main>
  );
}
