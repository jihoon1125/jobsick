"use client";

import { useTranslations } from "next-intl";
import { useCallback, useState } from "react";
import { AlertCircle, CheckCircle2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Props {
  initialHasKey: boolean;
}

function ApiKeyCard({ initialHasKey }: Props) {
  const t = useTranslations("profile.apiKey");
  const tc = useTranslations("common");
  const [hasKey, setHasKey] = useState(initialHasKey);
  const [editing, setEditing] = useState(!initialHasKey);
  const [keyInput, setKeyInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [removeOpen, setRemoveOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = useCallback(async () => {
    const trimmed = keyInput.trim();
    if (trimmed === "") return;
    setSaving(true);
    setError(null);

    const res = await fetch("/api/profile/api-key", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ apiKey: trimmed }),
    });

    if (res.ok) {
      setHasKey(true);
      setEditing(false);
      setKeyInput("");
    } else {
      const data = await res.json();
      setError(data.error ?? "Failed");
    }
    setSaving(false);
  }, [keyInput]);

  const handleConfirmRemove = useCallback(async () => {
    setRemoving(true);
    const res = await fetch("/api/profile/api-key", {
      method: "DELETE",
    });
    if (res.ok) {
      setHasKey(false);
      setEditing(true);
    }
    setRemoving(false);
    setRemoveOpen(false);
  }, []);

  const isMissing = !hasKey;

  return (
    <section className="flex flex-col gap-3 rounded-lg border p-4">
      <div className="flex items-center gap-2">
        {isMissing ? (
          <AlertCircle className="size-4 text-muted-foreground" />
        ) : (
          <CheckCircle2 className="size-4 text-primary" />
        )}
        <h2 className="text-sm font-semibold">{t("title")}</h2>
      </div>

      <p className="text-xs text-muted-foreground">
        {isMissing ? t("missing") : t("registered")}
      </p>

      {editing ? (
        <>
          <Input
            type="password"
            value={keyInput}
            autoComplete="off"
            placeholder={t("placeholder")}
            onChange={(e) => setKeyInput(e.target.value)}
          />
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            {t("guide")}
            <ExternalLink className="size-3" />
          </a>
          {error && <p className="text-xs text-destructive">{error}</p>}
          <div className="flex gap-2">
            {hasKey && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setEditing(false);
                  setKeyInput("");
                  setError(null);
                }}
              >
                {tc("cancel")}
              </Button>
            )}
            <Button
              size="sm"
              disabled={saving || keyInput.trim() === ""}
              onClick={handleSave}
            >
              {saving ? t("saving") : t("register")}
            </Button>
          </div>
        </>
      ) : (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
            {t("reregister")}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setRemoveOpen(true)}>
            {t("remove")}
          </Button>
        </div>
      )}

      <AlertDialog open={removeOpen} onOpenChange={setRemoveOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("removeConfirm")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("removeConfirmDesc")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={removing}>
              {tc("cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={removing}
              onClick={handleConfirmRemove}
            >
              {removing ? t("removing") : tc("delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}

export { ApiKeyCard };
