"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: Props) {
  const t = useTranslations("error");
  const tc = useTranslations("common");

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
      <h2 className="text-xl font-semibold">{t("pageTitle")}</h2>
      <p className="text-muted-foreground">{error.message}</p>
      <Button onClick={reset}>{tc("retry")}</Button>
    </main>
  );
}
