import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { HeaderActions } from "./header-actions";

async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="border-b">
      <div className="flex h-14 items-center justify-between px-6">
        <Link href="/" className="text-lg font-bold">
          Jobsick
        </Link>
        <HeaderActions user={user} />
      </div>
    </header>
  );
}

export { Header };
