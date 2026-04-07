import { useTranslations } from "next-intl";
import Link from "next/link";

export default function NotFound() {
  const t = useTranslations("error");

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
      <h2 className="text-xl font-semibold">{t("notFound")}</h2>
      <Link href="/" className="text-primary underline underline-offset-4">
        {t("goHome")}
      </Link>
    </main>
  );
}
