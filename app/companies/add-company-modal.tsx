"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Prefill {
  name: string;
  careersUrl: string;
}

interface Props {
  open: boolean;
  prefill: Prefill | null;
  onOpenChange: (open: boolean) => void;
}

function AddCompanyModal({ open, prefill, onOpenChange }: Props) {
  const t = useTranslations("company");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("addCompany")}</DialogTitle>
        </DialogHeader>
        {open && (
          <CompanyFormBody
            key={prefill ? `${prefill.name}-${prefill.careersUrl}` : "blank"}
            initialName={prefill?.name ?? ""}
            initialCareersUrl={prefill?.careersUrl ?? ""}
            onClose={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

interface BodyProps {
  initialName: string;
  initialCareersUrl: string;
  onClose: () => void;
}

function CompanyFormBody({
  initialName,
  initialCareersUrl,
  onClose,
}: BodyProps) {
  const t = useTranslations("company");
  const tc = useTranslations("common");
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [careersUrl, setCareersUrl] = useState(initialCareersUrl);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(async () => {
    if (!name.trim() || !careersUrl.trim()) return;
    setSaving(true);
    setError(null);

    const res = await fetch("/api/companies", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        careersUrl,
        notes: notes || null,
      }),
    });

    if (res.ok) {
      onClose();
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error ?? "Failed");
    }
    setSaving(false);
  }, [name, careersUrl, notes, onClose, router]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label>{t("name")}</Label>
        <Input
          value={name}
          autoComplete="off"
          placeholder={t("namePlaceholder")}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label>{t("careersUrl")}</Label>
        <Input
          type="url"
          value={careersUrl}
          autoComplete="off"
          placeholder={t("careersUrlPlaceholder")}
          onChange={(e) => setCareersUrl(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label>{t("notes")}</Label>
        <Textarea
          value={notes}
          rows={3}
          placeholder={t("notesPlaceholder")}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          {tc("cancel")}
        </Button>
        <Button
          disabled={saving || !name.trim() || !careersUrl.trim()}
          onClick={handleSubmit}
        >
          {saving ? tc("loading") : tc("save")}
        </Button>
      </div>
    </div>
  );
}

export { AddCompanyModal };
