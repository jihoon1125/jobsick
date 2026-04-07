import { getTranslations } from "next-intl/server";
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
    <main className="mx-auto w-full max-w-3xl p-8">
      <div className="mb-2">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("description")}</p>
      </div>
      <CompanyList companies={companies ?? []} />
    </main>
  );
}
