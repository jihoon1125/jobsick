"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

interface Resume {
  id: string;
  title: string;
  content: string;
  is_default: boolean;
  created_at: string;
}

interface Props {
  resumes: Resume[];
}

function ResumeList({ resumes }: Props) {
  const t = useTranslations("resume");
  const tc = useTranslations("common");
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleConfirmDelete = useCallback(async () => {
    if (!pendingId) return;
    setDeleting(true);
    await fetch(`/api/resumes/${pendingId}`, {
      method: "DELETE",
    });
    setDeleting(false);
    setPendingId(null);
    router.refresh();
  }, [pendingId, router]);

  if (resumes.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed py-16">
        <p className="text-muted-foreground">{t("noResumes")}</p>
        <p className="text-sm text-muted-foreground">{t("addFirst")}</p>
      </div>
    );
  }

  const items = resumes.map((resume) => {
    const preview = resume.content.slice(0, 120).replace(/\n/g, " ");

    return (
      <article
        key={resume.id}
        className="flex flex-col gap-2 rounded-lg border p-4"
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold">{resume.title}</h2>
            {resume.is_default && (
              <Badge variant="secondary">{t("defaultBadge")}</Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPendingId(resume.id)}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
        <p className="line-clamp-2 text-sm text-muted-foreground">{preview}</p>
      </article>
    );
  });

  return (
    <>
      <div className="flex flex-col gap-3">{items}</div>
      <AlertDialog
        open={pendingId !== null}
        onOpenChange={(open) => {
          if (!open) setPendingId(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteConfirm")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("deleteConfirmDesc")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>
              {tc("cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={deleting}
              onClick={handleConfirmDelete}
            >
              {deleting ? tc("loading") : tc("delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export { ResumeList };
