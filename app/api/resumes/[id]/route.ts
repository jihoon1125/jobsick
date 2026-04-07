import { createClient } from "@/lib/supabase/server";

interface Params {
  params: Promise<{ id: string }>;
}

export async function DELETE(_request: Request, { params }: Params) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get file_path before deleting the row
  const { data: resume } = await supabase
    .from("resumes")
    .select("file_path")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  const { error } = await supabase
    .from("resumes")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("[resumes] delete", error);
    return Response.json({ error: "Failed to delete resume" }, { status: 500 });
  }

  // Delete the file from storage if it exists
  if (resume?.file_path) {
    await supabase.storage.from("resumes").remove([resume.file_path]);
  }

  return Response.json({ success: true });
}
