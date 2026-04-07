import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const { provider } = await request.json();

  if (provider !== "github" && provider !== "google") {
    return Response.json({ error: "Invalid provider" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${new URL(request.url).origin}/auth/callback`,
    },
  });

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ url: data.url });
}
