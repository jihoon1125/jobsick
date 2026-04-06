import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: profileTags } = await supabase
    .from("profile_tags")
    .select("tag_id, tags(id, category, label)")
    .eq("profile_id", user.id);

  return Response.json({
    profile,
    tags: profileTags?.map((pt) => pt.tags) ?? [],
  });
}

export async function PUT(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      experience_years: body.experienceYears,
      salary_min: body.salaryMin,
      salary_max: body.salaryMax,
      preferred_regions: body.preferredRegions,
      work_types: body.workTypes,
      current_company: body.currentCompany,
      current_position: body.currentPosition,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (profileError) {
    console.error("[profile]", profileError);
    return Response.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }

  // Update tags: delete old, insert new
  const { error: deleteError } = await supabase
    .from("profile_tags")
    .delete()
    .eq("profile_id", user.id);

  if (deleteError) {
    console.error("[profile] delete tags", deleteError);
  }

  const tagRows = body.tagIds.map((tagId: string) => ({
    profile_id: user.id,
    tag_id: tagId,
  }));

  if (tagRows.length > 0) {
    const { error: insertError } = await supabase
      .from("profile_tags")
      .insert(tagRows);

    if (insertError) {
      console.error("[profile] insert tags", insertError);
    }
  }

  return Response.json({ success: true });
}
