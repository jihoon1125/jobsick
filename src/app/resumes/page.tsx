import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { Plus } from "lucide-react";
import { PageContainer } from "@/components/common/page-container";
import { createClient } from "@/lib/supabase/server";
import { ResumeList } from "./resume-list";

export default async function ResumesPage() {
  const t = await getTranslations("resume");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: resumes } = user
    ? await supabase
        .from("resumes")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
    : { data: [] };

  return (
    <PageContainer
      title={t("title")}
      actions={
        <Link
          href="/resumes/new"
          className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="size-4" />
          {t("newResume")}
        </Link>
      }
    >
      <ResumeList resumes={resumes ?? []} />
    </PageContainer>
  );
}
