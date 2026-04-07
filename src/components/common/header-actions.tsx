"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { useCallback, useState } from "react";
import { Briefcase, FileText, User as UserIcon } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LocaleToggle } from "./locale-toggle";
import { LoginModal } from "./login-modal";

interface Props {
  user: User | null;
}

function HeaderActions({ user }: Props) {
  const t = useTranslations("auth");
  const tm = useTranslations("menu");
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
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button variant="ghost" size="icon-sm" />}
            >
              <UserIcon className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem render={<Link href="/profile" />}>
                <UserIcon className="size-4" />
                {tm("profile")}
              </DropdownMenuItem>
              <DropdownMenuItem render={<Link href="/resumes" />}>
                <FileText className="size-4" />
                {tm("resumes")}
              </DropdownMenuItem>
              <DropdownMenuItem render={<Link href="/companies" />}>
                <Briefcase className="size-4" />
                {tm("companies")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
