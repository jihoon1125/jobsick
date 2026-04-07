"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Plus,
  Trash2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
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
import { RECOMMENDED_COMPANIES } from "@/lib/recommended-companies";
import { AddCompanyModal } from "./add-company-modal";

interface Company {
  id: string;
  name: string;
  careers_url: string;
}

interface Props {
  companies: Company[];
}

function CompanyList({ companies }: Props) {
  const t = useTranslations("company");
  const tc = useTranslations("common");
  const router = useRouter();
  const [addOpen, setAddOpen] = useState(false);
  const [prefill, setPrefill] = useState<{
    name: string;
    careersUrl: string;
  } | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [recExpanded, setRecExpanded] = useState(false);

  const myNames = useMemo(
    () => new Set(companies.map((c) => c.name)),
    [companies]
  );

  const recommendations = useMemo(
    () => RECOMMENDED_COMPANIES.filter((r) => !myNames.has(r.name)),
    [myNames]
  );

  const handleAddRecommended = useCallback(
    (name: string, careersUrl: string) => {
      setPrefill({ name, careersUrl });
      setAddOpen(true);
    },
    []
  );

  const handleConfirmDelete = useCallback(async () => {
    if (!pendingId) return;
    setDeleting(true);
    await fetch(`/api/companies/${pendingId}`, {
      method: "DELETE",
    });
    setDeleting(false);
    setPendingId(null);
    router.refresh();
  }, [pendingId, router]);

  const myCards = companies.map((company) => (
    <article
      key={company.id}
      className="flex items-center justify-between gap-3 rounded-lg border p-4"
    >
      <div className="flex flex-col gap-1">
        <h3 className="font-semibold">{company.name}</h3>
        <a
          href={company.careers_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          {company.careers_url}
          <ExternalLink className="size-3" />
        </a>
      </div>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => setPendingId(company.id)}
      >
        <Trash2 className="size-4" />
      </Button>
    </article>
  ));

  const visibleRecs = recExpanded
    ? recommendations
    : recommendations.slice(0, 6);
  const hiddenCount = recommendations.length - 6;

  const recCards = visibleRecs.map((rec, i) => (
    <motion.button
      key={rec.name}
      layout
      initial={i >= 6 ? { opacity: 0, y: -8 } : false}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{
        duration: 0.2,
        delay: i >= 6 ? (i - 6) * 0.03 : 0,
      }}
      onClick={() => handleAddRecommended(rec.name, rec.careersUrl)}
      className="flex flex-col items-start gap-1 rounded-lg border border-dashed p-4 text-left hover:border-solid hover:bg-accent"
    >
      <div className="flex w-full items-center justify-between">
        <h3 className="font-semibold">{rec.name}</h3>
        <Plus className="size-4 text-muted-foreground" />
      </div>
      <span className="text-xs text-muted-foreground">
        {rec.careersUrl.replace(/^https?:\/\//, "")}
      </span>
    </motion.button>
  ));

  return (
    <>
      {/* My companies */}
      <section className="mt-8 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-sm font-semibold">
            {t("myCompanies")}
            <span className="text-muted-foreground">{companies.length}</span>
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setPrefill(null);
              setAddOpen(true);
            }}
          >
            <Plus className="size-4" />
            {t("addCompany")}
          </Button>
        </div>
        {companies.length === 0 ? (
          <div className="rounded-lg border border-dashed py-12 text-center">
            <p className="text-sm text-muted-foreground">{t("noCompanies")}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {t("addFromRecommended")}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">{myCards}</div>
        )}
      </section>

      {/* Recommended */}
      {recommendations.length > 0 && (
        <section className="mt-8 flex flex-col gap-3">
          <h2 className="flex items-center gap-2 text-sm font-semibold">
            {t("recommended")}
            <span className="text-muted-foreground">
              {recommendations.length}
            </span>
          </h2>
          <motion.div layout className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <AnimatePresence>{recCards}</AnimatePresence>
          </motion.div>
          {hiddenCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="self-center"
              onClick={() => setRecExpanded((v) => !v)}
            >
              {recExpanded ? (
                <>
                  <ChevronUp className="size-4" />
                  {tc("collapse")}
                </>
              ) : (
                <>
                  <ChevronDown className="size-4" />
                  {t("showMoreCount", {
                    count: hiddenCount,
                  })}
                </>
              )}
            </Button>
          )}
        </section>
      )}

      <AddCompanyModal
        open={addOpen}
        prefill={prefill}
        onOpenChange={(open) => {
          setAddOpen(open);
          if (!open) setPrefill(null);
        }}
      />

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

export { CompanyList };
