"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LoginModal } from "@/components/common/login-modal";

function HomeCta() {
  const t = useTranslations("home");
  const [loginOpen, setLoginOpen] = useState(false);

  return (
    <>
      <div className="flex gap-3">
        <Button onClick={() => setLoginOpen(true)}>{t("cta")}</Button>
        <Button variant="outline">{t("learnMore")}</Button>
      </div>
      <LoginModal open={loginOpen} onOpenChange={setLoginOpen} />
    </>
  );
}

export { HomeCta };
