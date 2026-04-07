import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: companies, error } = await supabase
    .from("companies")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[companies] list", error);
    return Response.json(
      { error: "Failed to fetch companies" },
      { status: 500 }
    );
  }

  return Response.json({ companies });
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

  if (!body.name || !body.careersUrl) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  const { data: company, error } = await supabase
    .from("companies")
    .insert({
      user_id: user.id,
      name: body.name,
      careers_url: body.careersUrl,
      logo_url: body.logoUrl ?? null,
      notes: body.notes ?? null,
    })
    .select()
    .single();

  if (error) {
    console.error("[companies] create", error);
    return Response.json(
      { error: "Failed to create company" },
      { status: 500 }
    );
  }

  return Response.json({ company });
}
