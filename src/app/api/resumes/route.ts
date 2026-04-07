import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: resumes, error } = await supabase
    .from("resumes")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[resumes] list", error);
    return Response.json({ error: "Failed to fetch resumes" }, { status: 500 });
  }

  return Response.json({ resumes });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  if (!body.title || !body.content || !body.filePath) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  // If marked as default, unset other defaults
  if (body.isDefault) {
    await supabase
      .from("resumes")
      .update({ is_default: false })
      .eq("user_id", user.id);
  }

  // Postgres rejects NULL bytes in text columns
  const sanitizedContent = body.content.replace(/\u0000/g, "");

  const { data: resume, error: dbError } = await supabase
    .from("resumes")
    .insert({
      user_id: user.id,
      title: body.title,
      source_type: "pdf",
      file_path: body.filePath,
      content: sanitizedContent,
      is_default: body.isDefault ?? false,
    })
    .select()
    .single();

  if (dbError) {
    console.error("[resumes] insert", dbError);
    return Response.json({ error: "Failed to create resume" }, { status: 500 });
  }

  // Insert tags
  if (Array.isArray(body.tagIds) && body.tagIds.length > 0) {
    const tagRows = body.tagIds.map((tagId: string) => ({
      resume_id: resume.id,
      tag_id: tagId,
    }));
    await supabase.from("resume_tags").insert(tagRows);
  }

  return Response.json({ resume });
}
