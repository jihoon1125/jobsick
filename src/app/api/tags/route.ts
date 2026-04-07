import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");

  const supabase = await createClient();

  let query = supabase
    .from("tags")
    .select("id, category, label")
    .is("user_id", null)
    .order("label");

  if (category) {
    query = query.eq("category", category);
  }

  const { data, error } = await query;

  if (error) {
    console.error("[tags]", error);
    return Response.json({ error: "Failed to fetch tags" }, { status: 500 });
  }

  return Response.json({ tags: data });
}
