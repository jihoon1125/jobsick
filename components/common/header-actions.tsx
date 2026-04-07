"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { useCallback, useState } from "react";
import { FileText, User as UserIcon } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { LocaleToggle } from "./locale-toggle";
import { LoginModal } from "./login-modal";

interface Props {
  user: User | null;
}

function HeaderActions({ user }: Props) {
  const t = useTranslations("auth");
  const tr = useTranslations("resume");
  const [loginOpen, setLoginOpen] = useState(false);

  const handleLogout = useCallback(async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
    });
    window.location.href = "/";
  }, []);

  return (
    <div className="flex items-center gap-3">
      <LocaleToggle />
      {user ? (
        <>
          <Link
            href="/resumes"
            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm hover:bg-accent"
          >
            <FileText className="size-4" />
            {tr("title")}
          </Link>
          <Link
            href="/profile"
            className="inline-flex items-center justify-center rounded-md p-2 text-sm hover:bg-accent"
          >
            <UserIcon className="size-4" />
          </Link>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            {t("logout")}
          </Button>
        </>
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
