"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { LocaleToggle } from "./locale-toggle";
import { LoginModal } from "./login-modal";

interface Props {
  user: User | null;
}

function HeaderActions({ user }: Props) {
  const t = useTranslations("auth");
  const router = useRouter();
  const [loginOpen, setLoginOpen] = useState(false);

  const handleLogout = useCallback(async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
    });
    router.refresh();
  }, [router]);

  return (
    <div className="flex items-center gap-3">
      <LocaleToggle />
      {user ? (
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          {t("logout")}
        </Button>
      ) : (
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLoginOpen(true)}
          >
            {t("login")}
          </Button>
          <LoginModal open={loginOpen} onOpenChange={setLoginOpen} />
        </>
      )}
    </div>
  );
}

export { HeaderActions };
