"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LoginModal } from "@/components/common/login-modal";

interface Props {
  isLoggedIn: boolean;
}

function HomeCta({ isLoggedIn }: Props) {
  const t = useTranslations("home");
  const router = useRouter();
  const [loginOpen, setLoginOpen] = useState(false);

  const handleCta = () => {
    if (isLoggedIn) {
      router.push("/dashboard");
    } else {
      setLoginOpen(true);
    }
  };

  return (
    <>
      <div className="flex gap-3">
        <Button onClick={handleCta}>{t("cta")}</Button>
        <Button variant="outline">{t("learnMore")}</Button>
      </div>
      {!isLoggedIn && (
        <LoginModal open={loginOpen} onOpenChange={setLoginOpen} />
      )}
    </>
  );
}

export { HomeCta };
