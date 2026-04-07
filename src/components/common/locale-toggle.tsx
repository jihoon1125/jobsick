"use client";

import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/i18n/routing";

const LABELS: Record<Locale, string> = {
  ko: "KO",
  en: "EN",
};

function LocaleToggle() {
  const locale = useLocale();
  const router = useRouter();

  const toggle = useCallback(async () => {
    const next = locale === "ko" ? "en" : "ko";

    await fetch("/api/locale", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locale: next }),
    });

    router.refresh();
  }, [locale, router]);

  return (
    <Button variant="outline" size="sm" onClick={toggle}>
      {LABELS[locale === "ko" ? "en" : "ko"]}
    </Button>
  );
}

export { LocaleToggle };
