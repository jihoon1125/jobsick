import { getTranslations } from "next-intl/server";
import { PageContainer } from "@/components/common/page-container";
import { createClient } from "@/lib/supabase/server";
import { ApiKeyCard } from "../api-key-card";

export default async function ApiKeyPage() {
  const t = await getTranslations("profile.apiKey");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = user
    ? await supabase
        .from("profiles")
        .select("gemini_api_key_encrypted")
        .eq("id", user.id)
        .single()
    : { data: null };

  const hasApiKey = Boolean(profile?.gemini_api_key_encrypted);

  return (
    <PageContainer title={t("title")}>
      <ApiKeyCard initialHasKey={hasApiKey} />
    </PageContainer>
  );
}
