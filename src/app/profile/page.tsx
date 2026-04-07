import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { PageContainer } from "@/components/common/page-container";
import { ProfileForm } from "./profile-form";

interface TagRow {
  id: string;
  category: string;
  label: string;
}

interface ProfileTagJoinRow {
  tags: TagRow | TagRow[];
}

export default async function ProfilePage() {
  const t = await getTranslations("profile");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch everything in parallel
  const [profileRes, profileTagsRes, positionTagsRes, skillTagsRes] = user
    ? await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).single(),
        supabase
          .from("profile_tags")
          .select("tags(id, category, label)")
          .eq("profile_id", user.id),
        supabase
          .from("tags")
          .select("id, category, label")
          .eq("category", "position")
          .is("user_id", null)
          .order("label"),
        supabase
          .from("tags")
          .select("id, category, label")
          .eq("category", "skill")
          .is("user_id", null)
          .order("label"),
      ])
    : [{ data: null }, { data: [] }, { data: [] }, { data: [] }];

  const profile = profileRes.data;
  const tagRows = (profileTagsRes.data as ProfileTagJoinRow[]) ?? [];

  const ownedTags: TagRow[] = tagRows.flatMap((row) =>
    Array.isArray(row.tags) ? row.tags : [row.tags]
  );

  const initialPositions = ownedTags
    .filter((tag) => tag.category === "position")
    .map((tag) => ({ id: tag.id, label: tag.label }));

  const initialSkills = ownedTags
    .filter((tag) => tag.category === "skill")
    .map((tag) => ({ id: tag.id, label: tag.label }));

  const initialRegions = (profile?.preferred_regions ?? []).map(
    (r: string) => ({
      id: `region-${r}`,
      label: r,
    })
  );

  const positionSuggestions = (positionTagsRes.data ?? []).map(
    (tag: TagRow) => ({
      id: tag.id,
      label: tag.label,
    })
  );
  const skillSuggestions = (skillTagsRes.data ?? []).map((tag: TagRow) => ({
    id: tag.id,
    label: tag.label,
  }));

  return (
    <PageContainer title={t("title")}>
      <ProfileForm
        initialPositions={initialPositions}
        initialSkills={initialSkills}
        initialRegions={initialRegions}
        initialExperienceYears={profile?.experience_years ?? 0}
        initialSalaryMin={profile?.salary_min?.toString() ?? ""}
        initialSalaryMax={profile?.salary_max?.toString() ?? ""}
        initialWorkTypes={profile?.work_types ?? []}
        initialCurrentCompany={profile?.current_company ?? ""}
        initialCurrentPosition={profile?.current_position ?? ""}
        positionSuggestions={positionSuggestions}
        skillSuggestions={skillSuggestions}
      />
    </PageContainer>
  );
}
