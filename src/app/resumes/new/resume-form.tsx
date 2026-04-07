"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TagInput, type Tag } from "@/components/common/tag-input";
import { createClient } from "@/lib/supabase/client";
import { extractPdfText } from "@/lib/pdf";

function ResumeForm() {
  const t = useTranslations("resume");
  const tc = useTranslations("common");
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isDefault, setIsDefault] = useState(false);
  const [tags, setTags] = useState<Tag[]>([]);
  const [tagSuggestions, setTagSuggestions] = useState<Tag[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadTags() {
      const [posRes, companyRes] = await Promise.all([
        fetch("/api/tags?category=position"),
        fetch("/api/tags?category=company"),
      ]);
      const posData = await posRes.json();
      const companyData = await companyRes.json();
      setTagSuggestions([...posData.tags, ...companyData.tags]);
    }
    loadTags();
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0];
      if (!f) return;
      if (f.type !== "application/pdf") {
        setError(t("pdfOnly"));
        return;
      }
      setError(null);
      setFile(f);
      if (title.trim() === "") {
        setTitle(f.name.replace(/\.pdf$/i, ""));
      }
    },
    [title, t]
  );

  const handleSubmit = useCallback(async () => {
    if (!file || !title.trim()) return;

    setSaving(true);
    setError(null);

    try {
      // 1. Parse PDF text in browser
      const content = await extractPdfText(file);

      // 2. Upload PDF to Storage directly
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setError("Not logged in");
        setSaving(false);
        return;
      }

      const safeName = file.name
        .replace(/\.pdf$/i, "")
        .replace(/[^\w.-]+/g, "_")
        .slice(0, 60);
      const fileName = `${Date.now()}-${safeName || "resume"}.pdf`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("resumes")
        .upload(filePath, file, {
          contentType: "application/pdf",
        });

      if (uploadError) {
        setError(uploadError.message);
        setSaving(false);
        return;
      }

      // 3. Create DB row via API
      const res = await fetch("/api/resumes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
          filePath,
          isDefault,
          tagIds: tags.map((tag) => tag.id),
        }),
      });

      if (res.ok) {
        router.push("/resumes");
      } else {
        const data = await res.json();
        setError(data.error ?? "Failed");
        setSaving(false);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to process PDF");
      setSaving(false);
    }
  }, [file, title, isDefault, tags, router]);

  return (
    <div className="flex flex-col gap-6">
      {/* File Upload */}
      <div className="flex flex-col gap-2">
        <Label>{t("pdfFile")}</Label>
        <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-input p-8 hover:bg-accent">
          <Upload className="size-6 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {file ? file.name : t("uploadHint")}
          </span>
          <input
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      </div>

      {/* Title */}
      <div className="flex flex-col gap-2">
        <Label>{t("resumeTitle")}</Label>
        <Input
          value={title}
          autoComplete="off"
          placeholder={t("resumeTitlePlaceholder")}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {/* Tags */}
      <div className="flex flex-col gap-2">
        <Label>{t("tags")}</Label>
        <TagInput
          suggestions={tagSuggestions}
          selected={tags}
          onChange={setTags}
          placeholder={t("tagsPlaceholder")}
        />
      </div>

      {/* Default */}
      <label className="flex cursor-pointer items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={isDefault}
          onChange={(e) => setIsDefault(e.target.checked)}
        />
        {t("isDefault")}
      </label>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {/* Actions */}
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => router.push("/resumes")}>
          {tc("cancel")}
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={saving || !file || !title.trim()}
          className="flex-1"
        >
          {saving ? tc("loading") : t("create")}
        </Button>
      </div>
    </div>
  );
}

export { ResumeForm };
