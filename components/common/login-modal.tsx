"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { GithubIcon, GoogleIcon } from "./icons";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function LoginModal({ open, onOpenChange }: Props) {
  const t = useTranslations("auth");
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const handleLogin = useCallback(
    async (provider: "github" | "google") => {
      setLoading(provider);

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ provider }),
      });

      const data = await res.json();

      if (data.url) {
        router.push(data.url);
      } else {
        setLoading(null);
      }
    },
    [router]
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">Jobsick</DialogTitle>
          <DialogDescription className="text-center">
            {t("loginDescription")}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 pt-2">
          <Button
            variant="outline"
            size="lg"
            className="w-full"
            disabled={loading !== null}
            onClick={() => handleLogin("github")}
          >
            <GithubIcon className="size-5" />
            {loading === "github" ? t("login") + "..." : t("loginWithGithub")}
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="w-full"
            disabled={loading !== null}
            onClick={() => handleLogin("google")}
          >
            <GoogleIcon className="size-5" />
            {loading === "google" ? t("login") + "..." : t("loginWithGoogle")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export { LoginModal };
