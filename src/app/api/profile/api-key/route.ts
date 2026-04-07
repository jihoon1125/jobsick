import { createClient } from "@/lib/supabase/server";
import { encrypt } from "@/lib/crypto";

// GET: returns whether the user has a key registered.
// Never returns the key itself.
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data } = await supabase
    .from("profiles")
    .select("gemini_api_key_encrypted")
    .eq("id", user.id)
    .single();

  return Response.json({
    hasKey: Boolean(data?.gemini_api_key_encrypted),
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
  const apiKey: string =
    typeof body.apiKey === "string" ? body.apiKey.trim() : "";

  if (apiKey === "") {
    return Response.json({ error: "API key required" }, { status: 400 });
  }

  const encrypted = encrypt(apiKey);

  const { error } = await supabase
    .from("profiles")
    .update({
      gemini_api_key_encrypted: encrypted,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    console.error("[profile/api-key] update", error);
    return Response.json({ error: "Failed to save key" }, { status: 500 });
  }

  return Response.json({ success: true });
}

export async function DELETE() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      gemini_api_key_encrypted: null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    console.error("[profile/api-key] delete", error);
    return Response.json({ error: "Failed to remove key" }, { status: 500 });
  }

  return Response.json({ success: true });
}
