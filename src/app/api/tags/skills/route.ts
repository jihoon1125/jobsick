import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const positionId = searchParams.get("positionId");

  const supabase = await createClient();

  if (!positionId) {
    // Return all skills
    const { data } = await supabase
      .from("tags")
      .select("id, label")
      .eq("category", "skill")
      .is("user_id", null)
      .order("label");

    return Response.json({ skills: data ?? [] });
  }

  // Return skills linked to position, ordered
  const { data } = await supabase
    .from("position_skills")
    .select("display_order, skill_tag:tags!skill_tag_id(id, label)")
    .eq("position_tag_id", positionId)
    .order("display_order");

  const skills = data?.map((row) => row.skill_tag) ?? [];

  return Response.json({ skills });
}
