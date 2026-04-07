import { getTranslations } from "next-intl/server";
import { PageContainer } from "@/components/common/page-container";
import { createClient } from "@/lib/supabase/server";
import { CompanyList } from "./company-list";

export default async function CompaniesPage() {
  const t = await getTranslations("company");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: companies } = user
    ? await supabase
        .from("companies")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
    : { data: [] };

  return (
    <PageContainer title={t("title")} description={t("description")}>
      <CompanyList companies={companies ?? []} />
    </PageContainer>
  );
}
