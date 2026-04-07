"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { GithubIcon, GoogleIcon } from "@/components/common/icons";

function LoginButtons() {
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
    <div className="flex w-full max-w-xs flex-col gap-3">
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
  );
}

export { LoginButtons };
